import React, { useState, useEffect } from 'react';
import { View, Alert, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard, ActivityIndicator, Image, Text } from 'react-native';
import { TextInput, Button, Title, useTheme } from 'react-native-paper';
import { db, storage } from '../../firebase'; // Ensure firebase is correctly imported
import { doc, updateDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker'; // For image selection
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'; // Firebase storage functions

const EditAboutScreen = ({ route, navigation }) => {
  const { userId, userData } = route.params; // Get userData passed from the ProfileScreen
  const theme = useTheme();

  // Initialize state with the userData received from ProfileScreen
  const [aboutText, setAboutText] = useState(userData?.aboutyourself || '');
  const [hobbiesText, setHobbiesText] = useState(userData?.hobbies || '');
  const [aboutYourselfImageUri, setAboutYourselfImageUri] = useState(userData?.aboutyourselfImage || null);
  const [hobbyImageUri, setHobbyImageUri] = useState(userData?.hobbyImage || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // Function to handle saving the changes
  const handleSave = async () => {
    if (!aboutText.trim() || !hobbiesText.trim()) {
      setError(true);
      return;
    }

    setLoading(true); // Show loading indicator
    try {
      const userRef = doc(db, 'USERS', userId); // Save directly under userId

      // Handle about yourself image upload (aboutyouref)
      let aboutYourselfImageURL = aboutYourselfImageUri; // Default to current aboutyourself image if not updated
      if (aboutYourselfImageUri && aboutYourselfImageUri !== userData?.aboutyourselfImage) {
        const aboutYourselfImageRef = ref(storage, `images/${userId}/aboutyouref.jpg`);
        const response = await fetch(aboutYourselfImageUri);
        const blob = await response.blob();
        const uploadTask = uploadBytesResumable(aboutYourselfImageRef, blob);

        await uploadTask;
        aboutYourselfImageURL = await getDownloadURL(uploadTask.snapshot.ref);
      }

      // Handle hobby image upload
      let hobbyImageURL = hobbyImageUri; // Default to current hobby image if not updated
      if (hobbyImageUri && hobbyImageUri !== userData?.hobbyImage) {
        const hobbyImageRef = ref(storage, `images/${userId}/hobby.jpg`);
        const response = await fetch(hobbyImageUri);
        const blob = await response.blob();
        const uploadTask = uploadBytesResumable(hobbyImageRef, blob);

        await uploadTask;
        hobbyImageURL = await getDownloadURL(uploadTask.snapshot.ref);
      }

      // Update the Firestore document with the new information
      await updateDoc(userRef, {
        aboutyourself: aboutText,
        hobbies: hobbiesText,
        aboutyourselfImage: aboutYourselfImageURL, // Save the aboutyourself image URL in Firestore
        hobbyImage: hobbyImageURL,
      });

      Alert.alert('Success', 'Your profile has been updated');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  // Function to pick an image (for either about yourself or hobby)
  const pickImage = async (type) => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Denied', 'You need to grant permission to access the media library.');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      if (type === 'about') {
        setAboutYourselfImageUri(pickerResult.assets[0].uri); // Set about yourself image URI
      } else if (type === 'hobby') {
        setHobbyImageUri(pickerResult.assets[0].uri); // Set hobby image URI
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={{ padding: 20, position: 'absolute', top: 0, width: '100%', zIndex: 1 }}>
        {/* Fixed Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, marginTop: 10 }}>
          <Button icon="arrow-left" onPress={() => navigation.goBack()} />
          <Title style={{ fontSize: 28, fontWeight: 'bold', color: theme.colors.text, marginLeft: 10 }}>
            Yourself
          </Title>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingTop: 80 }}>
        <View style={{ padding: 20 }}>
          {/* About Yourself Image Picker */}
          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            {aboutYourselfImageUri ? (
              <Image source={{ uri: aboutYourselfImageUri }} style={{ width: 100, height: 100, borderRadius: 50 }} />
            ) : (
              <Text>No About Yourself Image Selected</Text>
            )}
            <Button mode="outlined" onPress={() => pickImage('about')} style={{ marginTop: 10 }}>
              Choose About Yourself Image
            </Button>
          </View>

          <TextInput
            label="About Yourself"
            value={aboutText}
            onChangeText={setAboutText}
            mode="outlined"
            multiline
            numberOfLines={10} // Increase the visible lines to make it bigger
            style={{
              marginBottom: 15,
              height: 200, // You can also set a fixed height here if you want
            }}
          />

          {/* Hobby Image Picker */}
          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            {hobbyImageUri ? (
              <Image source={{ uri: hobbyImageUri }} style={{ width: 100, height: 100, borderRadius: 50 }} />
            ) : (
              <Text>No Hobby Image Selected</Text>
            )}
            <Button mode="outlined" onPress={() => pickImage('hobby')} style={{ marginTop: 10 }}>
              Choose Hobby Image
            </Button>
          </View>

          {/* Hobbies Input */}
          <TextInput
            label="Hobbies"
            value={hobbiesText}
            onChangeText={setHobbiesText}
            mode="outlined"
            multiline
            numberOfLines={6} // Make the hobbies section a bit shorter
            style={{ marginBottom: 15 }}
          />

          {error && <Text style={{ color: 'red', marginBottom: 10 }}>Please fill in both sections</Text>}

          {loading ? (
            <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginVertical: 15 }} />
          ) : (
            <Button
              mode="contained"
              onPress={handleSave}
              style={{ borderRadius: 8, elevation: 3 }}
              contentStyle={{ paddingVertical: 10 }}
            >
              Save
            </Button>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default EditAboutScreen;
