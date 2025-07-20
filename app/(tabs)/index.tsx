import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to TaskBridge</Text>
      <Text style={styles.subtitle}>Your local favor-sharing community</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4', // Light background
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937', // Dark gray-blue text
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#374151', // Softer gray
  },
});
