import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground, StatusBar, Image, Dimensions, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PhoneNumberScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('+91-');
  const navigation = useNavigation();

  useEffect(() => {
    if (Platform.OS === 'android') {
      changeNavigationBarColor('#FFFFFF', true); // Change the navigation bar color to white
    }
  }, []);

  const handlePhoneNumberChange = (input) => {
    let cleanedInput = input.replace(/\D/g, '').replace(/^91/, '');
    cleanedInput = cleanedInput.slice(0, 10);
    const formattedInput = '+91-' + cleanedInput;
    setPhoneNumber(formattedInput);
    if (cleanedInput.length === 10) {
      Keyboard.dismiss();
    }
  };

  const handleNextPress = async () => {
    try {
      await AsyncStorage.setItem('phoneNumber', phoneNumber);
      navigation.navigate('Otp');
    } catch (error) {
      console.error('Failed to save phone number:', error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <StatusBar translucent backgroundColor="transparent" hidden={false} />
        <ImageBackground
          source={require('../assets/images/welcome_screen/wavy_background_image.png')}
          style={styles.backgroundImage}
          imageStyle={styles.imageStyle}
        >
          <KeyboardAvoidingView style={styles.keyboardAvoidingView} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} enabled>
            <View style={styles.logoContainer}>
              <Image source={require('../assets/images/welcome_screen/logo.png')} style={styles.logo} />
            </View>
            <KeyboardAwareScrollView contentContainerStyle={styles.contentContainer} extraHeight={150}>
              <View style={styles.content}>
                <Text style={styles.letsText}>Let's</Text>
                <Text style={styles.logInText}>Log you in</Text>
                <Text style={styles.phoneNumberLabel}>Phone Number</Text>
                <Text style={styles.phoneNumberDescription}>Please enter your phone number</Text>
                <TextInput
                  style={styles.phoneNumberInput}
                  placeholder="Please enter your phone number"
                  placeholderTextColor="#888"
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={handlePhoneNumberChange}
                />
                <TouchableOpacity style={styles.nextButton} onPress={handleNextPress}>
                  <Image source={require('../assets/images/welcome_screen/next-button-ic.png')} style={styles.nextButtonIcon} />
                </TouchableOpacity>
                <Text style={styles.footerText}>© All Rights Reserved by Dawalivery</Text>
              </View>
            </KeyboardAwareScrollView>
          </KeyboardAvoidingView>
        </ImageBackground>
        <SafeAreaView style={styles.bottomBar} />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  imageStyle: {
    resizeMode: 'cover',
    position: 'absolute',
    top: 0,
    right: 0,
    width: '100%',
    height: '100%',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  logoContainer: {
    position: 'absolute',
    top: Dimensions.get('window').height * 0.05,
    left: 20,
  },
  logo: {
    width: 60,
    height: 60,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  content: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    elevation: 10,
    shadowOpacity: 0.05,
    shadowColor: '#000',
    shadowOffset: { width: 90, height: 10 },
    padding: 20,
    flex: 1,
    marginTop: Dimensions.get('window').height * 0.3,
    paddingTop: Dimensions.get('window').height * 0.1,
    justifyContent: 'flex-start',
  },
  letsText: {
    fontSize: 36,
    color: '#26424D',
    fontFamily: 'Montserrat-Regular',
  },
  logInText: {
    fontSize: 48,
    color: '#178A80',
    fontFamily: 'Montserrat-Medium',
    marginBottom: 20,
  },
  phoneNumberLabel: {
    marginTop: 20,
    fontSize: 24,
    color: '#1A998E',
    fontFamily: 'Montserrat-Bold',
  },
  phoneNumberDescription: {
    fontSize: 14,
    color: '#6D6D6D',
    marginBottom: 20,
    fontFamily: 'Montserrat-Regular',
  },
  phoneNumberInput: {
    fontSize: 16,
    padding: 10,
    borderBottomWidth: 0.8,
    borderBottomColor: '#000',
    marginBottom: 50,
    color: '#178A80',
    fontFamily: 'Montserrat-Regular',
  },
  nextButton: {
    backgroundColor: '#178A80',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  nextButtonIcon: {
    width: 24,
    height: 24,
    tintColor: '#FFF',
  },
  footerText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 12,
    color: '#888',
    marginBottom: 10,
    fontFamily: 'Montserrat-Regular',
  },
  bottomBar: {
    backgroundColor: '#fff',
  },
});

export default PhoneNumberScreen;
