import { getUserInfo, GetUserInfoResponse } from '@/api/users';
import CocktailsList from '@/components/cocktail-list';
import IngredientsList from '@/components/ingredient-list';
import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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

  return (
    <SafeAreaView style={styles.container}>
      {userInfo ? (
        <View style={styles.content}>
          {/* 头部区域 - 用户头像 + 筛选器 */}
          <View style={styles.headerContainer}>
            <Image
              style={styles.avatar}
              source={{
                uri: 'https://s1.aigei.com/prevfiles/9f7f85b3b9384d9baf5d679ef2296eb8.jpg?e=2051020800&token=P7S2Xpzfz11vAkASLTkfHN7Fw-oOZBecqeJaxypL:Uo38WTfJnBXieqNx2CRXM72JTlk=',
              }}
            />
            <View style={styles.filterContainer}>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  activeFilter === 'ingredients' && styles.filterButtonActive,
                ]}
                onPress={() => setActiveFilter('ingredients')}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    activeFilter === 'ingredients' &&
                      styles.filterButtonTextActive,
                  ]}
                >
                  我的材料
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  activeFilter === 'cocktails' && styles.filterButtonActive,
                ]}
                onPress={() => setActiveFilter('cocktails')}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    activeFilter === 'cocktails' &&
                      styles.filterButtonTextActive,
                  ]}
                >
                  我的配方
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {activeFilter === 'ingredients' ? (
            <IngredientsList />
          ) : (
            <CocktailsList />
          )}
        </View>
      ) : (
        <View style={styles.content}>
          <View style={styles.loginPrompt}>
            <Text style={styles.promptText}>请先登录</Text>
            <Button title="登录" onPress={handleLogin} />
          </View>
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
  content: {
    flex: 1,
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
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  loginPrompt: {
    alignItems: 'center',
  },
  promptText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  filterContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  filterButton: {
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
  filterButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
});
