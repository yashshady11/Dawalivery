import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground, StatusBar, Image, Dimensions, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const OtpScreen = () => {
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const otpRefs = useRef([]);
  const navigation = useNavigation();

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== '' && index < otp.length - 1) {
      otpRefs.current[index + 1].focus();
    }

    if (index === otp.length - 1 && value !== '') {
      Keyboard.dismiss();
    }
  };

  const handleKeyPress = (index, key) => {
    if (key === 'Backspace') {
      const newOtp = [...otp];
      if (newOtp[index] !== '') {
        newOtp[index] = ''; // Clear the current box
      } else if (index > 0) {
        otpRefs.current[index - 1].focus(); // Move to the previous input box
        newOtp[index - 1] = ''; // Clear the previous box
      }
      setOtp(newOtp);
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
                <Text style={styles.otpLabel}>One Time Password</Text>
                <Text style={styles.otpDescription}>An OTP has been sent to your phone number</Text>
                <View style={styles.otpContainer}>
                  {otp.map((_, index) => (
                    <TextInput
                      key={index}
                      style={styles.otpInput}
                      keyboardType="numeric"
                      maxLength={1}
                      value={otp[index]}
                      onChangeText={(value) => handleOtpChange(index, value)}
                      onKeyPress={({ nativeEvent }) => handleKeyPress(index, nativeEvent.key)}
                      ref={(input) => (otpRefs.current[index] = input)}
                      placeholderTextColor="#888"
                    />
                  ))}
                </View>
                <TouchableOpacity style={styles.nextButton} onPress={() => navigation.navigate('Name')}>
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
    width: 100,
    height: 100,
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
    fontWeight: 'regular',
    fontFamily: 'Montserrat-Regular',
  },
  logInText: {
    fontSize: 48,
    fontWeight: 'medium',
    color: '#26424D',
    fontFamily: 'Montserrat-Medium',
    marginBottom: 20,
  },
  otpLabel: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6D6D6D',
    fontFamily: 'Montserrat-Bold',
  },
  otpDescription: {
    fontSize: 14,
    color: '#6D6D6D',
    marginBottom: 20,
    fontFamily: 'Montserrat-Regular',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 49,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#B6B6B6',
    textAlign: 'center',
    fontSize: 18,
    color: '#000',
    fontFamily: 'Montserrat-Regular',
  },
  nextButton: {
    backgroundColor: '#000',
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

export default OtpScreen;
