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
import CouponScreen from '../screens/CouponScreen';
import PaymentMethodScreen from '../screens/PaymentMethodScreen';
import MyAccountScreen from '../screens/MyAccountScreen';
import AddressBookScreen from '../screens/AddressBookScreen';
import AddNewAddressScreen from '../screens/AddNewAddressScreen';
import TermsAndConditionsScreen from '../screens/TermsAndConditionsScreen';
import HelpCentreScreen from '../screens/HelpCentreScreen';
import AboutUsScreen from '../screens/AboutUsScreen';
import OrderScreen from '../screens/OrderScreen';
import BillDetailsScreen from '../screens/BillDetailsScreen';

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
        <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ headerShown: false }} />
        <Stack.Screen name="OrderPlaced" component={OrderPlacedScreen} />
        <Stack.Screen name="CouponScreen" component={CouponScreen} options={{ headerShown: false }} />
        <Stack.Screen name="PaymentMethodScreen" component={PaymentMethodScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MyAccount" component={MyAccountScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AddressBook" component={AddressBookScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AddNewAddress" component={AddNewAddressScreen} options={{ headerShown: false }} />
        <Stack.Screen name="TermsAndConditions" component={TermsAndConditionsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="HelpCentre" component={HelpCentreScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AboutUs" component={AboutUsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="OrderScreen" component={OrderScreen} options={{ headerShown: false }} />
        <Stack.Screen name="BillDetailsScreen" component={BillDetailsScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
