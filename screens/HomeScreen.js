import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = ({ navigation }) => {
  const [userName, setUserName] = useState('');
  const [recentSpots, setRecentSpots] = useState([]);
  const [recentConfessions, setRecentConfessions] = useState([]);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const name = await AsyncStorage.getItem('userName');
        if (name) setUserName(name);
        
        setRecentSpots([
          { id: 1, name: 'Library Study Room', type: 'study', rating: 4.5 },
          { id: 2, name: 'Campus Cafe', type: 'eating', rating: 4.2 },
        ]);
        
        setRecentConfessions([
          { id: 1, text: 'I secretly love studying in the basement of the science building.', likes: 24 },
          { id: 2, text: 'I think the campus coffee is overrated but I still buy it every day.', likes: 18 },
        ]);
      } catch (error) {
        console.error('Error getting user data:', error);
      }
    };

    getUserData();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {userName || 'Student'}!</Text>
        <Text style={styles.subGreeting}>Welcome to Campus Connect</Text>
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity 
          style={styles.actionCard}
          onPress={() => navigation.navigate('Study Spots')}
        >
          <View style={styles.actionIcon}>
            <Ionicons name="book" size={30} color="#6366f1" />
          </View>
          <Text style={styles.actionTitle}>Study Spots</Text>
          <Text style={styles.actionSubtitle}>Find the perfect place to study</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionCard}
          onPress={() => navigation.navigate('Eating Spots')}
        >
          <View style={styles.actionIcon}>
            <Ionicons name="restaurant" size={30} color="#6366f1" />
          </View>
          <Text style={styles.actionTitle}>Eating Spots</Text>
          <Text style={styles.actionSubtitle}>Discover great food on campus</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionCard}
          onPress={() => navigation.navigate('Confessions')}
        >
          <View style={styles.actionIcon}>
            <Ionicons name="chatbubbles" size={30} color="#6366f1" />
          </View>
          <Text style={styles.actionTitle}>Confessions</Text>
          <Text style={styles.actionSubtitle}>Share anonymously</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Spots</Text>
        {recentSpots.map(spot => (
          <TouchableOpacity 
            key={spot.id} 
            style={styles.spotCard}
            onPress={() => navigation.navigate(spot.type === 'study' ? 'Study Spots' : 'Eating Spots')}
          >
            <View style={styles.spotInfo}>
              <Text style={styles.spotName}>{spot.name}</Text>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="#fbbf24" />
                <Text style={styles.rating}>{spot.rating}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Confessions</Text>
        {recentConfessions.map(confession => (
          <View key={confession.id} style={styles.confessionCard}>
            <Text style={styles.confessionText}>{confession.text}</Text>
            <View style={styles.confessionFooter}>
              <View style={styles.confessionLikes}>
                <Ionicons name="heart" size={16} color="#ef4444" />
                <Text style={styles.likesCount}>{confession.likes}</Text>
              </View>
              <Text style={styles.confessionTime}>2 hours ago</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fb',
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  subGreeting: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 5,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  actionCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#eef2ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 5,
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 15,
  },
  spotCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  spotInfo: {
    flex: 1,
  },
  spotName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 5,
  },
  confessionCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  confessionText: {
    fontSize: 16,
    color: '#1e293b',
    marginBottom: 10,
  },
  confessionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  confessionLikes: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likesCount: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 5,
  },
  confessionTime: {
    fontSize: 14,
    color: '#94a3b8',
  },
});

export default HomeScreen;