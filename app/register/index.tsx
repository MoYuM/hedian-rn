import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { login, register } from '../../api/users';
import { useAuthStore } from '../../store/auth';

export default function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { login: loginUser } = useAuthStore();

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  const registerMutation = useMutation({
    mutationFn: register,
    onSuccess: () => {
      // 注册成功后自动登录
      loginMutation.mutate({ username, password });
    },
    onError: error => {
      Alert.alert('错误', error.message);
    },
  });

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: data => {
      loginUser(data.token, { username });
      Alert.alert('成功', '注册并登录成功！');
      router.replace('/(tabs)');
    },
    onError: error => {
      Alert.alert('错误', error.message);
    },
  });

  const handleRegister = () => {
    if (!username.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('错误', '请填写所有字段');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('错误', '两次输入的密码不一致');
      return;
    }

    if (password.length < 6) {
      Alert.alert('错误', '密码长度至少6位');
      return;
    }

    registerMutation.mutate({ username, password });
  };

  const handleBackToLogin = () => {
    router.back();
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ThemedView style={styles.content}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackToLogin}
            >
              <ThemedText type="link">← 返回登录</ThemedText>
            </TouchableOpacity>

            <View style={styles.logoContainer}>
              <View
                style={[
                  styles.logo,
                  {
                    backgroundColor:
                      backgroundColor === '#fff' ? '#0a7ea4' : '#007AFF',
                  },
                ]}
              >
                <ThemedText style={styles.logoText}>H</ThemedText>
              </View>
            </View>

            <ThemedText type="title" style={styles.title}>
              创建账户
            </ThemedText>

            <ThemedView style={styles.form}>
              <View style={styles.inputContainer}>
                <ThemedText style={styles.inputLabel}>用户名</ThemedText>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor:
                        backgroundColor === '#fff' ? '#f8f9fa' : '#2a2a2a',
                      color: textColor,
                      borderColor:
                        backgroundColor === '#fff' ? '#e9ecef' : '#404040',
                    },
                  ]}
                  placeholder="请输入用户名"
                  placeholderTextColor={
                    backgroundColor === '#fff' ? '#adb5bd' : '#6c757d'
                  }
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
                      backgroundColor:
                        backgroundColor === '#fff' ? '#f8f9fa' : '#2a2a2a',
                      color: textColor,
                      borderColor:
                        backgroundColor === '#fff' ? '#e9ecef' : '#404040',
                    },
                  ]}
                  placeholder="请输入密码（至少6位）"
                  placeholderTextColor={
                    backgroundColor === '#fff' ? '#adb5bd' : '#6c757d'
                  }
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputContainer}>
                <ThemedText style={styles.inputLabel}>确认密码</ThemedText>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor:
                        backgroundColor === '#fff' ? '#f8f9fa' : '#2a2a2a',
                      color: textColor,
                      borderColor:
                        backgroundColor === '#fff' ? '#e9ecef' : '#404040',
                    },
                  ]}
                  placeholder="请再次输入密码"
                  placeholderTextColor={
                    backgroundColor === '#fff' ? '#adb5bd' : '#6c757d'
                  }
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  autoCapitalize="none"
                />
              </View>

              <TouchableOpacity
                style={[
                  styles.registerButton,
                  {
                    backgroundColor:
                      backgroundColor === '#fff' ? '#0a7ea4' : '#007AFF',
                  },
                  (registerMutation.isPending || loginMutation.isPending) &&
                    styles.registerButtonDisabled,
                ]}
                onPress={handleRegister}
                activeOpacity={0.8}
                disabled={registerMutation.isPending || loginMutation.isPending}
              >
                <ThemedText style={styles.registerButtonText}>
                  {registerMutation.isPending || loginMutation.isPending
                    ? '注册中...'
                    : '创建账户'}
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.loginLink}
                onPress={handleBackToLogin}
              >
                <ThemedText style={styles.loginLinkText}>
                  已有账户？<ThemedText type="link">立即登录</ThemedText>
                </ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>
        </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 50,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 24,
    zIndex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 40,
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
  registerButton: {
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
  registerButtonDisabled: {
    opacity: 0.6,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  loginLink: {
    alignItems: 'center',
    marginTop: 16,
  },
  loginLinkText: {
    textAlign: 'center',
    lineHeight: 24,
  },
});
