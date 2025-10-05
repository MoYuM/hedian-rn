import { IconSymbol } from '@/components/ui/IconSymbol';
import { PlaceholderImage } from '@/components/ui/PlaceholderImage';
import { Cocktail } from '@/types/cocktails';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

interface CocktailDetailProps {
  cocktail: Cocktail;
  onClose: () => void;
}

export function CocktailDetail({ cocktail, onClose }: CocktailDetailProps) {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* 头部图片区域 */}
        <View style={styles.imageContainer}>
          {cocktail.image ? (
            <Image
              source={{ uri: cocktail.image }}
              style={styles.cocktailImage}
            />
          ) : (
            <PlaceholderImage width="100%" height={300} text="🍹" />
          )}
          <TouchableOpacity
            style={[styles.backButton, { top: insets.top + 20 }]}
            onPress={onClose}
          >
            <IconSymbol name="arrow-left" color="#fff" size={24} />
          </TouchableOpacity>
          {/* 下拉指示器 */}
          <View style={[styles.dragIndicator, { top: insets.top + 8 }]}>
            <View style={styles.dragHandle} />
          </View>
        </View>

        {/* 内容区域 */}
        <View style={styles.contentContainer}>
          {/* 标题和评分 */}
          <View style={styles.headerSection}>
            <Text style={styles.cocktailName}>{cocktail.name}</Text>
            {cocktail.en_name && (
              <Text style={styles.cocktailEnName}>{cocktail.en_name}</Text>
            )}
            <View style={styles.starContainer}>
              <IconSymbol
                name={cocktail.star > 0 ? 'star-filled' : 'star-outline'}
                color={cocktail.star > 0 ? '#eac54f' : '#666'}
                size={20}
              />
              <Text style={styles.starCount}>{cocktail.star}</Text>
            </View>
          </View>

          {/* 作者信息 */}
          <View style={styles.authorSection}>
            <Text style={styles.sectionTitle}>作者</Text>
            <Text style={styles.authorName}>{cocktail.author_name}</Text>
          </View>

          {/* 材料列表 */}
          {cocktail.ingredients && cocktail.ingredients.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>材料</Text>
              <View style={styles.ingredientsList}>
                {cocktail.ingredients.map((ingredient, index) => (
                  <View key={index} style={styles.ingredientItem}>
                    <Text style={styles.ingredientName}>{ingredient.name}</Text>
                    {ingredient.usage && (
                      <Text style={styles.ingredientAmount}>
                        {ingredient.usage}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* 制作方法 */}
          {cocktail.method && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>制作方法</Text>
              <Text style={styles.methodText}>{cocktail.method}</Text>
            </View>
          )}

          {/* 装饰 */}
          {cocktail.garnish && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>装饰</Text>
              <Text style={styles.garnishText}>{cocktail.garnish}</Text>
            </View>
          )}

          {/* 历史 */}
          {cocktail.history && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>历史</Text>
              <Text style={styles.historyText}>{cocktail.history}</Text>
            </View>
          )}

          {/* 备注 */}
          {cocktail.note && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>备注</Text>
              <Text style={styles.noteText}>{cocktail.note}</Text>
            </View>
          )}

          {/* 英文材料 */}
          {cocktail.en_ingredients && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>英文材料</Text>
              <Text style={styles.enIngredientsText}>
                {cocktail.en_ingredients}
              </Text>
            </View>
          )}

          {/* 状态信息 */}
          <View style={styles.statusSection}>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>公开状态</Text>
              <Text
                style={[
                  styles.statusValue,
                  cocktail.is_public
                    ? styles.statusPublic
                    : styles.statusPrivate,
                ]}
              >
                {cocktail.is_public ? '公开' : '私有'}
              </Text>
            </View>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>收藏状态</Text>
              <Text
                style={[
                  styles.statusValue,
                  cocktail.is_star
                    ? styles.statusStarred
                    : styles.statusUnstarred,
                ]}
              >
                {cocktail.is_star ? '已收藏' : '未收藏'}
              </Text>
            </View>
          </View>

          {/* 时间信息 */}
          <View style={styles.timeSection}>
            <Text style={styles.timeText}>
              创建时间:{' '}
              {new Date(cocktail.created_at).toLocaleDateString('zh-CN')}
            </Text>
            <Text style={styles.timeText}>
              更新时间:{' '}
              {new Date(cocktail.updated_at).toLocaleDateString('zh-CN')}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    backgroundColor: '#f0f0f0',
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dragIndicator: {
    position: 'absolute',
    left: '50%',
    marginLeft: -20,
    alignItems: 'center',
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 2,
  },
  contentContainer: {
    padding: 20,
  },
  headerSection: {
    marginBottom: 24,
  },
  cocktailName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  cocktailEnName: {
    fontSize: 18,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  starContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starCount: {
    fontSize: 18,
    color: '#666',
    fontWeight: '600',
    marginLeft: 8,
  },
  authorSection: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  authorName: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    marginBottom: 24,
  },
  ingredientsList: {
    gap: 8,
  },
  ingredientItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  ingredientName: {
    fontSize: 16,
    color: '#000',
    flex: 1,
  },
  ingredientAmount: {
    fontSize: 14,
    color: '#666',
    marginLeft: 12,
  },
  methodText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  garnishText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
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
  enIngredientsText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  statusSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
    paddingVertical: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
  },
  statusItem: {
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  statusValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusPublic: {
    color: '#34C759',
  },
  statusPrivate: {
    color: '#FF9500',
  },
  statusStarred: {
    color: '#eac54f',
  },
  statusUnstarred: {
    color: '#666',
  },
  timeSection: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  timeText: {
    fontSize: 14,
    color: '#999',
    marginBottom: 4,
  },
});
