import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const EatingSpotsScreen = ({ navigation }) => {
  const [eatingSpots, setEatingSpots] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadEatingSpots();
  }, []);

  const loadEatingSpots = async () => {
    try {
      const mockData = [
        { id: 1, name: 'Campus Cafe', description: 'Great coffee and pastries', rating: 4.5, reviews: 156, image: 'https://picsum.photos/seed/cafe/300/200.jpg', cuisine: 'Coffee & Snacks', priceRange: '$' },
        { id: 2, name: 'Student Union Food Court', description: 'Variety of options', rating: 4.0, reviews: 203, image: 'https://picsum.photos/seed/foodcourt/300/200.jpg', cuisine: 'Various', priceRange: '$$' },
        { id: 3, name: 'Pizza Place', description: 'Best pizza on campus', rating: 4.7, reviews: 142, image: 'https://picsum.photos/seed/pizza/300/200.jpg', cuisine: 'Italian', priceRange: '$$' },
        { id: 4, name: 'Healthy Bites', description: 'Fresh salads and sandwiches', rating: 4.3, reviews: 98, image: 'https://picsum.photos/seed/healthy/300/200.jpg', cuisine: 'Healthy', priceRange: '$$' },
      ];
      
      setEatingSpots(mockData);
    } catch (error) {
      console.error('Error loading eating spots:', error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadEatingSpots();
    setRefreshing(false);
  };

  const renderEatingSpot = ({ item }) => (
    <TouchableOpacity 
      style={styles.spotCard}
      onPress={() => navigation.navigate('SpotDetails', { spot: item, spotType: 'Eating Spot' })}
    >
      <View style={styles.spotInfo}>
        <Text style={styles.spotName}>{item.name}</Text>
        <Text style={styles.spotDescription}>{item.description}</Text>
        <View style={styles.spotDetails}>
          <Text style={styles.cuisine}>{item.cuisine}</Text>
          <Text style={styles.priceRange}>{item.priceRange}</Text>
        </View>
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
        data={eatingSpots}
        renderItem={renderEatingSpot}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => navigation.navigate('AddSpot', { spotType: 'Eating Spot' })}
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
  spotDetails: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  cuisine: {
    fontSize: 14,
    color: '#6366f1',
    marginRight: 10,
  },
  priceRange: {
    fontSize: 14,
    color: '#10b981',
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

export default EatingSpotsScreen;