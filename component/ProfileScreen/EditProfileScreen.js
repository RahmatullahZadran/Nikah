import React, { useState, useRef } from 'react';
import { View, Alert, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard, ActivityIndicator, Text, Image } from 'react-native';
import { TextInput, Button, Title, useTheme, IconButton, Menu, Appbar } from 'react-native-paper';
import { db, storage } from '../../firebase'; // Ensure Firebase storage is correctly imported
import { doc, updateDoc } from 'firebase/firestore'; // Firebase functions
import * as ImagePicker from 'expo-image-picker'; // Import Image Picker
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage'; // Firebase storage functions

const EditProfileScreen = ({ route, navigation }) => {
  const { userId, userData } = route.params; // Get userData from params
  const theme = useTheme();

  const [name, setName] = useState(userData?.name || '');
  const [age, setAge] = useState(userData?.age || '');
  const [location, setLocation] = useState(userData?.location || ''); // Display country in location
  const [sect, setSect] = useState(userData?.sect || '');
  const [gender, setGender] = useState(userData?.gender || '');
  const [hijab, setHijab] = useState(userData?.hijab || '');
  const [children, setChildren] = useState(userData?.children || '');
  const [image, setImage] = useState(userData?.image || null); // To store the selected image, use fallback to null if not present

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const sectOptions = [
    { label: 'Sunni', value: 'Sunni' },
    { label: 'Shia', value: 'Shia' },
    { label: 'Other', value: 'Other' },
  ];

  const genderOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
  ];

  const hijabOptions = [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ];

  const childrenOptions = [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ];

  // Menu state for dynamic dropdowns
  const [isGenderMenuVisible, setIsGenderMenuVisible] = useState(false);
  const [isSectMenuVisible, setIsSectMenuVisible] = useState(false);
  const [isHijabMenuVisible, setIsHijabMenuVisible] = useState(false);
  const [isChildrenMenuVisible, setIsChildrenMenuVisible] = useState(false);

  // Validate the form
  const validateForm = () => {
    if (!name || !age || !location || !sect || !gender || !hijab || !children) {
      setError(true);
      return false;
    }
    setError(false);
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      Alert.alert('Error', 'Please fill out all fields correctly.');
      return;
    }

    setLoading(true); // Show loading indicator
    try {
      const userRef = doc(db, 'USERS', userId); // Get reference to user's document

      let imageURL = image; // Use the current image if no new image is selected

      if (image && image !== userData?.image) {
        // If there is a new image, upload it
        const imageRef = ref(storage, `images/${userId}/profile.jpg`);

        // Delete old image if it's not the same as the current one
        if (userData?.image) {
          const oldImageRef = ref(storage, userData.image); // Old image reference
          await deleteObject(oldImageRef); // Delete old image
        }

        // Upload the new image
        const response = await fetch(image);
        const blob = await response.blob();
        const uploadTask = uploadBytesResumable(imageRef, blob);

        // Wait for the upload to complete
        await uploadTask;

        // Get the image download URL after the upload completes
        imageURL = await getDownloadURL(uploadTask.snapshot.ref);
      }

      // Save the updated user profile data
      await updateDoc(userRef, {
        name,
        gender,
        age,
        location,
        sect,
        hijab,
        children,
        ...(imageURL && { image: imageURL }), // Add image URL if new image was uploaded
      });

      Alert.alert('Success', 'Profile updated successfully!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile.');
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Permission Denied', 'You need to grant permission to access the media library.');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      setImage(pickerResult.assets[0].uri); // Set the selected image URI
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Profile" />
      </Appbar.Header>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{ padding: 20 }}>

            {/* Image Picker Section */}
            <View style={{ alignItems: 'center', marginBottom: 20 }}>
              {image ? (
                <Image source={{ uri: image }} style={{ width: 100, height: 100, borderRadius: 50 }} />
              ) : (
                <Text>No Image Selected</Text>
              )}
              <Button mode="outlined" onPress={pickImage} style={{ marginTop: 10 }}>
                Choose Image
              </Button>
            </View>

            {/* Name */}
            <TextInput
              label="Name"
              value={name}
              onChangeText={setName}
              mode="outlined"
              style={{ marginBottom: 15 }}
            />

            {/* Gender Dropdown Menu */}
            <Menu
              visible={isGenderMenuVisible}
              onDismiss={() => setIsGenderMenuVisible(false)}
              anchor={
                <Button
                  mode="outlined"
                  onPress={() => setIsGenderMenuVisible(true)}
                  style={{ marginBottom: 15 }}
                >
                  Gender: {gender || 'Select'}
                </Button>
              }
            >
              {genderOptions.map((option) => (
                <Menu.Item
                  key={option.value}
                  onPress={() => {
                    setGender(option.value);
                    setIsGenderMenuVisible(false);
                  }}
                  title={option.label}
                />
              ))}
            </Menu>

            {/* Age */}
            <TextInput
              label="Age"
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
              mode="outlined"
              style={{ marginBottom: 15 }}
            />

            {/* Sect Dropdown Menu */}
            <Menu
              visible={isSectMenuVisible}
              onDismiss={() => setIsSectMenuVisible(false)}
              anchor={
                <Button
                  mode="outlined"
                  onPress={() => setIsSectMenuVisible(true)}
                  style={{ marginBottom: 15 }}
                >
                  Sect: {sect || 'Select'}
                </Button>
              }
            >
              {sectOptions.map((option) => (
                <Menu.Item
                  key={option.value}
                  onPress={() => {
                    setSect(option.value);
                    setIsSectMenuVisible(false);
                  }}
                  title={option.label}
                />
              ))}
            </Menu>

            {/* Location */}
            <TextInput
              label="Location (Country)"
              value={location}
              onChangeText={setLocation}
              mode="outlined"
              style={{ marginBottom: 15 }}
            />

            {/* Hijab Status */}
            <Menu
              visible={isHijabMenuVisible}
              onDismiss={() => setIsHijabMenuVisible(false)}
              anchor={
                <Button
                  mode="outlined"
                  onPress={() => setIsHijabMenuVisible(true)}
                  style={{ marginBottom: 15 }}
                >
                  Hijab: {hijab || 'Select'}
                </Button>
              }
            >
              {hijabOptions.map((option) => (
                <Menu.Item
                  key={option.value}
                  onPress={() => {
                    setHijab(option.value);
                    setIsHijabMenuVisible(false);
                  }}
                  title={option.label}
                />
              ))}
            </Menu>

            {/* Children */}
            <Menu
              visible={isChildrenMenuVisible}
              onDismiss={() => setIsChildrenMenuVisible(false)}
              anchor={
                <Button
                  mode="outlined"
                  onPress={() => setIsChildrenMenuVisible(true)}
                  style={{ marginBottom: 15 }}
                >
                  Children: {children || 'Select'}
                </Button>
              }
            >
              {childrenOptions.map((option) => (
                <Menu.Item
                  key={option.value}
                  onPress={() => {
                    setChildren(option.value);
                    setIsChildrenMenuVisible(false);
                  }}
                  title={option.label}
                />
              ))}
            </Menu>

            {/* Error Message */}
            {error && <Text style={{ color: 'red', marginBottom: 10 }}>Please fill out all fields correctly</Text>}

            {/* Save Button */}
            {loading ? (
              <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginVertical: 15 }} />
            ) : (
              <Button mode="contained" onPress={handleSave} style={{ borderRadius: 8 }}>
                Save
              </Button>
            )}
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default EditProfileScreen;
