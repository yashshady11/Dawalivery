import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Dimensions, Alert, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RFPercentage } from 'react-native-responsive-fontsize';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const deliveryFee = 20;

const SkeletonLoader = () => (
  <SkeletonPlaceholder>
    <SkeletonPlaceholder.Item flexDirection="row" alignItems="center" padding={20}>
      <SkeletonPlaceholder.Item width={24} height={24} borderRadius={12} />
      <SkeletonPlaceholder.Item marginLeft={20} width={200} height={20} borderRadius={4} />
    </SkeletonPlaceholder.Item>
    <SkeletonPlaceholder.Item padding={20}>
      <SkeletonPlaceholder.Item width="100%" height={20} borderRadius={4} marginBottom={10} />
      <SkeletonPlaceholder.Item width="80%" height={20} borderRadius={4} marginBottom={10} />
      <SkeletonPlaceholder.Item width="60%" height={20} borderRadius={4} />
    </SkeletonPlaceholder.Item>
  </SkeletonPlaceholder>
);

const CheckoutScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { selectedItems, onUpdateItems, pharmacyAddress, pharmacyName, pharmacyid } = route.params;

  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [discount, setDiscount] = useState(0);
  const [deliveryDiscount, setDeliveryDiscount] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [items, setItems] = useState(selectedItems || []);
  const [loading, setLoading] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      if (onUpdateItems) {
        onUpdateItems(items);
      }
      saveCartItems(items);
      saveCheckoutData();
    });

    // Simulate loading time
    setTimeout(() => {
      setLoading(false);
    }, 2000);

    return unsubscribe;
  }, [items, selectedAddress, couponCode, paymentMethod]);

  useEffect(() => {
    if (route.params?.coupon) {
      applyCoupon(route.params.coupon);
    }
    if (route.params?.paymentMethod) {
      setPaymentMethod(route.params.paymentMethod);
    }
    if (route.params?.selectedAddress) {
      setSelectedAddress(route.params.selectedAddress);
    }
  }, [route.params?.coupon, route.params?.paymentMethod, route.params?.selectedAddress]);

  useEffect(() => {
    if (couponCode) {
      applyCoupon({ code: couponCode, type: couponCode === 'FREEDEL' ? 'delivery' : 'percentage', value: couponCode === '15OFF' ? 15 : 20 });
    }
  }, [items]);

  const saveCartItems = async (items) => {
    try {
      await AsyncStorage.setItem('cartItems', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart items:', error);
    }
  };

  const saveCheckoutData = async () => {
    try {
      const checkoutData = {
        selectedAddress,
        couponCode,
        paymentMethod,
      };
      await AsyncStorage.setItem('checkoutData', JSON.stringify(checkoutData));
    } catch (error) {
      console.error('Error saving checkout data:', error);
    }
  };

  const loadCheckoutData = async () => {
    try {
      const data = await AsyncStorage.getItem('checkoutData');
      if (data) {
        const { selectedAddress, couponCode, paymentMethod } = JSON.parse(data);
        setSelectedAddress(selectedAddress);
        setCouponCode(couponCode);
        setPaymentMethod(paymentMethod);
      }
    } catch (error) {
      console.error('Error loading checkout data:', error);
    }
  };

  useEffect(() => {
    loadCheckoutData();
  }, []);

  const itemTotal = items.reduce((total, item) => total + (item.price * item.count), 0);
  const toPay = itemTotal + deliveryFee - discount;
  const finalToPay = deliveryDiscount ? toPay - deliveryFee : toPay;

  const handlePaymentMethodChange = () => {
    navigation.navigate('PaymentMethodScreen', { currentMethod: paymentMethod });
  };

  const handleApplyCoupon = () => {
    navigation.navigate('CouponScreen');
  };

  const handleIncrement = (id) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, count: item.count + 1 } : item
      )
    );
  };

  const handleDecrement = (id) => {
    const item = items.find((item) => item.id === id);
    if (item.count === 1) {
      Alert.alert(
        "Remove Medicine",
        "Are you sure you want to remove this medicine?",
        [
          { text: "No", onPress: () => {}, style: "cancel" },
          { text: "Yes", onPress: () => {
            removeItem(id);
            if (items.length === 1) {
              navigation.navigate('PharmacyShopScreen', { pharmacy: { id: pharmacyid, name: pharmacyName, medicines: [] } });
            }
          }}
        ],
        { cancelable: false }
      );
    } else {
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id ? { ...item, count: item.count - 1 } : item
        )
      );
    }
  };  

  const removeItem = (id) => {
    setItems((prevItems) => 
      prevItems.map((item) => 
        item.id === id ? { ...item, count: 0 } : item
      ).filter(item => item.count > 0)
    );
  };

  const handlePlaceOrder = async () => {
    const newOrder = {
      id: Date.now().toString(),
      pharmacyName: pharmacyName,
      pharmacyAddress: pharmacyAddress, // Pharmacy address
      deliveryAddress: selectedAddress ? selectedAddress.details : 'N/A', // Use the selected address details for delivery
      items: items.map((item) => ({
        name: item.name,
        quantity: item.count,
      })),
      totalAmount: finalToPay,
      couponCode: couponCode,
      itemTotal: itemTotal,
      discount: discount,
      deliveryFee: deliveryDiscount ? 0 : deliveryFee,
      deliveryDiscount: deliveryDiscount, // Add this to ensure delivery discount info is passed
      paymentMethod: paymentMethod,
      date: new Date().toLocaleString(),
      pharmacyid: pharmacyid
    };

    console.log(typeof new Date().toLocaleString())

    try {
      const existingOrders = await AsyncStorage.getItem('orders');
      const orders = existingOrders ? JSON.parse(existingOrders) : [];
      orders.push(newOrder);
      await AsyncStorage.setItem('orders', JSON.stringify(orders));
    } catch (error) {
      console.error('Error saving order:', error);
    }

    navigation.navigate('OrderPlaced');
  };

  const applyCoupon = (coupon) => {
    const total = items.reduce((total, item) => total + (item.price * item.count), 0);
    if (coupon.type === 'percentage') {
      const discountValue = (total * coupon.value) / 100;
      setDiscount(discountValue);
    } else if (coupon.type === 'delivery') {
      setDeliveryDiscount(true);
    }
    setCouponCode(coupon.code);
  };

  const removeCoupon = () => {
    setDiscount(0);
    setDeliveryDiscount(false);
    setCouponCode('');
  };

  const renderItem = ({ item }) => (
    <View style={styles.medicineItem}>
      <Text style={styles.medicineName}>{item.name}</Text>
      <View style={styles.medicineCounter}>
        <TouchableOpacity
          style={styles.counterButton}
          onPress={() => handleDecrement(item.id)}
        >
          <Text style={styles.counterButtonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.counterText}>{item.count}</Text>
        <TouchableOpacity
          style={styles.counterButton}
          onPress={() => handleIncrement(item.id)}
        >
          <Text style={styles.counterButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.medicinePrice}>₹ {(item.price * item.count).toFixed(2)}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Image source={require('../assets/images/checkout_screen/back-icon.png')} style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Cart</Text>
        </View>
        {items.length === 0 ? (
          <View style={styles.emptyCartContainer}>
            <Image source={require('../assets/images/checkout_screen/empty-cart.png')} style={styles.emptyCartImage} />
            <Text style={styles.emptyCartText}>Your Cart is Feeling Empty!</Text>
          </View>
        ) : (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Delivery Address</Text>
              {loading ? (
                <SkeletonPlaceholder>
                  <SkeletonPlaceholder.Item width="100%" height={50} borderRadius={10} />
                </SkeletonPlaceholder>
              ) : selectedAddress ? (
                <View style={styles.addressContainer}>
                  <View>
                    <Text style={styles.addressTitle}>{selectedAddress.title}</Text>
                    <Text style={styles.addressDetails}>{selectedAddress.details}</Text>
                  </View>
                  <TouchableOpacity onPress={() => navigation.navigate('AddressBook')}>
                    <Image source={require('../assets/images/checkout_screen/edit-icon.png')} style={styles.editIcon} />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={styles.addressButton} onPress={() => navigation.navigate('AddressBook')}>
                  <Text style={styles.addressButtonText}>Select Address</Text>
                  <Image source={require('../assets/images/checkout_screen/arrow-right-icon.png')} style={styles.arrowIcon} />
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Overview</Text>
              <Text style={styles.pharmacyName}>Ordering from - {pharmacyName}</Text>
              {loading ? (
                <SkeletonPlaceholder>
                  {Array(3).fill(0).map((_, index) => (
                    <SkeletonPlaceholder.Item key={index} width="100%" height={80} borderRadius={10} marginBottom={10} />
                  ))}
                </SkeletonPlaceholder>
              ) : (
                <View style={styles.overviewContainer}>
                  {items.map((item) => renderItem({ item }))}
                </View>
              )}
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Coupon</Text>
              {loading ? (
                <SkeletonPlaceholder>
                  <SkeletonPlaceholder.Item width="100%" height={50} borderRadius={10} marginBottom={10} />
                </SkeletonPlaceholder>
              ) : couponCode ? (
                <View style={styles.couponApplied}>
                  <Text style={styles.couponAppliedText}>Coupon applied: {couponCode}</Text>
                  <TouchableOpacity onPress={removeCoupon}>
                    <Text style={styles.removeCouponText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={styles.couponButton} onPress={handleApplyCoupon}>
                  <Text style={styles.couponButtonText}>Apply Coupon</Text>
                  <Image source={require('../assets/images/checkout_screen/arrow-right-icon.png')} style={styles.arrowIcon} />
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Bill Details</Text>
              {loading ? (
                <SkeletonPlaceholder>
                  <SkeletonPlaceholder.Item width="100%" height={150} borderRadius={10} />
                </SkeletonPlaceholder>
              ) : (
                <View style={styles.billDetailsContainer}>
                  <View style={styles.billItem}>
                    <Text style={styles.billItemText}>Item Total</Text>
                    <Text style={styles.billItemText}>
                      ₹ {itemTotal.toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.dottedLine} />
                  <View style={styles.billItem}>
                    <Text style={styles.billItemText}>Delivery Fee</Text>
                    <Text style={styles.billItemText}>
                      {deliveryDiscount ? <Text style={styles.strikeThrough}>₹ {deliveryFee.toFixed(2)}</Text> : null}
                      ₹ {deliveryDiscount ? 0 : deliveryFee.toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.billItem}>
                    <Text style={styles.billItemText}>Discount</Text>
                    <Text style={styles.billItemText}>- ₹ {discount.toFixed(2)}</Text>
                  </View>
                  <View style={styles.billItem}>
                    <Text style={styles.billItemText}>To Pay</Text>
                    <Text style={styles.billItemText}>
                      {discount ? <Text style={styles.strikeThrough}>₹ {itemTotal + deliveryFee}</Text> : null}
                      ₹ {finalToPay.toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.dottedLine} />
                  <View style={styles.billItem}>
                    <Text style={styles.billItemText}>Payment Method</Text>
                    <TouchableOpacity onPress={handlePaymentMethodChange} style={styles.paymentMethodContainer}>
                      <Text style={styles.billItemText}>{paymentMethod}</Text>
                      <Text style={styles.changeText}>Change</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>
      {loading ? (
        <SkeletonPlaceholder>
          <SkeletonPlaceholder.Item width="90%" height={50} borderRadius={10} alignSelf="center" marginVertical={10} />
        </SkeletonPlaceholder>
      ) : items.length > 0 ? (
        <TouchableOpacity style={styles.placeOrderButton} onPress={handlePlaceOrder}>
          <Text style={styles.placeOrderButtonText}>Place Order</Text>
          <Image source={require('../assets/images/pharmacy_shop_screen/order-now-icon.png')} style={styles.arrowIcon} />
        </TouchableOpacity>
      ) : null}
    </SafeAreaView>
  );  
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF', // Change background color to white
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 80, // Adjusted to prevent content being hidden behind the button
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFF',
  },
  backButton: {
    marginRight: 20,
  },
  backIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    tintColor: '#1B2E39', // Ensure visibility on dark background
  },
  headerTitle: {
    fontSize: RFPercentage(3),
    fontFamily: 'Montserrat-Bold',
    color: '#178A80',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
    padding: 20,
  },
  sectionTitle: {
    fontSize: RFPercentage(2.2),
    fontFamily: 'Montserrat-Bold',
    color: '#000',
    marginBottom: 10,
  },
  addressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A998E',
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  addressButtonText: {
    fontSize: RFPercentage(2.2),
    fontFamily: 'Montserrat-Bold',
    color: '#FFFFFF',
  },
  arrowIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#E0F7FA',
    borderRadius: 10,
    padding: 20,
  },
  addressTitle: {
    fontSize: RFPercentage(2.2),
    fontFamily: 'Montserrat-Bold',
    color: '#00796B',
  },
  addressDetails: {
    fontSize: RFPercentage(2),
    fontFamily: 'Montserrat-Regular',
    color: '#00796B',
    marginTop: 4,
  },
  editIcon: {
    width: 20,
    height: 20,
    tintColor: '#00796B',
    resizeMode: 'contain',
  },
  overviewContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 20,
  },
  overviewList: {
    paddingBottom: 20,
  },
  medicineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  medicineName: {
    flex: 2,
    fontSize: RFPercentage(1.6),
    fontFamily: 'Montserrat-Medium',
    color: '#26424D',
    flexShrink: 1, // Allows text to shrink if necessary
  },
  medicineCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-around',
  },
  counterButton: {
    width: 24,
    height: 24,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#26424D',
  },
  counterButtonText: {
    fontSize: RFPercentage(1.6),
    color: '#26424D',
    fontFamily: 'Montserrat-Bold',
  },
  counterText: {
    width: 30,
    textAlign: 'center',
    fontSize: RFPercentage(1.6),
    color: '#26424D',
    fontFamily: 'Montserrat-Medium',
  },
  medicinePrice: {
    flex: 1,
    textAlign: 'right',
    fontSize: RFPercentage(1.6),
    fontFamily: 'Montserrat-Medium',
    color: '#26424D',
    marginLeft: 10,
  },
  couponButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A998E',
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  couponButtonText: {
    fontSize: RFPercentage(2.2),
    fontFamily: 'Montserrat-Bold',
    color: '#FFFFFF',
  },
  couponApplied: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#E0F7FA',
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  couponAppliedText: {
    fontSize: RFPercentage(2.2),
    fontFamily: 'Montserrat-Bold',
    color: '#00796B',
  },
  removeCouponText: {
    fontSize: RFPercentage(2.5),
    fontFamily: 'Montserrat-Bold',
    color: '#00796B',
  },
  billDetailsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
  },
  billItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  billItemText: {
    fontSize: RFPercentage(2),
    fontFamily: 'Montserrat-Medium',
    color: '#26424D',
  },
  paymentMethodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentMethodText: {
    fontWeight: 'bold',
    fontSize: RFPercentage(2.2),
    color: '#26424D',
  },
  changeText: {
    color: '#1A998E',
    fontSize: RFPercentage(2),
    fontFamily: 'Montserrat-Medium',
    textDecorationLine: 'underline',
    marginLeft: 10, // Ensure spacing between "Cash" and "Change"
  },
  placeOrderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4AA366',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    position: 'absolute',
    bottom: 10,
    left: 20,
    right: 20,
    justifyContent: 'space-between',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  placeOrderButtonText: {
    fontSize: RFPercentage(2.5),
    fontFamily: 'Montserrat-Bold',
    color: '#FFFFFF',
  },
  skeletonContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginBottom: 30,
    borderRadius: 10,
  },
  dottedLine: {
    borderStyle: 'dotted',
    borderWidth: 1,
    borderRadius: 1,
    borderColor: '#d3d3d3',
    marginVertical: 10,
  },
  strikeThrough: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    color: 'red',
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF', // Ensure background is white
  },
  emptyCartImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20, // Add margin to space out the image and text
  },
  emptyCartText: {
    fontSize: RFPercentage(2.5),
    fontFamily: 'Montserrat-Regular',
    color: '#1B2E39',
    textAlign: 'center', // Center the text
  },
  pharmacyName: {
    fontSize: RFPercentage(1.6),
    color: '#C4C4C4',
    fontFamily: 'Montserrat-SemiBold',
    marginBottom: 10,
  },
  
});

export default CheckoutScreen;
function showAsyncStorageContentInDev(): any {
  throw new Error('Function not implemented.');
}
