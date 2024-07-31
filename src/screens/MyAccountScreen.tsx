import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform, StatusBar, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MyAccountScreen = () => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigation = useNavigation();
  const { height } = Dimensions.get('window');

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedName = await AsyncStorage.getItem('name');
        const storedPhoneNumber = await AsyncStorage.getItem('phoneNumber');
        if (storedName) setName(storedName);
        if (storedPhoneNumber) setPhoneNumber(storedPhoneNumber);
      } catch (error) {
        console.error('Failed to load user data:', error);
      }
    };

    loadUserData();
  }, []);

  const handleMenuPress = (item) => {
    if (item === 'Address Book') {
      navigation.navigate('AddressBook', { from: 'MyAccount' });
    } else if (item === 'Terms & Conditions') {
      navigation.navigate('TermsAndConditions');
    } else if (item === 'Help Centre') {
      navigation.navigate('HelpCentre');
    } else if (item === 'About Us') {
      navigation.navigate('AboutUs');
    } else if (item === 'Medicine Orders') {
      navigation.navigate('OrderScreen');
    } else {
      console.log(`${item} pressed`);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image source={require('../assets/images/checkout_screen/back-icon.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Account</Text>
        <View style={styles.profileContainer}>
          <View style={styles.profileIcon}>
            <Text style={styles.profileInitials}>{name.charAt(0).toUpperCase() + name.charAt(1).toUpperCase()}</Text>
          </View>
          <Text style={styles.profileName}>{name}</Text>
          <Text style={styles.profilePhone}>{phoneNumber}</Text>
        </View>
      </View>
      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <View key={index} style={styles.menuItemContainer}>
            <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuPress(item)}>
              <View style={styles.menuItemContent}>
                <Image source={menuIcons[item]} style={styles.menuItemIcon} />
                <Text style={styles.menuItemText}>{item}</Text>
              </View>
              <Image source={require('../assets/images/checkout_screen/right-arrow.png')} style={styles.menuItemArrow} />
            </TouchableOpacity>
            <View style={styles.separator} />
          </View>
        ))}
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>© All Rights Reserved by Dawailivery</Text>
      </View>
    </View>
  );
};

const menuItems = [
  'Medicine Orders',
  'Address Book',
  'Terms & Conditions',
  'Help Centre',
  'About Us',
];

const menuIcons = {
  'Medicine Orders': require('../assets/images/my_account_screen/medicine-orders.png'),
  'Address Book': require('../assets/images/my_account_screen/address-book.png'),
  'Terms & Conditions': require('../assets/images/my_account_screen/terms-conditions.png'),
  'Help Centre': require('../assets/images/my_account_screen/help-centre.png'),
  'About Us': require('../assets/images/my_account_screen/about-us.png'),
};

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, // Adjust for status bar on Android
  },
  headerContainer: {
    backgroundColor: '#178A80',
    height: height * 0.3, // 30% of screen height
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 10,
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: '#FFFFFF',
  },
  headerTitle: {
    position: 'absolute',
    top: 17,
    left: 60,
    fontSize: 22,
    color: '#FFFFFF',
    fontFamily: 'Montserrat-SemiBold',
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: 40, // Space for the header
  },
  profileIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1A998E',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileInitials: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'Montserrat-Bold',
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'Montserrat-Bold',
  },
  profilePhone: {
    fontSize: 16,
    color: '#E6E6E6',
    fontFamily: 'Montserrat-Regular',
  },
  menuContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 20,
  },
  menuItemContainer: {
    paddingHorizontal: 20,
    marginBottom: 10, // Increase gap between options
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemIcon: {
    width: 24,
    height: 24,
    marginRight: 20,
  },
  menuItemText: {
    fontSize: 18,
    fontFamily: 'Montserrat-Regular',
  },
  menuItemArrow: {
    width: 20,
    height: 20,
    tintColor: '#888',
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
  },
  footer: {
    alignItems: 'center',
    padding: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#888',
    fontFamily: 'Montserrat-Regular',
  },
});

export default MyAccountScreen;
