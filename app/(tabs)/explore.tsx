import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { getUserCocktailsList } from '../../api/user-cocktails';
import {
  getUserIngredientsList,
  removeIngredient,
} from '../../api/user-ingredients';
import { useAuthStore } from '../../store/auth';
import { Cocktail } from '../../types/cocktails';
import { Ingredient } from '../../types/ingredient';

interface CocktailCardProps {
  cocktail: Cocktail;
  onPress: () => void;
}

const CocktailCard: React.FC<CocktailCardProps> = ({ cocktail, onPress }) => {
  const cardColor = useThemeColor({}, 'card');

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: cardColor }]}
      onPress={onPress}
    >
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <ThemedText type="subtitle" style={styles.cocktailName}>
            {cocktail.name}
          </ThemedText>
          <ThemedText style={styles.cocktailEnName}>
            {cocktail.en_name}
          </ThemedText>
        </View>

        <View style={styles.ingredientsContainer}>
          {cocktail.ingredients?.slice(0, 3).map(ingredient => (
            <View
              key={ingredient.id}
              style={[styles.ingredientTag, { backgroundColor: '#f0f0f0' }]}
            >
              <ThemedText style={styles.ingredientText}>
                {ingredient.name}
              </ThemedText>
            </View>
          ))}
          {cocktail.ingredients && cocktail.ingredients.length > 3 && (
            <ThemedText style={styles.moreIngredients}>
              +{cocktail.ingredients.length - 3} 更多
            </ThemedText>
          )}
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.starContainer}>
            <ThemedText style={styles.starText}>⭐ {cocktail.star}</ThemedText>
          </View>
          <ThemedText style={styles.authorText}>
            by {cocktail.author_name}
          </ThemedText>
        </View>
      </View>
    </TouchableOpacity>
  );
};

interface IngredientCardProps {
  ingredient: Ingredient;
  onRemove: () => void;
}

const IngredientCard: React.FC<IngredientCardProps> = ({
  ingredient,
  onRemove,
}) => {
  const cardColor = useThemeColor({}, 'card');

  return (
    <View style={[styles.ingredientCard, { backgroundColor: cardColor }]}>
      <View style={styles.ingredientImageContainer}>
        <View style={styles.ingredientImagePlaceholder}>
          <ThemedText style={styles.ingredientImageText}>
            {ingredient.name.charAt(0)}
          </ThemedText>
        </View>
      </View>
      <ThemedText style={styles.ingredientName} numberOfLines={2}>
        {ingredient.name}
      </ThemedText>
      <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
        <ThemedText style={styles.removeButtonText}>删除</ThemedText>
      </TouchableOpacity>
    </View>
  );
};

