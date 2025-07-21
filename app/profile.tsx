import { signOut } from 'firebase/auth';
import {
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { auth, db } from '../firebaseConfig';

export default function ProfileScreen() {
  const user = auth.currentUser;
  const [posted, setPosted] = useState<{ id: string; title: string }[]>([]);
  const [accepted, setAccepted] = useState<{ id: string; title: string }[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const postedQuery = query(
          collection(db, 'favors'),
          where('postedBy', '==', user.email)
        );
        const acceptedQuery = query(
          collection(db, 'favors'),
          where('acceptedBy', '==', user.email)
        );

        const [postedSnap, acceptedSnap] = await Promise.all([
          getDocs(postedQuery),
          getDocs(acceptedQuery),
        ]);

        setPosted(
          postedSnap.docs.map(doc => ({ id: doc.id, ...(doc.data() as { title: string }) }))
        );
        setAccepted(
          acceptedSnap.docs.map(doc => ({ id: doc.id, ...(doc.data() as { title: string }) }))
        );
        

      } catch (err) {
        console.error("Error loading profile data:", err);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert('Success', 'Logged out');
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {user?.email}</Text>
      <Text style={styles.badge}>🔵 Trust Badge: Verified User</Text>

      <Text style={styles.section}>Favors You Posted:</Text>
      <FlatList
        data={posted}
        keyExtractor={(item: any) => item.id}
        renderItem={({ item }: any) => <Text>• {item.title}</Text>}
      />

      <Text style={styles.section}>Favors You Accepted:</Text>
      <FlatList
        data={accepted}
        keyExtractor={(item: any) => item.id}
        renderItem={({ item }: any) => <Text>• {item.title}</Text>}
      />

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 5 },
  badge: { fontSize: 16, color: '#2563EB', marginBottom: 20 },
  section: { fontSize: 18, fontWeight: '600', marginTop: 20, marginBottom: 6 },
  logoutButton: {
    marginTop: 30,
    backgroundColor: '#EF4444',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: { color: '#fff', fontWeight: 'bold' },
});
