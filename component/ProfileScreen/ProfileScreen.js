import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, Alert, ScrollView, Image } from 'react-native';
import { Button, IconButton, useTheme, Card } from 'react-native-paper';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, storage } from '../../firebase'; // Ensure Firebase storage is correctly imported
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect
import { ref, getDownloadURL } from 'firebase/storage'; // Firebase Storage functions

const ProfileScreen = ({ route, navigation }) => {
  const { userId } = route.params || {}; // Get userId from params
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState(null); // State for storing image URL
  const theme = useTheme();

  const fetchUserData = async () => {
    if (!userId) {
      Alert.alert('Error', 'No user ID found');
      setLoading(false);
      return;
    }
  
    try {
      const userDocRef = doc(db, 'USERS', userId); // Get reference to user's document
      const userDoc = await getDoc(userDocRef);
  
      if (userDoc.exists()) {
        const userData = userDoc.data(); // Access 'yourdetails' field
        setUser(userData ? userData : null); // If 'yourdetails' doesn't exist, set user to null
  
        // Fetch image URL if it exists
        if (userData?.image) {
          const imageRef = ref(storage, userData.image); // Get reference to the image in Firebase Storage
          const url = await getDownloadURL(imageRef); // Get the download URL
          setImageUrl(url); // Set the URL in the state
        }
      } else {
        Alert.alert('Error', 'User not found');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };
  

  // Fetch data on initial load
  useEffect(() => {
    fetchUserData();
  }, [userId]);

  // Refetch user data when coming back from EditProfile screen
  useFocusEffect(
    React.useCallback(() => {
      fetchUserData(); // Refetch user data when screen is focused (i.e., returning from EditProfile)
    }, [])
  );

  const isProfileComplete = () => {
    // Check if all the required fields are provided
    return (
      user?.name &&
      user?.gender &&
      user?.age &&
      user?.location &&
      user?.sect &&
      user?.hijab &&
      user?.children
    );
  };

  const isPreferencesComplete = () => {
    // Check if the "Your Preferences" section fields are filled out
    return (
      user?.preferredMinAge &&
      user?.preferredMaxAge &&
      user?.preferredHeight &&
      user?.preferredDistance &&
      user?.preferredSect
    );
  };

  const renderUserDetails = (field) => {
    return user?.[field] || '-'; // If the field doesn't exist, return "-"
  };

  const renderAgeRange = () => {
    if (user?.preferredMinAge && user?.preferredMaxAge) {
      return `${user.preferredMinAge} - ${user.preferredMaxAge}`;
    }
    return 'Not provided';
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  const handleEdit = (field) => {
    if (field === 'about') {
      console.log("Navigating to EditAboutScreen with userData:", user); // Add this log
      navigation.navigate('EditAboutScreen', { userId, userData: user });
    } else if (field === 'preferences') {
      console.log("Navigating to EditPreferences with userData:", user); // Add this log
      navigation.navigate('EditPreferences', { userId, userData: user });
    } else {
      console.log("Navigating to EditProfile with userData:", user); // Add this log
      navigation.navigate('EditProfile', { userId, userData: user });
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Stationary Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}></Text>
      </View>

      <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Your Details</Text>
              <View style={styles.editContainer}>
                <IconButton
                  icon={isProfileComplete() ? 'check-circle' : 'alert-circle'}
                  size={20}
                  color={isProfileComplete() ? theme.colors.success : theme.colors.warning}
                  onPress={() => handleEdit('profile')}
                />
                <IconButton
                  icon="pencil"
                  size={20}
                  onPress={() => handleEdit('profile')}
                  style={styles.editIcon}
                />
              </View>
            </View>

            {/* Profile Image */}
            <View style={styles.profileImageContainer}>
              {imageUrl ? (
                <Image source={{ uri: imageUrl }} style={styles.profileImage} />
              ) : (
                <Text>No Image Available</Text>
              )}
            </View>

            <View style={styles.detailsContainer}>
              <Text style={styles.infoText}>Name: <Text style={styles.infoValue}>{renderUserDetails('name')}</Text></Text>
              <Text style={styles.infoText}>Gender: <Text style={styles.infoValue}>{renderUserDetails('gender')}</Text></Text>
              <Text style={styles.infoText}>Age: <Text style={styles.infoValue}>{renderUserDetails('age')}</Text></Text>
              <Text style={styles.infoText}>Location (Country): <Text style={styles.infoValue}>{renderUserDetails('location')}</Text></Text>
              <Text style={styles.infoText}>Sect: <Text style={styles.infoValue}>{renderUserDetails('sect')}</Text></Text>
              
              {/* Conditionally Render Hijab Status based on Gender */}
              {renderUserDetails('gender') === 'Female' && (
                <Text style={styles.infoText}>Hijab Status: <Text style={styles.infoValue}>{renderUserDetails('hijab')}</Text></Text>
              )}
              
              <Text style={styles.infoText}>Children: <Text style={styles.infoValue}>{renderUserDetails('children')}</Text></Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>About Yourself</Text>
              <IconButton
                icon="pencil"
                size={20}
                onPress={() => handleEdit('about')}
                style={styles.editIcon}
              />
            </View>

            {/* About Yourself Image */}
            <View style={styles.profileImageContainer}>
              {user?.aboutyourselfImage ? (
                <Image source={{ uri: user.aboutyourselfImage }} style={styles.profileImage} />
              ) : (
                <Text>No About Yourself Image Available</Text>
              )}
            </View>

            {/* About Yourself Text */}
            <Text style={styles.infoText}>
              {user?.aboutyourself ? user.aboutyourself : 'No information provided.'}
            </Text>

            {/* Hobby Image */}
            <View style={styles.profileImageContainer}>
              {user?.hobbyImage ? (
                <Image source={{ uri: user.hobbyImage }} style={styles.profileImage} />
              ) : (
                <Text>No Hobby Image Available</Text>
              )}
            </View>

            {/* Hobbies Text */}
            <Text style={styles.infoText}>
              {user?.hobbies ? user.hobbies : 'No hobbies information provided.'}
            </Text>
          </Card.Content>
        </Card>

        {/* New Section: Your Preferences */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Your Preferences</Text>
              <View style={styles.editContainer}>
                <IconButton
                  icon={isPreferencesComplete() ? 'check-circle' : 'alert-circle'}
                  size={20}
                  color={isPreferencesComplete() ? theme.colors.success : theme.colors.warning}
                  onPress={() => handleEdit('preferences')}
                />
                <IconButton
                  icon="pencil"
                  size={20}
                  onPress={() => handleEdit('preferences')}
                  style={styles.editIcon}
                />
              </View>
            </View>

            {/* Preferences Information */}
            <Text style={styles.infoText}>
              Age Range: <Text style={styles.infoValue}>{renderAgeRange()}</Text>
            </Text>
            <Text style={styles.infoText}>
              Height: <Text style={styles.infoValue}>{renderUserDetails('preferredHeight') || 'Not provided'}</Text>
            </Text>
            <Text style={styles.infoText}>
              Distance: <Text style={styles.infoValue}>{renderUserDetails('preferredDistance') || 'Not provided'}</Text>
            </Text>
            <Text style={styles.infoText}>
              Sect: <Text style={styles.infoValue}>{renderUserDetails('preferredSect') || 'Not provided'}</Text>
            </Text>
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          style={styles.button}
          onPress={() => {
            auth.signOut();
            navigation.replace('Login');
          }}
        >
          Logout
        </Button>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    backgroundColor: 'white',
    padding: 0,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 22,
    color: 'white',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: 'gray',
  },
  card: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 8,
    elevation: 5,
    backgroundColor: '#f9f9f9',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#e74c3c',
    textDecorationLine: 'underline',
    textDecorationColor: '#e74c3c',
    textDecorationStyle: 'solid',
  },
  editContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editIcon: {
    marginLeft: 10,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  profileImage: {
    width: 300,   // Increase width
    height: 300,  // Increase height to make it longer (rectangular)
    borderRadius: 10,  // Slight rounding of the corners
  },
  detailsContainer: {
    marginTop: 15,
  },
  infoText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 6,
  },
  infoValue: {
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  button: {
    marginTop: 20,
    width: '100%',
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#e74c3c', // Change button color to red
  },
});

export default ProfileScreen;
