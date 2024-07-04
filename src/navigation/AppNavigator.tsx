import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WelcomeScreen from '../screens/WelcomeScreen';
import PhoneNumberScreen from '../screens/PhoneNumberScreen';
import OtpScreen from '../screens/OtpScreen';
import NameScreen from '../screens/NameScreen';
import WelcomeNameScreen from '../screens/WelcomeNameScreen';
import PharmacyListScreen from '../screens/PharmacyListScreen';  
import HomeScreen from '../screens/HomeScreen';  
import PharmacyShopScreen from '../screens/PharmacyShopScreen';
import CheckoutScreen from '../screens/CheckoutScreen'; 
import OrderPlacedScreen from '../screens/OrderPlacedScreen';

const Stack = createStackNavigator();

const forFade = ({ current, closing }) => ({
  cardStyle: {
    opacity: current.progress,
  },
});

const AppNavigator = () => {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkLoginState = async () => {
      const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
      if (isLoggedIn) {
        setInitialRoute('Home');
      } else {
        setInitialRoute('Welcome');
      }
    };
    checkLoginState();
  }, []);

  if (initialRoute === null) {
    return null; // Or a loading indicator
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          cardStyleInterpolator: forFade,
          transitionSpec: {
            open: { animation: 'timing', config: { duration: 300 } },
            close: { animation: 'timing', config: { duration: 300 } },
          },
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="PhoneNumber" component={PhoneNumberScreen} />
        <Stack.Screen name="Otp" component={OtpScreen} />
        <Stack.Screen name="Name" component={NameScreen} />
        <Stack.Screen name="WelcomeName" component={WelcomeNameScreen} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ gestureEnabled: false }} />
        <Stack.Screen name="PharmacyList" component={PharmacyListScreen} />
        <Stack.Screen name="PharmacyShopScreen" component={PharmacyShopScreen} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} />
        <Stack.Screen name="OrderPlaced" component={OrderPlacedScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
