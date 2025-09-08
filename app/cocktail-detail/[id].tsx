import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { getCocktailsList } from '../../api/cocktails';
import { addCocktail, removeCocktail } from '../../api/user-cocktails';

export default function CocktailDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const cardColor = useThemeColor({}, 'card');

  // 获取鸡尾酒详情（这里简化处理，实际应该有一个单独的详情接口）
  const {
    data: cocktailsData,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ['cocktails'],
    queryFn: ({ pageParam = 1 }) => getCocktailsList({ page: pageParam as number, size: 100 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: any, pages: any[]) => {
      if (lastPage.total > pages.length * 100) {
        return pages.length + 1;
      }
      return undefined;
    },
  });

  // 添加/删除收藏
  const addCocktailMutation = useMutation({
    mutationFn: addCocktail,
    onSuccess: () => {
      Alert.alert('成功', '已添加到我的收藏');
    },
    onError: (error) => {
      Alert.alert('错误', error.message);
    },
  });

  const removeCocktailMutation = useMutation({
    mutationFn: removeCocktail,
    onSuccess: () => {
      Alert.alert('成功', '已从收藏中移除');
    },
    onError: (error) => {
      Alert.alert('错误', error.message);
    },
  });

  const cocktail = cocktailsData?.pages
    ?.flatMap((page: any) => page.list)
    ?.find((c: any) => c.id.toString() === id);

  const handleToggleFavorite = () => {
    if (!cocktail) return;

    if (cocktail.is_star) {
      removeCocktailMutation.mutate({ cocktailId: cocktail.id });
    } else {
      addCocktailMutation.mutate({ cocktailId: cocktail.id });
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <ThemedText style={styles.loadingText}>加载中...</ThemedText>
        </View>
      </ThemedView>
    );
  }

  if (isError || !cocktail) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>
            加载失败: {error?.message || '鸡尾酒不存在'}
          </ThemedText>
          <TouchableOpacity style={styles.retryButton} onPress={handleBack}>
            <ThemedText style={styles.retryButtonText}>返回</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* 头部图片 */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: cocktail.image || 'https://via.placeholder.com/400x300' }}
            style={styles.cocktailImage}
            resizeMode="cover"
          />
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ThemedText style={styles.backButtonText}>← 返回</ThemedText>
          </TouchableOpacity>
        </View>

        {/* 内容区域 */}
        <View style={[styles.content, { backgroundColor: cardColor }]}>
          {/* 标题和基本信息 */}
          <View style={styles.header}>
            <ThemedText type="title" style={styles.cocktailName}>
              {cocktail.name}
            </ThemedText>
            <ThemedText style={styles.cocktailEnName}>
              {cocktail.en_name}
            </ThemedText>

            <View style={styles.metaInfo}>
              <View style={styles.starContainer}>
                <ThemedText style={styles.starText}>⭐ {cocktail.star}</ThemedText>
              </View>
              <ThemedText style={styles.authorText}>
                作者: {cocktail.author_name}
              </ThemedText>
            </View>
          </View>

          {/* 材料清单 */}
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              材料清单
            </ThemedText>
            <View style={styles.ingredientsList}>
              {cocktail.ingredients?.map((ingredient: any) => (
                <View key={ingredient.id} style={styles.ingredientItem}>
                  <ThemedText style={styles.ingredientName}>
                    {ingredient.name}
                  </ThemedText>
                  <ThemedText style={styles.ingredientUsage}>
                    {ingredient.usage}
                  </ThemedText>
                </View>
              ))}
            </View>
          </View>

          {/* 制作方法 */}
          <View style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              制作方法
            </ThemedText>
            <ThemedText style={styles.methodText}>
              {cocktail.method}
            </ThemedText>
          </View>

          {/* 装饰 */}
          {cocktail.garnish && (
            <View style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                装饰
              </ThemedText>
              <ThemedText style={styles.garnishText}>
                {cocktail.garnish}
              </ThemedText>
            </View>
          )}

          {/* 备注 */}
          {cocktail.note && (
            <View style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                备注
              </ThemedText>
              <ThemedText style={styles.noteText}>
                {cocktail.note}
              </ThemedText>
            </View>
          )}

          {/* 历史 */}
          {cocktail.history && (
            <View style={styles.section}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                历史
              </ThemedText>
              <ThemedText style={styles.historyText}>
                {cocktail.history}
              </ThemedText>
            </View>
          )}
        </View>
      </ScrollView>

      {/* 底部操作栏 */}
      <View style={[styles.bottomBar, { backgroundColor: cardColor }]}>
        <TouchableOpacity
          style={[
            styles.favoriteButton,
            { backgroundColor: cocktail.is_star ? '#ff6b6b' : '#007AFF' }
          ]}
          onPress={handleToggleFavorite}
          disabled={addCocktailMutation.isPending || removeCocktailMutation.isPending}
        >
          <ThemedText style={styles.favoriteButtonText}>
            {cocktail.is_star ? '❤️ 已收藏' : '🤍 收藏'}
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    height: 300,
  },
  cocktailImage: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
  },
  header: {
    marginBottom: 24,
  },
  cocktailName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cocktailEnName: {
    fontSize: 18,
    opacity: 0.7,
    marginBottom: 16,
  },
  metaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  starContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starText: {
    fontSize: 16,
    color: '#FFD700',
    fontWeight: '600',
  },
  authorText: {
    fontSize: 14,
    opacity: 0.6,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  ingredientsList: {
    gap: 12,
  },
  ingredientItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  ingredientName: {
    fontSize: 16,
    fontWeight: '500',
  },
  ingredientUsage: {
    fontSize: 14,
    color: '#666',
  },
  methodText: {
    fontSize: 16,
    lineHeight: 24,
  },
  garnishText: {
    fontSize: 16,
    lineHeight: 24,
  },
  noteText: {
    fontSize: 16,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  historyText: {
    fontSize: 16,
    lineHeight: 24,
  },
  bottomBar: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  favoriteButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  favoriteButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
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
});
