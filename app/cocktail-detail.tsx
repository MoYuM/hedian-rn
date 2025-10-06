import { IconSymbol } from '@/components/ui/IconSymbol';
import { Cocktail } from '@/types/cocktails';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
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
  const { cocktail } = useLocalSearchParams<{ cocktail: string }>();

  // 解析传递的 cocktail 数据
  const cocktailData: Cocktail = cocktail ? JSON.parse(cocktail) : null;

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
          <IconSymbol name="arrow-left" color="#fff" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>鸡尾酒详情</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* 鸡尾酒图片 */}
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
          {/* 渐变遮罩 */}
          <View style={styles.imageGradient} />
        </View>

        {/* 基本信息卡片 */}
        <View style={styles.infoCard}>
          <View style={styles.titleContainer}>
            <View style={styles.titleTextContainer}>
              <Text style={styles.cocktailName}>{cocktailData.name}</Text>
              {cocktailData.en_name && (
                <Text style={styles.englishName}>{cocktailData.en_name}</Text>
              )}
            </View>
            <View style={styles.starContainer}>
              <IconSymbol
                name={cocktailData.star > 0 ? 'star-filled' : 'star-outline'}
                color={cocktailData.star > 0 ? '#eac54f' : '#666'}
                size={24}
              />
              <Text style={styles.starCount}>{cocktailData.star}</Text>
            </View>
          </View>

          {cocktailData.author_name && (
            <View style={styles.authorContainer}>
              <IconSymbol name="person" color="#666" size={16} />
              <Text style={styles.authorName}>
                by {cocktailData.author_name}
              </Text>
            </View>
          )}

          {/* 状态标签 */}
          <View style={styles.statusContainer}>
            {cocktailData.is_public && (
              <View style={styles.statusTag}>
                <IconSymbol name="globe" color="#007AFF" size={14} />
                <Text style={styles.statusText}>公开</Text>
              </View>
            )}
            {cocktailData.is_star && (
              <View style={[styles.statusTag, styles.starredTag]}>
                <IconSymbol name="star-filled" color="#eac54f" size={14} />
                <Text style={[styles.statusText, styles.starredText]}>
                  已收藏
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* 制作方法 */}
        {cocktailData.method && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <IconSymbol name="recipe" color="#007AFF" size={20} />
              <Text style={styles.sectionTitle}>制作方法</Text>
            </View>
            <View style={styles.methodCard}>
              <Text style={styles.methodText}>{cocktailData.method}</Text>
            </View>
          </View>
        )}

        {/* 材料列表 */}
        {cocktailData.ingredients && cocktailData.ingredients.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <IconSymbol name="ingredients" color="#007AFF" size={20} />
              <Text style={styles.sectionTitle}>所需材料</Text>
            </View>
            <View style={styles.ingredientsCard}>
              {cocktailData.ingredients.map((ingredient, index) => (
                <View key={index} style={styles.ingredientItem}>
                  <View style={styles.ingredientIcon}>
                    <Text style={styles.ingredientEmoji}>🥃</Text>
                  </View>
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

        {/* 装饰物 */}
        {cocktailData.garnish && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <IconSymbol name="decorative" color="#007AFF" size={20} />
              <Text style={styles.sectionTitle}>装饰物</Text>
            </View>
            <View style={styles.garnishCard}>
              <Text style={styles.garnishText}>{cocktailData.garnish}</Text>
            </View>
          </View>
        )}

        {/* 历史背景 */}
        {cocktailData.history && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <IconSymbol name="history" color="#007AFF" size={20} />
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
              <IconSymbol name="note" color="#007AFF" size={20} />
              <Text style={styles.sectionTitle}>备注</Text>
            </View>
            <View style={styles.noteCard}>
              <Text style={styles.noteText}>{cocktailData.note}</Text>
            </View>
          </View>
        )}

        {/* 时间信息 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <IconSymbol name="time" color="#007AFF" size={20} />
            <Text style={styles.sectionTitle}>时间信息</Text>
          </View>
          <View style={styles.timeCard}>
            <View style={styles.timeItem}>
              <Text style={styles.timeLabel}>创建时间</Text>
              <Text style={styles.timeValue}>
                {new Date(cocktailData.created_at).toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
            <View style={styles.timeItem}>
              <Text style={styles.timeLabel}>更新时间</Text>
              <Text style={styles.timeValue}>
                {new Date(cocktailData.updated_at).toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
          </View>
        </View>

        {/* 底部间距 */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#007AFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
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
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
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
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  statusContainer: {
    flexDirection: 'row',
    gap: 8,
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
    marginLeft: 8,
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
  ingredientsCard: {
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
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  ingredientIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  ingredientEmoji: {
    fontSize: 20,
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
    fontWeight: '500',
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
  garnishCard: {
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
  noteCard: {
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
  noteText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  timeCard: {
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
