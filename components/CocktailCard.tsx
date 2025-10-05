import { PlaceholderImage } from '@/components/ui/PlaceholderImage';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IconSymbol } from './ui/IconSymbol';

interface CocktailCardProps {
  cocktail: {
    id: string | number;
    name: string;
    image?: string;
    star: number;
    method: string;
  };
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
        <Text style={styles.cocktailName} numberOfLines={2}>
          {cocktail.name}
        </Text>
        <View style={styles.cocktailMeta}>
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
        <Text style={styles.cocktailMethod} numberOfLines={3}>
          {cocktail.method}
        </Text>
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
  cocktailName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  cocktailMeta: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 8,
  },
  starContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  cocktailMethod: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
});
