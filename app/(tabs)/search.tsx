import { getCocktailsList, GetCocktailsListParams } from '@/api/cocktails';
import { getUserIngredientsList } from '@/api/user-ingredients';
import { getUserInfo, GetUserInfoResponse } from '@/api/users';
import CocktailCard from '@/components/cocktail-card';
import { pagePadding } from '@/constants/theme';
import { Cocktail } from '@/types/cocktails';
import MasonryList from '@react-native-seoul/masonry-list';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  Button,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type SearchTab = 'cocktails' | 'ingredients';

export default function SearchScreen() {
  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState<SearchTab>('cocktails');
  const [refreshing, setRefreshing] = useState(false);

  const { data: userInfo, isPending: isUserInfoPending } =
    useQuery<GetUserInfoResponse>({
      queryKey: ['userInfo'],
      queryFn: getUserInfo,
      retry: false,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    });
  console.log('userInfo', userInfo);

  // 鸡尾酒搜索
  const {
    data: cocktails,
    status: cocktailsStatus,
    refetch: refetchCocktails,
    fetchNextPage: fetchNextCocktails,
    hasNextPage: hasNextCocktails,
    isFetchingNextPage: isFetchingNextCocktails,
    isPending: isCocktailsPending,
  } = useInfiniteQuery({
    queryKey: ['searchCocktails', searchText],
    queryFn: ({ pageParam }) => {
      const params: GetCocktailsListParams = {
        page: pageParam,
        size: 10,
        search: searchText || undefined,
      };
      return getCocktailsList(params);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) =>
      lastPage.total > pages.length * 10 ? pages.length + 1 : undefined,
    enabled: activeTab === 'cocktails' && searchText.length > 0,
  });

  // 材料搜索
  const {
    data: ingredients,
    refetch: refetchIngredients,
    fetchNextPage: fetchNextIngredients,
    hasNextPage: hasNextIngredients,
    isFetchingNextPage: isFetchingNextIngredients,
  } = useInfiniteQuery({
    queryKey: ['searchIngredients', searchText],
    queryFn: ({ pageParam }) =>
      getUserIngredientsList({
        page: pageParam,
        size: 10,
        search: searchText || undefined,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) =>
      lastPage.total > pages.length * 10 ? pages.length + 1 : undefined,
    enabled: activeTab === 'ingredients' && searchText.length > 0 && !!userInfo,
  });

  const handleLogin = () => {
    router.push('/login' as any);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    if (activeTab === 'cocktails') {
      await refetchCocktails();
    } else {
      await refetchIngredients();
    }
    setRefreshing(false);
  };

  const handleLoadMore = useCallback(() => {
    if (activeTab === 'cocktails') {
      if (hasNextCocktails && !isFetchingNextCocktails && !refreshing) {
        fetchNextCocktails();
      }
    } else {
      if (hasNextIngredients && !isFetchingNextIngredients && !refreshing) {
        fetchNextIngredients();
      }
    }
  }, [
    activeTab,
    hasNextCocktails,
    isFetchingNextCocktails,
    hasNextIngredients,
    isFetchingNextIngredients,
    refreshing,
    fetchNextCocktails,
    fetchNextIngredients,
  ]);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { contentOffset, contentSize, layoutMeasurement } =
        event.nativeEvent;
      const isCloseToBottom =
        contentOffset.y + layoutMeasurement.height >= contentSize.height * 0.7;

      if (isCloseToBottom && !refreshing) {
        if (activeTab === 'cocktails') {
          if (hasNextCocktails && !isFetchingNextCocktails) {
            fetchNextCocktails();
          }
        } else {
          if (hasNextIngredients && !isFetchingNextIngredients) {
            fetchNextIngredients();
          }
        }
      }
    },
    [
      activeTab,
      hasNextCocktails,
      isFetchingNextCocktails,
      hasNextIngredients,
      isFetchingNextIngredients,
      refreshing,
      fetchNextCocktails,
      fetchNextIngredients,
    ]
  );

  const renderIngredientCard = ({ item: ingredient }: { item: any }) => (
    <TouchableOpacity style={styles.card}>
      <View style={styles.cardInfo}>
        <Text style={styles.cardName}>{ingredient.name}</Text>
        <Text style={styles.cardEnName}>{ingredient.en_name}</Text>
        <Text style={styles.cardDescription} numberOfLines={2}>
          {ingredient.description}
        </Text>
        <View style={styles.cardMeta}>
          <Text style={styles.ingredientUsage}>用量: {ingredient.usage}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderTabButton = (tab: SearchTab, title: string) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]}
      onPress={() => setActiveTab(tab)}
    >
      <Text
        style={[
          styles.tabButtonText,
          activeTab === tab && styles.tabButtonTextActive,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  const getCurrentData = () => {
    if (activeTab === 'cocktails') {
      return cocktails?.pages.flatMap(page => page.list) || [];
    } else {
      return ingredients?.pages.flatMap(page => page.list) || [];
    }
  };

  const getCurrentStatus = () => {
    if (activeTab === 'cocktails') {
      return cocktailsStatus;
    } else {
      return 'success';
    }
  };

  const getCurrentHasNextPage = () => {
    if (activeTab === 'cocktails') {
      return hasNextCocktails;
    } else {
      return hasNextIngredients;
    }
  };

  const getCurrentIsFetchingNextPage = () => {
    if (activeTab === 'cocktails') {
      return isFetchingNextCocktails;
    } else {
      return isFetchingNextIngredients;
    }
  };

  const getCurrentIsPending = () => {
    if (activeTab === 'cocktails') {
      return isCocktailsPending;
    } else {
      return false;
    }
  };

  const currentData = getCurrentData();
  const currentStatus = getCurrentStatus();
  const currentHasNextPage = getCurrentHasNextPage();
  const currentIsFetchingNextPage = getCurrentIsFetchingNextPage();
  const currentIsPending = getCurrentIsPending();

  // 检查是否需要登录（材料搜索需要登录）
  if (activeTab === 'ingredients' && !userInfo && !isUserInfoPending) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="搜索鸡尾酒或材料..."
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor="#999"
          />
        </View>
        <View style={styles.tabContainer}>
          {renderTabButton('cocktails', '鸡尾酒')}
          {renderTabButton('ingredients', '材料')}
        </View>
        <View style={styles.loginPrompt}>
          <Text style={styles.promptText}>搜索材料需要先登录</Text>
          <Button title="登录" onPress={handleLogin} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="搜索鸡尾酒或材料..."
          value={searchText}
          onChangeText={setSearchText}
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.tabContainer}>
        {renderTabButton('cocktails', '鸡尾酒')}
        {renderTabButton('ingredients', '材料')}
      </View>

      {searchText.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>请输入搜索关键词</Text>
        </View>
      ) : currentStatus === 'error' ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>搜索失败</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              if (activeTab === 'cocktails') {
                refetchCocktails();
              } else {
                refetchIngredients();
              }
            }}
          >
            <Text style={styles.retryButtonText}>重试</Text>
          </TouchableOpacity>
        </View>
      ) : activeTab === 'cocktails' ? (
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
            if (currentIsPending) {
              return (
                <View style={styles.loadingMore}>
                  <Text style={styles.loadingMoreText}>搜索中...</Text>
                </View>
              );
            }

            if (currentIsFetchingNextPage) {
              return (
                <View style={styles.loadingMore}>
                  <Text style={styles.loadingMoreText}>加载更多...</Text>
                </View>
              );
            }

            if (
              !currentIsPending &&
              !currentHasNextPage &&
              currentData.length > 0
            ) {
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
              <Text style={styles.emptyText}>未找到相关鸡尾酒</Text>
            </View>
          )}
        />
      ) : (
        <FlatList
          data={currentData}
          renderItem={renderIngredientCard}
          keyExtractor={item => `ingredients-${item.id}`}
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
            if (currentIsFetchingNextPage) {
              return (
                <View style={styles.loadingMore}>
                  <Text style={styles.loadingMoreText}>加载更多...</Text>
                </View>
              );
            }

            if (
              !currentIsPending &&
              !currentHasNextPage &&
              currentData.length > 0
            ) {
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
              <Text style={styles.emptyText}>未找到相关材料</Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  searchContainer: {
    paddingTop: pagePadding,
    paddingRight: pagePadding,
    paddingLeft: pagePadding,
  },
  searchInput: {
    height: 44,
    backgroundColor: '#f8f8f8',
    borderRadius: 22,
    paddingHorizontal: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  tabContainer: {
    flexDirection: 'row',
    padding: pagePadding,
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f8f8f8',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    height: 32,
  },
  tabButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  tabButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  tabButtonTextActive: {
    color: '#fff',
  },
  listContainer: {
    paddingHorizontal: pagePadding,
  },
  cocktailsList: {
    paddingHorizontal: pagePadding,
  },
  card: {
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
  cardImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
  },
  cardInfo: {
    padding: 16,
  },
  cardName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  cardEnName: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  cardMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  starContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  starCount: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  authorName: {
    fontSize: 12,
    color: '#999',
  },
  ingredientUsage: {
    fontSize: 12,
    color: '#999',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#999',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
  loginPrompt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  promptText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
});
