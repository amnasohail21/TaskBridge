import { addDoc, collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../firebaseConfig'; // Make sure you’ve exported `db` from firebaseConfig


export default function FavorFeedScreen() {
  const [favors, setFavors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavors = async () => {
      try {
        const favorSnapshot = await getDocs(collection(db, 'favors'));
        const favorList = favorSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFavors(favorList);
      } catch (error) {
        console.error("Error fetching favors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavors();
  }, []);
  
  const handlePostFavor = async () => {
    try {
      const docRef = await addDoc(collection(db, 'favors'), {
        title: 'Car broke down',
        description: 'My car stopped working on Main Street. Need urgent help!',
        location: {
          lat: 43.6532,
          lng: -79.3832, // Example: Toronto coords; use real coords or user input
        },
        createdAt: new Date(),
        status: 'open',
        postedBy: 'amna786@gmail.com', // Ideally the current user’s ID/email
      });
  
      console.log('Favor posted with ID:', docRef.id);
      Alert.alert('Success', 'Favor posted!');
    } catch (error) {
      console.error('Error posting favor:', error);
      Alert.alert('Error', 'Failed to post favor');
    }
  };
  

  const renderFavor = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.details}>{item.description}</Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>I'll do it</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 100 }} />;

  return (
    <View style={styles.container}>
      <FlatList
        data={favors}
        keyExtractor={item => item.id}
        renderItem={renderFavor}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  card: {
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
  },
  title: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  details: { fontSize: 14, color: '#4B5563', marginTop: 4 },
  button: {
    marginTop: 12,
    backgroundColor: '#2563EB',
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: '600' },
});
