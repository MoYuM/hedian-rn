import { getUserIngredientsList } from '@/api/user-ingredients';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { useCallback } from 'react';
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

/**
 * 我的材料列表组件
 */
export default function IngredientsList() {
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
    staleTime: 5 * 60 * 1000, // 5分钟内数据不会过期
    enabled: true,
  });

  const handleLoadMore = useCallback(() => {
    if (hasNextIngredients && !isFetchingNextIngredients) {
      fetchNextIngredients();
    }
  }, [hasNextIngredients, isFetchingNextIngredients, fetchNextIngredients]);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { contentOffset, contentSize, layoutMeasurement } =
        event.nativeEvent;
      const isCloseToBottom =
        contentOffset.y + layoutMeasurement.height >= contentSize.height * 0.7;

      if (isCloseToBottom) {
        handleLoadMore();
      }
    },
    [handleLoadMore]
  );

  const renderIngredientCard = ({ item: ingredient }: { item: any }) => (
    <TouchableOpacity style={styles.ingredientCard}>
      <Image
        source={{ uri: ingredient.image }}
        style={styles.ingredientImage}
        contentFit="cover"
        transition={200}
        cachePolicy="memory-disk"
        placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
      />
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

  const currentData = ingredients?.pages.flatMap(page => page.list) || [];

  return (
    <FlatList
      data={currentData}
      renderItem={renderIngredientCard}
      keyExtractor={(item, index) => `ingredient-${item.id}-${index}`}
      contentContainerStyle={styles.listContainer}
      refreshControl={
        <RefreshControl
          refreshing={isFetchingNextIngredients}
          onRefresh={refetchIngredients}
          colors={['#007AFF']}
          tintColor="#007AFF"
        />
      }
      onScroll={handleScroll}
      scrollEventThrottle={16}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.3}
      ListFooterComponent={() => {
        if (isFetchingNextIngredients) {
          return (
            <View style={styles.loadingMore}>
              <Text style={styles.loadingMoreText}>加载更多...</Text>
            </View>
          );
        }

        if (!hasNextIngredients && currentData.length > 0) {
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
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: 20,
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
    flexDirection: 'row',
    height: 120,
  },
  ingredientImage: {
    width: 120,
    height: 120,
  },
  ingredientInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  ingredientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  ingredientEnName: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 6,
  },
  ingredientDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
    marginBottom: 6,
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
});
