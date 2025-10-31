import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const StudySpotsScreen = ({ navigation }) => {
  const [studySpots, setStudySpots] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadStudySpots();
  }, []);

  const loadStudySpots = async () => {
    try {
      const mockData = [
        { id: 1, name: 'Main Library', description: 'Quiet floors, lots of resources', rating: 4.5, reviews: 128, image: 'https://picsum.photos/seed/library/300/200.jpg', amenities: ['WiFi', 'Power Outlets', 'Quiet Zones', 'Group Study Rooms'] },
        { id: 2, name: 'Science Building Lounge', description: '24/7 access, comfortable seating', rating: 4.2, reviews: 87, image: 'https://picsum.photos/seed/science/300/200.jpg', amenities: ['WiFi', 'Power Outlets', 'Whiteboards'] },
        { id: 3, name: 'Student Union Study Area', description: 'Collaborative environment', rating: 4.0, reviews: 65, image: 'https://picsum.photos/seed/union/300/200.jpg', amenities: ['WiFi', 'Power Outlets', 'Vending Machines'] },
        { id: 4, name: 'Engineering Building Lab', description: 'Computers with specialized software', rating: 4.7, reviews: 94, image: 'https://picsum.photos/seed/engineering/300/200.jpg', amenities: ['Computers', 'Specialized Software', 'Printing'] },
      ];
      
      setStudySpots(mockData);
    } catch (error) {
      console.error('Error loading study spots:', error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadStudySpots();
    setRefreshing(false);
  };

  const renderStudySpot = ({ item }) => (
    <TouchableOpacity 
      style={styles.spotCard}
      onPress={() => navigation.navigate('SpotDetails', { spot: item, spotType: 'Study Spot' })}
    >
      <View style={styles.spotInfo}>
        <Text style={styles.spotName}>{item.name}</Text>
        <Text style={styles.spotDescription}>{item.description}</Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color="#fbbf24" />
          <Text style={styles.rating}>{item.rating}</Text>
          <Text style={styles.reviewCount}>({item.reviews} reviews)</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={studySpots}
        renderItem={renderStudySpot}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => navigation.navigate('AddSpot', { spotType: 'Study Spot' })}
      >
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fb',
  },
  list: {
    padding: 20,
  },
  spotCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  spotInfo: {
    flex: 1,
  },
  spotName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 5,
  },
  spotDescription: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
    marginLeft: 5,
  },
  reviewCount: {
    fontSize: 14,
    color: '#94a3b8',
    marginLeft: 5,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default StudySpotsScreen;