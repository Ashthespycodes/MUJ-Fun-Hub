import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const ConfessionsScreen = () => {
  const [confessions, setConfessions] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newConfession, setNewConfession] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadConfessions();
  }, []);

  const loadConfessions = async () => {
    try {
      const mockData = [
        { id: 1, text: 'I secretly love studying in the basement of the science building. It\'s so quiet and no one ever goes there.', likes: 24, comments: 5, time: '2 hours ago' },
        { id: 2, text: 'I think the campus coffee is overrated but I still buy it every day because I don\'t want to make my own.', likes: 18, comments: 3, time: '5 hours ago' },
        { id: 3, text: 'I\'ve been pretending to understand what my professor is talking about for the entire semester.', likes: 42, comments: 12, time: '1 day ago' },
        { id: 4, text: 'I take the long way to class just to avoid running into my ex.', likes: 31, comments: 8, time: '2 days ago' },
        { id: 5, text: 'I\'ve never actually read any of the assigned readings. I just skim the summaries online.', likes: 67, comments: 15, time: '3 days ago' },
      ];
      
      setConfessions(mockData);
    } catch (error) {
      console.error('Error loading confessions:', error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadConfessions();
    setRefreshing(false);
  };

  const handleAddConfession = () => {
    if (!newConfession.trim()) {
      Alert.alert('Error', 'Please enter a confession');
      return;
    }

    const newConfessionObj = {
      id: Date.now(),
      text: newConfession,
      likes: 0,
      comments: 0,
      time: 'Just now'
    };

    setConfessions([newConfessionObj, ...confessions]);
    setNewConfession('');
    setModalVisible(false);
  };

  const handleLikeConfession = (id) => {
    setConfessions(confessions.map(confession => 
      confession.id === id 
        ? { ...confession, likes: confession.likes + 1 }
        : confession
    ));
  };

  const renderConfession = ({ item }) => (
    <View style={styles.confessionCard}>
      <Text style={styles.confessionText}>{item.text}</Text>
      <View style={styles.confessionFooter}>
        <TouchableOpacity 
          style={styles.confessionAction}
          onPress={() => handleLikeConfession(item.id)}
        >
          <Ionicons name="heart" size={18} color="#ef4444" />
          <Text style={styles.actionCount}>{item.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.confessionAction}>
          <Ionicons name="chatbubble-outline" size={18} color="#6366f1" />
          <Text style={styles.actionCount}>{item.comments}</Text>
        </TouchableOpacity>
        <Text style={styles.confessionTime}>{item.time}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={confessions}
        renderItem={renderConfession}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Share Your Confession</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.confessionInput}
              placeholder="What's your campus confession?"
              placeholderTextColor="#94a3b8"
              multiline
              numberOfLines={5}
              value={newConfession}
              onChangeText={setNewConfession}
              textAlignVertical="top"
            />
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.postButton}
                onPress={handleAddConfession}
              >
                <Text style={styles.postButtonText}>Post Anonymously</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
  confessionCard: {
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
  confessionText: {
    fontSize: 16,
    color: '#1e293b',
    marginBottom: 15,
  },
  confessionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  confessionAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionCount: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 5,
  },
  confessionTime: {
    fontSize: 14,
    color: '#94a3b8',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  confessionInput: {
    height: 150,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 15,
    fontSize: 16,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#64748b',
  },
  postButton: {
    flex: 1,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  postButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ConfessionsScreen;