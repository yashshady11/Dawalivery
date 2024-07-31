import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground, StatusBar, Image, Dimensions, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NameScreen = () => {
  const [name, setName] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    if (Platform.OS === 'android') {
      changeNavigationBarColor('#FFFFFF', true); // Change the navigation bar color to white
    }
  }, []);

  const handleNextPress = async () => {
    try {
      await AsyncStorage.setItem('name', name);
      navigation.navigate('WelcomeName', { name });
    } catch (error) {
      console.error('Failed to save name:', error);
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
                <Text style={styles.oneText}>One</Text>
                <Text style={styles.lastThingText}>Last thing</Text>
                <Text style={styles.nameLabel}>Your Name</Text>
                <Text style={styles.nameDescription}>Tell us how we should call you</Text>
                <TextInput
                  style={styles.nameInput}
                  placeholder="Please enter your name"
                  placeholderTextColor="#888"
                  value={name}
                  onChangeText={setName}
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
  oneText: {
    fontSize: 36,
    color: '#26424D',
    fontFamily: 'Montserrat-Regular',
  },
  lastThingText: {
    fontSize: 48,
    color: '#178A80',
    fontFamily: 'Montserrat-Medium',
    marginBottom: 20,
  },
  nameLabel: {
    marginTop: 20,
    fontSize: 24,
    color: '#1A998E',
    fontFamily: 'Montserrat-Bold',
  },
  nameDescription: {
    fontSize: 14,
    color: '#6D6D6D',
    marginBottom: 20,
    fontFamily: 'Montserrat-Regular',
  },
  nameInput: {
    fontSize: 16,
    padding: 10,
    borderBottomWidth: 0.8,
    borderBottomColor: '#000',
    marginBottom: 50,
    color: '#000',
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

export default NameScreen;
