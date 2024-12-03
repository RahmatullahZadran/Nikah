import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator
} from 'react-native';
import { TextInput, Button, Text, Title, useTheme } from 'react-native-paper';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase'; // Import Firebase authentication instance

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const theme = useTheme();

  const handleLogin = async () => {
    if (email.trim() === '' || password.trim() === '') {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    setLoading(true); // Show loading indicator
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      Alert.alert('Success', 'Logged in successfully!');
      navigation.replace('Main', {
        screen: 'Profile',
        params: { userId: user.uid }, // Pass the userId for further use
      });
    } catch (error) {
      Alert.alert('Login Failed', error.message); // Display Firebase error message
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

            {loading ? (
              <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loadingIndicator} />
            ) : (
              <Button
                mode="contained"
                onPress={handleLogin}
                style={styles.button}
                contentStyle={styles.buttonContent}
                labelStyle={styles.buttonLabel}
              >
                Login
              </Button>
            )}

            <Text style={styles.footerText}>
              Don't have an account?{' '}
              <Text
                style={[styles.link, { color: theme.colors.primary }]}
                onPress={() => navigation.navigate('SignUp')}
              >
                Sign up
              </Text>
            </Text>
          </View>

          <Button
            mode="outlined"
            onPress={() => navigation.navigate('FatherLogin')}
            style={[styles.waliButton, { borderColor: theme.colors.primary }]}
            labelStyle={styles.buttonLabel}
            contentStyle={styles.buttonContent}
          >
            Login as Wali
          </Button>
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
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    marginBottom: 15,
  },
  buttonLabel: {
    fontSize: 21,
  },
  button: {
    marginTop: 10,
    borderRadius: 8,
    elevation: 3,
  },
  buttonContent: {
    paddingVertical: 10,
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
  waliButton: {
    marginTop: 20,
    borderRadius: 8,
  },
  loadingIndicator: {
    marginVertical: 15,
  },
});
