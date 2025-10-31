import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Image, Dimensions, Modal, TextInput, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const StudySpotsScreen = ({ navigation }) => {
  const [studySpots, setStudySpots] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSpots, setFilteredSpots] = useState([]);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [loading, setLoading] = useState(true);

  // Get all unique amenities from study spots
  const allAmenities = [...new Set(studySpots.flatMap(spot => spot.amenities))];

  useEffect(() => {
    loadStudySpots();
    loadFavorites();
  }, []);

  useEffect(() => {
    filterStudySpots();
  }, [studySpots, searchQuery, selectedAmenities, minRating]);

  const loadFavorites = async () => {
    try {
      const favs = await AsyncStorage.getItem('favoriteSpots');
      if (favs) setFavorites(JSON.parse(favs));
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const toggleFavorite = async (spotId) => {
    try {
      let newFavorites;
      if (favorites.includes(spotId)) {
        newFavorites = favorites.filter(id => id !== spotId);
      } else {
        newFavorites = [...favorites, spotId];
      }
      setFavorites(newFavorites);
      await AsyncStorage.setItem('favoriteSpots', JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Error updating favorites:', error);
    }
  };

  const loadStudySpots = async () => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockData = [
        { 
          id: 1, 
          name: 'Main Library', 
          description: 'Quiet floors, lots of resources', 
          rating: 4.5, 
          reviews: 128, 
          image: 'https://picsum.photos/seed/library/300/200.jpg', 
          amenities: ['WiFi', 'Power Outlets', 'Quiet Zones', 'Group Study Rooms'],
          hours: '7:00 AM - 12:00 AM',
          distance: '0.3 miles',
          crowdedness: 'Medium'
        },
        { 
          id: 2, 
          name: 'Science Building Lounge', 
          description: '24/7 access, comfortable seating', 
          rating: 4.2, 
          reviews: 87, 
          image: 'https://picsum.photos/seed/science/300/200.jpg', 
          amenities: ['WiFi', 'Power Outlets', 'Whiteboards'],
          hours: '24/7',
          distance: '0.5 miles',
          crowdedness: 'Low'
        },
        { 
          id: 3, 
          name: 'Student Union Study Area', 
          description: 'Collaborative environment', 
          rating: 4.0, 
          reviews: 65, 
          image: 'https://picsum.photos/seed/union/300/200.jpg', 
          amenities: ['WiFi', 'Power Outlets', 'Vending Machines'],
          hours: '8:00 AM - 10:00 PM',
          distance: '0.2 miles',
          crowdedness: 'High'
        },
        { 
          id: 4, 
          name: 'Engineering Building Lab', 
          description: 'Computers with specialized software', 
          rating: 4.7, 
          reviews: 94, 
          image: 'https://picsum.photos/seed/engineering/300/200.jpg', 
          amenities: ['Computers', 'Specialized Software', 'Printing'],
          hours: '7:30 AM - 9:00 PM',
          distance: '0.7 miles',
          crowdedness: 'Medium'
        },
      ];
      
      setStudySpots(mockData);
    } catch (error) {
      console.error('Error loading study spots:', error);
      Alert.alert('Error', 'Failed to load study spots. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filterStudySpots = () => {
    let result = studySpots;
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(spot => 
        spot.name.toLowerCase().includes(query) || 
        spot.description.toLowerCase().includes(query)
      );
    }
    
    // Filter by amenities
    if (selectedAmenities.length > 0) {
      result = result.filter(spot => 
        selectedAmenities.every(amenity => spot.amenities.includes(amenity))
      );
    }
    
    // Filter by rating
    if (minRating > 0) {
      result = result.filter(spot => spot.rating >= minRating);
    }
    
    setFilteredSpots(result);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStudySpots();
    setRefreshing(false);
  };

  const toggleAmenityFilter = (amenity) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const resetFilters = () => {
    setSelectedAmenities([]);
    setMinRating(0);
    setSearchQuery('');
  };

  const renderStudySpot = ({ item }) => (
    <TouchableOpacity 
      style={styles.spotCard}
      onPress={() => navigation.navigate('SpotDetails', { spot: item, spotType: 'Study Spot' })}
    >
      <Image source={{ uri: item.image }} style={styles.spotImage} />
      <View style={styles.spotContent}>
        <View style={styles.spotHeader}>
          <Text style={styles.spotName}>{item.name}</Text>
          <TouchableOpacity onPress={() => toggleFavorite(item.id)} style={styles.favoriteButton}>
            <Ionicons 
              name={favorites.includes(item.id) ? "heart" : "heart-outline"} 
              size={24} 
              color={favorites.includes(item.id) ? "#ef4444" : "#94a3b8"} 
            />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.spotDescription}>{item.description}</Text>
        
        <View style={styles.spotDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="star" size={16} color="#fbbf24" />
            <Text style={styles.rating}>{item.rating}</Text>
            <Text style={styles.reviewCount}>({item.reviews})</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Ionicons name="location" size={16} color="#6366f1" />
            <Text style={styles.detailText}>{item.distance}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Ionicons name="time" size={16} color="#6366f1" />
            <Text style={styles.detailText}>{item.hours}</Text>
          </View>
        </View>
        
        <View style={styles.amenitiesContainer}>
          {item.amenities.slice(0, 3).map((amenity, index) => (
            <View key={index} style={styles.amenityTag}>
              <Text style={styles.amenityText}>{amenity}</Text>
            </View>
          ))}
          {item.amenities.length > 3 && (
            <View style={styles.amenityTag}>
              <Text style={styles.amenityText}>+{item.amenities.length - 3}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.crowdednessContainer}>
          <Text style={styles.crowdednessLabel}>Crowdedness:</Text>
          <View style={styles.crowdednessBar}>
            <View 
              style={[
                styles.crowdednessLevel, 
                item.crowdedness === 'Low' ? styles.lowCrowdedness : 
                item.crowdedness === 'Medium' ? styles.mediumCrowdedness : 
                styles.highCrowdedness
              ]} 
            />
          </View>
          <Text style={styles.crowdednessText}>{item.crowdedness}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="search" size={60} color="#cbd5e1" />
      <Text style={styles.emptyTitle}>No study spots found</Text>
      <Text style={styles.emptyDescription}>
        Try adjusting your search or filters to find what you're looking for.
      </Text>
      <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
        <Text style={styles.resetButtonText}>Reset Filters</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#94a3b8" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search study spots..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#94a3b8" />
            </TouchableOpacity>
          ) : null}
        </View>
        
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setFilterModalVisible(true)}
        >
          <Ionicons name="options" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={styles.loadingText}>Loading study spots...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredSpots}
          renderItem={renderStudySpot}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
        />
      )}
      
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => navigation.navigate('AddSpot', { spotType: 'Study Spot' })}
      >
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>
      
      {/* Filter Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={filterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Study Spots</Text>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                <Ionicons name="close" size={24} color="#1e293b" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              <Text style={styles.filterSectionTitle}>Minimum Rating</Text>
              <View style={styles.ratingFilterContainer}>
                {[0, 3, 4, 4.5].map(rating => (
                  <TouchableOpacity
                    key={rating}
                    style={[
                      styles.ratingFilterButton,
                      minRating === rating && styles.selectedRatingFilter
                    ]}
                    onPress={() => setMinRating(rating)}
                  >
                    <Text style={[
                      styles.ratingFilterText,
                      minRating === rating && styles.selectedRatingFilterText
                    ]}>
                      {rating === 0 ? 'Any' : `${rating}+`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <Text style={styles.filterSectionTitle}>Amenities</Text>
              <View style={styles.amenitiesFilterContainer}>
                {allAmenities.map(amenity => (
                  <TouchableOpacity
                    key={amenity}
                    style={[
                      styles.amenityFilterButton,
                      selectedAmenities.includes(amenity) && styles.selectedAmenityFilter
                    ]}
                    onPress={() => toggleAmenityFilter(amenity)}
                  >
                    <Text style={[
                      styles.amenityFilterText,
                      selectedAmenities.includes(amenity) && styles.selectedAmenityFilterText
                    ]}>
                      {amenity}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.resetFiltersButton} 
                onPress={resetFilters}
              >
                <Text style={styles.resetFiltersText}>Reset All</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.applyFiltersButton} 
                onPress={() => setFilterModalVisible(false)}
              >
                <Text style={styles.applyFiltersText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fb',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 44,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  list: {
    padding: 20,
  },
  spotCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  spotImage: {
    width: '100%',
    height: 180,
  },
  spotContent: {
    padding: 15,
  },
  spotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  spotName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    flex: 1,
  },
  favoriteButton: {
    padding: 5,
  },
  spotDescription: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 12,
  },
  spotDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    marginBottom: 5,
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
    marginLeft: 2,
  },
  detailText: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 5,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  amenityTag: {
    backgroundColor: '#f1f5f9',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 8,
    marginBottom: 8,
  },
  amenityText: {
    fontSize: 12,
    color: '#64748b',
  },
  crowdednessContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  crowdednessLabel: {
    fontSize: 14,
    color: '#64748b',
    marginRight: 10,
  },
  crowdednessBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#e2e8f0',
    borderRadius: 3,
  },
  crowdednessLevel: {
    height: '100%',
    borderRadius: 3,
  },
  lowCrowdedness: {
    width: '30%',
    backgroundColor: '#10b981',
  },
  mediumCrowdedness: {
    width: '60%',
    backgroundColor: '#f59e0b',
  },
  highCrowdedness: {
    width: '90%',
    backgroundColor: '#ef4444',
  },
  crowdednessText: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 10,
    width: 50,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#64748b',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginTop: 20,
  },
  emptyDescription: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 40,
  },
  resetButton: {
    marginTop: 20,
    backgroundColor: '#6366f1',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  modalBody: {
    padding: 20,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 15,
  },
  ratingFilterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  ratingFilterButton: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    marginBottom: 10,
  },
  selectedRatingFilter: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  ratingFilterText: {
    fontSize: 14,
    color: '#64748b',
  },
  selectedRatingFilterText: {
    color: '#fff',
  },
  amenitiesFilterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  amenityFilterButton: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    marginBottom: 10,
  },
  selectedAmenityFilter: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  amenityFilterText: {
    fontSize: 14,
    color: '#64748b',
  },
  selectedAmenityFilterText: {
    color: '#fff',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  resetFiltersButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingVertical: 12,
    marginRight: 10,
    alignItems: 'center',
  },
  resetFiltersText: {
    fontSize: 16,
    color: '#64748b',
  },
  applyFiltersButton: {
    flex: 1,
    backgroundColor: '#6366f1',
    borderRadius: 8,
    paddingVertical: 12,
    marginLeft: 10,
    alignItems: 'center',
  },
  applyFiltersText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default StudySpotsScreen;
