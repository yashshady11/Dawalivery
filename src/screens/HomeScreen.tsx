import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, StatusBar, FlatList, Platform, PermissionsAndroid } from 'react-native';
import { useNavigation, useIsFocused, useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import { RFPercentage } from 'react-native-responsive-fontsize';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const services = [
  { id: '1', title: 'Medicine', description: 'Order Medicines from 12 Stores near you.', icon: require('../assets/images/home_screen/medicine-icon.png'), bgColor: '#FFFFFF' },
  { id: '2', title: 'Lab Test', description: 'Book Blood Test, LFT, Urine culture and more.', icon: require('../assets/images/home_screen/lab-test-icon.png'), bgColor: '#FFFFFF' },
  { id: '3', title: 'Radio Test', description: 'Book Ultrasound, MRI, X-Ray and more.', icon: require('../assets/images/home_screen/radio-test-icon.png'), bgColor: '#FFFFFF' },
  { id: '4', title: 'Doctor', description: 'Look for doctors near you.', icon: require('../assets/images/home_screen/doctor-icon.png'), bgColor: '#FFFFFF' },
];

const promoBanners = [
  { id: '1', text: 'FREE', subText: 'Get free delivery on order above Rs.199' },
  { id: '2', text: '15OFF', subText: 'Get 15% off on all eligible medicines' },
  { id: '3', text: '5OFF', subText: 'Get 5% off on all cosmetic products' },
];

const HomeScreen = () => {
  const [location, setLocation] = useState('Fetching location...');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeRoute, setActiveRoute] = useState('Home');
  const [orderCount, setOrderCount] = useState(0); // State to track order count
  const [cartItems, setCartItems] = useState([]); // State to track cart items
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const carouselRef = useRef(null);

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Permission',
              message: 'This app needs access to your location to show nearby pharmacies.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            getLocation();
          } else {
            setLocation('Location permission denied');
          }
        } catch (err) {
          console.warn(err);
        }
      } else {
        getLocation();
      }
    };

    const preventGoingBack = navigation.addListener('beforeRemove', (e) => {
      if (activeRoute === 'Home') {
        e.preventDefault();
      }
    });

    const getLocation = () => {
      Geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          const fetchLocationData = async (retryCount = 5) => {
            for (let i = 0; i < retryCount; i++) {
              try {
                const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
                if (response.data && response.data.display_name) {
                  const address = response.data.display_name;
                  setLocation(address);
                  return;
                }
              } catch (error) {
                console.error('Error fetching location:', error);
              }
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
            setLocation('Unable to fetch location');
          };

          fetchLocationData();
        },
        (error) => {
          setLocation('Location access denied');
          console.error('Error accessing location:', error);
        },
        { enableHighAccuracy: true, timeout: 30000, maximumAge: 10000 },
      );
    };

    requestLocationPermission();

    if (isFocused) {
      setActiveRoute('Home');
    }

    const fetchOrders = async () => {
      try {
        const orders = await AsyncStorage.getItem('orders');
        if (orders) {
          const ordersArray = JSON.parse(orders);
          setOrderCount(ordersArray.length);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    const fetchCartItems = async () => {
      try {
        const items = await AsyncStorage.getItem('cartItems');
        if (items) {
          setCartItems(JSON.parse(items));
        }
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    fetchOrders();
    fetchCartItems();
  }, [isFocused]);

  useFocusEffect(
    useCallback(() => {
      const clearCartOnOrderPlaced = async () => {
        const orderPlaced = await AsyncStorage.getItem('orderPlaced');
        if (orderPlaced === 'true') {
          // Get all pharmacy IDs
          const pharmacies = await AsyncStorage.getItem('pharmacies');
          console.log('Pharmacies:', pharmacies)
          if (pharmacies) {
            const pharmacyIds = JSON.parse(pharmacies);
            // Clear selected items for each pharmacy
            console.log('PharmacyIds:', pharmacyIds)
            for (const pharmacyId of pharmacyIds) {
              console.log(`Clearing selected items for pharmacy ${pharmacyId}`)
              await AsyncStorage.removeItem(`selectedItems_${pharmacyId}`);
            }
          }
          await AsyncStorage.removeItem('cartItems');
          await AsyncStorage.removeItem('checkoutData');
          await AsyncStorage.removeItem('orderPlaced');
          setCartItems([]);
          console.log('Cart, checkout data, and selected items for all pharmacies cleared');
        }
      };

      if (isFocused) {
        clearCartOnOrderPlaced();
      }
    }, [isFocused])
  );

  const renderPromoBanner = ({ item }) => (
    <View style={styles.promoBanner}>
      <Text style={styles.promoText}>{item.text}</Text>
      <Text style={styles.promoSubText}>{item.subText}</Text>
    </View>
  );

  const renderServiceItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.serviceItem, { backgroundColor: item.bgColor }]}
      onPress={() => {
        if (item.title === 'Medicine') {
          navigation.navigate('PharmacyList', { location });
          setActiveRoute('PharmacyList');
        } else {
          // Handle other service item navigation here
        }
      }}
    >
      <Image source={item.icon} style={styles.serviceIcon} />
      <View style={styles.serviceTextContainer}>
        <Text style={styles.serviceTitle}>{item.title}</Text>
        <Text style={styles.serviceDescription}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  const handleScroll = event => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden={false} backgroundColor={'#178A80'} />
      <View style={styles.header}>
        <View style={styles.locationContainer}>
          <Image source={require('../assets/images/home_screen/location-icon.png')} style={styles.locationIcon} />
          <View style={styles.locationTextContainer}>
            <Text style={styles.deliveringAtText}>Delivering at -</Text>
            <Text style={styles.locationText}>{location}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.profileIconContainer} onPress={() => navigation.navigate('MyAccount')}>
          <Image
            source={require('../assets/images/home_screen/profile-icon-black.png')}
            style={styles.profileIcon}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.mainContainer}>
        <View style={styles.logoContainer}>
          <Image source={require('../assets/images/welcome_screen/logo.png')} style={styles.logo} />
          <View>
            <Text style={styles.logoText}>Dawalivery</Text>
            <Text style={styles.subtitleText}>Book Test, Medicine Delivery</Text>
          </View>
        </View>
        <FlatList
          data={promoBanners}
          renderItem={renderPromoBanner}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          snapToAlignment="center"
          decelerationRate="fast"
          snapToInterval={width}
          contentContainerStyle={styles.carouselContent}
          ref={carouselRef}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        />
        <View style={styles.indicatorContainer}>
          {promoBanners.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                index === currentIndex ? styles.activeIndicator : styles.inactiveIndicator,
              ]}
            />
          ))}
        </View>
        <View style={styles.servicesContainer}>
          <Text style={styles.servicesTitle}>Services</Text>
          <Text style={styles.servicesSubtitle}>Order Medicine, Book Lab Test and Radio Test</Text>
        </View>
        <FlatList
          data={services}
          renderItem={renderServiceItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.serviceList}
          contentContainerStyle={styles.serviceListContainer}
        />
      </View>
      <View style={styles.bottomNavigation}>
        <TouchableOpacity style={styles.navButton} onPress={() => { setActiveRoute('Home'); navigation.navigate('Home'); }}>
          <View style={[styles.navIconContainer, activeRoute === 'Home' && styles.activeNavButton]}>
            <Image source={require('../assets/images/home_screen/home-icon.png')} style={[styles.navIcon, activeRoute === 'Home' && styles.activeNavIcon]} />
          </View>
          <Text style={[styles.navText, activeRoute === 'Home' && styles.activeNavText]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => { setActiveRoute('PharmacyList'); navigation.navigate('PharmacyList', { location });
 }}>
          <View style={[styles.navIconContainer, activeRoute === 'PharmacyList' && styles.activeNavButton]}>
            <Image source={require('../assets/images/home_screen/only-medicine.png')} style={[styles.navIcon, activeRoute === 'PharmacyList' && styles.activeNavIcon]} />
          </View>
          <Text style={[styles.navText, activeRoute === 'PharmacyList' && styles.activeNavText]}>Get Medicine</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => { setActiveRoute('Checkout'); navigation.navigate('Checkout', { selectedItems: cartItems, onUpdateItems: setCartItems }); }}>
          <View style={[styles.navIconContainer, activeRoute === 'Checkout' && styles.activeNavButton]}>
            <Image source={require('../assets/images/home_screen/cart-icon.png')} style={[styles.navIcon, activeRoute === 'Checkout' && styles.activeNavIcon]} />
          </View>
          <Text style={[styles.navText, activeRoute === 'Checkout' && styles.activeNavText]}>Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => { setActiveRoute('OrderScreen'); navigation.navigate('OrderScreen'); }}>
          <View style={[styles.navIconContainer, activeRoute === 'OrderScreen' && styles.activeNavButton]}>
            <Image source={require('../assets/images/home_screen/orders-icon.png')} style={[styles.navIcon, activeRoute === 'OrderScreen' && styles.activeNavIcon]} />
            {orderCount > 0 && ( // Show badge if there are orders
              <View style={styles.redDot} />
            )}
          </View>
          <Text style={[styles.navText, activeRoute === 'OrderScreen' && styles.activeNavText]}>My Orders</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#178A80',
  },
  header: {
    backgroundColor: '#178A80',
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveringAtText: {
    fontSize: 12,
    color: '#fff',
    fontFamily: 'Montserrat-SemiBold',
  },
  locationTextContainer: {
    marginLeft: 5,
    maxWidth: width - 130,
  },
  locationIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginVertical: 5,
  },
  locationText: {
    fontSize: 14,
    color: '#fff',
    fontFamily: 'Montserrat-Regular',
    marginTop: 5,
  },
  profileIconContainer: {
    padding: 10,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
  },
  profileIcon: {
    width: 24,
    height: 24,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  logo: {
    marginRight: 20,
    width: 60,
    height: 60,
  },
  logoText: {
    fontSize: RFPercentage(3),
    color: '#1B2E39',
    fontFamily: 'Montserrat-Bold',
  },
  subtitleText: {
    fontSize: RFPercentage(2),
    color: '#3B3B3B',
    fontFamily: 'Montserrat-Regular',
  },
  promoBanner: {
    backgroundColor: '#4AA366',
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    height: 100,
    width: width * 0.9,
    marginHorizontal: (width * 0.1) / 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  promoText: {
    fontSize: RFPercentage(3.5),
    color: '#fff',
    fontFamily: 'Montserrat-Bold',
    flex: 1.5,
  },
  promoSubText: {
    fontSize: RFPercentage(2),
    color: '#fff',
    fontFamily: 'Montserrat-Medium',
    marginLeft: 10,
    flex: 3,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: height * 0.01,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#1B2E39',
  },
  inactiveIndicator: {
    backgroundColor: '#888',
  },
  servicesContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  servicesTitle: {
    fontSize: RFPercentage(3),
    color: '#1B2E39',
    fontFamily: 'Montserrat-Bold',
    marginBottom: 5,
  },
  servicesSubtitle: {
    fontSize: RFPercentage(1.6),
    color: '#3B3B3B',
    fontFamily: 'Montserrat-Regular',
    marginBottom: 20,
  },
  serviceListContainer: {
    paddingHorizontal: 20,
  },
  serviceList: {
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  serviceItem: {
    width: (width / 2) - 30,
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    alignItems: 'flex-start',
    paddingHorizontal: 10,
    borderColor: '#E9E9E9',
    borderWidth: 1,
  },
  serviceIcon: {
    width: 40,
    height: 40,
    marginBottom: 10,
  },
  serviceTextContainer: {
    alignItems: 'flex-start',
  },
  serviceTitle: {
    fontSize: RFPercentage(2.2),
    color: '#1B2E39',
    fontFamily: 'Montserrat-Bold',
    marginBottom: 5,
  },
  serviceDescription: {
    fontSize: RFPercentage(1.4),
    color: '#3B3B3B',
    fontFamily: 'Montserrat-Regular',
    textAlign: 'left',
  },
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
    tintColor: '#1B2E39', // Active icon color
  },
  navText: {
    fontSize: RFPercentage(1.8),
    color: '#000000',
    fontFamily: 'Montserrat-Regular',
    marginTop: 5,
  },
  activeNavText: {
    color: '#1B2E39', // Active text color
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

export default HomeScreen;
