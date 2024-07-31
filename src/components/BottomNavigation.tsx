import React from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RFPercentage } from 'react-native-responsive-fontsize';

const BottomNavigation = ({ activeRoute, setActiveRoute, orderCount }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.bottomNavigation}>
      <TouchableOpacity style={styles.navButton} onPress={() => { setActiveRoute('Home'); navigation.navigate('Home'); }}>
        <View style={[styles.navIconContainer, activeRoute === 'Home' && styles.activeNavButton]}>
          <Image source={require('../assets/images/home_screen/home-icon.png')} style={[styles.navIcon, activeRoute === 'Home' && styles.activeNavIcon]} />
        </View>
        <Text style={[styles.navText, activeRoute === 'Home' && styles.activeNavText]}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navButton} onPress={() => { setActiveRoute('PharmacyList'); navigation.navigate('PharmacyList'); }}>
        <View style={[styles.navIconContainer, activeRoute === 'PharmacyList' && styles.activeNavButton]}>
          <Image source={require('../assets/images/home_screen/only-medicine.png')} style={[styles.navIcon, activeRoute === 'PharmacyList' && styles.activeNavIcon]} />
        </View>
        <Text style={[styles.navText, activeRoute === 'PharmacyList' && styles.activeNavText]}>Get Medicine</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navButton} onPress={() => { setActiveRoute('Checkout'); navigation.navigate('Checkout'); }}>
        <View style={[styles.navIconContainer, activeRoute === 'Checkout' && styles.activeNavButton]}>
          <Image source={require('../assets/images/home_screen/cart-icon.png')} style={[styles.navIcon, activeRoute === 'Checkout' && styles.activeNavIcon]} />
        </View>
        <Text style={[styles.navText, activeRoute === 'Checkout' && styles.activeNavText]}>Cart</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navButton} onPress={() => { setActiveRoute('OrderScreen'); navigation.navigate('OrderScreen'); }}>
        <View style={[styles.navIconContainer, activeRoute === 'OrderScreen' && styles.activeNavButton]}>
          <Image source={require('../assets/images/home_screen/orders-icon.png')} style={[styles.navIcon, activeRoute === 'OrderScreen' && styles.activeNavIcon]} />
          {orderCount > 0 && (
            <View style={styles.redDot} />
          )}
        </View>
        <Text style={[styles.navText, activeRoute === 'OrderScreen' && styles.activeNavText]}>My Orders</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  navIconContainer: {
    padding: 10,
    borderRadius: 25,
  },
  navIcon: {
    width: 24,
    height: 24,
  },
  activeNavIcon: {
    tintColor: '#178A80', // Active icon color
  },
  navText: {
    fontSize: RFPercentage(1.8),
    color: '#26424D',
    fontFamily: 'Montserrat-Regular',
    marginTop: 5,
  },
  activeNavText: {
    color: '#178A80', // Active text color
  },
  activeNavButton: {
    backgroundColor: 'rgba(200, 200, 200, 0.5)', // Light grey background for the active button
  },
  redDot: {
    position: 'absolute',
    top: -3,
    right: -3,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'red',
  },
});

export default BottomNavigation;
