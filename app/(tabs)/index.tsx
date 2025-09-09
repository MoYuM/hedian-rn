import { useInfiniteQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { getCocktailsList } from '../../api/cocktails';
import { Cocktail } from '../../types/cocktails';

interface CocktailCardProps {
  cocktail: Cocktail;
  onPress: () => void;
}

const CocktailCard: React.FC<CocktailCardProps> = ({ cocktail, onPress }) => {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
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

export default function HomeScreen() {
  // const backgroundColor = useThemeColor({}, 'background');
  // const textColor = useThemeColor({}, 'text');

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['cocktails'],
    queryFn: ({ pageParam = 1 }) =>
      getCocktailsList({ page: pageParam as number, size: 10 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: any, pages: any[]) => {
      if (lastPage.total > pages.length * 10) {
        return pages.length + 1;
      }
      return undefined;
    },
  });

  console.log('data', data);

  // console.log("isLoading", isLoading);

  // const handleCocktailPress = (cocktail: Cocktail) => {
  //   // 跳转到鸡尾酒详情页面
  //   router.push(`/cocktail-detail/${cocktail.id}`);
  // };

  // const renderCocktail = ({ item }: { item: Cocktail }) => (
  //   <CocktailCard
  //     cocktail={item}
  //     onPress={() => handleCocktailPress(item)}
  //   />
  // );

  // const renderFooter = () => {
  //   if (!hasNextPage) return null;

  //   return (
  //     <View style={styles.footerLoader}>
  //       {isFetchingNextPage ? (
  //         <ActivityIndicator size="small" color="#007AFF" />
  //       ) : (
  //         <TouchableOpacity
  //           style={styles.loadMoreButton}
  //           onPress={() => fetchNextPage()}
  //         >
  //           <ThemedText style={styles.loadMoreText}>加载更多</ThemedText>
  //         </TouchableOpacity>
  //       )}
  //     </View>
  //   );
  // };

  // if (isLoading) {
  //   return (
  //     <ThemedView style={styles.container}>
  //       <View style={styles.loadingContainer}>
  //         <ActivityIndicator size="large" color="#007AFF" />
  //         <ThemedText style={styles.loadingText}>加载中...</ThemedText>
  //       </View>
  //     </ThemedView>
  //   );
  // }

  // if (isError) {
  //   return (
  //     <ThemedView style={styles.container}>
  //       <View style={styles.errorContainer}>
  //         <ThemedText style={styles.errorText}>
  //           加载失败: {error?.message}
  //         </ThemedText>
  //         <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
  //           <ThemedText style={styles.retryButtonText}>重试</ThemedText>
  //         </TouchableOpacity>
  //       </View>
  //     </ThemedView>
  //   );
  // }

  // const cocktails = data?.pages.flatMap((page: any) => page.list) || [];

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          🍺 喝点
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          发现精彩配方，创造属于你的鸡尾酒
        </ThemedText>
      </View>

      {/* <FlatList
        data={cocktails}
        renderItem={renderCocktail}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            tintColor="#007AFF"
          />
        }
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
      /> */}
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  listContainer: {
    padding: 16,
  },
  card: {
    borderRadius: 12,
    marginBottom: 16,
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
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cocktailEnName: {
    fontSize: 14,
    opacity: 0.7,
  },
  ingredientsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  ingredientTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  ingredientText: {
    fontSize: 12,
    color: '#666',
  },
  moreIngredients: {
    fontSize: 12,
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
    fontSize: 14,
    color: '#FFD700',
  },
  authorText: {
    fontSize: 12,
    opacity: 0.6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#ff6b6b',
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footerLoader: {
    padding: 20,
    alignItems: 'center',
  },
  loadMoreButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  loadMoreText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
