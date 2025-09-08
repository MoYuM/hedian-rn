import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useAuthStore } from '../../store/auth';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuthStore();

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      login(data.token, { username });
      Alert.alert('成功', '登录成功！');
      router.replace('/(tabs)');
    },
    onError: (error) => {
      Alert.alert('错误', error.message);
    },
  });

  const handleLogin = () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('错误', '请输入用户名和密码');
      return;
    }
    loginMutation.mutate({ username, password });
  };

  const handleRegister = () => {
    // 跳转到注册页面
    router.push('/register');
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ThemedView style={styles.content}>
          {/* Logo 区域 */}
          <View style={styles.logoContainer}>
            <View style={[styles.logo, { backgroundColor: backgroundColor === '#fff' ? '#0a7ea4' : '#007AFF' }]}>
              <ThemedText style={styles.logoText}>H</ThemedText>
            </View>
          </View>

          <ThemedText type="title" style={styles.title}>
            欢迎回来
          </ThemedText>

          <ThemedView style={styles.form}>
            <View style={styles.inputContainer}>
              <ThemedText style={styles.inputLabel}>用户名</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: backgroundColor === '#fff' ? '#f8f9fa' : '#2a2a2a',
                    color: textColor,
                    borderColor: backgroundColor === '#fff' ? '#e9ecef' : '#404040'
                  }
                ]}
                placeholder="请输入用户名"
                placeholderTextColor={backgroundColor === '#fff' ? '#adb5bd' : '#6c757d'}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <ThemedText style={styles.inputLabel}>密码</ThemedText>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: backgroundColor === '#fff' ? '#f8f9fa' : '#2a2a2a',
                    color: textColor,
                    borderColor: backgroundColor === '#fff' ? '#e9ecef' : '#404040'
                  }
                ]}
                placeholder="请输入密码"
                placeholderTextColor={backgroundColor === '#fff' ? '#adb5bd' : '#6c757d'}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity
              style={[
                styles.loginButton,
                {
                  backgroundColor: backgroundColor === '#fff' ? '#0a7ea4' : '#007AFF',
                },
                loginMutation.isPending && styles.loginButtonDisabled
              ]}
              onPress={handleLogin}
              activeOpacity={0.8}
              disabled={loginMutation.isPending}
            >
              <ThemedText style={styles.loginButtonText}>
                {loginMutation.isPending ? '登录中...' : '登录'}
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity style={styles.forgotPassword}>
              <ThemedText type="link">
                忘记密码？
              </ThemedText>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={[styles.dividerLine, { backgroundColor: backgroundColor === '#fff' ? '#e9ecef' : '#404040' }]} />
              <ThemedText style={styles.dividerText}>或</ThemedText>
              <View style={[styles.dividerLine, { backgroundColor: backgroundColor === '#fff' ? '#e9ecef' : '#404040' }]} />
            </View>

            <TouchableOpacity
              style={[
                styles.registerButton,
                { borderColor: backgroundColor === '#fff' ? '#e9ecef' : '#404040' }
              ]}
              onPress={handleRegister}
            >
              <ThemedText style={styles.registerButtonText}>
                创建新账户
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 50,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  logoText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  title: {
    textAlign: 'center',
    marginBottom: 40,
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 4,
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  loginButton: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: 8,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    opacity: 0.6,
  },
  registerButton: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
