import React from 'react';
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
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    title: { fontSize: 28, fontWeight: 'bold', marginBottom: 10 },
    subtitle: { fontSize: 18, color: '#555' },
});
