import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { TextInput, Button, Text, Title, Checkbox, useTheme } from 'react-native-paper';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebase'; // Firestore added here
import { doc, setDoc } from 'firebase/firestore'; // Firestore imports
import TermsAndConditions from '../Signup/TermsAndConditions';

export default function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [loading, setLoading] = useState(false); // State for loading indicator
  const theme = useTheme();

  const handleSignUp = async () => {
    if (!agreeToTerms) {
      Alert.alert('Error', 'You must agree to the terms and conditions.');
      return;
    }
  
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }
  
    if (email.trim() === '' || password.trim() === '') {
      Alert.alert('Error', 'All fields are required.');
      return;
    }
  
    setLoading(true); // Show loading indicator
  
    try {
      // Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Save user data to Firestore
      await setDoc(doc(db, 'USERS', user.uid), {
        email: user.email,
        createdAt: new Date().toISOString(),
      });
  
      Alert.alert('Success', 'Account created successfully!');
      navigation.navigate('Main', {
        screen: 'Profile', // Directly open the Profile tab
        params: { userId: user.uid }, // Pass userId
      });
    } catch (error) {
      Alert.alert('Error', error.message); // Display Firebase error message
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };
  

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.content}>
            <View style={styles.logoContainer}>
              <Image
                source={require('../../assets/NikahMatch.png')}
                style={styles.logo}
              />
              <Title style={styles.title}>NikahMatch</Title>
            </View>

            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              style={styles.input}
              keyboardType="email-address"
            />

            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              secureTextEntry
              style={styles.input}
            />

            <TextInput
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              mode="outlined"
              secureTextEntry
              style={styles.input}
            />

            <View style={styles.checkboxContainer}>
              <Checkbox
                status={agreeToTerms ? 'checked' : 'unchecked'}
                onPress={() => setAgreeToTerms(!agreeToTerms)}
                color={theme.colors.primary}
              />
              <Text style={styles.checkboxText}>
                I agree to the{' '}
                <Text
                  style={[styles.link, { color: theme.colors.primary }]}
                  onPress={() => setShowTerms(true)}
                >
                  terms and conditions
                </Text>
              </Text>
            </View>

            {/* Show ActivityIndicator when loading */}
            {loading ? (
              <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loadingIndicator} />
            ) : (
              <Button
                mode="contained"
                onPress={handleSignUp}
                style={styles.button}
                contentStyle={styles.buttonContent}
                labelStyle={styles.buttonLabel}
              >
                Sign Up
              </Button>
            )}

            <Text style={styles.footerText}>
              Already have an account?{' '}
              <Text
                style={[styles.link, { color: theme.colors.primary }]}
                onPress={() => navigation.goBack()}
              >
                Login
              </Text>
            </Text>
          </View>

          {/* Modal for Terms and Conditions */}
          <Modal
            visible={showTerms}
            animationType="slide"
            onRequestClose={() => setShowTerms(false)}
          >
            <TermsAndConditions />
            <Button
              mode="contained"
              onPress={() => setShowTerms(false)}
              style={styles.closeButton}
            >
              Close
            </Button>
          </Modal>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 10,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#ccc',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  input: {
    marginBottom: 15,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },
  checkboxText: {
    fontSize: 16,
    marginLeft: 8,
    flexShrink: 1,
  },
  button: {
    marginTop: 10,
    borderRadius: 8,
    elevation: 3,
  },
  buttonContent: {
    paddingVertical: 10,
  },
  buttonLabel: {
    fontSize: 21,
  },
  footerText: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 20,
    color: 'gray',
  },
  link: {
    fontWeight: 'bold',
  },
  closeButton: {
    margin: 20,
  },
  loadingIndicator: {
    marginVertical: 15,
  },
});
