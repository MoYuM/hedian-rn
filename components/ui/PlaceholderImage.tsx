import { StyleSheet, Text, View } from 'react-native';

interface PlaceholderImageProps {
  width?: number | string;
  height?: number | string;
  text?: string;
}

/**
 * 占位符图片组件
 */
export function PlaceholderImage({
  width = '100%',
  height = 200,
  text = '🍹',
}: PlaceholderImageProps) {
  return (
    <View style={[styles.container, { width, height }]}>
      <Text style={styles.icon}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 48,
    opacity: 0.5,
  },
});
