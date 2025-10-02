import { getUserInfo, GetUserInfoResponse } from '@/api/users';
import { JWT_TOKEN_KEY } from '@/constants/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Button, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * 我的页面
 */
export default function MineScreen() {
  const queryClient = useQueryClient();

  const {
    data: userInfo,
    isPending,
    refetch,
  } = useQuery<GetUserInfoResponse>({
    queryKey: ['userInfo'],
    queryFn: getUserInfo,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5分钟
    refetchOnWindowFocus: false,
  });

  const handleLogin = () => {
    router.push('/login' as any);
  };

  const handleLogout = async () => {
    // 清空 JWT token
    await AsyncStorage.removeItem(JWT_TOKEN_KEY);

    // 清空所有 useQuery 缓存
    queryClient.clear();

    // 可选：重新获取用户信息（这会返回未登录状态）
    refetch();
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
      <View style={styles.content}>
        {userInfo ? (
          <View style={styles.userInfo}>
            <Text style={styles.welcomeText}>
              欢迎回来，{userInfo.username}
            </Text>
            <Button title="登出" onPress={handleLogout} />
          </View>
        ) : (
          <View style={styles.loginPrompt}>
            <Text style={styles.promptText}>请先登录</Text>
            <Button title="登录" onPress={handleLogin} />
          </View>
        )}
      </View>
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
    padding: 20,
    justifyContent: 'center',
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
  userInfo: {
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emailText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  loginPrompt: {
    alignItems: 'center',
  },
  promptText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
});
