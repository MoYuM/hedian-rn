import { useFonts } from 'expo-font';
import { Drawer } from 'expo-router/drawer';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import CustomDrawerContent from '@/components/drawer-content';
import { AppProviders } from '@/providers';

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <AppProviders>
      <Drawer
        drawerContent={props => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerShown: false,
          drawerStyle: {
            backgroundColor: '#fff',
            width: 280,
          },
          drawerType: 'front',
          swipeEnabled: true,
        }}
      >
        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: '首页',
            title: '首页',
          }}
        />
        <Drawer.Screen
          name="login"
          options={{
            drawerLabel: '登录',
            title: '登录',
          }}
        />
        <Drawer.Screen
          name="register"
          options={{
            drawerLabel: '注册',
            title: '注册',
          }}
        />
        <Drawer.Screen
          name="(tabs)"
          options={{
            drawerLabel: '主页面',
            title: '主页面',
          }}
        />
        <Drawer.Screen
          name="cocktail-detail"
          options={{
            drawerLabel: '鸡尾酒详情',
            title: '鸡尾酒详情',
          }}
        />
        <Drawer.Screen
          name="add-ingredient"
          options={{
            drawerLabel: '添加材料',
            title: '添加材料',
          }}
        />
        <Drawer.Screen
          name="create-cocktail"
          options={{
            drawerLabel: '创建鸡尾酒',
            title: '创建鸡尾酒',
          }}
        />
        <Drawer.Screen
          name="not-found"
          options={{
            drawerLabel: '页面未找到',
            title: '页面未找到',
          }}
        />
      </Drawer>
      <StatusBar style="auto" />
    </AppProviders>
  );
}
