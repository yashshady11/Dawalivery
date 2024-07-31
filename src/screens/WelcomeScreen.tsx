import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, Image, ImageBackground, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import changeNavigationBarColor from 'react-native-navigation-bar-color';

const WelcomeScreen = () => {
  const [location, setLocation] = useState('Rewari');
  const locations = ['Rewari', 'Dharuhera', 'Bhiwadi'];
  const navigation = useNavigation();

  useEffect(() => {
    if (Platform.OS === 'android') {
      changeNavigationBarColor('#F6F7FC', true); // Change the navigation bar color to white
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setLocation(prevLocation => {
        const currentIndex = locations.indexOf(prevLocation);
        const nextIndex = (currentIndex + 1) % locations.length;
        return locations[nextIndex];
      });
    }, 1000); // Change location every second

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" hidden={false} />
      <ImageBackground
        source={require('../assets/images/welcome_screen/wavy_background_image.png')}
        style={styles.backgroundImage}
        imageStyle={styles.imageStyle}
      >
        <View style={styles.header}>
          <Image source={require('../assets/images/welcome_screen/logo.png')} style={styles.logo} />
          <Text style={styles.title}>Dawalivery</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.subtitle}>Medicine</Text>
          <Text style={styles.subtitleBold}>in 30 mins.</Text>
          <View style={styles.line}></View>
          <Text style={styles.location}>{location}</Text>
        </View>
        <Text style={styles.terms2}>By proceeding,</Text>
        <Text style={styles.terms}>I accept Dawalivery T&C & Privacy Policy</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('PhoneNumber')}>
          <Image source={require('../assets/images/welcome_screen/phone-ic.png')} style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Sign In Via Phone Number</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7FC',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  imageStyle: {
    resizeMode: 'cover',
    position: 'absolute',
    top: 0,
    right: 0,
    width: '100%',
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: -10, // Reduce gap between header and text
    marginLeft: 20, // Ensure alignment from the left edge
  },
  logo: {
    width: 60,
    height: 60,
    marginRight: 10,
    marginBottom: 10, // Reduce gap between logo and text
  },
  title: {
    color: '#000',
    fontSize: 34,
    marginLeft: 3, // Reduce gap between logo and text
    marginTop: -9, // Increase gap between logo and text
    fontFamily: 'Montserrat-SemiBold',
  },
  textContainer: {
    alignSelf: 'flex-start',
    marginTop: 1, // Reduce gap between header and textContainer
    marginLeft: 20, // Ensure alignment from the left edge
  },
  subtitle: {
    color: '#000',
    fontSize: 36,
    fontFamily: 'Montserrat-Light', // Change to lighter font
  },
  subtitleBold: {
    color: '#178A80',
    fontSize: 36,
    fontFamily: 'Montserrat-Bold',
  },
  line: {
    width: 30,
    height: 5,
    backgroundColor: '#26424D',
    marginVertical: 10,
  },
  location: {
    color: '#000',
    fontSize: 24,
    fontFamily: 'Montserrat-Regular',
    marginBottom: 30, // Increase gap between location and terms and conditions text
  },
  terms: {
    color: '#888',
    fontSize: 10, // Decrease font size by 2
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Montserrat-Regular',
  },
  terms2: {
    color: '#888',
    fontSize: 10, // Decrease font size by 2
    marginBottom: 5,
    textAlign: 'center',
    fontFamily: 'Montserrat-Regular',
  },
  button: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#178A80',
    width: '90%',
    paddingVertical: 15, // Decrease padding
    paddingHorizontal: 10, // Decrease padding
    borderRadius: 30,
  },
  buttonIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Montserrat-SemiBold',
  },
});

export default WelcomeScreen;