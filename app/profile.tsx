import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, Button, FlatList, StyleSheet, Text, View } from 'react-native';
import { auth, db } from '../firebaseConfig';

export default function ProfileScreen() {
  const [postedFavors, setPostedFavors] = useState<any[]>([]);
  const [acceptedFavors, setAcceptedFavors] = useState<any[]>([]);
  const user = auth.currentUser;
  const router = useRouter();

  useEffect(() => {
    if (!user) return;

    const fetchFavors = async () => {
      try {
        // Favors posted by user
        const postedQuery = query(
          collection(db, 'favors'),
          where('postedBy', '==', user.email)
        );
        const postedSnap = await getDocs(postedQuery);
        const postedList = postedSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPostedFavors(postedList);

        // Favors accepted by user
        const acceptedQuery = query(
          collection(db, 'favors'),
          where('acceptedBy', '==', user.email)
        );
        const acceptedSnap = await getDocs(acceptedQuery);
        const acceptedList = acceptedSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAcceptedFavors(acceptedList);
      } catch (e) {
        console.error("Error loading profile data:", e);
      }
    };

    fetchFavors();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/login'); // Redirect to login
    } catch (error) {
      Alert.alert('Logout Error', 'Could not log out. Try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Profile</Text>
      <Text style={styles.email}>Email: {user?.email}</Text>

      <Text style={styles.section}>Posted Favors</Text>
      <FlatList
        data={postedFavors}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <Text>• {item.title}</Text>}
      />

      <Text style={styles.section}>Accepted Favors</Text>
      <FlatList
        data={acceptedFavors}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <Text>• {item.title}</Text>}
      />

      <Button title="Logout" onPress={handleLogout} color="#EF4444" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  email: { marginBottom: 20 },
  section: { fontSize: 18, fontWeight: '600', marginTop: 16, marginBottom: 8 },
});
