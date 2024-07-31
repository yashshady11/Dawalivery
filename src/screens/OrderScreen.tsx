import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, Dimensions, StatusBar, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { RFPercentage } from 'react-native-responsive-fontsize';

const OrderScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const { height } = Dimensions.get('window');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const existingOrders = await AsyncStorage.getItem('orders');
        const orders = existingOrders ? JSON.parse(existingOrders) : [];
        const sortedOrders = orders.sort((a, b) => new Date(b.date) - new Date(a.date));
        setOrders(sortedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    };

    fetchOrders();
  }, []);

  const renderOrderItem = ({ item }) => {
    const totalItems = item.items.reduce((acc, orderItem) => acc + orderItem.quantity, 0);

    return (
      <View style={styles.orderContainer}>
        <View style={styles.orderHeader}>
          <Image source={require('../assets/images/home_screen/pharmacy-icon.png')} style={styles.pharmacyIcon} />
          <View style={styles.pharmacyInfo}>
            <Text style={styles.pharmacyName}>{item.pharmacyName}</Text>
            <Text style={styles.pharmacyAddress}>{item.pharmacyAddress}</Text>
          </View>
        </View>
        <View style={styles.orderDetails}>
          {item.items.slice(0, 4).map((orderItem, index) => (
            <Text key={index} style={styles.orderItemText}>
              {orderItem.quantity} x {orderItem.name}
            </Text>
          ))}
          {item.items.length > 4 && (
            <Text style={styles.orderItemText}>... more</Text>
          )}
          <View style={styles.dottedLine} />
          <View style={styles.orderFooter}>
            <Text style={styles.orderDate}>{item.date}</Text>
            <View style={styles.orderAmountContainer}>
              <Text style={styles.orderAmount}>₹ {item.totalAmount.toFixed(2)}</Text>
              <Text style={styles.totalItems}>Total Items: {totalItems}</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.viewBillButton} 
            onPress={() => navigation.navigate('BillDetailsScreen', { 
              pharmacyName: item.pharmacyName, 
              billDetails: {
                itemTotal: item.itemTotal ?? 0,
                deliveryFee: item.deliveryFee ?? 0,
                discount: item.discount ?? 0,
                deliveryDiscount: item.deliveryDiscount ?? false,
                finalToPay: item.totalAmount ?? 0,
                deliveryAddress: item.deliveryAddress, 
                items: item.items,
                date: item.date,
                paymentMethod: item.paymentMethod ?? 'N/A',
              } 
            })}
          >
            <Text style={styles.viewBillButtonText}>View Bill Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar hidden={false} backgroundColor={'#178A80'} />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Image source={require('../assets/images/checkout_screen/back-icon.png')} style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Orders</Text>
          <Image source={require('../assets/images/order_screen/medicine_order_image.png')} style={styles.headerImage} />
          <Text style={styles.headerSubtitle}>Medicine Orders</Text>
        </View>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {loading ? (
            <SkeletonPlaceholder>
              {Array(5).fill(0).map((_, index) => (
                <SkeletonPlaceholder.Item key={index} width={'80%'} height={80} borderRadius={10} marginVertical={10} alignSelf="center" />
              ))}
            </SkeletonPlaceholder>
          ) : orders.length === 0 ? (
            <View style={styles.noOrdersContainer}>
              <Image source={require('../assets/images/order_screen/no-orders.png')} style={styles.noOrdersImage} />
              <Text style={styles.noOrdersText}>No orders found. Place your first order now!</Text>
            </View>
          ) : (
            <FlatList
              data={orders}
              renderItem={renderOrderItem}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.ordersList}
            />
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#178A80',
    alignItems: 'center',
    paddingBottom: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? StatusBar.currentHeight : 10,
    left: 10,
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: '#FFFFFF',
  },
  headerTitle: {
    position: 'absolute',
    top: Platform.OS === 'android' ? StatusBar.currentHeight : 10,
    left: 50,
    fontSize: 22,
    color: '#FFFFFF',
    fontFamily: 'Montserrat-SemiBold',
  },
  headerImage: {
    marginTop: 50,
    width: 120,
    height: 120,
  },
  headerSubtitle: {
    fontSize: RFPercentage(3),
    color: '#FFFFFF',
    fontFamily: 'Montserrat-Medium',
    marginTop: 10,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  ordersList: {
    padding: 16,
  },
  orderContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    borderColor: '#F2F2F2',
    borderWidth: 1,
    elevation: 0.2,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
  },
  orderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F7F3',
    padding: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  pharmacyIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  pharmacyInfo: {
    flex: 1,
  },
  pharmacyName: {
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
    color: '#1B2E39',
  },
  pharmacyAddress: {
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    color: '#888',
    flexWrap: 'wrap',
  },
  orderDetails: {
    paddingTop: 10,
  },
  orderItemText: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: '#1B2E39',
    marginBottom: 5,
  },
  dottedLine: {
    borderStyle: 'dotted',
    borderWidth: 1,
    borderRadius: 1,
    borderColor: '#d3d3d3',
    marginVertical: 10,
    height: 1,
    width: '100%',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  orderDate: {
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    color: '#888',
  },
  orderAmountContainer: {
    alignItems: 'flex-end',
  },
  orderAmount: {
    fontSize: 14,
    fontFamily: 'Montserrat-Bold',
    color: '#1B2E39',
  },
  totalItems: {
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    color: '#888',
  },
  skeletonContainer: {
    flex: 1,
  },
  skeletonOrderContainer: {
    backgroundColor: '#F7F8FA',
    borderRadius: 10,
    padding: 64,
    marginBottom: 20,
    marginTop: 20,
    marginLeft: 16,
    marginRight: 16,
  },
  noOrdersContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noOrdersImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  noOrdersText: {
    fontSize: 18,
    color: '#888',
    fontFamily: 'Montserrat-Regular',
    textAlign: 'center',
  },
  viewBillButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  viewBillButtonText: {
    fontSize: 14,
    color: '#1B2E39',
    fontFamily: 'Montserrat-Bold',
    textDecorationLine: 'underline',
  },
});

export default OrderScreen;
