import { searchIngredient } from '@/api/ingredients';
import { addUserIngredient } from '@/api/user-ingredients';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { pagePadding } from '@/constants/theme';
import { Ingredient } from '@/types/ingredient';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import debounce from 'p-debounce';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddIngredientScreen() {
  const [inputKeyword, setInputKeyword] = useState('');
  const [debouncedKeyword, setDebouncedKeyword] = useState('');
  const [addingIds, setAddingIds] = useState<Set<number>>(new Set());

  // 防抖处理搜索关键词
  const debouncedSetKeyword = debounce((keyword: string) => {
    setDebouncedKeyword(keyword);
  }, 500);

  // 使用 useQuery 管理搜索状态
  const {
    data: searchResult,
    isLoading: isSearchLoading,
    error: searchError,
    refetch: refetchSearch,
  } = useQuery({
    queryKey: ['searchIngredients', debouncedKeyword],
    queryFn: () => searchIngredient({ keyword: debouncedKeyword }),
    enabled: !!debouncedKeyword.trim(), // 只有当防抖后的搜索关键词不为空时才执行查询
    staleTime: 5 * 60 * 1000, // 5分钟内数据被认为是新鲜的
    retry: 1, // 失败时重试1次
  });

  // 处理搜索关键词变化
  const handleSearchKeywordChange = (keyword: string) => {
    setInputKeyword(keyword);
    debouncedSetKeyword(keyword);
  };

  // 获取材料列表
  const ingredients = searchResult?.list || [];

  // 添加材料到用户收藏
  const handleAddIngredient = async (ingredient: Ingredient) => {
    if (addingIds.has(ingredient.id)) return;

    setAddingIds(prev => new Set(prev).add(ingredient.id));

    try {
      await addUserIngredient({ ingredient_id: ingredient.id });
      Alert.alert('成功', `已添加材料：${ingredient.name}`);
      // 添加成功后可以刷新搜索缓存
      refetchSearch();
    } catch (error) {
      console.error('添加材料失败:', error);
      Alert.alert('错误', '添加材料失败，请重试');
    } finally {
      setAddingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(ingredient.id);
        return newSet;
      });
    }
  };

  // 渲染材料项
  const renderIngredientItem = ({ item }: { item: Ingredient }) => {
    const isAdding = addingIds.has(item.id);

    return (
      <View style={styles.ingredientItem}>
        <View style={styles.ingredientInfo}>
          <View style={styles.ingredientHeader}>
            <Text style={styles.ingredientName} numberOfLines={1}>
              {item.name}
            </Text>
          </View>
          <View style={styles.ingredientDetails}>
            {item.description && (
              <Text style={styles.ingredientDescription} numberOfLines={2}>
                {item.description}
              </Text>
            )}
            {item.usage && (
              <Text style={styles.ingredientUsage} numberOfLines={1}>
                用量：{item.usage}
              </Text>
            )}
          </View>
        </View>
        <TouchableOpacity
          style={[styles.addButton, isAdding && styles.addButtonDisabled]}
          onPress={() => handleAddIngredient(item)}
          disabled={isAdding}
        >
          {isAdding ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.addButtonText}>添加</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <IconSymbol size={24} color="#007AFF" name="arrow-left" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>添加材料</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="搜索材料名称..."
          value={inputKeyword}
          onChangeText={handleSearchKeywordChange}
          returnKeyType="search"
        />
        {isSearchLoading && (
          <View style={styles.loadingIndicator}>
            <ActivityIndicator size="small" color="#007AFF" />
          </View>
        )}
      </View>

      <FlatList
        data={ingredients}
        keyExtractor={item => item.id.toString()}
        renderItem={renderIngredientItem}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          inputKeyword ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {isSearchLoading
                  ? '搜索中...'
                  : searchError
                    ? '搜索失败，请重试'
                    : '未找到相关材料'}
              </Text>
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>输入材料名称开始搜索</Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: pagePadding,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  headerPlaceholder: {
    width: 40,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: pagePadding,
    paddingRight: pagePadding,
    paddingLeft: pagePadding,
    paddingBottom: 16,
    backgroundColor: '#fff',
  },
  searchInput: {
    flex: 1,
    height: 44,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  loadingIndicator: {
    marginLeft: 12,
    padding: 8,
  },
  list: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    paddingTop: pagePadding,
    paddingRight: pagePadding,
    paddingLeft: pagePadding,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
    height: 80,
  },
  ingredientInfo: {
    flex: 1,
    marginRight: 12,
    height: '100%',
    justifyContent: 'center',
  },
  ingredientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ingredientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginRight: 8,
    flex: 1,
  },
  ingredientEnName: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    flex: 1,
  },
  ingredientDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  ingredientDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
    marginBottom: 2,
  },
  ingredientUsage: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 50,
  },
  addButtonDisabled: {
    backgroundColor: '#ccc',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});
