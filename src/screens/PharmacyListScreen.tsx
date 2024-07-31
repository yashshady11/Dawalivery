import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Dimensions, StatusBar } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { RFPercentage } from 'react-native-responsive-fontsize';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const pharmacies = [
  {
    id: '1',
    name: 'DS Medi World',
    distance: '500M from you',
    address: 'Shop No. 22, Model Town, Rewari',
    image: require('../assets/images/home_screen/pharmacy-icon.png'),
    phone: '1234567890',
    location: 'https://maps.google.com/?q=28.704060,77.102493',
    medicines: [
      { id: '101', name: 'Acetaminophen', price: 128.5, count: 0 },
      { id: '102', name: 'Adderall', price: 150, count: 0 },
      { id: '103', name: 'Alprazolam', price: 100, count: 0 },
      { id: '104', name: 'Ambien', price: 200, count: 0 },
      { id: '105', name: 'Amoxicillin', price: 250, count: 0 },
      { id: '106', name: 'Ativan', price: 300, count: 0 },
      { id: '107', name: 'Azithromycin', price: 350, count: 0 },
      { id: '108', name: 'Ciprofloxacin', price: 400, count: 0 },
      { id: '109', name: 'Clindamycin', price: 450, count: 0 },
      { id: '110', name: 'Codeine', price: 500, count: 0 },
      { id: '111', name: 'Cymbalta', price: 550, count: 0 },
      { id: '112', name: 'Doxycycline', price: 600, count: 0 },
      { id: '113', name: 'Gabapentin', price: 650, count: 0 },
      { id: '114', name: 'Hydrocodone', price: 700, count: 0 },
      { id: '115', name: 'Ibuprofen', price: 750, count: 0 },
      { id: '116', name: 'Lexapro', price: 800, count: 0 },
      { id: '117', name: 'Lisinopril', price: 850, count: 0 },
      { id: '118', name: 'Loratadine', price: 900, count: 0 },
      { id: '119', name: 'Losartan', price: 950, count: 0 },
      { id: '120', name: 'Meloxicam', price: 1000, count: 0 },
      { id: '121', name: 'Metformin', price: 1050, count: 0 },
      { id: '122', name: 'Metoprolol', price: 1100, count: 0 },
      { id: '123', name: 'Naproxen', price: 1150, count: 0 },
      { id: '124', name: 'Omeprazole', price: 1200, count: 0 },
      { id: '125', name: 'Oxycodone', price: 1250, count: 0 },
      { id: '126', name: 'Pantoprazole', price: 1300, count: 0 },
      { id: '127', name: 'Prednisone', price: 1350, count: 0 },
      { id: '128', name: 'Propranolol', price: 1400, count: 0 },
      { id: '129', name: 'Sertraline', price: 1450, count: 0 },
      { id: '130', name: 'Simvastatin', price: 1500, count: 0 },
      { id: '131', name: 'Tramadol', price: 1550, count: 0 },
      { id: '132', name: 'Trazodone', price: 1600, count: 0 },
      { id: '133', name: 'awedcse', price: 1650, count: 0 },
      { id: '134', name: 'Zolpidem', price: 1700, count: 0 },
      { id: '135', name: 'Zyrtec', price: 1750, count: 0 },
      { id: '136', name: 'Zoloft', price: 1800, count: 0 },
      { id: '137', name: 'Zantac', price: 1850, count: 0 },
      { id: '138', name: 'Xanax', price: 1900, count: 0 },
      { id: '139', name: 'Wellbutrin', price: 1950, count: 0 },
      { id: '140', name: 'Vicodin', price: 2000, count: 0 },
      { id: '141', name: 'Valium', price: 2050, count: 0 },
      { id: '142', name: 'Tramadol', price: 2100, count: 0 },
      { id: '143', name: 'Trazodone', price: 2150, count: 0 },
      { id: '144', name: 'Viagra', price: 2200, count: 0 },
      { id: '145', name: 'Zolpidem', price: 2250, count: 0 },
      { id: '146', name: 'Zyrtec', price: 2300, count: 0 },
      { id: '147', name: 'Zoloft', price: 2350, count: 0 },
      { id: '148', name: 'Zantac', price: 2400, count: 0 },
      { id: '149', name: 'Xanax', price: 2450, count: 0 },
      { id: '150', name: 'Wellbutrin', price: 2500, count: 0 },
      { id: '151', name: 'Vicodin', price: 2550, count: 0 },
      { id: '152', name: 'Valium', price: 2600, count: 0 },
      { id: '153', name: 'Tramadol', price: 2650, count: 0 },
      { id: '154', name: 'Trazodone', price: 2700, count: 0 },
      { id: '155', name: 'Viagra', price: 2750, count: 0 },
      { id: '156', name: 'Zolpidem', price: 2800, count: 0 },
      { id: '157', name: 'Zyrtec', price: 2850, count: 0 },
      { id: '158', name: 'Zoloft', price: 2900, count: 0 },
      { id: '159', name: 'Zantac', price: 2950, count: 0 },
      { id: '160', name: 'Xanax', price: 3000, count: 0 },
      { id: '161', name: 'Wellbutrin', price: 3050, count: 0 },
      { id: '162', name: 'Vicodin', price: 3100, count: 0 },
      { id: '163', name: 'Valium', price: 3150, count: 0 },
      { id: '164', name: 'Tramadol', price: 3200, count: 0 },
      { id: '165', name: 'Trazodone', price: 3250, count: 0 },
      { id: '166', name: 'Viagra', price: 3300, count: 0 },
      { id: '167', name: 'Zolpidem', price: 3350, count: 0 },
      { id: '168', name: 'Zyrtec', price: 3400, count: 0 },
      { id: '169', name: 'Zoloft', price: 3450, count: 0 },
      { id: '170', name: 'Zantac', price: 3500, count: 0 },
      { id: '171', name: 'Xanax', price: 3550, count: 0 },

    ],
  },
  {
    id: '2',
    name: 'DS Medi World',
    distance: '500M from you',
    address: 'Shop No. 22, Model Town, Rewari',
    image: require('../assets/images/home_screen/pharmacy-icon.png'),
    phone: '1234567890',
    location: 'https://maps.google.com/?q=28.704060,77.102493',
    medicines: [
      { id: '11', name: 'Cipla medicine 01', price: 128.5, count: 0 },
      { id: '22', name: 'Cipla medicine 02', price: 150, count: 0 },
    ],
  },
  {
    id: '3',
    name: 'City Medical Store',
    distance: '500M from you',
    address: 'Shop No. 12, Model Town, Rewari',
    image: require('../assets/images/home_screen/pharmacy-icon.png'),
    phone: '1234567890',
    location: 'https://maps.google.com/?q=28.704060,77.102493',
    medicines: [
      { id: '311', name: 'Cipla medicine 01', price: 128.5, count: 0 },
      { id: '312', name: 'Cipla medicine 02', price: 150, count: 0 },
    ],
  },
  // Add more pharmacy objects as needed
];

