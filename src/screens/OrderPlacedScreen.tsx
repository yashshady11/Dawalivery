import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const OrderPlacedScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    // Assuming the GIF duration is 3 seconds
    const timer = setTimeout(() => {
      navigation.navigate('Home'); // Navigate to the home screen after the GIF ends
    }, 7000); // Duration of the GIF in milliseconds

    return () => clearTimeout(timer); // Cleanup the timer
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.gifContainer}>
        <FastImage
          source={require('../assets/images/order_placed_screen/order-placed.gif')}
          style={styles.gif}
          resizeMode={FastImage.resizeMode.contain}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  gifContainer: {
    width: 450,
    height: 450,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gif: {
    width: '100%',
    height: '100%',
  },
});

export default OrderPlacedScreen;
