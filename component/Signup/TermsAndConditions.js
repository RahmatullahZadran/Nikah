import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';

const TermsAndConditions = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Terms and Conditions</Text>
      <Text style={styles.paragraph}>
        Welcome to NikahMatch! By signing up for our platform, you agree to the following terms and conditions:
      </Text>
      <Text style={styles.subHeading}>1. Use of Platform</Text>
      <Text style={styles.paragraph}>
        The NikahMatch platform is intended solely for personal, non-commercial use. You agree to use the platform
        responsibly and comply with all applicable laws.
      </Text>
      <Text style={styles.subHeading}>2. Account Responsibility</Text>
      <Text style={styles.paragraph}>
        You are responsible for maintaining the confidentiality of your login information and ensuring no unauthorized
        access to your account. If any breach occurs, inform us immediately.
      </Text>
      <Text style={styles.subHeading}>3. Prohibited Activities</Text>
      <Text style={styles.paragraph}>
        Users are prohibited from sharing offensive, illegal, or misleading information. Any violations may result in
        account suspension or termination.
      </Text>
      <Text style={styles.subHeading}>4. Privacy</Text>
      <Text style={styles.paragraph}>
        Your data privacy is important to us. We adhere to our Privacy Policy, which outlines how we collect, use, and
        protect your information.
      </Text>
      <Text style={styles.subHeading}>5. Amendments</Text>
      <Text style={styles.paragraph}>
        NikahMatch reserves the right to modify these terms at any time. Continued use of the platform constitutes your
        acceptance of the updated terms.
      </Text>
      <Text style={styles.paragraph}>
        For any questions or clarifications, please contact us at support@nikahmatch.com.
      </Text>
      <Text style={styles.footer}>Last updated: [Insert Date]</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 10,
  },
  footer: {
    fontSize: 14,
    color: 'gray',
    marginTop: 20,
    textAlign: 'center',
  },
});

export default TermsAndConditions;
