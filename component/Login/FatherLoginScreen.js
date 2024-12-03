import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { TextInput, Button, Text, Title, useTheme } from 'react-native-paper';

export default function WaliLoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const theme = useTheme();

  const handleWaliLogin = () => {
    if (email === 'WALI' && password === 'WALI') {
      navigation.replace('Main');
    } else {
      Alert.alert('Login Failed', 'Invalid email or password. Use "WALI" for both email and password.');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ScrollView contentContainerStyle={styles.content}>
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

          <Button
            mode="contained"
            onPress={handleWaliLogin}
            style={styles.button}
            contentStyle={styles.buttonContent}
            labelStyle={styles.buttonLabel}
          >
            Login as Wali
          </Button>

          <Text style={styles.footerText}>
            Back to{' '}
            <Text
              style={[styles.link, { color: theme.colors.primary }]}
              onPress={() => navigation.navigate('Login')}
            >
              Login
            </Text>
          </Text>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  content: {
    flexGrow: 1,
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
});
