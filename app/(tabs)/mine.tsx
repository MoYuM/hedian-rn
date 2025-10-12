import { getUserInfo, GetUserInfoResponse } from '@/api/users';
import CocktailsList from '@/components/cocktail-list';
import Header from '@/components/header';
import IngredientsList from '@/components/ingredient-list';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// 筛选器类型
type FilterType = 'ingredients' | 'cocktails';

/**
 * 我的页面
 */
export default function MineScreen() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('ingredients');

  const { data: userInfo, isPending } = useQuery<GetUserInfoResponse>({
    queryKey: ['userInfo'],
    queryFn: getUserInfo,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5分钟
    refetchOnWindowFocus: false,
  });

  const handleLogin = () => {
    router.push('/login' as any);
  };

  if (isPending) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>加载中...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const buttons = [
    { id: 'ingredients', name: '我的材料' },
    { id: 'cocktails', name: '我的配方' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {userInfo ? (
        <>
          <Header
            buttons={buttons}
            activeButton={activeFilter}
            onButtonChange={buttonId => setActiveFilter(buttonId as FilterType)}
          />

          {activeFilter === 'ingredients' ? (
            <IngredientsList />
          ) : (
            <CocktailsList />
          )}
        </>
      ) : (
        <View style={styles.loginPrompt}>
          <Text style={styles.promptText}>请先登录</Text>
          <Button title="登录" onPress={handleLogin} />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  loginPrompt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  promptText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
});
