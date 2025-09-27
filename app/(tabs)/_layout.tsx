import { IconSymbol } from '@/components/ui/IconSymbol';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '首页',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} color={color} name="menubar.home" />
          ),
        }}
      />
      <Tabs.Screen
        name="mine"
        options={{
          title: '我的',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} color={color} name="menubar.mine" />
          ),
        }}
      />
    </Tabs>
  );
}
