import AntDesign from '@expo/vector-icons/AntDesign';
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
  'arrow-left': {
    family: 'Feather',
    name: 'arrow-left',
    description: '左箭头',
  },
  'arrow-right': {
    family: 'Feather',
    name: 'arrow-right',
    description: '右箭头',
  },
  'menubar.plus': {
    family: 'Feather',
    name: 'plus',
    description: '加号圆圈图标',
  },
  inbox: {
    family: 'AntDesign',
    name: 'inbox',
    description: '黄金图标',
  },
  close: {
    family: 'AntDesign',
    name: 'close',
    description: '关闭图标',
  },
};

const ICON_COMPONENTS: Record<string, ComponentType<any>> = {
  Entypo,
  Feather,
  FontAwesome,
  MaterialIcons,
  AntDesign,
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
