import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Image, Dimensions, StatusBar } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { RFPercentage } from 'react-native-responsive-fontsize';

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
  const navigation = useNavigation();
  const route = useRoute();
  const { location } = route.params;  // Receive location data from HomeScreen
  const carouselRef = useRef(null);

  useEffect(() => {
    // Simulate loading time
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  const filteredPharmacies = pharmacies.filter(pharmacy =>
    pharmacy.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <StatusBar hidden={false} backgroundColor={'#1B2E39'} />
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
            placeholderTextColor="#888"
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
          snapToInterval={width} // Ensure snapping to the center
          contentContainerStyle={styles.carouselContent}
          ref={carouselRef}
          onScroll={handleScroll}
          scrollEventThrottle={16} // Improve scroll performance
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
          // Skeleton effect while loading
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
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Home')}>
          <View style={styles.navIconContainer}>
            <Image source={require('../assets/images/home_screen/home-icon.png')} style={styles.navIcon} />
          </View>
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('OrderBasket')}>
          <View style={styles.navIconContainer}>
            <Image source={require('../assets/images/home_screen/cart-icon.png')} style={styles.navIcon} />
          </View>
          <Text style={styles.navText}>Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Profile')}>
          <View style={styles.navIconContainer}>
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
    paddingBottom: 10,
  },
  scrollViewContent: {
    flexGrow: 1,
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
    backgroundColor: '#2C3E50',
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
    color: '#888',
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
  carousel: {
    marginBottom: 20,
  },
  carouselContent: {
    paddingHorizontal: 10,
  },
});

export default PharmacyListScreen;
