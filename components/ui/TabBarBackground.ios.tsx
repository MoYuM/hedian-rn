import { BlurView } from 'expo-blur';
import { StyleSheet } from 'react-native';

export default function BlurTabBarBackground() {
  return (
    <BlurView
      // System chrome material automatically adapts to the system's theme
      // and matches the native tab bar appearance on iOS.
      tint="systemChromeMaterial"
      intensity={100}
      style={StyleSheet.absoluteFill}
    />
  );
}

// 移除对React Navigation的依赖，使用固定值或自定义hook
export function useBottomTabOverflow() {
  // 返回一个合理的默认值，或者您可以根据需要实现自定义逻辑
  return 0;
}
