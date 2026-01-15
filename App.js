// App.js - Medical Class Schedule Notifier
// React Native Android App

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  StatusBar,
} from 'react-native';
import PushNotification from 'react-native-push-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const [rollNumber, setRollNumber] = useState('');
  const [batch, setBatch] = useState('');
  const [anatomyBatch, setAnatomyBatch] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [currentDay, setCurrentDay] = useState('');
  const [upcomingClasses, setUpcomingClasses] = useState([]);

  const batchRanges = {
    'A': { start: 1, end: 65 },
    'B': { start: 66, end: 130 },
    'C': { start: 131, end: 195 },
    'D': { start: 196, end: 255 }
  };

  const anatomyBatchRanges = {
    'A': { start: 1, end: 52 },
    'B': { start: 53, end: 104 },
    'C': { start: 105, end: 156 },
    'D': { start: 157, end: 208 },
    'E': { start: 209, end: 255 }
  };

  const schedule = {
    Saturday: [
      {
        time: '08:00',
        duration: 60,
        classes: [
          { batch: 'ALL', subject: 'Biochemistry Tutorial', venue: 'All Batches', type: 'Tutorial' }
        ]
      },
      {
        time: '09:00',
        duration: 60,
        classes: [
          { batch: 'ALL', subject: 'Physiology Lecture', venue: 'Gallery-2', type: 'Lecture' }
        ]
      },
      {
        time: '10:30',
        duration: 120,
        classes: [
          { batch: 'A', subject: 'Biology Tutorial', venue: 'Tutorial Room', type: 'Tutorial' },
          { batch: 'B', subject: 'Physiology Tutorial', venue: 'Tutorial Room', type: 'Tutorial' },
          { batch: 'C', subject: 'Biology Practical', venue: 'Lab', type: 'Practical' },
          { batch: 'D', subject: 'Physiology Practical', venue: 'Lab', type: 'Practical' }
        ]
      },
      {
        time: '12:30',
        duration: 120,
        classes: [
          { anatomyBatch: 'B', subject: 'Anatomy Dissection', venue: 'Dissection Hall', type: 'Dissection' },
          { anatomyBatch: 'C', subject: 'Anatomy Dissection', venue: 'Dissection Hall', type: 'Dissection' },
          { anatomyBatch: 'D', subject: 'Anatomy Dissection', venue: 'Dissection Hall', type: 'Dissection' },
          { anatomyBatch: 'E', subject: 'Anatomy Dissection', venue: 'Dissection Hall', type: 'Dissection' },
          { anatomyBatch: 'A', subject: 'Histology-A', venue: 'Histology Lab', type: 'Practical' }
        ]
      }
    ],
    // ... Repeat for other days (Sunday, Monday, ...) using the same pattern with straight quotes
  };

  useEffect(() => {
    initializeApp();
    configurePushNotifications();
  }, []);

  useEffect(() => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = days[new Date().getDay()];
    setCurrentDay(today);
  }, []);

  useEffect(() => {
    if (batch && anatomyBatch && currentDay && rollNumber) {
      updateUpcomingClasses();
    }
  }, [batch, anatomyBatch, currentDay, rollNumber]);

  const initializeApp = async () => {
    try {
      const savedRoll = await AsyncStorage.getItem('rollNumber');
      if (savedRoll) {
        handleRollNumberChange(savedRoll);
      }
    } catch (error) {
      console.log('Error loading data:', error);
    }
  };

  const configurePushNotifications = () => {
    PushNotification.configure({
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: Platform.OS === 'ios',
    });

    PushNotification.createChannel(
      {
        channelId: "class-reminders",
        channelName: "Class Reminders",
        channelDescription: "Notifications for upcoming classes",
        playSound: true,
        soundName: "default",
        importance: 4,
        vibrate: true,
      },
      (created) => console.log(`Channel created: ${created}`)
    );
  };

  const getBatchFromRoll = (roll) => {
    const rollNum = parseInt(roll);
    if (isNaN(rollNum) || rollNum < 1 || rollNum > 255) return null;

    for (const [batchLetter, range] of Object.entries(batchRanges)) {
      if (rollNum >= range.start && rollNum <= range.end) {
        return batchLetter;
      }
    }
    return null;
  };

  const getAnatomyBatchFromRoll = (roll) => {
    const rollNum = parseInt(roll);
    if (isNaN(rollNum) || rollNum < 1 || rollNum > 255) return null;

    for (const [batchLetter, range] of Object.entries(anatomyBatchRanges)) {
      if (rollNum >= range.start && rollNum <= range.end) {
        return batchLetter;
      }
    }
    return null;
  };

  const handleRollNumberChange = async (value) => {
    setRollNumber(value);
    const detectedBatch = getBatchFromRoll(value);
    const detectedAnatomyBatch = getAnatomyBatchFromRoll(value);

    if (detectedBatch) {
      setBatch(detectedBatch);
      await AsyncStorage.setItem('rollNumber', value);
      await AsyncStorage.setItem('batch', detectedBatch);
    } else {
      setBatch('');
    }

    if (detectedAnatomyBatch) {
      setAnatomyBatch(detectedAnatomyBatch);
      await AsyncStorage.setItem('anatomyBatch', detectedAnatomyBatch);
    } else {
      setAnatomyBatch('');
    }
  };

  // ... The rest of your functions (updateUpcomingClasses, scheduleNotifications, enableNotifications, formatTime, getTypeColor)
  // Make sure all strings use straight quotes

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4F46E5" />
      <ScrollView style={styles.scrollView}>
        {/* Your JSX components here */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollView: { flex: 1 },
  header: { backgroundColor: '#4F46E5', padding: 20, paddingTop: 40 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 5 },
  headerSubtitle: { fontSize: 14, color: '#E0E7FF' },
  card: { backgroundColor: '#FFFFFF', margin: 15, padding: 20, borderRadius: 12 },
  // ... Add the rest of your styles with straight quotes
});

export default App;
