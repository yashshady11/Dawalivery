import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, SafeAreaView, ImageBackground, StatusBar } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const WelcomeNameScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { name } = route.params;

  // Function to capitalize the first letter of each word
  const capitalizeName = (name) => {
    return name.replace(/\b\w/g, char => char.toUpperCase());
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Home'); // Navigate to the Home screen after 3 seconds
    }, 3000);

    return () => clearTimeout(timer); // Clear the timer if the component is unmounted
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" hidden={false} />
      <ImageBackground
        source={require('../assets/images/welcome_screen/wavy_background_image.png')} // Your background image
        style={styles.backgroundImage}
        imageStyle={styles.imageStyle}
      >
        <View style={styles.content}>
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>Welcome</Text>
            <ActivityIndicator size="small" color="#26424D" style={styles.loader} />
          </View>
          <Text style={styles.nameText}>{capitalizeName(name)}</Text>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#26424D',
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    color: '#26424D',
    fontFamily: 'Montserrat-Regular',
  },
  loader: {
    marginLeft: 5,
  },
  nameText: {
    fontSize: 48,
    color: '#26424D',
    fontFamily: 'Montserrat-Bold',
    marginTop: 10,
  },
});

export default WelcomeNameScreen;
