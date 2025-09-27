import { IdTokenClaims, useLogto } from '@logto/rn';
import { useEffect, useState } from 'react';
import { Button, Platform, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const isIos = Platform.OS === 'ios';
const callbackUrl = isIos
  ? 'io.logto://callback'
  : 'http://localhost:8081/mine';

/**
 * 我的页面
 */
export default function MineScreen() {
  const [user, setUser] = useState<IdTokenClaims | null>(null);
  const { signIn, signOut, isAuthenticated, getIdTokenClaims } = useLogto();

  useEffect(() => {
    if (!isAuthenticated) return;
    getIdTokenClaims().then(user => {
      setUser(user);
    });
  }, [isAuthenticated, getIdTokenClaims]);

  return (
    <SafeAreaView style={styles.container}>
      <Text>欢迎回来，{user?.email}</Text>

      {isAuthenticated ? (
        <Button title="登出" onPress={async () => signOut()} />
      ) : (
        <Button title="登录" onPress={async () => signIn(callbackUrl)} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});
