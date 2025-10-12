import { getCocktailsList, GetCocktailsListParams } from '@/api/cocktails';
import CocktailCard from '@/components/cocktail-card';
import Header from '@/components/header';
import { pagePadding } from '@/constants/theme';
import { Cocktail } from '@/types/cocktails';
import MasonryList from '@react-native-seoul/masonry-list';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: cocktails,
    status,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
  } = useInfiniteQuery({
    queryKey: ['cocktailList', selectedCategory],
    queryFn: ({ pageParam }) => {
      const params: GetCocktailsListParams = {
        page: pageParam,
        size: 10,
      };
      if (selectedCategory === 'is_makeable') {
        params.is_makeable = true;
      }
      return getCocktailsList(params);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) =>
      lastPage.total > pages.length * 10 ? pages.length + 1 : undefined,
  });

  const categories = [
    { id: 'all', name: '全部' },
    { id: 'is_makeable', name: '可制作' },
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage && !refreshing) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, refreshing, fetchNextPage]);

  // if (status === 'pending') {
  //   return (
  //     <SafeAreaView style={styles.container}>
  //       <View style={styles.loadingContainer}>
  //         <Text style={styles.loadingText}>加载中...</Text>
  //       </View>
  //     </SafeAreaView>
  //   );
  // }

  if (status === 'error') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>加载失败</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => refetch()}
          >
            <Text style={styles.retryButtonText}>重试</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // 将所有页面的鸡尾酒数据合并成一个数组
  const allCocktails = cocktails?.pages.flatMap(page => page.list) || [];

  return (
    <SafeAreaView style={styles.container}>
      <Header
        buttons={categories}
        activeButton={selectedCategory}
        onButtonChange={setSelectedCategory}
        showSearchButton={true}
      />

      {/* 鸡尾酒列表 - 瀑布流布局 */}
      <MasonryList
        data={allCocktails}
        renderItem={({ item }) => <CocktailCard cocktail={item as Cocktail} />}
        keyExtractor={item => item.id.toString()}
        style={styles.cocktailsList}
        numColumns={2}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        ListFooterComponent={() => {
          if (isPending) {
            return (
              <View style={styles.loadingMore}>
                <Text style={styles.loadingMoreText}>加载中...</Text>
              </View>
            );
          }

          if (!isPending && !hasNextPage && allCocktails.length > 0) {
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
            <Text style={styles.emptyText}>暂无鸡尾酒配方</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: pagePadding,
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
  cocktailsList: {
    paddingHorizontal: pagePadding,
  },
  loadingMore: {
    padding: pagePadding,
    alignItems: 'center',
  },
  loadingMoreText: {
    fontSize: 14,
    color: '#666',
  },
  noMoreData: {
    padding: pagePadding,
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
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
});
