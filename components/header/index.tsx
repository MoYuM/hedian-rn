import { IconSymbol } from '@/components/ui/IconSymbol';
import { pagePadding } from '@/constants/theme';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface HeaderButton {
  id: string;
  name: string;
}

export interface HeaderProps {
  /** 头像图片 URL */
  avatarUri?: string;
  /** 是否显示搜索按钮 */
  showSearchButton?: boolean;
  /** 搜索按钮点击事件 */
  onSearchPress?: () => void;
  /** 按钮组数据 */
  buttons?: HeaderButton[];
  /** 当前选中的按钮 */
  activeButton?: string;
  /** 按钮选择回调 */
  onButtonChange?: (buttonId: string) => void;
}

export default function Header({
  avatarUri = 'https://s1.aigei.com/prevfiles/9f7f85b3b9384d9baf5d679ef2296eb8.jpg?e=2051020800&token=P7S2Xpzfz11vAkASLTkfHN7Fw-oOZBecqeJaxypL:Uo38WTfJnBXieqNx2CRXM72JTlk=',
  showSearchButton = false,
  onSearchPress,
  buttons = [],
  activeButton,
  onButtonChange,
}: HeaderProps) {
  const navigation = useNavigation();

  const handleSearchPress = () => {
    if (onSearchPress) {
      onSearchPress();
    } else {
      router.push('/search' as any);
    }
  };

  const handleAvatarPress = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const renderButton = (button: HeaderButton) => (
    <TouchableOpacity
      key={button.id}
      style={[styles.button, activeButton === button.id && styles.buttonActive]}
      onPress={() => onButtonChange?.(button.id)}
    >
      <Text
        style={[
          styles.buttonText,
          activeButton === button.id && styles.buttonTextActive,
        ]}
      >
        {button.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handleAvatarPress}
        style={styles.avatarContainer}
      >
        <Image style={styles.avatar} source={{ uri: avatarUri }} />
      </TouchableOpacity>

      {/* 按钮组 */}
      {buttons.length > 0 && (
        <View style={styles.buttonsContainer}>{buttons.map(renderButton)}</View>
      )}

      {/* 搜索按钮 */}
      {showSearchButton && (
        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearchPress}
        >
          <IconSymbol size={24} name="menubar.search" color="#666" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: pagePadding,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  buttonsContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f8f8f8',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  buttonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  buttonTextActive: {
    color: '#fff',
  },
  searchButton: {
    marginLeft: 'auto',
  },
});
