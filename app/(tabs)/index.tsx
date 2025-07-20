import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to TaskBridge</Text>
      <Text style={styles.subtitle}>Your local favor-sharing community</Text>
      
      <TouchableOpacity style={styles.button} onPress={() => router.push('/login')}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f4f4f4', padding: 20,
  },
  title: {
    fontSize: 28, fontWeight: 'bold', color: '#1F2937', marginBottom: 10,
  },
  subtitle: {
    fontSize: 18, color: '#374151', marginBottom: 40,
  },
  button: {
    backgroundColor: '#001031',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
