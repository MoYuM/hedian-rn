import { getCocktailsList } from '@/api/cocktails';
import { PlaceholderImage } from '@/components/ui/PlaceholderImage';
import { useInfiniteQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  FlatList,
  Image,
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

export default function HomeScreen() {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: cocktails,
    status,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['cocktailList', searchText, selectedCategory],
    queryFn: ({ pageParam }) =>
      getCocktailsList({
        page: pageParam,
        size: 10,
        search: searchText || undefined,
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) =>
      lastPage.total > pages.length * 10 ? pages.length + 1 : undefined,
  });

  const categories = [
    { id: 'all', name: '全部' },
    { id: 'classic', name: '经典' },
    { id: 'modern', name: '现代' },
    { id: 'tropical', name: '热带' },
    { id: 'sour', name: '酸味' },
  ];

  const handleLogin = () => {
    router.push('/login' as any);
  };

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

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { contentOffset, contentSize, layoutMeasurement } =
        event.nativeEvent;
      const isCloseToBottom =
        contentOffset.y + layoutMeasurement.height >= contentSize.height * 0.7;

      if (
        isCloseToBottom &&
        hasNextPage &&
        !isFetchingNextPage &&
        !refreshing
      ) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, refreshing, fetchNextPage]
  );

  const renderCocktailCard = ({ item: cocktail }: { item: any }) => (
    <TouchableOpacity style={styles.cocktailCard}>
      {cocktail.image ? (
        <Image source={{ uri: cocktail.image }} style={styles.cocktailImage} />
      ) : (
        <PlaceholderImage width="100%" height={200} text="🍹" />
      )}
      <View style={styles.cocktailInfo}>
        <Text style={styles.cocktailName}>{cocktail.name}</Text>
        <Text style={styles.cocktailEnName}>{cocktail.en_name}</Text>
        <View style={styles.cocktailMeta}>
          <View style={styles.starContainer}>
            <Text style={styles.starIcon}>⭐</Text>
            <Text style={styles.starCount}>{cocktail.star}</Text>
          </View>
          <Text style={styles.authorName}>by {cocktail.author_name}</Text>
        </View>
        <Text style={styles.cocktailMethod} numberOfLines={2}>
          {cocktail.method}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderCategoryTag = ({ item: category }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.categoryTag,
        selectedCategory === category.id && styles.categoryTagActive,
      ]}
      onPress={() => setSelectedCategory(category.id)}
    >
      <Text
        style={[
          styles.categoryTagText,
          selectedCategory === category.id && styles.categoryTagTextActive,
        ]}
      >
        {category.name}
      </Text>
    </TouchableOpacity>
  );

  if (status === 'pending') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>加载中...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
      {/* 头部区域 */}
      {/* <View style={styles.header}> */}

      {/* 搜索栏 */}
      {/* <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="搜索鸡尾酒..."
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor="#999"
          />
        </View> */}
      {/* </View> */}

      {/* 分类标签 */}
      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          renderItem={renderCategoryTag}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* 鸡尾酒列表 */}
      <FlatList
        data={allCocktails}
        renderItem={renderCocktailCard}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.cocktailsList}
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
          if (isFetchingNextPage) {
            return (
              <View style={styles.loadingMore}>
                <Text style={styles.loadingMoreText}>加载更多...</Text>
              </View>
            );
          }

          if (!hasNextPage && allCocktails.length > 0) {
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
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
    color: '#000',
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    color: '#666',
    marginBottom: 20,
  },
  searchContainer: {
    marginTop: 16,
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
  loginButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  categoriesContainer: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categoriesList: {
    paddingHorizontal: 20,
  },
  categoryTag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f8f8f8',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  categoryTagActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  categoryTagText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  categoryTagTextActive: {
    color: '#fff',
  },
  cocktailsList: {
    padding: 20,
    // paddingBottom: 100,
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
  cocktailImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
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
  cocktailMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
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
  cocktailMethod: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
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
