import { useLogto } from '@logto/rn';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const { signIn, signOut, isAuthenticated } = useLogto();

  return (
    <View style={styles.container}>
      {isAuthenticated ? (
        <TouchableOpacity style={styles.button} onPress={async () => signOut()}>
          <Text style={styles.buttonText}>Sign out</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.button}
          onPress={async () => signIn('io.logto://callback')}
        >
          <Text style={styles.buttonText}>Sign in</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
