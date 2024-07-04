import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Dimensions, Alert, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RFPercentage } from 'react-native-responsive-fontsize';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import LinearGradient from 'react-native-linear-gradient';

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
  const { selectedItems, onUpdateItems } = route.params;

  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [discount, setDiscount] = useState(0);
  const [items, setItems] = useState(selectedItems);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      onUpdateItems(items);
    });

    // Simulate loading time
    setTimeout(() => {
      setLoading(false);
    }, 2000);

    return unsubscribe;
  }, [items]);

  const itemTotal = items.reduce((total, item) => total + (item.price * item.count), 0);
  const toPay = itemTotal + deliveryFee - discount;

  const handlePaymentMethodChange = () => {
    alert('Change Payment Method functionality to be implemented');
  };

  const handleApplyCoupon = () => {
    alert('Apply Coupon functionality to be implemented');
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
          { text: "Yes", onPress: () => removeItem(id) }
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

  const handlePlaceOrder = () => {
    navigation.navigate('OrderPlaced');
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
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <TouchableOpacity style={styles.addressButton}>
            <Text style={styles.addressButtonText}>Select Address</Text>
            <Image source={require('../assets/images/checkout_screen/arrow-right-icon.png')} style={styles.arrowIcon} />
          </TouchableOpacity>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.overviewContainer}>
            {items.map((item) => renderItem({ item }))}
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Applied Coupon</Text>
          <TouchableOpacity style={styles.couponButton} onPress={handleApplyCoupon}>
            <Text style={styles.couponButtonText}>Apply Coupon</Text>
            <Image source={require('../assets/images/checkout_screen/arrow-right-icon.png')} style={styles.arrowIcon} />
          </TouchableOpacity>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bill Details</Text>
          <View style={styles.billDetailsContainer}>
            <View style={styles.billItem}>
              <Text style={styles.billItemText}>Item Total</Text>
              <Text style={styles.billItemText}>₹ {itemTotal.toFixed(2)}</Text>
            </View>
            <View style={styles.billItem}>
              <Text style={styles.billItemText}>Delivery Fee</Text>
              <Text style={styles.billItemText}>₹ {deliveryFee.toFixed(2)}</Text>
            </View>
            <View style={styles.billItem}>
              <Text style={styles.billItemText}>Discount</Text>
              <Text style={styles.billItemText}>- ₹ {discount.toFixed(2)}</Text>
            </View>
            <View style={styles.billItem}>
              <Text style={styles.billItemText}>To Pay</Text>
              <Text style={styles.billItemText}>₹ {toPay.toFixed(2)}</Text>
            </View>
            <View style={styles.billItem}>
              <Text style={styles.billItemText}>Payment Method</Text>
              <TouchableOpacity onPress={handlePaymentMethodChange} style={styles.paymentMethodContainer}>
                <Text style={styles.billItemText}>{paymentMethod}</Text>
                <Text style={styles.changeText}>Change</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.placeOrderButton} onPress={handlePlaceOrder}>
        <Text style={styles.placeOrderButtonText}>Place Order</Text>
        <Image source={require('../assets/images/checkout_screen/arrow-right-icon.png')} style={styles.arrowIcon} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
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
    color: '#1B2E39',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
    padding: 20,
  },
  sectionTitle: {
    fontSize: RFPercentage(2.2),
    fontFamily: 'Montserrat-Bold',
    color: '#26424D',
    marginBottom: 10,
  },
  addressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#26424D',
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
    fontSize: RFPercentage(2),
    fontFamily: 'Montserrat-Medium',
    color: '#26424D',
  },
  medicineCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  counterButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#26424D',
  },
  counterButtonText: {
    fontSize: RFPercentage(2.5),
    color: '#26424D',
    fontFamily: 'Montserrat-Bold',
  },
  counterText: {
    width: 30,
    textAlign: 'center',
    fontSize: RFPercentage(2),
    color: '#26424D',
    fontFamily: 'Montserrat-Medium',
  },
  medicinePrice: {
    flex: 1,
    textAlign: 'right',
    fontSize: RFPercentage(2),
    fontFamily: 'Montserrat-Medium',
    color: '#26424D',
  },
  couponButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#26424D',
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
    color: '#26424D',
    fontSize: RFPercentage(2),
    fontFamily: 'Montserrat-Medium',
    textDecorationLine: 'underline',
    marginLeft: 10, // Ensure spacing between "Cash" and "Change"
  },
  placeOrderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
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
    marginBottom: 10,
    borderRadius: 10,
  },
});

export default CheckoutScreen;
