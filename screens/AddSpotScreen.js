import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AddSpotScreen = ({ route, navigation }) => {
  const { spotType } = route.params;
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState(0);
  const [amenities, setAmenities] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [priceRange, setPriceRange] = useState('');

  const handleSubmit = () => {
    if (!name || !description) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (spotType === 'Study Spot' && !amenities) {
      Alert.alert('Error', 'Please enter amenities');
      return;
    }

    if (spotType === 'Eating Spot' && (!cuisine || !priceRange)) {
      Alert.alert('Error', 'Please enter cuisine and price range');
      return;
    }

    Alert.alert(
      'Success',
      `${spotType} added successfully!`,
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  const renderStars = () => {
    return (
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => setRating(star)}
          >
            <Ionicons
              name={star <= rating ? 'star' : 'star-outline'}
              size={30}
              color={star <= rating ? '#fbbf24' : '#d1d5db'}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Add {spotType}</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name *</Text>
          <TextInput
            style={styles.input}
            placeholder={`Enter ${spotType.toLowerCase()} name`}
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder={`Describe this ${spotType.toLowerCase()}`}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Rating</Text>
          {renderStars()}
        </View>

        {spotType === 'Study Spot' && (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Amenities *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., WiFi, Power Outlets, Quiet Zone"
              value={amenities}
              onChangeText={setAmenities}
            />
          </View>
        )}

        {spotType === 'Eating Spot' && (
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Cuisine Type *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Italian, Asian, Fast Food"
                value={cuisine}
                onChangeText={setCuisine}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Price Range *</Text>
              <View style={styles.priceOptions}>
                {['$', '$$', '$$$', '$$$$'].map((price) => (
                  <TouchableOpacity
                    key={price}
                    style={[
                      styles.priceOption,
                      priceRange === price && styles.selectedPriceOption
                    ]}
                    onPress={() => setPriceRange(price)}
                  >
                    <Text style={[
                      styles.priceOptionText,
                      priceRange === price && styles.selectedPriceOptionText
                    ]}>{price}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        )}

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Add {spotType}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fb',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
    marginBottom: 8,
  },
  input: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  textArea: {
    height: 100,
    paddingTop: 15,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
  },
  priceOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priceOption: {
    width: 60,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedPriceOption: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  priceOptionText: {
    fontSize: 16,
    color: '#1e293b',
  },
  selectedPriceOptionText: {
    color: '#fff',
  },
  submitButton: {
    backgroundColor: '#6366f1',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddSpotScreen;