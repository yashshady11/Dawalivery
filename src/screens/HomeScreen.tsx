import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, StatusBar, FlatList, Platform, PermissionsAndroid } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import { RFPercentage } from 'react-native-responsive-fontsize';

const { width, height } = Dimensions.get('window');

const services = [
  { id: '1', title: 'Medicine', description: 'Order Medicines from 12 Stores near you.', icon: require('../assets/images/home_screen/medicine-icon.png'), bgColor: '#EAE6FA' },
  { id: '2', title: 'Lab Test', description: 'Book Blood Test, LFT, Urine culture and more.', icon: require('../assets/images/home_screen/lab-test-icon.png'), bgColor: '#FFF2E5' },
  { id: '3', title: 'Radio Test', description: 'Book Ultrasound, MRI, X-Ray and more.', icon: require('../assets/images/home_screen/radio-test-icon.png'), bgColor: '#EBFDF2' },
  { id: '4', title: 'Doctor', description: 'Look for doctors near you.', icon: require('../assets/images/home_screen/doctor-icon.png'), bgColor: '#F0FDF6' },
];

const promoBanners = [
  { id: '1', text: 'FREE', subText: 'Get free delivery on order above Rs.199' },
  { id: '2', text: '15OFF', subText: 'Get 15% off on all eligible medicines' },
  { id: '3', text: '5OFF', subText: 'Get 5% off on all cosmetic products' },
  // Add more banners as needed
];

const HomeScreen = () => {
  const [location, setLocation] = useState('Fetching location...');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeRoute, setActiveRoute] = useState('Home');
  const navigation = useNavigation();
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
            console.log('Latitude:', latitude, 'Longitude:', longitude); // Debug log
      
            // Retry fetching location data if it fails
            const fetchLocationData = async (retryCount = 5) => {
              for (let i = 0; i < retryCount; i++) {
                try {
                  const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
                  console.log(response.data.display_name); // Debug log
                  if (response.data && response.data.display_name) {
                    console.log(response.data.display_name); // Debug log
                    const address = response.data.display_name;
                    setLocation(address);
                    return;
                  } else {
                    console.log('No results found for the provided coordinates'); // Debug log
                  }
                } catch (error) {
                  console.error('Error fetching location:', error); // Debug log
                }
                // Wait for a second before retrying
                await new Promise(resolve => setTimeout(resolve, 1000));
              }
              setLocation('Unable to fetch location');
            };
      
            fetchLocationData();
          },
          (error) => {
            setLocation('Location access denied');
            console.error('Error accessing location:', error); // Debug log
          },
          { enableHighAccuracy: true, timeout: 30000, maximumAge: 10000 }, // Increase timeout to 30 seconds
        );
      };
    requestLocationPermission();
  }, []);

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
          navigation.navigate('PharmacyList', { location }); // Pass location data to PharmacyListScreen
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
      <StatusBar hidden={false} backgroundColor={'#1B2E39'} />
      <View style={styles.header}>
        <View style={styles.locationContainer}>
          <Image source={require('../assets/images/home_screen/location-icon.png')} style={styles.locationIcon} />
          <View style={styles.locationTextContainer}>
            <Text style={styles.deliveringAtText}>Delivering at -</Text>
            <Text style={styles.locationText}>{location}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.profileIconContainer}>
          <Image source={require('../assets/images/home_screen/profile-icon-black.png')} style={styles.profileIcon} />
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
          snapToInterval={width * 0.9} // Make sure the interval matches the width of the promo banner
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
            <Image source={require('../assets/images/home_screen/home-icon.png')} style={styles.navIcon} />
          </View>
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => { setActiveRoute('OrderBasket'); navigation.navigate('OrderBasket'); }}>
          <View style={[styles.navIconContainer, activeRoute === 'OrderBasket' && styles.activeNavButton]}>
            <Image source={require('../assets/images/home_screen/cart-icon.png')} style={styles.navIcon} />
          </View>
          <Text style={styles.navText}>Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => { setActiveRoute('Profile'); navigation.navigate('Profile'); }}>
          <View style={[styles.navIconContainer, activeRoute === 'Profile' && styles.activeNavButton]}>
            <Image source={require('../assets/images/home_screen/profile-icon.png')} style={styles.navIcon} />
          </View>
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B2E39',
  },
  header: {
    backgroundColor: '#1B2E39',
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
    maxWidth: width - 130, // Adjust the max width to prevent overlap with the profile icon
  },
  locationIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain', // Ensure the image is fully visible
    marginVertical: 5, // Add vertical margin to ensure it's not cut off
  },
  locationText: {
    fontSize: 14,
    color: '#fff',
    fontFamily: 'Montserrat-Regular',
    marginTop: 5,
  },
  profileIconContainer: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#FFF',
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
    width: 80,
    height: 80,
  },
  logoText: {
    fontSize: RFPercentage(3),
    color: '#1B2E39',
    fontFamily: 'Montserrat-Bold',
  },
  subtitleText: {
    fontSize: RFPercentage(2),
    color: '#A8B6C1',
    fontFamily: 'Montserrat-Regular',
  },
  promoBanner: {
    backgroundColor: '#4AA366',
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    height: 100,
    width: width * 0.9, // Adjust the banner width to match the screen width with padding
    marginHorizontal: (width * 0.1) / 2, // Ensure proper centering
    flexDirection: 'row',
    alignItems: 'center',
  },
  promoText: {
    fontSize: RFPercentage(3.5), // Responsive font size
    color: '#fff',
    fontFamily: 'Montserrat-Bold',
    flex: 1.5,
  },
  promoSubText: {
    fontSize: RFPercentage(2), // Responsive font size
    color: '#fff',
    fontFamily: 'Montserrat-Medium',
    marginLeft: 10,
    flex: 3,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: height * 0.01, // Dynamic margin based on screen height
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
    fontSize: RFPercentage(2),
    color: '#A8B6C1',
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
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'flex-start',
    paddingHorizontal: 10,
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
    fontSize: RFPercentage(1.8),
    color: '#A8B6C1',
    fontFamily: 'Montserrat-Regular',
    textAlign: 'left',
  },
  bottomNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#1B2E39',
    paddingVertical: 10,
    marginHorizontal: 40, // Decreased width by increasing margins
    borderRadius: 40,
    position: 'absolute',
    bottom: 10,
    left: 20,
    right: 20,
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
  navText: {
    fontSize: RFPercentage(1.8),
    color: '#fff',
    fontFamily: 'Montserrat-Regular',
    marginTop: 5,
  },
  activeNavButton: {
    backgroundColor: 'rgba(217, 217, 217, 0.3)',
    borderRadius: 25, // Ensures the background is a circle
  },
  activeDot: {
    position: 'absolute',
    bottom: -10,
    left: '50%',
    transform: [{ translateX: -4 }],
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  carouselContent: {
    paddingHorizontal: 0,
  },
});

export default HomeScreen;
