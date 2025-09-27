import { useLogto, IdTokenClaims } from '@logto/rn';
import { useEffect, useState } from 'react';
import { Button, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
        <Button title="Sign out" onPress={async () => signOut()} />
      ) : (
        // Replace the redirect URI with your own
        <Button
          title="Sign in"
          onPress={async () => signIn('http://localhost:8081/mine')}
        />
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
