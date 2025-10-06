import { getUserCocktailsList } from '@/api/user-cocktails';
import { getUserIngredientsList } from '@/api/user-ingredients';
import { getUserInfo, GetUserInfoResponse } from '@/api/users';
import CocktailCard from '@/components/cocktail-card';
import { Cocktail } from '@/types/cocktails';
import MasonryList from '@react-native-seoul/masonry-list';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  Button,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// 筛选器类型
type FilterType = 'ingredients' | 'cocktails';

/**
 * 我的页面
 */
export default function MineScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>('ingredients');

  const { data: userInfo, isPending } = useQuery<GetUserInfoResponse>({
    queryKey: ['userInfo'],
    queryFn: getUserInfo,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5分钟
    refetchOnWindowFocus: false,
  });

  const {
    data: ingredients,
    refetch: refetchIngredients,
    fetchNextPage: fetchNextIngredients,
    hasNextPage: hasNextIngredients,
    isFetchingNextPage: isFetchingNextIngredients,
  } = useInfiniteQuery({
    queryKey: ['userIngredients'],
    queryFn: ({ pageParam }) =>
      getUserIngredientsList({
        page: pageParam,
        size: 10,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) =>
      lastPage.total > pages.length * 10 ? pages.length + 1 : undefined,
    enabled: !!userInfo && activeFilter === 'ingredients', // 只有登录后且选中材料时才查询
  });

  const {
    data: cocktails,
    refetch: refetchCocktails,
    fetchNextPage: fetchNextCocktails,
    hasNextPage: hasNextCocktails,
    isFetchingNextPage: isFetchingNextCocktails,
  } = useInfiniteQuery({
    queryKey: ['userCocktails'],
    queryFn: ({ pageParam }) =>
      getUserCocktailsList({
        page: pageParam,
        size: 10,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) =>
      lastPage.total > pages.length * 10 ? pages.length + 1 : undefined,
    enabled: !!userInfo && activeFilter === 'cocktails', // 只有登录后且选中配方时才查询
  });

  const handleLogin = () => {
    router.push('/login' as any);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    switch (activeFilter) {
      case 'ingredients':
        await refetchIngredients();
        break;
      case 'cocktails':
        await refetchCocktails();
        break;
    }
    setRefreshing(false);
  };

  const handleLoadMore = useCallback(() => {
    if (refreshing) return;

    switch (activeFilter) {
      case 'ingredients':
        if (hasNextIngredients && !isFetchingNextIngredients) {
          fetchNextIngredients();
        }
        break;
      case 'cocktails':
        if (hasNextCocktails && !isFetchingNextCocktails) {
          fetchNextCocktails();
        }
        break;
    }
  }, [
    activeFilter,
    hasNextIngredients,
    isFetchingNextIngredients,
    fetchNextIngredients,
    hasNextCocktails,
    isFetchingNextCocktails,
    fetchNextCocktails,
    refreshing,
  ]);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { contentOffset, contentSize, layoutMeasurement } =
        event.nativeEvent;
      const isCloseToBottom =
        contentOffset.y + layoutMeasurement.height >= contentSize.height * 0.7;

      if (isCloseToBottom && !refreshing) {
        handleLoadMore();
      }
    },
    [handleLoadMore, refreshing]
  );

  const renderIngredientCard = ({ item: ingredient }: { item: any }) => (
    <TouchableOpacity style={styles.ingredientCard}>
      <View style={styles.ingredientInfo}>
        <Text style={styles.ingredientName}>{ingredient.name}</Text>
        <Text style={styles.ingredientEnName}>{ingredient.en_name}</Text>
        <Text style={styles.ingredientDescription} numberOfLines={2}>
          {ingredient.description}
        </Text>
        <View style={styles.ingredientMeta}>
          <Text style={styles.ingredientUsage}>用量: {ingredient.usage}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCocktailCard = ({ item: cocktail }: { item: any }) => (
    <TouchableOpacity style={styles.cocktailCard}>
      <View style={styles.cocktailInfo}>
        <Text style={styles.cocktailName}>{cocktail.name}</Text>
        <Text style={styles.cocktailEnName}>{cocktail.en_name}</Text>
        <Text style={styles.cocktailDescription} numberOfLines={2}>
          {cocktail.history || cocktail.note}
        </Text>
        <View style={styles.cocktailMeta}>
          <Text style={styles.cocktailAuthor}>
            作者: {cocktail.author_name}
          </Text>
          <View style={styles.cocktailStats}>
            <Text style={styles.cocktailStar}>⭐ {cocktail.star}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (isPending) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>加载中...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // 获取当前筛选器对应的数据
  const getCurrentData = () => {
    switch (activeFilter) {
      case 'ingredients':
        return ingredients?.pages.flatMap(page => page.list) || [];
      case 'cocktails':
        return cocktails?.pages.flatMap(page => page.list) || [];
      default:
        return [];
    }
  };

  const getCurrentLoadingState = () => {
    switch (activeFilter) {
      case 'ingredients':
        return isFetchingNextIngredients;
      case 'cocktails':
        return isFetchingNextCocktails;
      default:
        return false;
    }
  };

  const getCurrentHasNextPage = () => {
    switch (activeFilter) {
      case 'ingredients':
        return hasNextIngredients;
      case 'cocktails':
        return hasNextCocktails;
      default:
        return false;
    }
  };

  const getCurrentRenderItem = () => {
    switch (activeFilter) {
      case 'ingredients':
        return renderIngredientCard;
      case 'cocktails':
        return renderCocktailCard;
      default:
        return renderIngredientCard;
    }
  };

  const currentData = getCurrentData();
  const isFetchingNext = getCurrentLoadingState();
  const hasNextPage = getCurrentHasNextPage();
  const renderItem = getCurrentRenderItem();

  return (
    <SafeAreaView style={styles.container}>
      {userInfo ? (
        <View style={styles.content}>
          {/* 头部区域 - 用户头像 + 筛选器 */}
          <View style={styles.headerContainer}>
            <Image
              style={styles.avatar}
              source={{
                uri: 'https://s1.aigei.com/prevfiles/9f7f85b3b9384d9baf5d679ef2296eb8.jpg?e=2051020800&token=P7S2Xpzfz11vAkASLTkfHN7Fw-oOZBecqeJaxypL:Uo38WTfJnBXieqNx2CRXM72JTlk=',
              }}
            />
            <View style={styles.filterContainer}>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  activeFilter === 'ingredients' && styles.filterButtonActive,
                ]}
                onPress={() => setActiveFilter('ingredients')}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    activeFilter === 'ingredients' &&
                      styles.filterButtonTextActive,
                  ]}
                >
                  我的材料
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  activeFilter === 'cocktails' && styles.filterButtonActive,
                ]}
                onPress={() => setActiveFilter('cocktails')}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    activeFilter === 'cocktails' &&
                      styles.filterButtonTextActive,
                  ]}
                >
                  我的配方
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 列表 */}
          {activeFilter === 'ingredients' ? (
            <FlatList
              data={currentData}
              renderItem={renderItem}
              keyExtractor={item => `${item.id}-${item.name}`}
              contentContainerStyle={styles.listContainer}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                  colors={['#007AFF']}
                  tintColor="#007AFF"
                />
              }
              onScroll={handleScroll}
              scrollEventThrottle={16}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.3}
              ListFooterComponent={() => {
                if (isFetchingNext) {
                  return (
                    <View style={styles.loadingMore}>
                      <Text style={styles.loadingMoreText}>加载更多...</Text>
                    </View>
                  );
                }

                if (!hasNextPage && currentData.length > 0) {
                  return (
                    <View style={styles.noMoreData}>
                      <Text style={styles.noMoreDataText}>没有更多数据了</Text>
                    </View>
                  );
                }

                return null;
              }}
              ListEmptyComponent={() => (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>暂无材料</Text>
                </View>
              )}
            />
          ) : (
            <MasonryList
              data={currentData}
              renderItem={({ item }) => (
                <CocktailCard cocktail={item as Cocktail} />
              )}
              keyExtractor={item => item.id.toString()}
              style={styles.cocktailsList}
              numColumns={2}
              refreshing={refreshing}
              onRefresh={handleRefresh}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.3}
              ListFooterComponent={() => {
                if (isFetchingNext) {
                  return (
                    <View style={styles.loadingMore}>
                      <Text style={styles.loadingMoreText}>加载中...</Text>
                    </View>
                  );
                }

                if (!isFetchingNext && !hasNextPage && currentData.length > 0) {
                  return (
                    <View style={styles.noMoreData}>
                      <Text style={styles.noMoreDataText}>没有更多了~</Text>
                    </View>
                  );
                }

                return null;
              }}
              ListEmptyComponent={() => (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>暂无配方</Text>
                </View>
              )}
            />
          )}
        </View>
      ) : (
        <View style={styles.content}>
          <View style={styles.loginPrompt}>
            <Text style={styles.promptText}>请先登录</Text>
            <Button title="登录" onPress={handleLogin} />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
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
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  loginPrompt: {
    alignItems: 'center',
  },
  promptText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  filterContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f8f8f8',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  listContainer: {
    padding: 20,
  },
  cocktailsList: {
    paddingHorizontal: 20,
  },
  ingredientCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  ingredientInfo: {
    padding: 16,
  },
  ingredientName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  ingredientEnName: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  ingredientDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  ingredientMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ingredientUsage: {
    fontSize: 12,
    color: '#999',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  loadingMore: {
    padding: 20,
    alignItems: 'center',
  },
  loadingMoreText: {
    fontSize: 14,
    color: '#666',
  },
  noMoreData: {
    padding: 20,
    alignItems: 'center',
  },
  noMoreDataText: {
    fontSize: 14,
    color: '#999',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  cocktailCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  cocktailInfo: {
    padding: 16,
  },
  cocktailName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  cocktailEnName: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  cocktailDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  cocktailMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cocktailAuthor: {
    fontSize: 12,
    color: '#999',
    flex: 1,
  },
  cocktailStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cocktailStar: {
    fontSize: 12,
    color: '#FFA500',
    backgroundColor: '#FFF8DC',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
});
