import { useMutation, useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { searchIngredient } from '../../api/ingredients';
import { addUserIngredient } from '../../api/user-ingredients';
import { Ingredient } from '../../types/ingredient';

interface IngredientItemProps {
  ingredient: Ingredient;
  onAdd: () => void;
  isAdding?: boolean;
}

const IngredientItem: React.FC<IngredientItemProps> = ({ ingredient, onAdd, isAdding }) => {
  const cardColor = useThemeColor({}, 'card');

  return (
    <View style={[styles.ingredientItem, { backgroundColor: cardColor }]}>
      <View style={styles.ingredientInfo}>
        <ThemedText style={styles.ingredientName}>
          {ingredient.name}
        </ThemedText>
        {ingredient.en_name && (
          <ThemedText style={styles.ingredientEnName}>
            {ingredient.en_name}
          </ThemedText>
        )}
        {ingredient.description && (
          <ThemedText style={styles.ingredientDescription} numberOfLines={2}>
            {ingredient.description}
          </ThemedText>
        )}
      </View>
      <TouchableOpacity
        style={[styles.addButton, isAdding && styles.addButtonDisabled]}
        onPress={onAdd}
        disabled={isAdding}
      >
        {isAdding ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <ThemedText style={styles.addButtonText}>添加</ThemedText>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default function AddIngredientScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const inputColor = useThemeColor({}, 'input');

  // 搜索材料
  const {
    data: searchData,
    isLoading: isSearching,
    refetch: searchIngredients,
  } = useQuery({
    queryKey: ['searchIngredient', searchQuery],
    queryFn: () => searchIngredient({ keyword: searchQuery }),
    enabled: searchQuery.length > 0,
  });

  // 添加材料
  const addIngredientMutation = useMutation({
    mutationFn: addUserIngredient,
    onSuccess: () => {
      Alert.alert('成功', '材料添加成功');
    },
    onError: (error) => {
      Alert.alert('错误', error.message);
    },
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleAddIngredient = (ingredient: Ingredient) => {
    addIngredientMutation.mutate({ ingredient_id: ingredient.id });
  };

  const handleBack = () => {
    router.back();
  };

  const ingredients = searchData?.list || [];

  return (
    <ThemedView style={styles.container}>
      {/* 头部 */}
      <View style={[styles.header, { backgroundColor: inputColor }]}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ThemedText style={styles.backButtonText}>← 返回</ThemedText>
        </TouchableOpacity>
        <ThemedText type="title" style={styles.title}>
          添加材料
        </ThemedText>
        <View style={styles.placeholder} />
      </View>

      {/* 搜索框 */}
      <View style={styles.searchContainer}>
        <TextInput
          style={[
            styles.searchInput,
            {
              backgroundColor: inputColor,
              color: textColor,
              borderColor: inputColor,
            }
          ]}
          placeholder="搜索材料名称..."
          placeholderTextColor={textColor === '#000' ? '#999' : '#666'}
          value={searchQuery}
          onChangeText={handleSearch}
          autoFocus
        />
      </View>

      {/* 搜索结果 */}
      <View style={styles.content}>
        {searchQuery.length === 0 ? (
          <View style={styles.emptyState}>
            <ThemedText style={styles.emptyStateText}>
              请输入材料名称进行搜索
            </ThemedText>
          </View>
        ) : isSearching ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <ThemedText style={styles.loadingText}>搜索中...</ThemedText>
          </View>
        ) : ingredients.length === 0 ? (
          <View style={styles.emptyState}>
            <ThemedText style={styles.emptyStateText}>
              未找到相关材料
            </ThemedText>
          </View>
        ) : (
          <FlatList
            data={ingredients}
            renderItem={({ item }) => (
              <IngredientItem
                ingredient={item}
                onAdd={() => handleAddIngredient(item)}
                isAdding={addIngredientMutation.isPending}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </View>
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
  placeholder: {
    width: 60,
  },
  searchContainer: {
    padding: 20,
  },
  searchInput: {
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  ingredientItem: {
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
    marginRight: 12,
  },
  ingredientName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  ingredientEnName: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 4,
  },
  ingredientDescription: {
    fontSize: 12,
    opacity: 0.6,
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  addButtonDisabled: {
    opacity: 0.6,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    opacity: 0.6,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
});
