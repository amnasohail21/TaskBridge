import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { auth, db } from '../firebaseConfig';

export default function ProfileScreen() {
  const [postedFavors, setPostedFavors] = useState<any[]>([]);
  const [acceptedFavors, setAcceptedFavors] = useState<any[]>([]);
  const [trustLevel, setTrustLevel] = useState('');
  const router = useRouter();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const fetchFavors = async () => {
      try {
        const postedQuery = query(
          collection(db, 'favors'),
          where('postedBy', '==', user.email)
        );
        const postedSnap = await getDocs(postedQuery);
        const postedList = postedSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPostedFavors(postedList);

        const acceptedQuery = query(
          collection(db, 'favors'),
          where('acceptedBy', '==', user.email)
        );
        const acceptedSnap = await getDocs(acceptedQuery);
        const acceptedList = acceptedSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAcceptedFavors(acceptedList);

        // Trust Badge Logic
        const total = postedList.length + acceptedList.length;
        if (total >= 10) setTrustLevel('Gold');
        else if (total >= 5) setTrustLevel('Silver');
        else if (total >= 1) setTrustLevel('Bronze');
        else setTrustLevel('New');
      } catch (e) {
        console.error("Error loading profile data:", e);
      }
    };

    fetchFavors();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/login');
    } catch (error) {
      Alert.alert('Logout Error', 'Could not log out. Try again.');
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Not logged in</Text>
      </View>
    );
  }

  const renderFavorItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardDescription}>{item.description}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Profile</Text>
      <Text style={styles.email}>Email: {user.email}</Text>
      <Text style={styles.trust}>Trust Badge: {trustLevel}</Text>

      <Text style={styles.section}>Posted Favors</Text>
      <FlatList
        data={postedFavors}
        keyExtractor={item => item.id}
        renderItem={renderFavorItem}
      />

      <Text style={styles.section}>Accepted Favors</Text>
      <FlatList
        data={acceptedFavors}
        keyExtractor={item => item.id}
        renderItem={renderFavorItem}
      />

      <View style={{ marginTop: 30 }}>
        <Button title="Logout" onPress={handleLogout} color="#EF4444" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  email: { fontSize: 16, marginBottom: 4 },
  trust: { fontSize: 16, marginBottom: 16, fontStyle: 'italic', color: '#10B981' },
  section: { fontSize: 18, fontWeight: '600', marginTop: 20, marginBottom: 8 },
  card: {
    backgroundColor: '#F3F4F6',
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#111827',
  },
  cardDescription: {
    marginTop: 4,
    color: '#4B5563',
    fontSize: 14,
  },
});
