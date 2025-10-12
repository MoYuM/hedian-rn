import { IconSymbol } from '@/components/ui/IconSymbol';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

interface DrawerContentProps {
  navigation: any;
  state: any;
  descriptors: any;
}

export default function CustomDrawerContent(props: DrawerContentProps) {
  const { navigation } = props;

  const handleLogout = () => {
    // TODO: 实现退出登录逻辑
    console.log('退出登录');
    navigation.closeDrawer();
  };

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.container}
    >
      <View style={styles.header}>
        <Image
          style={styles.avatar}
          source={{
            uri: 'https://s1.aigei.com/prevfiles/9f7f85b3b9384d9baf5d679ef2296eb8.jpg?e=2051020800&token=P7S2Xpzfz11vAkASLTkfHN7Fw-oOZBecqeJaxypL:Uo38WTfJnBXieqNx2CRXM72JTlk=',
          }}
        />
        <Text style={styles.userName}>用户</Text>
        <Text style={styles.userEmail}>user@example.com</Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>核点鸡尾酒 v1.0.0</Text>

        <DrawerItem
          label="退出登录"
          icon={({ color, size }) => (
            <IconSymbol
              name="rectangle.portrait.and.arrow.right"
              size={size}
              color={color}
            />
          )}
          onPress={handleLogout}
          labelStyle={styles.logoutLabel}
          style={styles.logoutItem}
        />
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  logoutItem: {
    marginHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#ff3b30',
    marginTop: 16,
  },
  logoutLabel: {
    fontSize: 16,
    color: '#fff',
    marginLeft: -10,
    fontWeight: '500',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
  },
});
