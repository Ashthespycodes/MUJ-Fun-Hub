import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SpotDetailsScreen = ({ route, navigation }) => {
  const { spot, spotType } = route.params;
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviews, setReviews] = useState([
    { id: 1, user: 'Anonymous', rating: 5, text: 'Great place! Very quiet and has good lighting.', date: '2 days ago' },
    { id: 2, user: 'Anonymous', rating: 4, text: 'Nice spot but can get crowded during finals week.', date: '1 week ago' },
  ]);

  const renderStars = (rating, interactive = false) => {
    return (
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={interactive ? () => setUserRating(star) : null}
            disabled={!interactive}
          >
            <Ionicons
              name={star <= rating ? 'star' : 'star-outline'}
              size={interactive ? 30 : 16}
              color={star <= rating ? '#fbbf24' : '#d1d5db'}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const handleSubmitReview = () => {
    if (userRating === 0 || !reviewText.trim()) {
      Alert.alert('Error', 'Please provide a rating and review');
      return;
    }

    const newReview = {
      id: Date.now(),
      user: 'Anonymous',
      rating: userRating,
      text: reviewText,
      date: 'Just now'
    };

    setReviews([newReview, ...reviews]);
    setUserRating(0);
    setReviewText('');
    Alert.alert('Success', 'Your review has been submitted');
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: spot.image }} style={styles.spotImage} />
      
      <View style={styles.spotInfo}>
        <Text style={styles.spotName}>{spot.name}</Text>
        <Text style={styles.spotDescription}>{spot.description}</Text>
        
        <View style={styles.spotDetails}>
          <View style={styles.ratingSection}>
            <Text style={styles.ratingLabel}>Rating</Text>
            <View style={styles.ratingRow}>
              {renderStars(spot.rating)}
              <Text style={styles.ratingValue}>{spot.rating}</Text>
            </View>
            <Text style={styles.reviewCount}>({spot.reviews} reviews)</Text>
          </View>
          
          {spotType === 'Study Spot' && (
            <View style={styles.amenitiesSection}>
              <Text style={styles.sectionTitle}>Amenities</Text>
              <View style={styles.amenitiesList}>
                {spot.amenities.map((amenity, index) => (
                  <View key={index} style={styles.amenityTag}>
                    <Text style={styles.amenityText}>{amenity}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
          
          {spotType === 'Eating Spot' && (
            <View style={styles.eatingDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Cuisine</Text>
                <Text style={styles.detailValue}>{spot.cuisine}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Price Range</Text>
                <Text style={styles.detailValue}>{spot.priceRange}</Text>
              </View>
            </View>
          )}
        </View>
        
        <View style={styles.reviewSection}>
          <Text style={styles.sectionTitle}>Reviews</Text>
          
          <View style={styles.addReviewContainer}>
            <Text style={styles.addReviewTitle}>Add Your Review</Text>
            {renderStars(userRating, true)}
            <TextInput
              style={styles.reviewInput}
              placeholder="Share your experience..."
              value={reviewText}
              onChangeText={setReviewText}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmitReview}>
              <Text style={styles.submitButtonText}>Submit Review</Text>
            </TouchableOpacity>
          </View>
          
          {reviews.map(review => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewUser}>{review.user}</Text>
                <View style={styles.reviewRating}>
                  {renderStars(review.rating)}
                </View>
              </View>
              <Text style={styles.reviewText}>{review.text}</Text>
              <Text style={styles.reviewDate}>{review.date}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fb',
  },
  spotImage: {
    width: '100%',
    height: 200,
  },
  spotInfo: {
    padding: 20,
  },
  spotName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 10,
  },
  spotDescription: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 20,
  },
  spotDetails: {
    marginBottom: 20,
  },
  ratingSection: {
    marginBottom: 20,
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
    marginBottom: 5,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  ratingValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginLeft: 10,
  },
  reviewCount: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 5,
  },
  amenitiesSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 10,
  },
  amenitiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  amenityTag: {
    backgroundColor: '#eef2ff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 10,
    marginBottom: 10,
  },
  amenityText: {
    fontSize: 14,
    color: '#6366f1',
  },
  eatingDetails: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 16,
    color: '#64748b',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
  },
  reviewSection: {
    marginTop: 20,
  },
  addReviewContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addReviewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 10,
  },
  reviewInput: {
    height: 80,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    marginVertical: 10,
  },
  submitButton: {
    backgroundColor: '#6366f1',
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  reviewCard: {
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
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  reviewUser: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  reviewRating: {
    flexDirection: 'row',
  },
  reviewText: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 10,
  },
  reviewDate: {
    fontSize: 12,
    color: '#94a3b8',
  },
});

export default SpotDetailsScreen;