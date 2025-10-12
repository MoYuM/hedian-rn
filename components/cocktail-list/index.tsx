import { getUserCocktailsList } from '@/api/user-cocktails';
import CocktailCard from '@/components/cocktail-card';
import { Cocktail } from '@/types/cocktails';
import MasonryList from '@react-native-seoul/masonry-list';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';

/**
 * 我的配方列表组件
 */
export default function CocktailsList() {
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
    staleTime: 5 * 60 * 1000, // 5分钟内数据不会过期
    enabled: true,
  });

  const handleLoadMore = useCallback(() => {
    if (hasNextCocktails && !isFetchingNextCocktails) {
      fetchNextCocktails();
    }
  }, [hasNextCocktails, isFetchingNextCocktails, fetchNextCocktails]);

  const currentData = cocktails?.pages.flatMap(page => page.list) || [];

  return (
    <MasonryList
      data={currentData}
      renderItem={({ item }) => <CocktailCard cocktail={item as Cocktail} />}
      keyExtractor={(item, index) => `cocktail-${item.id}-${index}`}
      style={styles.cocktailsList}
      numColumns={2}
      refreshing={isFetchingNextCocktails}
      onRefresh={refetchCocktails}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.3}
      ListFooterComponent={() => {
        if (isFetchingNextCocktails) {
          return (
            <View key="loading-more" style={styles.loadingMore}>
              <Text style={styles.loadingMoreText}>加载中...</Text>
            </View>
          );
        }

        if (
          !isFetchingNextCocktails &&
          !hasNextCocktails &&
          currentData.length > 0
        ) {
          return (
            <View key="no-more-data" style={styles.noMoreData}>
              <Text style={styles.noMoreDataText}>没有更多了~</Text>
            </View>
          );
        }

        return null;
      }}
      ListEmptyComponent={() => (
        <View key="empty-state" style={styles.emptyContainer}>
          <Text style={styles.emptyText}>暂无配方</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  cocktailsList: {
    paddingHorizontal: 20,
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
});
