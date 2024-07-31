import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Image, Dimensions, StatusBar } from 'react-native';
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RFPercentage } from 'react-native-responsive-fontsize';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomModal from './CustomModal'; // Adjust the path as needed

const { width, height } = Dimensions.get('window');
const borderColor = '#26424D';

const PharmacyShopScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { pharmacy = { id: '', name: '', medicines: [] } } = route.params;
  const isFocused = useIsFocused();

  const [itemsSelected, setItemsSelected] = useState(0);
  const [loading, setLoading] = useState(true);
  const [medicineList, setMedicineList] = useState(pharmacy.medicines);
  const [searchQuery, setSearchQuery] = useState('');
  const [addedItems, setAddedItems] = useState({});
  const [existingPharmacy, setExistingPharmacy] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [itemToAdd, setItemToAdd] = useState(null);

  useEffect(() => {
    const simulateLoading = () => {
      setLoading(true);
      const timeoutId = setTimeout(() => {
        setLoading(false);
      }, 2000); // Adjust the timeout duration as needed

      return () => clearTimeout(timeoutId); // Cleanup timeout on unmount
    };

    simulateLoading();
  }, []);

  useEffect(() => {
    const checkExistingCart = async () => {
      try {
        const existingItems = await AsyncStorage.getItem('cartItems');
        if (existingItems) {
          const parsedItems = JSON.parse(existingItems);
          console.log('Existing cart items:', parsedItems);
          if (parsedItems.length > 0 && parsedItems[0].pharmacyName !== pharmacy.name) {
            console.log('Existing pharmacy in cart:', parsedItems[0].pharmacyName);
            setExistingPharmacy(parsedItems[0].pharmacyName);
          }
        }
      } catch (error) {
        console.error('Error checking existing cart:', error);
      }
    };

    const loadSelectedItems = async () => {
      try {
        const storedItems = await AsyncStorage.getItem(`selectedItems_${pharmacy.id}`);
        if (storedItems) {
          const parsedItems = JSON.parse(storedItems);
          console.log('Loaded selected items:', parsedItems);
          setMedicineList(parsedItems);
          const selectedCount = parsedItems.reduce((sum, item) => sum + item.count, 0);
          setItemsSelected(selectedCount);
          const newAddedItems = {};
          parsedItems.forEach(item => {
            if (item.count > 0) {
              newAddedItems[item.id] = true;
            }
          });
          setAddedItems(newAddedItems);
        }
      } catch (error) {
        console.error('Error loading selected items:', error);
      }
    };

    if (isFocused) {
      checkExistingCart();
      loadSelectedItems();
    }
  }, [isFocused, pharmacy.id]);

  useEffect(() => {
    const clearSelectedItemsOnOrderPlaced = async () => {
      const orderPlaced = await AsyncStorage.getItem('orderPlaced');
      console.log('Order placed:', orderPlaced);
      if (orderPlaced === 'true') {
        await AsyncStorage.removeItem(`selectedItems_${pharmacy.id}`);
        setMedicineList(pharmacy.medicines.map(item => ({ ...item, count: 0 })));
        setItemsSelected(0);
        setAddedItems({});
        await AsyncStorage.removeItem('orderPlaced');
        console.log('Order placed, cart cleared');
      }
    };

    if (isFocused) {
      clearSelectedItemsOnOrderPlaced();
    }
  }, [isFocused, pharmacy.id]);

  const saveSelectedItems = async (items) => {
    try {
      await AsyncStorage.setItem(`selectedItems_${pharmacy.id}`, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving selected items:', error);
    }
  };

  const saveCartItems = async (items) => {
    try {
      const cartItems = items.filter(item => item.count > 0).map(item => ({ ...item, pharmacyName: pharmacy.name }));
      await AsyncStorage.setItem('cartItems', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart items:', error);
    }
  };

  const clearCart = async () => {
    try {
      console.log('Clearing cart items from AsyncStorage');
      await AsyncStorage.removeItem('cartItems');
      await AsyncStorage.removeItem(`selectedItems_${pharmacy.id}`);
      console.log('Resetting medicine list and state');
      setMedicineList(pharmacy.medicines.map(item => ({ ...item, count: 0 })));
      setItemsSelected(0);
      setAddedItems({});
      setExistingPharmacy('');
      console.log('Cart cleared');
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const handleAddItem = (id) => {
    console.log('Attempting to add item from pharmacy:', pharmacy.name);
    console.log('Existing pharmacy in cart:', existingPharmacy);
    if (existingPharmacy && existingPharmacy !== pharmacy.name) {
      console.log('Showing alert for clearing cart');
      setItemToAdd(id);
      setModalVisible(true);
    } else {
      console.log('Adding item to cart');
      addItem(id);
    }
  };

  const clearCartAndAddItem = async () => {
    console.log('Clearing cart and adding item:', itemToAdd);
    await clearCart();
    console.log('Adding item after clearing cart');
    addItem(itemToAdd);
    setModalVisible(false);
    setItemToAdd(null);
  };

  const addItem = (id) => {
    console.log('Adding item:', id);
    setAddedItems((prev) => ({ ...prev, [id]: true }));
    incrementCount(id);
  };

  const incrementCount = (id) => {
    const updatedList = medicineList.map((item) =>
      item.id === id ? { ...item, count: item.count + 1 } : item
    );
    console.log('Updated medicine list after increment:', updatedList);
    setMedicineList(updatedList);
    setItemsSelected(itemsSelected + 1);
    saveSelectedItems(updatedList);
    saveCartItems(updatedList);
  };

  const decrementCount = (id) => {
    const updatedList = medicineList.map((item) =>
      item.id === id && item.count > 0
        ? { ...item, count: item.count - 1 } : item
    );
    console.log('Updated medicine list after decrement:', updatedList);
    setMedicineList(updatedList);
    setItemsSelected(itemsSelected > 0 ? itemsSelected - 1 : 0);
    setAddedItems((prev) => (prev[id] && medicineList.find(item => item.id === id).count === 1 ? { ...prev, [id]: false } : prev));
    saveSelectedItems(updatedList);
    saveCartItems(updatedList);
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
          onPress={() => handleAddItem(item.id)}
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
        saveSelectedItems(updatedList);
        saveCartItems(updatedList);
      },
      pharmacyName: pharmacy.name,
      pharmacyAddress: pharmacy.address,
      pharmacyid: pharmacy.id // Pass the pharmacy name and id here
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden={false} backgroundColor={'#178A80'} />
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.locationContainer}>
            {loading ? (
              <SkeletonPlaceholder>
                <SkeletonPlaceholder.Item width={20} height={20} borderRadius={10} marginTop={15} marginRight={5} />
              </SkeletonPlaceholder>
            ) : (
              <Image
                source={require('../assets/images/home_screen/location-icon.png')}
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
              <SkeletonPlaceholder.Item width={40} height={40} borderRadius={20} marginRight={15} />
            </SkeletonPlaceholder>
          ) : (
            <TouchableOpacity style={styles.profileIconContainer} onPress={() => navigation.navigate('MyAccount')}>
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
                <Text style={styles.pharmacyName}>{pharmacy.name}</Text>
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
              placeholderTextColor="#FFF"
              value={searchQuery}
              onChangeText={(text) => setSearchQuery(text)}
            />
          </>
        )}
      </View>
      <View style={styles.medicineListContainer}>
        {loading ? (
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
      <CustomModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setItemToAdd(null);
        }}
        onConfirm={clearCartAndAddItem}
      />
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
  locationTextContainer: {
    marginLeft: 5,
  },
  locationText: {
    fontSize: RFPercentage(2.2),
    color: '#fff',
    fontFamily: 'Montserrat-Regular',
  },
  profileIconContainer: {
    padding: 10,
    borderRadius: 30,
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
    fontSize: RFPercentage(1.5),
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
    backgroundColor: 'rgba(196, 196, 196, 0.2)',
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
    color: '#FFF',
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
    fontFamily: 'Montserrat-Medium',
  },
  medicineDetailsLink: {
    fontSize: RFPercentage(1.6),
    color: '#2C3E50',
    fontFamily: 'Montserrat-Light',
    marginTop: 5,
    textDecorationLine: 'underline',
  },
  addButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderWidth: 2,
    borderColor: '#000',
  },
  addButtonText: {
    color: '#1A998E',
    fontFamily: 'Montserrat-SemiBold',
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
    borderColor: '#000',
  },
  counterButtonText: {
    fontSize: RFPercentage(2.5),
    color: '#1A998E',
    fontFamily: 'Montserrat-Bold',
    lineHeight: 26, // Ensure text is vertically centered
  },
  counterText: {
    width: 45, // Fixed width to prevent layout shift
    textAlign: 'center',
    fontSize: RFPercentage(2.5),
    color: '#1A998E',
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
    backgroundColor: '#178A80',
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
    backgroundColor: '#1A998E',
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
