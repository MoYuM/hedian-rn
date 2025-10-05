import { PlaceholderImage } from '@/components/ui/PlaceholderImage';
import { Cocktail } from '@/types/cocktails';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IconSymbol } from './ui/IconSymbol';

interface CocktailCardProps {
  cocktail: Cocktail;
  onPress?: () => void;
}

export function CocktailCard({ cocktail, onPress }: CocktailCardProps) {
  return (
    <TouchableOpacity style={styles.cocktailCard} onPress={onPress}>
      {cocktail.image ? (
        <Image source={{ uri: cocktail.image }} style={styles.cocktailImage} />
      ) : (
        <PlaceholderImage width="100%" height={160} text="🍹" />
      )}
      <View style={styles.cocktailInfo}>
        <View style={styles.nameAndStarContainer}>
          <Text style={styles.cocktailName} numberOfLines={2}>
            {cocktail.name}
          </Text>
          <View style={styles.starContainer}>
            <Text style={styles.starIcon}>
              <IconSymbol
                name={cocktail.star > 0 ? 'star-filled' : 'star-outline'}
                color={cocktail.star > 0 ? '#eac54f' : '#666'}
                size={16}
              />
            </Text>
            <Text style={styles.starCount}>{cocktail.star}</Text>
          </View>
        </View>
        <View style={styles.ingredientsContainer}>
          {cocktail.ingredients && cocktail.ingredients.length > 0 ? (
            cocktail.ingredients.slice(0, 3).map((ingredient, index) => (
              <View key={index} style={styles.ingredientTag}>
                <Text style={styles.ingredientText} numberOfLines={1}>
                  {ingredient.name}
                </Text>
              </View>
            ))
          ) : (
            <View style={styles.ingredientTag}>
              <Text style={styles.ingredientText}>暂无材料</Text>
            </View>
          )}
          {cocktail.ingredients && cocktail.ingredients.length > 3 && (
            <View style={styles.ingredientTag}>
              <Text style={styles.ingredientText}>
                +{cocktail.ingredients.length - 3}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cocktailCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
    marginBottom: 16,
    marginHorizontal: 4,
  },
  cocktailImage: {
    width: '100%',
    height: 160,
    backgroundColor: '#f0f0f0',
  },
  cocktailInfo: {
    padding: 12,
  },
  nameAndStarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cocktailName: {
    fontSize: 14,
    fontWeight: 'normal',
    color: '#000',
    flex: 1,
    marginRight: 12,
    lineHeight: 20, // 调整行高以匹配新的字体大小
  },
  starContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0, // 防止被压缩
    paddingTop: 2, // 稍微向下偏移，与文字基线对齐
  },
  starIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  starCount: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  ingredientsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  ingredientTag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  ingredientText: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
  },
});
