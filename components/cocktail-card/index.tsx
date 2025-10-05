import { PlaceholderImage } from '@/components/ui/PlaceholderImage';
import { Cocktail } from '@/types/cocktails';
import React from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { IconSymbol } from '../ui/IconSymbol';

interface CocktailCardProps {
  cocktail: Cocktail;
  onPress?: (cardLayout: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function CocktailCard({ cocktail, onPress }: CocktailCardProps) {
  const cardRef = React.useRef<View>(null);
  const pressed = useSharedValue<boolean>(false);

  const tap = Gesture.Tap().onBegin(() => {
    pressed.value = true;
  });

  const animatedStyles = useAnimatedStyle(() => ({
    width: pressed.value ? screenWidth : 'auto',
    height: pressed.value ? screenHeight : 'auto',
    zIndex: pressed.value ? 1000 : 1,
  }));

  const onClose = () => {
    pressed.value = false;
  };

  const handlePress = () => {
    if (onPress) {
      // 测量卡片位置
      cardRef.current?.measure((x, y, width, height, pageX, pageY) => {
        onPress({
          x: pageX,
          y: pageY,
          width,
          height,
        });
      });
    }
  };

  return (
    <GestureDetector gesture={tap}>
      <Animated.View
        style={[styles.cocktailCard, animatedStyles]}
        // onTouchStart={handlePress}
        // ref={cardRef}
      >
        {pressed.value && (
          <View>
            <IconSymbol name="arrow-left" color="#000" size={24} />
          </View>
        )}
        {cocktail.image ? (
          <Image
            source={{ uri: cocktail.image }}
            style={styles.cocktailImage}
          />
        ) : (
          <PlaceholderImage width="100%" height={160} text="🍹" />
        )}
        <View style={styles.cocktailInfo}>
          <View style={styles.nameAndStarContainer}>
            <Text style={styles.cocktailName} numberOfLines={2}>
              {cocktail.name}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <View>
                <IconSymbol name="arrow-left" color="#000" size={24} />
              </View>
            </TouchableOpacity>
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
      </Animated.View>
    </GestureDetector>
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
  cardTouchable: {
    flex: 1,
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
