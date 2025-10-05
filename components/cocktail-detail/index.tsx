import { Cocktail } from '@/types/cocktails';
import { useEffect } from 'react';
import { Animated, Dimensions, Modal, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { CocktailDetail } from './detail';

interface CocktailDetailModalProps {
  visible: boolean;
  cocktail: Cocktail | null;
  onClose: () => void;
  cardLayout?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const scaleAnim = new Animated.Value(1);
const translateXAnim = new Animated.Value(0);
const translateYAnim = new Animated.Value(0);
const panY = new Animated.Value(0);

export default function CocktailDetailModal({
  visible,
  cocktail,
  onClose,
  cardLayout,
}: CocktailDetailModalProps) {
  // 创建新的 Pan gesture，使用更现代的配置
  const panGesture = Gesture.Pan()
    .minDistance(5) // 减少最小拖拽距离，让响应更敏感
    .activeOffsetY(5) // 减少向下拖拽的激活偏移
    .failOffsetX([-30, 30]) // 减少水平拖拽失败范围，让响应更敏感
    .runOnJS(true) // 在 JS 线程运行，确保与 Animated API 兼容
    .onUpdate(event => {
      // 只允许向下拖拽
      if (event.translationY > 0) {
        panY.setValue(event.translationY);
        // 根据拖拽距离调整缩放
        const progress = Math.min(event.translationY / (screenHeight * 0.3), 1);

        // 计算卡片原始缩放比例
        const cardWidth = cardLayout ? cardLayout.width : screenWidth * 0.9;
        const cardHeight = cardLayout ? cardLayout.height : screenHeight * 0.6;
        const scaleX = cardWidth / screenWidth;
        const scaleY = cardHeight / screenHeight;
        const initialScale = Math.min(scaleX, scaleY);

        // 从卡片原始大小开始缩放，而不是从1开始
        const scale = Math.max(
          initialScale,
          1 - progress * (1 - initialScale) * 0.5
        );

        scaleAnim.setValue(scale);
      }
    })
    .onEnd(event => {
      const shouldClose =
        event.translationY > screenHeight * 0.1 || event.velocityY > 600;

      if (shouldClose) {
        // 关闭动画 - 使用快速线性动画
        Animated.parallel([
          Animated.timing(panY, {
            toValue: screenHeight,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: cardLayout
              ? Math.min(
                  cardLayout.width / screenWidth,
                  cardLayout.height / screenHeight
                )
              : 0.8,
            duration: 150,
            useNativeDriver: true,
          }),
        ]).start(() => {
          onClose();
          // 重置动画值
          panY.setValue(0);
        });
      } else {
        // 回弹动画 - 使用快速线性动画
        Animated.parallel([
          Animated.timing(panY, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
        ]).start();
      }
    });

  useEffect(() => {
    if (visible && cocktail) {
      // 计算卡片在屏幕中的位置
      const cardCenterX = cardLayout
        ? cardLayout.x + cardLayout.width / 2
        : screenWidth / 2;
      const cardCenterY = cardLayout
        ? cardLayout.y + cardLayout.height / 2
        : screenHeight / 2;

      // 计算卡片的原始缩放比例
      const cardWidth = cardLayout ? cardLayout.width : screenWidth * 0.9;
      const cardHeight = cardLayout ? cardLayout.height : screenHeight * 0.6;
      const scaleX = cardWidth / screenWidth;
      const scaleY = cardHeight / screenHeight;
      const initialScale = Math.min(scaleX, scaleY); // 使用较小的缩放比例保持比例

      // 调试信息
      console.log('Card Layout:', cardLayout);
      console.log('Card Center:', { x: cardCenterX, y: cardCenterY });
      console.log('Card Size:', { width: cardWidth, height: cardHeight });
      console.log('Initial Scale:', initialScale);

      // 设置初始位置和缩放
      translateXAnim.setValue(cardCenterX - screenWidth / 2);
      translateYAnim.setValue(cardCenterY - screenHeight / 2);
      scaleAnim.setValue(initialScale);

      // 开始动画 - 使用快速线性动画
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateXAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // 关闭动画 - 计算卡片原始缩放比例
      const cardWidth = cardLayout ? cardLayout.width : screenWidth * 0.9;
      const cardHeight = cardLayout ? cardLayout.height : screenHeight * 0.6;
      const scaleX = cardWidth / screenWidth;
      const scaleY = cardHeight / screenHeight;
      const initialScale = Math.min(scaleX, scaleY);

      // 计算卡片在屏幕中的位置
      const cardCenterX = cardLayout
        ? cardLayout.x + cardLayout.width / 2
        : screenWidth / 2;
      const cardCenterY = cardLayout
        ? cardLayout.y + cardLayout.height / 2
        : screenHeight / 2;

      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: initialScale,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(translateXAnim, {
          toValue: cardCenterX - screenWidth / 2,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: cardCenterY - screenHeight / 2,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // 重置动画值
        scaleAnim.setValue(1);
        translateXAnim.setValue(0);
        translateYAnim.setValue(0);
        panY.setValue(0);
      });
    }
  }, [visible, cocktail, cardLayout]);

  if (!visible || !cocktail) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [
                { translateX: translateXAnim },
                { translateY: Animated.add(translateYAnim, panY) },
                { scale: scaleAnim },
              ],
            },
          ]}
        >
          <CocktailDetail cocktail={cocktail} onClose={onClose} />
        </Animated.View>
      </GestureDetector>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    borderRadius: 0,
  },
});
