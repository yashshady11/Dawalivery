import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const HelpCentreScreen = () => {
  const navigation = useNavigation();

  const handleEmailPress = () => {
    const email = 'support@example.com';
    const subject = 'Support Request';
    const body = 'Hi there, I need help with...';
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    Linking.openURL(mailtoUrl).catch((err) => console.error('Error opening email client:', err));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={require('../assets/images/checkout_screen/back-icon.png')} style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Help Centre</Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.text}>
            Our support representatives are always with you 24*7. You can email us by clicking on the button below.
          </Text>
          <TouchableOpacity style={styles.emailButton} onPress={handleEmailPress}>
            <Text style={styles.emailButtonText}>Email Us</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderBottomColor: '#ddd',
    },
    backIcon: {
        width: 20,
        height: 20,
    },
    headerTitle: {
        fontSize: 22,
        color: '#178A80',
        fontFamily: 'Montserrat-SemiBold',
        marginLeft: 16,
    },
  content: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: '#26424D',
    textAlign: 'center',
    marginBottom: 20,
  },
  emailButton: {
    backgroundColor: '#178A80',
    borderRadius: 10,
    paddingVertical: 15,
    width: '100%',
    alignItems: 'center',
  },
  emailButtonText: {
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
    color: '#FFFFFF',
  },
});

export default HelpCentreScreen;
