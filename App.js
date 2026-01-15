// App.js - Medical Class Schedule Notifier
// React Native Android App

import React, { useState, useEffect } from ‘react’;
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
} from ‘react-native’;
import PushNotification from ‘react-native-push-notification’;
import AsyncStorage from ‘@react-native-async-storage/async-storage’;

const App = () => {
const [rollNumber, setRollNumber] = useState(’’);
const [batch, setBatch] = useState(’’);
const [anatomyBatch, setAnatomyBatch] = useState(’’);
const [notificationsEnabled, setNotificationsEnabled] = useState(false);
const [currentDay, setCurrentDay] = useState(’’);
const [upcomingClasses, setUpcomingClasses] = useState([]);

const batchRanges = {
‘A’: { start: 1, end: 65 },
‘B’: { start: 66, end: 130 },
‘C’: { start: 131, end: 195 },
‘D’: { start: 196, end: 255 }
};

const anatomyBatchRanges = {
‘A’: { start: 1, end: 52 },
‘B’: { start: 53, end: 104 },
‘C’: { start: 105, end: 156 },
‘D’: { start: 157, end: 208 },
‘E’: { start: 209, end: 255 }
};

const schedule = {
Saturday: [
{ time: ‘08:00’, duration: 60, classes: [
{ batch: ‘ALL’, subject: ‘Biochemistry Tutorial’, venue: ‘All Batches’, type: ‘Tutorial’ }
]},
{ time: ‘09:00’, duration: 60, classes: [
{ batch: ‘ALL’, subject: ‘Physiology Lecture’, venue: ‘Gallery-2’, type: ‘Lecture’ }
]},
{ time: ‘10:30’, duration: 120, classes: [
{ batch: ‘A’, subject: ‘Biology Tutorial’, venue: ‘Tutorial Room’, type: ‘Tutorial’ },
{ batch: ‘B’, subject: ‘Physiology Tutorial’, venue: ‘Tutorial Room’, type: ‘Tutorial’ },
{ batch: ‘C’, subject: ‘Biology Practical’, venue: ‘Lab’, type: ‘Practical’ },
{ batch: ‘D’, subject: ‘Physiology Practical’, venue: ‘Lab’, type: ‘Practical’ }
]},
{ time: ‘12:30’, duration: 120, classes: [
{ anatomyBatch: ‘B’, subject: ‘Anatomy Dissection’, venue: ‘Dissection Hall’, type: ‘Dissection’ },
{ anatomyBatch: ‘C’, subject: ‘Anatomy Dissection’, venue: ‘Dissection Hall’, type: ‘Dissection’ },
{ anatomyBatch: ‘D’, subject: ‘Anatomy Dissection’, venue: ‘Dissection Hall’, type: ‘Dissection’ },
{ anatomyBatch: ‘E’, subject: ‘Anatomy Dissection’, venue: ‘Dissection Hall’, type: ‘Dissection’ },
{ anatomyBatch: ‘A’, subject: ‘Histology-A’, venue: ‘Histology Lab’, type: ‘Practical’ }
]}
],
Sunday: [
{ time: ‘08:00’, duration: 60, classes: [
{ batch: ‘ALL’, subject: ‘Anatomy Demonstration’, venue: ‘All Batches’, type: ‘Demonstration’ }
]},
{ time: ‘09:00’, duration: 60, classes: [
{ batch: ‘ALL’, subject: ‘Biochemistry Lecture’, venue: ‘Gallery-2’, type: ‘Lecture’ }
]},
{ time: ‘10:30’, duration: 120, classes: [
{ batch: ‘A’, subject: ‘Physiology Tutorial’, venue: ‘Tutorial Room’, type: ‘Tutorial’ },
{ batch: ‘B’, subject: ‘Biology Practical’, venue: ‘Lab’, type: ‘Practical’ },
{ batch: ‘C’, subject: ‘Physiology Practical’, venue: ‘Lab’, type: ‘Practical’ },
{ batch: ‘D’, subject: ‘Biology Tutorial’, venue: ‘Tutorial Room’, type: ‘Tutorial’ }
]},
{ time: ‘12:30’, duration: 120, classes: [
{ anatomyBatch: ‘A’, subject: ‘Anatomy Dissection’, venue: ‘Dissection Hall’, type: ‘Dissection’ },
{ anatomyBatch: ‘C’, subject: ‘Anatomy Dissection’, venue: ‘Dissection Hall’, type: ‘Dissection’ },
{ anatomyBatch: ‘D’, subject: ‘Anatomy Dissection’, venue: ‘Dissection Hall’, type: ‘Dissection’ },
{ anatomyBatch: ‘E’, subject: ‘Anatomy Dissection’, venue: ‘Dissection Hall’, type: ‘Dissection’ },
{ anatomyBatch: ‘B’, subject: ‘Histology-B’, venue: ‘Histology Lab’, type: ‘Practical’ }
]}
],
Monday: [
{ time: ‘08:00’, duration: 60, classes: [
{ batch: ‘ALL’, subject: ‘Physiology Lecture’, venue: ‘Gallery-2’, type: ‘Lecture’ }
]},
{ time: ‘09:00’, duration: 60, classes: [
{ batch: ‘ALL’, subject: ‘Anatomy Lecture’, venue: ‘Gallery-1’, type: ‘Lecture’ }
]},
{ time: ‘10:30’, duration: 120, classes: [
{ anatomyBatch: ‘A’, subject: ‘Anatomy Dissection’, venue: ‘Dissection Hall’, type: ‘Dissection’ },
{ anatomyBatch: ‘B’, subject: ‘Anatomy Dissection’, venue: ‘Dissection Hall’, type: ‘Dissection’ },
{ anatomyBatch: ‘D’, subject: ‘Anatomy Dissection’, venue: ‘Dissection Hall’, type: ‘Dissection’ },
{ anatomyBatch: ‘E’, subject: ‘Anatomy Dissection’, venue: ‘Dissection Hall’, type: ‘Dissection’ },
{ anatomyBatch: ‘C’, subject: ‘Histology-C’, venue: ‘Histology Lab’, type: ‘Practical’ }
]},
{ time: ‘12:30’, duration: 120, classes: [
{ batch: ‘A’, subject: ‘Biology Practical’, venue: ‘Lab’, type: ‘Practical’ },
{ batch: ‘B’, subject: ‘Physiology Practical’, venue: ‘Lab’, type: ‘Practical’ },
{ batch: ‘C’, subject: ‘Biology Tutorial’, venue: ‘Tutorial Room’, type: ‘Tutorial’ },
{ batch: ‘D’, subject: ‘Physiology Tutorial’, venue: ‘Tutorial Room’, type: ‘Tutorial’ }
]}
],
Tuesday: [
{ time: ‘08:00’, duration: 60, classes: [
{ batch: ‘ALL’, subject: ‘Anatomy Demonstration’, venue: ‘All Batches’, type: ‘Demonstration’ }
]},
{ time: ‘09:00’, duration: 60, classes: [
{ batch: ‘ALL’, subject: ‘Physiology Lecture’, venue: ‘Gallery-1’, type: ‘Lecture’ }
]},
{ time: ‘10:30’, duration: 120, classes: [
{ anatomyBatch: ‘A’, subject: ‘Anatomy Dissection’, venue: ‘Dissection Hall’, type: ‘Dissection’ },
{ anatomyBatch: ‘B’, subject: ‘Anatomy Dissection’, venue: ‘Dissection Hall’, type: ‘Dissection’ },
{ anatomyBatch: ‘C’, subject: ‘Anatomy Dissection’, venue: ‘Dissection Hall’, type: ‘Dissection’ },
{ anatomyBatch: ‘E’, subject: ‘Anatomy Dissection’, venue: ‘Dissection Hall’, type: ‘Dissection’ },
{ anatomyBatch: ‘D’, subject: ‘Histology-D’, venue: ‘Histology Lab’, type: ‘Practical’ }
]},
{ time: ‘12:30’, duration: 120, classes: [
{ batch: ‘A’, subject: ‘Physiology Practical’, venue: ‘Lab’, type: ‘Practical’ },
{ batch: ‘B’, subject: ‘Biology Tutorial’, venue: ‘Tutorial Room’, type: ‘Tutorial’ },
{ batch: ‘C’, subject: ‘Physiology Tutorial’, venue: ‘Tutorial Room’, type: ‘Tutorial’ },
{ batch: ‘D’, subject: ‘Biology Practical’, venue: ‘Lab’, type: ‘Practical’ }
]}
],
Wednesday: [
{ time: ‘08:00’, duration: 60, classes: [
{ batch: ‘ALL’, subject: ‘Physiology Tutorial’, venue: ‘All Batches’, type: ‘Tutorial’ }
]},
{ time: ‘09:00’, duration: 60, classes: [
{ batch: ‘ALL’, subject: ‘Biochemistry Lecture’, venue: ‘Gallery-2’, type: ‘Lecture’ }
]},
{ time: ‘10:30’, duration: 120, classes: [
{ batch: ‘A’, subject: ‘Physiology Tutorial’, venue: ‘Tutorial Room’, type: ‘Tutorial’ },
{ batch: ‘B’, subject: ‘Biochemistry Tutorial’, venue: ‘Tutorial Room’, type: ‘Tutorial’ },
{ batch: ‘C’, subject: ‘Physiology Tutorial’, venue: ‘Tutorial Room’, type: ‘Tutorial’ },
{ batch: ‘D’, subject: ‘Biochemistry Tutorial’, venue: ‘Tutorial Room’, type: ‘Tutorial’ }
]},
{ time: ‘12:30’, duration: 120, classes: [
{ anatomyBatch: ‘B’, subject: ‘Anatomy Dissection’, venue: ‘Dissection Hall’, type: ‘Dissection’ },
{ anatomyBatch: ‘C’, subject: ‘Anatomy Dissection’, venue: ‘Dissection Hall’, type: ‘Dissection’ },
{ anatomyBatch: ‘D’, subject: ‘Anatomy Dissection’, venue: ‘Dissection Hall’, type: ‘Dissection’ },
{ anatomyBatch: ‘E’, subject: ‘Anatomy Dissection’, venue: ‘Dissection Hall’, type: ‘Dissection’ },
{ anatomyBatch: ‘A’, subject: ‘Histology-A’, venue: ‘Histology Lab’, type: ‘Practical’ }
]}
],
Thursday: [
{ time: ‘08:00’, duration: 60, classes: [
{ batch: ‘ALL’, subject: ‘Biochemistry Lecture’, venue: ‘Gallery-3’, type: ‘Lecture’ }
]},
{ time: ‘09:00’, duration: 60, classes: [
{ batch: ‘ALL’, subject: ‘Anatomy Lecture’, venue: ‘Gallery-2’, type: ‘Lecture’ }
]},
{ time: ‘10:30’, duration: 120, classes: [
{ batch: ‘ALL’, subject: ‘Anatomy Dissection (All Batch)’, venue: ‘Dissection Hall’, type: ‘Dissection’, useAnatomyBatch: true }
]},
{ time: ‘12:30’, duration: 120, classes: [
{ batch: ‘A’, subject: ‘Biochemistry Tutorial’, venue: ‘Tutorial Room’, type: ‘Tutorial’ },
{ batch: ‘B’, subject: ‘Physiology Tutorial’, venue: ‘Tutorial Room’, type: ‘Tutorial’ },
{ batch: ‘C’, subject: ‘Biochemistry Tutorial’, venue: ‘Tutorial Room’, type: ‘Tutorial’ },
{ batch: ‘D’, subject: ‘Physiology Tutorial’, venue: ‘Tutorial Room’, type: ‘Tutorial’ }
]}
]
};

useEffect(() => {
initializeApp();
configurePushNotifications();
}, []);

useEffect(() => {
const days = [‘Sunday’, ‘Monday’, ‘Tuesday’, ‘Wednesday’, ‘Thursday’, ‘Friday’, ‘Saturday’];
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
const savedRoll = await AsyncStorage.getItem(‘rollNumber’);
if (savedRoll) {
handleRollNumberChange(savedRoll);
}
} catch (error) {
console.log(‘Error loading data:’, error);
}
};

const configurePushNotifications = () => {
PushNotification.configure({
onNotification: function (notification) {
console.log(‘NOTIFICATION:’, notification);
},
permissions: {
alert: true,
badge: true,
sound: true,
},
popInitialNotification: true,
requestPermissions: Platform.OS === ‘ios’,
});

```
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
```

};

const getBatchFromRoll = (roll) => {
const rollNum = parseInt(roll);
if (isNaN(rollNum) || rollNum < 1 || rollNum > 255) return null;

```
for (const [batchLetter, range] of Object.entries(batchRanges)) {
  if (rollNum >= range.start && rollNum <= range.end) {
    return batchLetter;
  }
}
return null;
```

};

const getAnatomyBatchFromRoll = (roll) => {
const rollNum = parseInt(roll);
if (isNaN(rollNum) || rollNum < 1 || rollNum > 255) return null;

```
for (const [batchLetter, range] of Object.entries(anatomyBatchRanges)) {
  if (rollNum >= range.start && rollNum <= range.end) {
    return batchLetter;
  }
}
return null;
```

};

const handleRollNumberChange = async (value) => {
setRollNumber(value);
const detectedBatch = getBatchFromRoll(value);
const detectedAnatomyBatch = getAnatomyBatchFromRoll(value);

```
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
```

};

const updateUpcomingClasses = () => {
if (!currentDay || !batch || !rollNumber) return;

```
const todaySchedule = schedule[currentDay] || [];
const upcoming = [];

todaySchedule.forEach(timeSlot => {
  timeSlot.classes.forEach(cls => {
    if (cls.batch) {
      if (cls.batch === 'ALL') {
        if (cls.useAnatomyBatch) {
          upcoming.push({
            time: timeSlot.time,
            duration: timeSlot.duration,
            ...cls,
            displayBatch: anatomyBatch
          });
        } else {
          upcoming.push({
            time: timeSlot.time,
            duration: timeSlot.duration,
            ...cls
          });
        }
      } else if (cls.batch === batch) {
        upcoming.push({
          time: timeSlot.time,
          duration: timeSlot.duration,
          ...cls
        });
      }
    } else if (cls.anatomyBatch && cls.anatomyBatch === anatomyBatch) {
      upcoming.push({
        time: timeSlot.time,
        duration: timeSlot.duration,
        ...cls,
        displayBatch: anatomyBatch
      });
    }
  });
});

setUpcomingClasses(upcoming);
```

};

const scheduleNotifications = () => {
// Cancel all existing notifications
PushNotification.cancelAllLocalNotifications();

```
upcomingClasses.forEach((cls, index) => {
  const [hours, minutes] = cls.time.split(':');
  const classTime = new Date();
  classTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  
  const notificationTime = new Date(classTime.getTime() - 10 * 60000);
  const now = new Date();
  
  if (notificationTime > now) {
    const batchInfo = cls.anatomyBatch ? `Anatomy Batch ${cls.anatomyBatch}` : 
                     cls.batch === 'ALL' ? 'All Batches' : `Batch ${cls.batch}`;
    
    PushNotification.localNotificationSchedule({
      channelId: "class-reminders",
      title: `${cls.subject}`,
      message: `${batchInfo}\nStarting in 10 minutes\n📍 ${cls.venue}`,
      date: notificationTime,
      allowWhileIdle: true,
      id: index + 1,
    });
  }
});
```

};

const enableNotifications = () => {
if (!batch || !rollNumber || !anatomyBatch) {
Alert.alert(‘Error’, ‘Please enter your roll number first!’);
return;
}

```
scheduleNotifications();
setNotificationsEnabled(true);

Alert.alert(
  'Notifications Enabled! ✅',
  `Regular Classes: Batch ${batch}\nAnatomy Classes: Batch ${anatomyBatch}\n\nYou will receive alerts 10 minutes before each class.`,
  [{ text: 'OK' }]
);
```

};

const formatTime = (time) => {
const [hours, minutes] = time.split(’:’);
const hour = parseInt(hours);
const ampm = hour >= 12 ? ‘PM’ : ‘AM’;
const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
return `${displayHour}:${minutes} ${ampm}`;
};

const getTypeColor = (type) => {
const colors = {
‘Lecture’: ‘#DBEAFE’,
‘Tutorial’: ‘#D1FAE5’,
‘Practical’: ‘#E9D5FF’,
‘Dissection’: ‘#FEE2E2’,
‘Demonstration’: ‘#FEF3C7’
};
return colors[type] || ‘#F3F4F6’;
};

return (
<View style={styles.container}>
<StatusBar barStyle="light-content" backgroundColor="#4F46E5" />

```
  <ScrollView style={styles.scrollView}>
    {/* Header */}
    <View style={styles.header}>
      <Text style={styles.headerTitle}>🔔 Medical Class Scheduler</Text>
      <Text style={styles.headerSubtitle}>Batch-Specific Notifications</Text>
    </View>

    {/* Roll Number Input */}
    <View style={styles.card}>
      <Text style={styles.label}>📝 Enter Roll Number (1-255)</Text>
      <TextInput
        style={styles.input}
        value={rollNumber}
        onChangeText={handleRollNumberChange}
        placeholder="Enter your roll number"
        keyboardType="numeric"
        maxLength={3}
      />

      {batch && anatomyBatch && rollNumber && (
        <View style={styles.batchInfo}>
          <View style={styles.batchCard}>
            <Text style={styles.batchTitle}>Regular Classes: Batch {batch}</Text>
            <Text style={styles.batchRange}>
              Roll {batchRanges[batch].start}-{batchRanges[batch].end}
            </Text>
          </View>
          <View style={[styles.batchCard, styles.anatomyCard]}>
            <Text style={styles.batchTitle}>Anatomy Classes: Batch {anatomyBatch}</Text>
            <Text style={styles.batchRange}>
              Roll {anatomyBatchRanges[anatomyBatch].start}-{anatomyBatchRanges[anatomyBatch].end}
            </Text>
          </View>
        </View>
      )}

      <TouchableOpacity
        style={[styles.button, (!batch || !anatomyBatch) && styles.buttonDisabled]}
        onPress={enableNotifications}
        disabled={!batch || !anatomyBatch}
      >
        <Text style={styles.buttonText}>
          {notificationsEnabled ? '✓ Notifications Active' : '🔔 Enable Notifications'}
        </Text>
      </TouchableOpacity>
    </View>

    {/* Today's Schedule */}
    {batch && rollNumber && anatomyBatch && upcomingClasses.length > 0 && (
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          📅 Today's Schedule - {currentDay}
        </Text>
        <Text style={styles.subtitle}>
          Roll {rollNumber} • Batch {batch} • Anatomy {anatomyBatch}
        </Text>

        {upcomingClasses.map((cls, idx) => (
          <View 
            key={idx} 
            style={[styles.classCard, { backgroundColor: getTypeColor(cls.type) }]}
          >
            <View style={styles.classHeader}>
              <Text style={styles.classTime}>{formatTime(cls.time)}</Text>
              <Text style={styles.classType}>{cls.type}</Text>
            </View>
            <Text style={styles.classSubject}>{cls.subject}</Text>
            <Text style={styles.classVenue}>📍 {cls.venue}</Text>
            {cls.anatomyBatch && (
              <Text style={styles.classBatch}>Anatomy Batch {cls.anatomyBatch}</Text>
            )}
            {cls.batch && cls.batch !== 'ALL' && !cls.anatomyBatch && (
              <Text style={styles.classBatch}>Batch {cls.batch}</Text>
            )}
            {cls.batch === 'ALL' && !cls.anatomyBatch && (
              <Text style={styles.classBatch}>All Batches</Text>
            )}
          </View>
        ))}
      </View>
    )}

    {batch && rollNumber && anatomyBatch && upcomingClasses.length === 0 && currentDay && (
      <View style={styles.card}>
        <Text style={styles.noClassText}>
          No classes scheduled for you today ({currentDay}) 🎉
        </Text>
      </View>
    )}

    {/* Info */}
    <View style={styles.infoCard}>
      <Text style={styles.infoTitle}>ℹ️ Dual Batch System</Text>
      <Text style={styles.infoText}>
        • Regular Classes (A,B,C,D): All 255 students{'\n'}
        • Anatomy Classes (A,B,C,D,E): Regrouped like Batch A{'\n'}
        • Batch E exists ONLY for anatomy dissection{'\n'}
        • Notifications sent 10 minutes before class
      </Text>
    </View>
  </ScrollView>
</View>
```

);
};

