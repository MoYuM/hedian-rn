import { createCocktail } from '@/api/cocktails';
import { searchIngredient } from '@/api/ingredients';
import { pagePadding } from '@/constants/theme';
import { Ingredient } from '@/types/ingredient';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface SelectedIngredient {
  id: number;
  name: string;
  usage: string;
}

interface FormData {
  name: string;
  method: string;
  ingredients: SelectedIngredient[];
  isPublic: boolean;
}

export default function CreateScreen() {
  const [selectedIngredients, setSelectedIngredients] = useState<
    SelectedIngredient[]
  >([]);
  const [showIngredientModal, setShowIngredientModal] = useState(false);
  const [ingredientSearchText, setIngredientSearchText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      method: '',
      ingredients: [],
      isPublic: false,
    },
  });

  const watchedIngredients = watch('ingredients');

  // 搜索材料
  const { data: ingredientsData, isLoading: isIngredientsLoading } = useQuery({
    queryKey: ['searchIngredients', ingredientSearchText],
    queryFn: () => searchIngredient({ keyword: ingredientSearchText }),
    enabled: showIngredientModal && ingredientSearchText.length > 0,
  });

  const handleAddIngredient = (ingredient: Ingredient) => {
    const newIngredient: SelectedIngredient = {
      id: ingredient.id,
      name: ingredient.name,
      usage: ingredient.usage || '',
    };
    const updatedIngredients = [...selectedIngredients, newIngredient];
    setSelectedIngredients(updatedIngredients);
    setValue('ingredients', updatedIngredients);
    setShowIngredientModal(false);
    setIngredientSearchText('');
  };

  const handleRemoveIngredient = (index: number) => {
    const updatedIngredients = selectedIngredients.filter(
      (_, i) => i !== index
    );
    setSelectedIngredients(updatedIngredients);
    setValue('ingredients', updatedIngredients);
  };

  const handleUpdateIngredientUsage = (index: number, usage: string) => {
    const updatedIngredients = selectedIngredients.map((item, i) =>
      i === index ? { ...item, usage } : item
    );
    setSelectedIngredients(updatedIngredients);
    setValue('ingredients', updatedIngredients);
  };

  const onSubmit = async (data: FormData) => {
    if (selectedIngredients.length === 0) {
      Alert.alert('提示', '请至少添加一种材料');
      return;
    }

    // 检查所有材料是否都有用量
    const hasEmptyUsage = selectedIngredients.some(
      ingredient => !ingredient.usage.trim()
    );
    if (hasEmptyUsage) {
      Alert.alert('提示', '请为所有材料填写用量');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createCocktail({
        name: data.name.trim(),
        ingredients: selectedIngredients.map(ingredient => ({
          id: ingredient.id,
          usage: ingredient.usage.trim(),
        })),
        method: data.method.trim() || undefined,
        is_public: data.isPublic,
      });

      Alert.alert('成功', '配方创建成功！', [
        {
          text: '确定',
          onPress: () => {
            // 重置表单
            setValue('name', '');
            setValue('method', '');
            setValue('ingredients', []);
            setValue('isPublic', false);
            setSelectedIngredients([]);
            // 返回首页
            router.push('/(tabs)/' as any);
          },
        },
      ]);
    } catch (error) {
      console.error('创建配方失败:', error);
      Alert.alert('错误', '创建配方失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderIngredientItem = ({ item }: { item: Ingredient }) => (
    <TouchableOpacity
      style={styles.ingredientItem}
      onPress={() => handleAddIngredient(item)}
    >
      <View style={styles.ingredientInfo}>
        <Text style={styles.ingredientName}>{item.name}</Text>
        <Text style={styles.ingredientEnName}>{item.en_name}</Text>
        {item.description && (
          <Text style={styles.ingredientDescription} numberOfLines={2}>
            {item.description}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderSelectedIngredient = (
    ingredient: SelectedIngredient,
    index: number
  ) => (
    <View key={index} style={styles.selectedIngredientItem}>
      <View style={styles.selectedIngredientInfo}>
        <Text style={styles.selectedIngredientName}>{ingredient.name}</Text>
        <TextInput
          style={styles.usageInput}
          placeholder="用量"
          value={ingredient.usage}
          onChangeText={text => handleUpdateIngredientUsage(index, text)}
          placeholderTextColor="#999"
        />
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveIngredient(index)}
      >
        <Text style={styles.removeButtonText}>删除</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.form}>
          {/* 配方名称 */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>配方名称 *</Text>
            <Controller
              control={control}
              name="name"
              rules={{ required: '请输入配方名称' }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.textInput, errors.name && styles.errorInput]}
                  placeholder="请输入配方名称"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholderTextColor="#999"
                />
              )}
            />
            {errors.name && (
              <Text style={styles.errorText}>{errors.name.message}</Text>
            )}
          </View>

          {/* 材料选择 */}
          <View style={styles.fieldContainer}>
            <View style={styles.fieldHeader}>
              <Text style={styles.fieldLabel}>材料 *</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setShowIngredientModal(true)}
              >
                <Text style={styles.addButtonText}>+ 添加材料</Text>
              </TouchableOpacity>
            </View>

            {selectedIngredients.length > 0 ? (
              <View style={styles.selectedIngredientsContainer}>
                {selectedIngredients.map(renderSelectedIngredient)}
              </View>
            ) : (
              <View style={styles.emptyIngredients}>
                <Text style={styles.emptyIngredientsText}>请添加材料</Text>
              </View>
            )}
          </View>

          {/* 制作方法 */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>制作方法</Text>
            <Controller
              control={control}
              name="method"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  placeholder="请输入制作方法"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholderTextColor="#999"
                  multiline
                  numberOfLines={4}
                />
              )}
            />
          </View>

          {/* 是否公开 */}
          <View style={styles.fieldContainer}>
            <Controller
              control={control}
              name="isPublic"
              render={({ field: { onChange, value } }) => (
                <TouchableOpacity
                  style={styles.checkboxContainer}
                  onPress={() => onChange(!value)}
                >
                  <View
                    style={[styles.checkbox, value && styles.checkboxChecked]}
                  >
                    {value && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <Text style={styles.checkboxLabel}>公开配方</Text>
                </TouchableOpacity>
              )}
            />
          </View>

          {/* 提交按钮 */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              isSubmitting && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? '创建中...' : '创建配方'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 材料选择模态框 */}
      <Modal
        visible={showIngredientModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => {
                setShowIngredientModal(false);
                setIngredientSearchText('');
              }}
            >
              <Text style={styles.modalCloseButtonText}>取消</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>选择材料</Text>
            <View style={styles.modalPlaceholder} />
          </View>

          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="搜索材料..."
              value={ingredientSearchText}
              onChangeText={setIngredientSearchText}
              placeholderTextColor="#999"
            />
          </View>

          {isIngredientsLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>搜索中...</Text>
            </View>
          ) : ingredientsData?.list && ingredientsData.list.length > 0 ? (
            <FlatList
              data={ingredientsData.list}
              renderItem={renderIngredientItem}
              keyExtractor={item => item.id.toString()}
              style={styles.ingredientsList}
              showsVerticalScrollIndicator={false}
            />
          ) : ingredientSearchText.length > 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>未找到相关材料</Text>
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>请输入搜索关键词</Text>
            </View>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  form: {
    padding: pagePadding,
  },
  fieldContainer: {
    marginBottom: 24,
  },
  fieldHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  selectedIngredientsContainer: {
    gap: 12,
  },
  selectedIngredientItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedIngredientInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  selectedIngredientName: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    minWidth: 80,
  },
  usageInput: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  removeButton: {
    backgroundColor: '#ff3b30',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyIngredients: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  emptyIngredientsText: {
    fontSize: 14,
    color: '#999',
  },
  errorInput: {
    borderColor: '#ff3b30',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 12,
    marginTop: 4,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  checkmark: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: pagePadding,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  modalCloseButton: {
    paddingVertical: 8,
  },
  modalCloseButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  modalPlaceholder: {
    width: 40,
  },
  searchContainer: {
    padding: pagePadding,
    backgroundColor: '#fff',
  },
  searchInput: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  ingredientsList: {
    flex: 1,
    paddingHorizontal: pagePadding,
  },
  ingredientItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  ingredientInfo: {
    gap: 4,
  },
  ingredientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  ingredientEnName: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  ingredientDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});
