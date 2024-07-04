import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Image, Dimensions, StatusBar } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RFPercentage } from 'react-native-responsive-fontsize';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const { width, height } = Dimensions.get('window');
const borderColor = '#26424D';

const PharmacyShopScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { pharmacy } = route.params;

  const [itemsSelected, setItemsSelected] = useState(0);
  const [loading, setLoading] = useState(true);
  const [medicineList, setMedicineList] = useState(pharmacy.medicines);
  const [searchQuery, setSearchQuery] = useState('');
  const [addedItems, setAddedItems] = useState({});

  useEffect(() => {
    // Simulate loading data
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 2000); // Adjust the timeout duration as needed

    return () => clearTimeout(timeoutId); // Cleanup timeout on unmount
  }, []);

  useEffect(() => {
    if (route.params?.updatedItems) {
      const updatedItems = route.params.updatedItems;
      setMedicineList((prevList) =>
        prevList.map((item) => 
          updatedItems.find((updatedItem) => updatedItem.id === item.id) || item
        )
      );
      const newItemsSelected = updatedItems.reduce((sum, item) => sum + item.count, 0);
      setItemsSelected(newItemsSelected);
    }
  }, [route.params?.updatedItems]);

  const addItem = (id) => {
    setAddedItems((prev) => ({ ...prev, [id]: true }));
    incrementCount(id);
  };

  const incrementCount = (id) => {
    setMedicineList((prevList) =>
      prevList.map((item) =>
        item.id === id ? { ...item, count: item.count + 1 } : item
      )
    );
    setItemsSelected(itemsSelected + 1);
  };

  const decrementCount = (id) => {
    setMedicineList((prevList) =>
      prevList.map((item) =>
        item.id === id && item.count > 0
          ? { ...item, count: item.count - 1 }
          : item
      )
    );
    setItemsSelected(itemsSelected > 0 ? itemsSelected - 1 : 0);
    setAddedItems((prev) => (prev[id] && medicineList.find(item => item.id === id).count === 1 ? { ...prev, [id]: false } : prev));
  };

  const filteredMedicines = medicineList.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <View style={styles.medicineItem}>
      <View style={styles.medicineDetails}>
        <Text style={styles.medicineName}>{item.name}</Text>
        <Text style={styles.medicinePrice}>Rs. {item.price}</Text>
        <TouchableOpacity onPress={() => console.log('Details clicked')}>
          <Text style={styles.medicineDetailsLink}>Details</Text>
        </TouchableOpacity>
      </View>
      {addedItems[item.id] ? (
        <View style={styles.medicineCounter}>
          <TouchableOpacity
            style={styles.counterButton}
            onPress={() => decrementCount(item.id)}
          >
            <Text style={styles.counterButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.counterText}>{item.count}</Text>
          <TouchableOpacity
            style={styles.counterButton}
            onPress={() => incrementCount(item.id)}
          >
            <Text style={styles.counterButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => addItem(item.id)}
        >
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const handleNavigateToCheckout = () => {
    navigation.navigate('Checkout', {
      selectedItems: medicineList.filter(item => item.count > 0),
      onUpdateItems: (updatedItems) => {
        const updatedList = medicineList.map((item) =>
          updatedItems.find((updatedItem) => updatedItem.id === item.id) || { ...item, count: 0 }
        );
        setMedicineList(updatedList);
        const newItemsSelected = updatedList.reduce((sum, item) => sum + item.count, 0);
        setItemsSelected(newItemsSelected);
  
        const newAddedItems = {};
        updatedList.forEach(item => {
          newAddedItems[item.id] = item.count > 0;
        });
        setAddedItems(newAddedItems);
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden={false} backgroundColor={'#1B2E39'} />
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.locationContainer}>
            {loading ? (
              <SkeletonPlaceholder>
                <SkeletonPlaceholder.Item width={20} height={20} borderRadius={10} />
              </SkeletonPlaceholder>
            ) : (
              <Image
                source={require('../assets/images/pharmacy_shop_screen/location-icon.png')}
                style={styles.locationIcon}
              />
            )}
            <View style={styles.locationTextContainer}>
              {loading ? (
                <SkeletonPlaceholder>
                  <SkeletonPlaceholder.Item width={100} height={15} borderRadius={5} marginBottom={5} />
                  <SkeletonPlaceholder.Item width={150} height={20} borderRadius={5} />
                </SkeletonPlaceholder>
              ) : (
                <>
                  <Text style={styles.deliveringAtText}>Delivering at -</Text>
                  <Text style={styles.locationText}>Sector-1, Rewari, Haryana</Text>
                </>
              )}
            </View>
          </View>
          {loading ? (
            <SkeletonPlaceholder>
              <SkeletonPlaceholder.Item width={40} height={40} borderRadius={20} />
            </SkeletonPlaceholder>
          ) : (
            <TouchableOpacity style={styles.profileIconContainer}>
              <Image
                source={require('../assets/images/home_screen/profile-icon-black.png')}
                style={styles.profileIcon}
              />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.pharmacyInfoContainer}>
          {loading ? (
            <SkeletonPlaceholder>
              <SkeletonPlaceholder.Item width={60} height={60} borderRadius={30} />
            </SkeletonPlaceholder>
          ) : (
            <Image
              source={require('../assets/images/home_screen/pharmacy-icon.png')}
              style={styles.pharmacyLogo}
            />
          )}
          <View style={styles.pharmacyInfo}>
            {loading ? (
              <SkeletonPlaceholder>
                <SkeletonPlaceholder.Item width={150} height={25} borderRadius={5} marginBottom={5} />
                <SkeletonPlaceholder.Item width={200} height={20} borderRadius={5} />
              </SkeletonPlaceholder>
            ) : (
              <>
                <Text style={styles.pharmacyName}>DS Medi World</Text>
                <Text style={styles.pharmacyAddress}>
                  Shop No. 22, Model Town, Rewari, Haryana (123401)
                </Text>
              </>
            )}
          </View>
          {loading ? (
            <SkeletonPlaceholder>
              <SkeletonPlaceholder.Item width={40} height={40} borderRadius={20} marginHorizontal={10} marginBottom={10} />
              <SkeletonPlaceholder.Item width={40} height={40} borderRadius={20} marginHorizontal={10} />
            </SkeletonPlaceholder>
          ) : (
            <View style={styles.pharmacyButtons}>
              <TouchableOpacity style={styles.pharmacyButton}>
                <Image
                  source={require('../assets/images/pharmacy_shop_screen/phone-icon.png')}
                  style={styles.pharmacyButtonIcon}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.pharmacyButton}>
                <Image
                  source={require('../assets/images/pharmacy_shop_screen/location-icon.png')}
                  style={styles.pharmacyButtonIcon}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
      <View style={styles.searchContainer}>
        {loading ? (
          <SkeletonPlaceholder>
            <SkeletonPlaceholder.Item width={'100%'} height={40} borderRadius={20} />
          </SkeletonPlaceholder>
        ) : (
          <>
            <Image
              source={require('../assets/images/home_screen/search-icon.png')}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search medicine name"
              placeholderTextColor="#888"
              value={searchQuery}
              onChangeText={(text) => setSearchQuery(text)}
            />
          </>
        )}
      </View>
      <View style={styles.medicineListContainer}>
        {loading ? (
          // Skeleton effect while loading
          <SkeletonPlaceholder>
            {Array(6).fill(0).map((_, index) => (
              <SkeletonPlaceholder.Item key={index} width={'80%'} height={80} borderRadius={10} marginBottom={20} marginLeft={40} />
            ))}
          </SkeletonPlaceholder>
        ) : (
          filteredMedicines.length > 0 ? (
            <FlatList
              data={filteredMedicines}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.medicineList}
            />
          ) : (
            <View style={styles.noResultsContainer}>
              <Image
                source={require('../assets/images/pharmacy_shop_screen/no-results.png')}
                style={styles.noResultsImage}
              />
              <Text style={styles.noResultsText}>Oops, we don't have this medicine with us.</Text>
            </View>
          )
        )}
      </View>
      {itemsSelected > 0 && (
        <View style={styles.bottomBar}>
          <Text style={styles.itemsSelectedText}>
            <Text style={styles.fixedWidthText}>{itemsSelected}</Text> items selected
          </Text>
          <TouchableOpacity
            style={styles.orderButton}
            onPress={handleNavigateToCheckout}
          >
            <Text style={styles.orderButtonText}>Order Now</Text>
            <Image
              source={require('../assets/images/pharmacy_shop_screen/order-now-icon.png')}
              style={styles.orderButtonIcon}
            />
          </TouchableOpacity>
        </View>
      )}
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
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginVertical: 5,
  },
  deliveringAtText: {
    fontSize: 14,
    color: '#fff',
    fontFamily: 'Montserrat-SemiBold',
    marginLeft: 5,
  },
  locationText: {
    fontSize: RFPercentage(2.2),
    color: '#fff',
    fontFamily: 'Montserrat-Regular',
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
  pharmacyInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  pharmacyLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF',
  },
  pharmacyInfo: {
    flex: 1,
    marginLeft: 10,
  },
  pharmacyName: {
    fontSize: RFPercentage(3),
    color: '#fff',
    fontFamily: 'Montserrat-Bold',
  },
  pharmacyAddress: {
    fontSize: RFPercentage(2),
    color: '#A8B6C1',
    fontFamily: 'Montserrat-Regular',
  },
  pharmacyButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pharmacyButton: {
    marginHorizontal: 10,
  },
  pharmacyButtonIcon: {
    width: 24,
    height: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C3E50',
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10, // Adding space between the search bar and the list
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: RFPercentage(2),
    color: '#888',
    fontFamily: 'Montserrat-Regular',
  },
  medicineListContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 20,
  },
  medicineList: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  medicineItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  medicineDetails: {
    flex: 1,
  },
  medicineName: {
    fontSize: RFPercentage(2.2),
    color: '#000',
    fontFamily: 'Montserrat-Bold',
  },
  medicinePrice: {
    fontSize: RFPercentage(2),
    color: '#000',
    fontFamily: 'Montserrat-Regular',
  },
  medicineDetailsLink: {
    fontSize: RFPercentage(1.8),
    color: '#2C3E50',
    fontFamily: 'Montserrat-SemiBold',
    marginTop: 5,
    textDecorationLine: 'underline',
  },
  addButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderWidth: 2,
    borderColor: borderColor,
  },
  addButtonText: {
    color: borderColor,
    fontFamily: 'Montserrat-Bold',
    fontSize: RFPercentage(2.2),
  },
  medicineCounter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterButton: {
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: borderColor,
  },
  counterButtonText: {
    fontSize: RFPercentage(2.5),
    color: borderColor,
    fontFamily: 'Montserrat-Bold',
    lineHeight: 26, // Ensure text is vertically centered
  },
  counterText: {
    width: 45, // Fixed width to prevent layout shift
    textAlign: 'center',
    fontSize: RFPercentage(2.5),
    color: '#000',
    fontFamily: 'Montserrat-Medium',
  },
  noResultsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noResultsImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  noResultsText: {
    fontSize: RFPercentage(2.5),
    color: '#000',
    fontFamily: 'Montserrat-Regular',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 10, // Adding space at the bottom
    left: 10, // Adding space on the left
    right: 10, // Adding space on the right
    backgroundColor: '#1B2E39',
    borderRadius: 20, // Making the bottom bar rounded
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  itemsSelectedText: {
    fontSize: RFPercentage(2.2),
    color: '#FFF',
    fontFamily: 'Montserrat-Regular',
  },
  fixedWidthText: {
    width: 30, // Fixed width for the selected items number
    textAlign: 'center',
  },
  orderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C3E50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  orderButtonText: {
    fontSize: RFPercentage(2.2),
    color: '#FFF',
    fontFamily: 'Montserrat-Bold',
    marginRight: 10,
  },
  orderButtonIcon: {
    width: 20,
    height: 20,
    tintColor: '#FFF',
  },
});

export default PharmacyShopScreen;