const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: ‘#F3F4F6’,
},
scrollView: {
flex: 1,
},
header: {
backgroundColor: ‘#4F46E5’,
padding: 20,
paddingTop: 40,
},
headerTitle: {
fontSize: 24,
fontWeight: ‘bold’,
color: ‘#FFFFFF’,
marginBottom: 5,
},
headerSubtitle: {
fontSize: 14,
color: ‘#E0E7FF’,
},
card: {
backgroundColor: ‘#FFFFFF’,
margin: 15,
padding: 20,
borderRadius: 12,
shadowColor: ‘#000’,
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.1,
shadowRadius: 4,
elevation: 3,
},
label: {
fontSize: 14,
fontWeight: ‘600’,
color: ‘#374151’,
marginBottom: 10,
},
input: {
borderWidth: 2,
borderColor: ‘#D1D5DB’,
borderRadius: 8,
padding: 12,
fontSize: 16,
marginBottom: 15,
},
batchInfo: {
marginBottom: 15,
},
batchCard: {
backgroundColor: ‘#EEF2FF’,
padding: 12,
borderRadius: 8,
marginBottom: 10,
borderWidth: 1,
borderColor: ‘#C7D2FE’,
},
anatomyCard: {
backgroundColor: ‘#FEE2E2’,
borderColor: ‘#FECACA’,
},
batchTitle: {
fontSize: 14,
fontWeight: ‘bold’,
color: ‘#1F2937’,
marginBottom: 4,
},
batchRange: {
fontSize: 12,
color: ‘#6B7280’,
},
button: {
backgroundColor: ‘#4F46E5’,
padding: 15,
borderRadius: 8,
alignItems: ‘center’,
},
buttonDisabled: {
backgroundColor: ‘#D1D5DB’,
},
buttonText: {
color: ‘#FFFFFF’,
fontSize: 16,
fontWeight: ‘bold’,
},
sectionTitle: {
fontSize: 18,
fontWeight: ‘bold’,
color: ‘#1F2937’,
marginBottom: 5,
},
subtitle: {
fontSize: 12,
color: ‘#6B7280’,
marginBottom: 15,
},
classCard: {
padding: 15,
borderRadius: 8,
marginBottom: 12,
borderLeftWidth: 4,
borderLeftColor: ‘#4F46E5’,
},
classHeader: {
flexDirection: ‘row’,
justifyContent: ‘space-between’,
alignItems: ‘center’,
marginBottom: 8,
},
classTime: {
fontSize: 16,
fontWeight: ‘bold’,
color: ‘#1F2937’,
},
classType: {
fontSize: 12,
fontWeight: ‘600’,
color: ‘#4F46E5’,
backgroundColor: ‘#FFFFFF’,
paddingHorizontal: 8,
paddingVertical: 4,
borderRadius: 4,
},
classSubject: {
fontSize: 16,
fontWeight: ‘600’,
color: ‘#1F2937’,
marginBottom: 4,
},
classVenue: {
fontSize: 13,
color: ‘#6B7280’,
marginBottom: 4,
},
classBatch: {
fontSize: 11,
color: ‘#7C3AED’,
fontWeight: ‘600’,
marginTop: 4,
},
noClassText: {
fontSize: 14,
color: ‘#F59E0B’,
textAlign: ‘center’,
padding: 20,
},
infoCard: {
backgroundColor: ‘#EFF6FF’,
margin: 15,
padding: 15,
borderRadius: 8,
borderLeftWidth: 4,
borderLeftColor: ‘#3B82F6’,
},
infoTitle: {
fontSize: 14,
fontWeight: ‘bold’,
color: ‘#1E40AF’,
marginBottom: 8,
},
infoText: {
fontSize: 12,
color: ‘#1E3A8A’,
lineHeight: 18,
},
});

export default App;
