import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface User {
  username: string;
  email: string;
}

const USER_STORAGE_KEY = 'user_data';

/**
 * 我的页面
 */
export default function MineScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem(USER_STORAGE_KEY);
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('加载用户数据失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    router.push('/login' as any);
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
      setUser(null);
    } catch (error) {
      console.error('登出失败:', error);
    }
  };

  if (isLoading) {
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
        {user ? (
          <View style={styles.userInfo}>
            <Text style={styles.welcomeText}>欢迎回来，{user.username}</Text>
            <Text style={styles.emailText}>{user.email}</Text>
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
