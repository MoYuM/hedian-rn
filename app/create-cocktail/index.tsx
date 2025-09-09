import { useMutation, useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { createCocktail } from '../../api/cocktails';
import { searchIngredient } from '../../api/ingredients';
import { Ingredient } from '../../types/ingredient';

interface IngredientItem {
  id: number;
  name: string;
  usage: string;
}

export default function CreateCocktailScreen() {
  const [name, setName] = useState('');
  const [method, setMethod] = useState('');
  const [garnish, setGarnish] = useState('');
  const [note, setNote] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [ingredients, setIngredients] = useState<IngredientItem[]>([
    { id: 0, name: '', usage: '' },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIngredient, setSelectedIngredient] =
    useState<Ingredient | null>(null);

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const inputColor = useThemeColor({}, 'input');
  const cardColor = useThemeColor({}, 'card');

  // 搜索材料
  const { data: searchData, isLoading: isSearching } = useQuery({
    queryKey: ['searchIngredient', searchQuery],
    queryFn: () => searchIngredient({ keyword: searchQuery }),
    enabled: searchQuery.length > 0,
  });

  // 创建配方
  const createCocktailMutation = useMutation({
    mutationFn: createCocktail,
    onSuccess: () => {
      Alert.alert('成功', '配方创建成功！', [
        {
          text: '确定',
          onPress: () => router.back(),
        },
      ]);
    },
    onError: error => {
      Alert.alert('错误', error.message);
    },
  });

  const handleBack = () => {
    router.back();
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { id: 0, name: '', usage: '' }]);
  };

  const handleRemoveIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  const handleSelectIngredient = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient);
    setSearchQuery('');
  };

  const handleConfirmIngredient = (index: number) => {
    if (selectedIngredient) {
      const newIngredients = [...ingredients];
      newIngredients[index] = {
        id: selectedIngredient.id,
        name: selectedIngredient.name,
        usage: newIngredients[index].usage,
      };
      setIngredients(newIngredients);
      setSelectedIngredient(null);
    }
  };

  const handleUsageChange = (index: number, usage: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index].usage = usage;
    setIngredients(newIngredients);
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert('错误', '请输入配方名称');
      return;
    }

    if (!method.trim()) {
      Alert.alert('错误', '请输入制作方法');
      return;
    }

    const validIngredients = ingredients.filter(
      ingredient => ingredient.id > 0 && ingredient.usage.trim()
    );

    if (validIngredients.length === 0) {
      Alert.alert('错误', '请至少添加一个材料');
      return;
    }

    const data = {
      name: name.trim(),
      ingredients: validIngredients.map(ingredient => ({
        id: ingredient.id,
        usage: ingredient.usage.trim(),
      })),
      method: method.trim(),
      garnish: garnish.trim() || undefined,
      note: note.trim() || undefined,
      is_public: isPublic,
    };

    createCocktailMutation.mutate(data);
  };

  const searchResults = searchData?.list || [];

  return (
    <ThemedView style={styles.container}>
      {/* 头部 */}
      <View style={[styles.header, { backgroundColor: inputColor }]}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ThemedText style={styles.backButtonText}>← 返回</ThemedText>
        </TouchableOpacity>
        <ThemedText type="title" style={styles.title}>
          创建配方
        </ThemedText>
        <TouchableOpacity
          style={[
            styles.submitButton,
            createCocktailMutation.isPending && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={createCocktailMutation.isPending}
        >
          {createCocktailMutation.isPending ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <ThemedText style={styles.submitButtonText}>保存</ThemedText>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            基本信息
          </ThemedText>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>配方名称 *</ThemedText>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: inputColor, color: textColor },
              ]}
              placeholder="例如：莫吉托"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>制作方法 *</ThemedText>
            <TextInput
              style={[
                styles.textArea,
                { backgroundColor: inputColor, color: textColor },
              ]}
              placeholder="详细描述制作步骤..."
              value={method}
              onChangeText={setMethod}
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>装饰</ThemedText>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: inputColor, color: textColor },
              ]}
              placeholder="例如：薄荷叶装饰"
              value={garnish}
              onChangeText={setGarnish}
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>备注</ThemedText>
            <TextInput
              style={[
                styles.textArea,
                { backgroundColor: inputColor, color: textColor },
              ]}
              placeholder="特殊说明或小贴士"
              value={note}
              onChangeText={setNote}
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        {/* 材料清单 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              材料清单
            </ThemedText>
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddIngredient}
            >
              <ThemedText style={styles.addButtonText}>+ 添加材料</ThemedText>
            </TouchableOpacity>
          </View>

          {ingredients.map((ingredient, index) => (
            <View
              key={index}
              style={[styles.ingredientRow, { backgroundColor: cardColor }]}
            >
              <View style={styles.ingredientInfo}>
                <TouchableOpacity
                  style={styles.ingredientSelector}
                  onPress={() => setSearchQuery('')}
                >
                  <ThemedText style={styles.ingredientSelectorText}>
                    {ingredient.name || '选择材料'}
                  </ThemedText>
                </TouchableOpacity>

                <TextInput
                  style={[
                    styles.usageInput,
                    { backgroundColor: inputColor, color: textColor },
                  ]}
                  placeholder="用量"
                  value={ingredient.usage}
                  onChangeText={text => handleUsageChange(index, text)}
                />
              </View>

              {ingredients.length > 1 && (
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemoveIngredient(index)}
                >
                  <ThemedText style={styles.removeButtonText}>删除</ThemedText>
                </TouchableOpacity>
              )}
            </View>
          ))}

          {/* 材料搜索 */}
          {searchQuery && (
            <View style={styles.searchResults}>
              {isSearching ? (
                <View style={styles.searchLoading}>
                  <ActivityIndicator size="small" color="#007AFF" />
                  <ThemedText style={styles.searchLoadingText}>
                    搜索中...
                  </ThemedText>
                </View>
              ) : (
                searchResults.map(ingredient => (
                  <TouchableOpacity
                    key={ingredient.id}
                    style={[
                      styles.searchResultItem,
                      { backgroundColor: cardColor },
                    ]}
                    onPress={() => handleSelectIngredient(ingredient)}
                  >
                    <ThemedText style={styles.searchResultName}>
                      {ingredient.name}
                    </ThemedText>
                    {ingredient.en_name && (
                      <ThemedText style={styles.searchResultEnName}>
                        {ingredient.en_name}
                      </ThemedText>
                    )}
                  </TouchableOpacity>
                ))
              )}
            </View>
          )}
        </View>

        {/* 公开设置 */}
        <View style={styles.section}>
          <View style={styles.publicSetting}>
            <View>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                公开配方
              </ThemedText>
              <ThemedText style={styles.publicDescription}>
                公开后其他用户可以搜索到你的配方
              </ThemedText>
            </View>
            <TouchableOpacity
              style={[styles.switch, isPublic && styles.switchActive]}
              onPress={() => setIsPublic(!isPublic)}
            >
              <ThemedText style={styles.switchText}>
                {isPublic ? '公开' : '私有'}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  backButton: {
    paddingVertical: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  ingredientInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ingredientSelector: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 12,
    marginRight: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  ingredientSelectorText: {
    fontSize: 16,
    color: '#666',
  },
  usageInput: {
    width: 80,
    height: 40,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  removeButton: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  searchResults: {
    marginTop: 8,
    maxHeight: 200,
  },
  searchLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  searchLoadingText: {
    marginLeft: 8,
    fontSize: 14,
  },
  searchResultItem: {
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchResultName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  searchResultEnName: {
    fontSize: 14,
    opacity: 0.7,
  },
  publicSetting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  publicDescription: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 4,
  },
  switch: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
  },
  switchActive: {
    backgroundColor: '#007AFF',
  },
  switchText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
});
