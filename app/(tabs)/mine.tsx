import { getUserIngredientsList } from '@/api/user-ingredients';
import { getUserInfo, GetUserInfoResponse } from '@/api/users';
import { JWT_TOKEN_KEY } from '@/constants/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
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

/**
 * 我的页面
 */
export default function MineScreen() {
  const queryClient = useQueryClient();
  const [searchText, setSearchText] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: userInfo,
    isPending,
    refetch,
  } = useQuery<GetUserInfoResponse>({
    queryKey: ['userInfo'],
    queryFn: getUserInfo,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5分钟
    refetchOnWindowFocus: false,
  });

  const {
    data: ingredients,
    refetch: refetchIngredients,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['userIngredients', searchText],
    queryFn: ({ pageParam }) =>
      getUserIngredientsList({
        page: pageParam,
        size: 10,
        search: searchText || undefined,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) =>
      lastPage.total > pages.length * 10 ? pages.length + 1 : undefined,
    enabled: !!userInfo, // 只有登录后才查询材料列表
  });

  const handleLogin = () => {
    router.push('/login' as any);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem(JWT_TOKEN_KEY);
    queryClient.clear();
    refetch();
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetchIngredients();
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

  if (isPending) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>加载中...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // 将所有页面的材料数据合并成一个数组
  const allIngredients = ingredients?.pages.flatMap(page => page.list) || [];

  return (
    <SafeAreaView style={styles.container}>
      {userInfo ? (
        <View style={styles.content}>
          {/* 用户信息头部 */}
          <View style={styles.userHeader}>
            <Text style={styles.welcomeText}>
              欢迎回来，{userInfo.username}
            </Text>
            <Button title="登出" onPress={handleLogout} />
          </View>

          {/* 搜索栏 */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="搜索材料..."
              value={searchText}
              onChangeText={setSearchText}
              placeholderTextColor="#999"
            />
          </View>

          {/* 材料列表 */}
          <FlatList
            data={allIngredients}
            renderItem={renderIngredientCard}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.ingredientsList}
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

              if (!hasNextPage && allIngredients.length > 0) {
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
  userHeader: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emailText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  loginPrompt: {
    alignItems: 'center',
  },
  promptText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  searchContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
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
  ingredientsList: {
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
});
