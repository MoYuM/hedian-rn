import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight } from 'expo-symbols';
import { ComponentType } from 'react';
import {
  OpaqueColorValue,
  Text,
  type StyleProp,
  type TextStyle,
} from 'react-native';

type IconFamily = Record<
  string,
  {
    family: string;
    name: string;
    description: string;
  }
>;

const MAPPING: IconFamily = {
  'menubar.home': {
    family: 'Entypo',
    name: 'home',
    description: '底部导航栏首页图标',
  },
  'menubar.mine': {
    family: 'Feather',
    name: 'user',
    description: '底部导航栏我的图标',
  },
  'menubar.search': {
    family: 'Feather',
    name: 'search',
    description: '底部导航栏搜索图标',
  },
  'star-outline': {
    family: 'MaterialIcons',
    name: 'star-outline',
    description: '星形图标',
  },
  'star-filled': {
    family: 'MaterialIcons',
    name: 'star',
    description: '星形图标填满的',
  },
};

const ICON_COMPONENTS: Record<string, ComponentType<any>> = {
  Entypo,
  Feather,
  FontAwesome,
  MaterialIcons,
};

/**
 * https://icons.expo.fyi/Index 中找到对应的图标
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: keyof typeof MAPPING;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  const mapping = MAPPING[name];

  if (!mapping) {
    return <Text>Icon not found</Text>;
  }

  const IconComponent = ICON_COMPONENTS[mapping.family];

  if (!IconComponent || !mapping) {
    return <Text>Icon not found</Text>;
  }

  return (
    <IconComponent
      color={color}
      size={size}
      name={mapping.name}
      style={style}
    />
  );
}