export default function ExploreScreen() {
  const { user, logout } = useAuthStore();
  const [showMakeableOnly, setShowMakeableOnly] = useState(false);
  const backgroundColor = useThemeColor({}, 'background');
  const cardColor = useThemeColor({}, 'card');

  // 获取用户收藏的鸡尾酒
  const {
    data: cocktailsData,
    isLoading: cocktailsLoading,
    isError: cocktailsError,
    error: cocktailsErrorMsg,
    refetch: refetchCocktails,
  } = useInfiniteQuery({
    queryKey: ['userCocktails', showMakeableOnly],
    queryFn: ({ pageParam = 1 }) =>
      getUserCocktailsList({
        page: pageParam as number,
        size: 10,
        is_makeable: showMakeableOnly,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: any, pages: any[]) => {
      if (lastPage.total > pages.length * 10) {
        return pages.length + 1;
      }
      return undefined;
    },
  });

  // 获取用户库存材料
  const {
    data: ingredientsData,
    isLoading: ingredientsLoading,
    refetch: refetchIngredients,
  } = useInfiniteQuery({
    queryKey: ['userIngredients'],
    queryFn: ({ pageParam = 1 }) =>
      getUserIngredientsList({ page: pageParam as number, size: 20 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: any, pages: any[]) => {
      if (lastPage.total > pages.length * 20) {
        return pages.length + 1;
      }
      return undefined;
    },
  });

  // 删除材料
  const removeIngredientMutation = useMutation({
    mutationFn: removeIngredient,
    onSuccess: () => {
      Alert.alert('成功', '材料删除成功');
      refetchIngredients();
    },
    onError: error => {
      Alert.alert('错误', error.message);
    },
  });

  const handleLogout = () => {
    Alert.alert('确认退出', '确定要退出登录吗？', [
      { text: '取消', style: 'cancel' },
      {
        text: '确定',
        style: 'destructive',
        onPress: () => {
          logout();
          router.replace('/login');
        },
      },
    ]);
  };

  const handleCocktailPress = (cocktail: Cocktail) => {
    router.push(`/cocktail-detail/${cocktail.id}`);
  };

  const handleRemoveIngredient = (ingredient: Ingredient) => {
    Alert.alert('确认删除', `确定要删除材料"${ingredient.name}"吗？`, [
      { text: '取消', style: 'cancel' },
      {
        text: '确定',
        style: 'destructive',
        onPress: () =>
          removeIngredientMutation.mutate({ ingredient_id: ingredient.id }),
      },
    ]);
  };

  const renderCocktail = ({ item }: { item: Cocktail }) => (
    <CocktailCard cocktail={item} onPress={() => handleCocktailPress(item)} />
  );

  const renderIngredient = ({ item }: { item: Ingredient }) => (
    <IngredientCard
      ingredient={item}
      onRemove={() => handleRemoveIngredient(item)}
    />
  );

  const cocktails =
    cocktailsData?.pages.flatMap((page: any) => page.list) || [];
  const ingredients =
    ingredientsData?.pages.flatMap((page: any) => page.list) || [];

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <ThemedText type="title" style={styles.title}>
            🍹 我的
          </ThemedText>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <ThemedText style={styles.logoutText}>退出</ThemedText>
          </TouchableOpacity>
        </View>
        <ThemedText style={styles.welcomeText}>
          欢迎回来，{user?.username}
        </ThemedText>
      </View>

      <View style={styles.content}>
        {/* 我的鸡尾酒部分 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              我的鸡尾酒
            </ThemedText>
            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.createButton}
                onPress={() => router.push('/create-cocktail')}
              >
                <ThemedText style={styles.createButtonText}>+ 创建</ThemedText>
              </TouchableOpacity>
              <View style={styles.switchContainer}>
                <ThemedText style={styles.switchLabel}>可调配</ThemedText>
                <Switch
                  value={showMakeableOnly}
                  onValueChange={setShowMakeableOnly}
                  trackColor={{ false: '#767577', true: '#81b0ff' }}
                  thumbColor={showMakeableOnly ? '#f5dd4b' : '#f4f3f4'}
                />
              </View>
            </View>
          </View>

          {cocktailsLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#007AFF" />
              <ThemedText style={styles.loadingText}>加载中...</ThemedText>
            </View>
          ) : cocktailsError ? (
            <View style={styles.errorContainer}>
              <ThemedText style={styles.errorText}>
                加载失败: {cocktailsErrorMsg?.message}
              </ThemedText>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={() => refetchCocktails()}
              >
                <ThemedText style={styles.retryButtonText}>重试</ThemedText>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={cocktails}
              renderItem={renderCocktail}
              keyExtractor={item => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            />
          )}
        </View>

        {/* 我的库存部分 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              我的库存
            </ThemedText>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push('/add-ingredient')}
            >
              <ThemedText style={styles.addButtonText}>+ 添加</ThemedText>
            </TouchableOpacity>
          </View>

          {ingredientsLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#007AFF" />
              <ThemedText style={styles.loadingText}>加载中...</ThemedText>
            </View>
          ) : (
            <FlatList
              data={ingredients}
              renderItem={renderIngredient}
              keyExtractor={item => item.id.toString()}
              numColumns={2}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.ingredientsGrid}
            />
          )}
        </View>
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
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  logoutText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  welcomeText: {
    fontSize: 16,
    opacity: 0.7,
  },
  content: {
    flex: 1,
    padding: 16,
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  createButton: {
    backgroundColor: '#28a745',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchLabel: {
    marginRight: 8,
    fontSize: 14,
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  horizontalList: {
    paddingRight: 16,
  },
  card: {
    borderRadius: 12,
    marginRight: 16,
    width: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    marginBottom: 12,
  },
  cocktailName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cocktailEnName: {
    fontSize: 12,
    opacity: 0.7,
  },
  ingredientsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  ingredientTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 6,
    marginBottom: 4,
  },
  ingredientText: {
    fontSize: 10,
    color: '#666',
  },
  moreIngredients: {
    fontSize: 10,
    color: '#999',
    alignSelf: 'center',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  starContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starText: {
    fontSize: 12,
    color: '#FFD700',
  },
  authorText: {
    fontSize: 10,
    opacity: 0.6,
  },
  ingredientsGrid: {
    paddingBottom: 16,
  },
  ingredientCard: {
    flex: 1,
    margin: 8,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  ingredientImageContainer: {
    marginBottom: 8,
  },
  ingredientImagePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ingredientImageText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
  },
  ingredientName: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 8,
    minHeight: 32,
  },
  removeButton: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  loadingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
  },
  errorContainer: {
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
    color: '#ff6b6b',
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
