import React, { useState, useRef } from 'react';
import { View, Alert, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard, ActivityIndicator, Text } from 'react-native';
import { TextInput, Button, Title, useTheme, IconButton, Menu } from 'react-native-paper';
import Slider from '@react-native-community/slider'; // Import the slider component
import { db } from '../../firebase'; // Ensure firebase is correctly imported
import { doc, updateDoc } from 'firebase/firestore';

const EditPreferencesScreen = ({ route, navigation }) => {
  const { userId, userData } = route.params; // Get userData from params
  const theme = useTheme();

  // Initialize state with user preferences data
  const [preferenceMinAge, setPreferenceMinAge] = useState(userData?.preferredMinAge || 18);
  const [preferenceMaxAge, setPreferenceMaxAge] = useState(userData?.preferredMaxAge || 100);
  const [preferenceHeight, setPreferenceHeight] = useState(userData?.preferredHeight || '');
  const [preferenceDistance, setPreferenceDistance] = useState(userData?.preferredDistance || 'Any'); // Default to "Any"
  const [preferenceSect, setPreferenceSect] = useState(userData?.preferredSect || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isMinAgeMenuVisible, setIsMinAgeMenuVisible] = useState(false);
  const [isMaxAgeMenuVisible, setIsMaxAgeMenuVisible] = useState(false);
  const [isHeightMenuVisible, setIsHeightMenuVisible] = useState(false);
  const [isSectMenuVisible, setIsSectMenuVisible] = useState(false);

  const sectOptions = [
    { label: 'Sunni', value: 'Sunni' },
    { label: 'Shia', value: 'Shia' },
    { label: 'Other', value: 'Other' },
  ];

  // Set the minimum and maximum age
  const minAge = 18;
  const maxAge = 100;

  // Generate age options from minAge to maxAge
  const ageOptions = Array.from({ length: maxAge - minAge + 1 }, (_, index) => minAge + index);

  // Height options (in cm) from 140cm to 220cm with "Any" option
  const heightOptions = [
    { label: 'Any', value: 'Any' },
    ...Array.from({ length: 81 }, (_, index) => 140 + index).map((height) => ({
      label: `${height} cm`,
      value: `${height}`,
    })),
  ];

  // Ref to store the slider value temporarily
  const sliderValueRef = useRef(preferenceDistance);

  // Validate the form
  const validateForm = () => {
    if (!preferenceMinAge || !preferenceMaxAge || !preferenceHeight || !preferenceDistance || !preferenceSect) {
      setError(true);
      return false;
    }
    if (preferenceMinAge < minAge || preferenceMinAge > maxAge || preferenceMaxAge < minAge || preferenceMaxAge > maxAge) {
      setError(true);
      Alert.alert('Error', `Age must be between ${minAge} and ${maxAge}`);
      return false;
    }
    if (preferenceMinAge >= preferenceMaxAge) {
      setError(true);
      Alert.alert('Error', 'Minimum age must be less than maximum age.');
      return false;
    }
    setError(false);
    return true;
  };

  // Handle saving the preferences
  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true); // Show loading indicator
    try {
      const userRef = doc(db, 'USERS', userId); // Get reference to user's document

      // Update user preferences
      await updateDoc(userRef, {
        preferredMinAge: preferenceMinAge,
        preferredMaxAge: preferenceMaxAge,
        preferredHeight: preferenceHeight,
        preferredDistance: preferenceDistance === 'Any' ? '' : preferenceDistance, // Store "" if "Any" is selected
        preferredSect: preferenceSect,
      });

      Alert.alert('Success', 'Preferences updated successfully!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to update preferences.');
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  // Handle slider value change
  const handleDistanceChange = (value) => {
    if (value === 1000) {
      sliderValueRef.current = 'Any'; // If it's 1000 miles, set it as "Any"
    } else {
      sliderValueRef.current = value;
    }
  };

  // Handle when the user finishes sliding
  const handleSlidingComplete = () => {
    setPreferenceDistance(sliderValueRef.current); // Update the state once the user is done sliding
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{ padding: 20 }}>
            {/* Header with Go Back Button */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20, marginTop: 10 }}>
              <IconButton icon="arrow-left" onPress={() => navigation.goBack()} size={30} />
              <Title style={{ fontSize: 28, fontWeight: 'bold', color: theme.colors.text, marginLeft: 10 }}>
                Preferences
              </Title>
            </View>

            {/* Preferred Minimum Age with Dropdown Menu */}
            <Menu
              visible={isMinAgeMenuVisible}
              onDismiss={() => setIsMinAgeMenuVisible(false)}
              anchor={
                <Button
                  mode="outlined"
                  onPress={() => setIsMinAgeMenuVisible(true)}
                  style={{ marginBottom: 15, borderRadius: 8 }}
                >
                  Preferred Minimum Age: {preferenceMinAge}
                </Button>
              }
            >
              {ageOptions.map((age) => (
                <Menu.Item
                  key={age}
                  onPress={() => {
                    setPreferenceMinAge(age);
                    setIsMinAgeMenuVisible(false);
                  }}
                  title={`${age} years`}
                />
              ))}
            </Menu>

            {/* Preferred Maximum Age with Dropdown Menu */}
            <Menu
              visible={isMaxAgeMenuVisible}
              onDismiss={() => setIsMaxAgeMenuVisible(false)}
              anchor={
                <Button
                  mode="outlined"
                  onPress={() => setIsMaxAgeMenuVisible(true)}
                  style={{ marginBottom: 15, borderRadius: 8 }}
                >
                  Preferred Maximum Age: {preferenceMaxAge}
                </Button>
              }
            >
              {ageOptions.map((age) => (
                <Menu.Item
                  key={age}
                  onPress={() => {
                    setPreferenceMaxAge(age);
                    setIsMaxAgeMenuVisible(false);
                  }}
                  title={`${age} years`}
                />
              ))}
            </Menu>

            {/* Preferred Minimum Height with Dropdown Menu */}
            <Menu
              visible={isHeightMenuVisible}
              onDismiss={() => setIsHeightMenuVisible(false)}
              anchor={
                <Button
                  mode="outlined"
                  onPress={() => setIsHeightMenuVisible(true)}
                  style={{ marginBottom: 15, borderRadius: 8 }}
                >
                  Preferred Minimum Height: {preferenceHeight === 'Any' ? 'Any' : `${preferenceHeight} cm`}
                </Button>
              }
            >
              {heightOptions.map((height) => (
                <Menu.Item
                  key={height.value}
                  onPress={() => {
                    setPreferenceHeight(height.value);
                    setIsHeightMenuVisible(false);
                  }}
                  title={height.label}
                />
              ))}
            </Menu>

            {/* Preferred Distance with Slider */}
            <Text style={{ marginBottom: 10, color: theme.colors.text }}>Preferred Distance: {preferenceDistance === 'Any' ? 'Any' : `${preferenceDistance} miles`}</Text>
            <Slider
              style={{ width: '100%', height: 40 }}
              minimumValue={0}
              maximumValue={1000}
              step={1}
              value={preferenceDistance === 'Any' ? 1000 : preferenceDistance} // Set 1000 as the max value for "Any"
              onValueChange={handleDistanceChange} // Update the value while dragging
              onSlidingComplete={handleSlidingComplete} // Update the state once the user is done sliding
              minimumTrackTintColor={theme.colors.primary}
              maximumTrackTintColor={theme.colors.border}
              thumbTintColor={theme.colors.primary}
            />

            {/* Preferred Sect with Dropdown Menu */}
            <Menu
              visible={isSectMenuVisible}
              onDismiss={() => setIsSectMenuVisible(false)}
              anchor={
                <Button
                  mode="outlined"
                  onPress={() => setIsSectMenuVisible(true)}
                  style={{ marginBottom: 15, borderRadius: 8 }}
                >
                  Preferred Sect: {preferenceSect || 'Select'}
                </Button>
              }
            >
              {sectOptions.map((sect) => (
                <Menu.Item
                  key={sect.value}
                  onPress={() => {
                    setPreferenceSect(sect.value);
                    setIsSectMenuVisible(false);
                  }}
                  title={sect.label}
                />
              ))}
            </Menu>

            {/* Error Message */}
            {error && <Text style={{ color: 'red', marginBottom: 10 }}>Please fill out all fields correctly</Text>}

            {/* Loading Indicator or Save Button */}
            {loading ? (
              <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginVertical: 15 }} />
            ) : (
              <Button
                mode="contained"
                onPress={handleSave}
                style={{
                  borderRadius: 8,
                  elevation: 5,
                  paddingVertical: 10,
                  backgroundColor: theme.colors.primary,
                }}
                contentStyle={{ paddingVertical: 12 }}
              >
                Save
              </Button>
            )}
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default EditPreferencesScreen;
