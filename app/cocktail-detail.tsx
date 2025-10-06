import { addCocktail, removeCocktail } from '@/api/user-cocktails';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Cocktail } from '@/types/cocktails';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CocktailDetailScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { cocktail } = useLocalSearchParams<{ cocktail: string }>();

  // 解析传递的 cocktail 数据
  const cocktailData: Cocktail = cocktail ? JSON.parse(cocktail) : null;

  // 收藏状态管理
  const [isStarred, setIsStarred] = useState(cocktailData?.is_star || false);
  const [starCount, setStarCount] = useState(cocktailData?.star || 0);

  // 添加收藏的 mutation
  const addCocktailMutation = useMutation({
    mutationFn: addCocktail,
    onSuccess: () => {
      console.log('添加收藏成功');
      setIsStarred(true);
      setStarCount(prev => prev + 1);
      // 使相关查询失效，触发重新获取
      queryClient.invalidateQueries({ queryKey: ['userCocktails'] });
      queryClient.invalidateQueries({ queryKey: ['searchCocktails'] });
      queryClient.invalidateQueries({ queryKey: ['cocktailList'] });
    },
    onError: error => {
      console.error('添加收藏失败:', error);
      Alert.alert('操作失败', `添加收藏失败: ${error.message}`);
    },
  });

  // 移除收藏的 mutation
  const removeCocktailMutation = useMutation({
    mutationFn: removeCocktail,
    onSuccess: () => {
      console.log('移除收藏成功');
      setIsStarred(false);
      setStarCount(prev => Math.max(0, prev - 1));
      // 使相关查询失效，触发重新获取
      queryClient.invalidateQueries({ queryKey: ['userCocktails'] });
      queryClient.invalidateQueries({ queryKey: ['searchCocktails'] });
      queryClient.invalidateQueries({ queryKey: ['cocktailList'] });
    },
    onError: error => {
      console.error('移除收藏失败:', error);
      Alert.alert('操作失败', `移除收藏失败: ${error.message}`);
    },
  });

  const handleStarPress = () => {
    if (isLoading) {
      return;
    }

    if (isStarred) {
      removeCocktailMutation.mutate({ cocktailId: cocktailData.id });
    } else {
      addCocktailMutation.mutate({ cocktailId: cocktailData.id });
    }
  };

  const isLoading =
    addCocktailMutation.isPending || removeCocktailMutation.isPending;

  if (!cocktailData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>鸡尾酒数据不存在</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>返回</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* 头部导航 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <IconSymbol name="arrow-left" color="#000" size={24} />
        </TouchableOpacity>
        {cocktailData.author_name && (
          <Text style={styles.authorName}>{cocktailData.author_name}</Text>
        )}
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
          {cocktailData.image ? (
            <Image
              source={{ uri: cocktailData.image }}
              style={styles.cocktailImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.placeholderImage}>
              <Text style={styles.placeholderText}>🍹</Text>
            </View>
          )}
        </View>

        <View style={styles.infoCard}>
          <View style={styles.titleContainer}>
            <View style={styles.titleTextContainer}>
              <Text style={styles.cocktailName}>{cocktailData.name}</Text>
              {cocktailData.en_name && (
                <Text style={styles.englishName}>{cocktailData.en_name}</Text>
              )}
            </View>
            <View style={styles.starContainer}>
              <TouchableOpacity
                style={styles.starButton}
                onPress={handleStarPress}
                disabled={isLoading}
              >
                <IconSymbol
                  name={isStarred ? 'star-filled' : 'star-outline'}
                  color={isStarred ? '#eac54f' : '#666'}
                  size={24}
                />
                <Text style={styles.starCount}>{starCount}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 材料列表 */}
        {cocktailData.ingredients && cocktailData.ingredients.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>所需材料</Text>
            </View>
            <View>
              {cocktailData.ingredients.map((ingredient, index) => (
                <View key={index} style={styles.ingredientItem}>
                  <View style={styles.ingredientInfo}>
                    <Text style={styles.ingredientName}>{ingredient.name}</Text>
                    {ingredient.usage && (
                      <Text style={styles.ingredientUsage}>
                        {ingredient.usage}
                      </Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* 制作方法 */}
        {cocktailData.method && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>制作方法</Text>
            </View>
            <Text style={styles.methodText}>{cocktailData.method}</Text>
          </View>
        )}

        {/* 装饰物 */}
        {cocktailData.garnish && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>装饰物</Text>
            </View>
            <View>
              <Text style={styles.garnishText}>{cocktailData.garnish}</Text>
            </View>
          </View>
        )}

        {/* 历史背景 */}
        {cocktailData.history && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>历史背景</Text>
            </View>
            <View style={styles.historyCard}>
              <Text style={styles.historyText}>{cocktailData.history}</Text>
            </View>
          </View>
        )}

        {/* 备注 */}
        {cocktailData.note && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>备注</Text>
            </View>
            <View>
              <Text style={styles.noteText}>{cocktailData.note}</Text>
            </View>
          </View>
        )}

        {/* 底部间距 */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
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
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    height: 280,
    position: 'relative',
  },
  cocktailImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e9ecef',
  },
  placeholderText: {
    fontSize: 80,
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  infoCard: {
    margin: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  titleTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  cocktailName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  starContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  starButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  starCount: {
    fontSize: 16,
    color: '#666',
    marginLeft: 6,
    fontWeight: '600',
  },
  englishName: {
    fontSize: 18,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  authorName: {
    fontSize: 16,
    marginLeft: 6,
  },
  statusTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  starredTag: {
    backgroundColor: '#fff3e0',
  },
  statusText: {
    fontSize: 12,
    color: '#007AFF',
    marginLeft: 4,
    fontWeight: '500',
  },
  starredText: {
    color: '#e65100',
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  methodCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  methodText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  ingredientInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ingredientName: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  ingredientUsage: {
    fontSize: 14,
    color: '#666',
    backgroundColor: '#e9ecef',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    fontWeight: '500',
  },
  garnishText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  historyCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  historyText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  noteText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  timeCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  timeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  timeLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  timeValue: {
    fontSize: 14,
    color: '#333',
  },
  bottomSpacing: {
    height: 40,
  },
});
