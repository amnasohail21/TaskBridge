import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Animated,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { auth, db } from '../firebaseConfig';

export default function ProfileScreen() {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [postedFavors, setPostedFavors] = useState<any[]>([]);
  const [acceptedFavors, setAcceptedFavors] = useState<any[]>([]);
  const [trustLevel, setTrustLevel] = useState('');
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) {
      setPostedFavors([]);
      setAcceptedFavors([]);
      setTrustLevel('');
      return;
    }

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
      <LinearGradient colors={['#E0EAFC', '#CFDEF3']} style={styles.gradient}>
        <SafeAreaView style={[styles.containerCentered]}>
          <Text style={styles.header}>Not logged in</Text>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  // Extract initials from email
  const initials = user.email
    ? user.email
        .split('@')[0]
        .split('.')
        .map(name => name[0].toUpperCase())
        .join('')
    : 'U';

  const renderFavorItem = ({ item }: { item: any }) => {
    const scale = new Animated.Value(1);
    return (
      <Pressable
        onPressIn={() => Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start()}
        onPressOut={() => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start()}
        style={{ transform: [{ scale }], marginBottom: 12 }}
      >
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardDescription}>{item.description}</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <LinearGradient colors={['#E0EAFC', '#CFDEF3']} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={{ marginLeft: 16 }}>
            <Text style={styles.header}>Profile</Text>
            <Text style={styles.email}>{user.email}</Text>
            <View style={styles.trustBadge}>
              <Text style={styles.trustText}>Trust Badge:</Text>
              <View
                style={[
                  styles.badge,
                  trustLevelStyles[(trustLevel || 'new').toLowerCase() as keyof typeof trustLevelStyles],
                ]}
              >
                <Text style={styles.badgeText}>{trustLevel}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.section}>Posted Favors</Text>
        </View>
        <FlatList
          data={postedFavors}
          keyExtractor={item => item.id}
          renderItem={renderFavorItem}
          ListEmptyComponent={<Text style={styles.emptyText}>No posted favors yet.</Text>}
          style={{ marginBottom: 20 }}
        />

        <View style={styles.sectionHeader}>
          <Text style={styles.section}>Accepted Favors</Text>
        </View>
        <FlatList
          data={acceptedFavors}
          keyExtractor={item => item.id}
          renderItem={renderFavorItem}
          ListEmptyComponent={<Text style={styles.emptyText}>No accepted favors yet.</Text>}
          style={{ marginBottom: 30 }}
        />

        <Pressable
          style={({ pressed }) => [
            styles.logoutButton,
            pressed && styles.logoutButtonPressed,
          ]}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </Pressable>
      </SafeAreaView>
    </LinearGradient>
  );
}

const trustLevelStyles = StyleSheet.create({
  gold: {
    backgroundColor: '#FFD700',
  },
  silver: {
    backgroundColor: '#C0C0C0',
  },
  bronze: {
    backgroundColor: '#CD7F32',
  },
  new: {
    backgroundColor: '#9CA3AF',
  },
});

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: {
    flex: 1,
    padding: 20,
  },
  containerCentered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    backgroundColor: '#2563EB',
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 8,
  },
  avatarText: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  email: {
    fontSize: 16,
    color: '#374151',
    marginTop: 6,
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  trustText: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
    color: '#374151',
  },
  badge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    color: '#fff',
    fontWeight: '700',
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  section: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 8,
    color: '#111827',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  cardTitle: {
    fontWeight: '700',
    fontSize: 16,
    color: '#111827',
  },
  cardDescription: {
    marginTop: 6,
    color: '#6B7280',
    fontSize: 14,
  },
  emptyText: {
    fontStyle: 'italic',
    color: '#9CA3AF',
    marginBottom: 10,
    paddingLeft: 8,
  },

  logoutButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 7,
  },
  logoutButtonPressed: {
    backgroundColor: '#B91C1C',
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
});
