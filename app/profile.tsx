import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { auth } from '../firebaseConfig';

export default function ProfileHeader() {
  const user = auth.currentUser;

  return (
    <View style={styles.header}>
      <Text style={styles.title}>Welcome, {user?.email}</Text>
      <Text style={styles.badge}>🔵 Trust Badge: Verified User</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 5 },
  badge: { fontSize: 16, color: '#2563EB' },
});