const promoBanners = [
  {
    id: '1',
    text: 'FREE',
    subText: 'Get free delivery on order above Rs.199',
  },
  {
    id: '2',
    text: '15% OFF',
    subText: 'Get 20% off on your first order',
  },
  // Add more banners as needed
];

const PharmacyListScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeRoute, setActiveRoute] = useState('PharmacyList');
  const navigation = useNavigation();
  const route = useRoute();
  const isFocused = useIsFocused();
  const { location } = route.params;  // Receive location data from HomeScreen
  const [orderCount, setOrderCount] = useState(0); // State to track order count
  const [cartItems, setCartItems] = useState([]); // State to track cart items
  const carouselRef = useRef(null);

useEffect(() => {
    // Simulate loading time
    setTimeout(() => {
      setLoading(false);
      storePharmacyIds();
    }, 2000);

    if (isFocused) {
      setActiveRoute('PharmacyList');
    }
    fetchOrders();
    fetchCartItems();
  }, [isFocused]);


  const filteredPharmacies = pharmacies.filter(pharmacy =>
    pharmacy.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const storePharmacyIds = async () => {
    try {
      const pharmacyIds = pharmacies.map(pharmacy => pharmacy.id);
      await AsyncStorage.setItem('pharmacies', JSON.stringify(pharmacyIds));
    } catch (error) {
      console.error('Error storing pharmacy IDs:', error);
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
  

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.pharmacyTile}
      onPress={() => navigation.navigate('PharmacyShopScreen', { pharmacy: item })}
    >
      <View style={styles.pharmacyImageContainer}>
        <Image source={item.image} style={styles.pharmacyImage} />
      </View>
      <View style={styles.pharmacyInfo}>
        <Text style={styles.pharmacyName}>{item.name}</Text>
        <Text style={styles.pharmacyDistance}>{item.distance}</Text>
        <Text style={styles.pharmacyAddress}>{item.address}</Text>
      </View>
      <TouchableOpacity style={styles.viewButton}>
        <Image source={require('../assets/images/welcome_screen/next-button-ic.png')} style={styles.buttonIcon} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderPromoBanner = ({ item }) => (
    <View style={styles.promoBanner}>
      <Text style={styles.promoText}>{item.text}</Text>
      <Text style={styles.promoSubText}>{item.subText}</Text>
    </View>
  );

  const handleScroll = event => {
    const index = Math.floor(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden={false} backgroundColor={'#178A80'} />
      <View style={styles.header}>
        <View style={styles.locationContainer}>
          <Image source={require('../assets/images/home_screen/location-icon.png')} style={styles.locationIcon} />
          <Text style={styles.deliveringAtText}>Delivering at -</Text>
        </View>
        <Text style={styles.locationText}>{location}</Text>
        <Text style={styles.title}>Pharmacy near you</Text>
        <Text style={styles.subtitle}>We are showcasing you pharmacies near you</Text>
        <View style={styles.searchContainer}>
          <Image source={require('../assets/images/home_screen/search-icon.png')} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by pharmacy or medicine name"
            placeholderTextColor="#FFF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
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
      </View>
      <View style={styles.pharmacyListContainer}>
        {loading ? (
          <SkeletonPlaceholder>
            {Array(6).fill(0).map((_, index) => (
              <SkeletonPlaceholder.Item key={index} width={'80%'} height={80} borderRadius={10} marginTop={15} marginBottom={20} marginLeft={40} />
            ))}
          </SkeletonPlaceholder>
        ) : (
          <FlatList
            data={filteredPharmacies}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.pharmacyList}
          />
        )}
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
    paddingBottom: 10,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  deliveringAtText: {
    fontSize: 14,
    color: '#fff',
    fontFamily: 'Montserrat-SemiBold',
    marginLeft: 5,
  },
  locationIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginVertical: 5,
  },
  locationText: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Montserrat-Regular',
    marginTop: 5,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontFamily: 'Montserrat-Bold',
    marginTop: 30,
    marginBottom: 5,
    paddingHorizontal: 20,
  },
  subtitle: {
    fontSize: 14,
    color: '#A8B6C1',
    fontFamily: 'Montserrat-Regular',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(196, 196, 196, 0.2)',
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 20,
    marginHorizontal: 20,
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: '#FFF',
    fontFamily: 'Montserrat-Regular',
  },
  promoBanner: {
    backgroundColor: '#4AA366',
    borderRadius: 10,
    padding: 20,
    width: width - 40,
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  promoText: {
    fontSize: 24,
    color: '#fff',
    fontFamily: 'Montserrat-Bold',
    flex: 1.3,
  },
  promoSubText: {
    fontSize: 14,
    color: '#fff',
    fontFamily: 'Montserrat-Medium',
    marginLeft: 10,
    flex: 3,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#fff',
  },
  inactiveIndicator: {
    backgroundColor: '#888',
  },
  pharmacyListContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    flex: 1,
    paddingBottom: 50,
  },
  shimmerContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  shimmerTile: {
    width: '100%',
    height: 80,
    borderRadius: 10,
    marginBottom: 20,
  },
  pharmacyList: {
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  pharmacyTile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  pharmacyImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  pharmacyImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  pharmacyInfo: {
    flex: 1,
  },
  pharmacyName: {
    fontSize: 18,
    color: '#000',
    fontFamily: 'Montserrat-Bold',
  },
  pharmacyDistance: {
    fontSize: 14,
    color: '#888',
    fontFamily: 'Montserrat-Regular',
    marginTop: 5,
  },
  pharmacyAddress: {
    fontSize: 14,
    color: '#888',
    fontFamily: 'Montserrat-Regular',
    marginTop: 5,
  },
  viewButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    width: 20,
    height: 20,
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
    tintColor: '#178A80', // Active icon color
  },
  navText: {
    fontSize: RFPercentage(1.8),
    color: '#000',
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
  carouselContent: {
    paddingHorizontal: 10,
  },
});

export default PharmacyListScreen;
