// BillDetailsScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';

const BillDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { pharmacyName, billDetails } = route.params;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../assets/images/checkout_screen/back-icon.png')} style={styles.backIcon} />
        </TouchableOpacity>
          <Text style={styles.headerTitle}>{pharmacyName}</Text>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.orderContainer}>
            <View style={styles.orderHeader}>
              <Image source={require('../assets/images/home_screen/pharmacy-icon.png')} style={styles.pharmacyIcon} />
              <View style={styles.pharmacyInfo}>
                <Text style={styles.pharmacyName}>{pharmacyName}</Text>
                <Text style={styles.pharmacyAddress}>{billDetails.address}</Text>
              </View>
            </View>
            <View style={styles.orderDetails}>
              {billDetails.items.map((orderItem, index) => (
                <Text key={index} style={styles.orderItemText}>
                  {orderItem.quantity} x {orderItem.name}
                </Text>
              ))}
              <View style={styles.dottedLine} />
              <View style={styles.orderFooter}>
                <Text style={styles.orderDate}>{billDetails.date}</Text>
                <Text style={styles.orderAmount}>₹ {billDetails.finalToPay.toFixed(2)}</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bill Details</Text>
            <View style={styles.billDetailsContainer}>
              <View style={styles.billItem}>
                <Text style={styles.billItemText}>Item Total</Text>
                <Text style={styles.billItemText}>₹ {billDetails.itemTotal.toFixed(2)}</Text>
              </View>
              <View style={styles.dottedLine} />
              <View style={styles.billItem}>
                <Text style={styles.billItemText}>Delivery Fee</Text>
                <Text style={styles.billItemText}>
                  {billDetails.deliveryDiscount ? <Text style={styles.strikeThrough}>₹ {billDetails.deliveryFee.toFixed(2)}</Text> : null}
                  ₹ {billDetails.deliveryDiscount ? 0 : billDetails.deliveryFee.toFixed(2)}
                </Text>
              </View>
              <View style={styles.billItem}>
                <Text style={styles.billItemText}>Discount</Text>
                <Text style={styles.billItemText}>- ₹ {billDetails.discount.toFixed(2)}</Text>
              </View>
              <View style={styles.billItem}>
                <Text style={styles.billItemText}>To Pay</Text>
                <Text style={styles.billItemText}>₹ {billDetails.finalToPay.toFixed(2)}</Text>
              </View>
              <View style={styles.dottedLine} />
              <View style={styles.billItem}>
                <Text style={styles.billItemText}>Payment Method</Text>
                <Text style={styles.billItemText}>{billDetails.paymentMethod}</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Delivery Address</Text>
            <Text style={styles.addressText}>{billDetails.deliveryAddress}</Text>
          </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#FFF',
  },
  headerTitle: {
    fontSize: 20,
    color: '#1B2E39',
    fontFamily: 'Montserrat-SemiBold',
    marginLeft: 8,
  },
  scrollContainer: {
    padding: 20,
  },
  orderContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    borderColor: '#d3d3d3',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  orderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
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
  orderAmount: {
    fontSize: 14,
    fontFamily: 'Montserrat-Bold',
    color: '#1B2E39',
  },
  section: {
    marginBottom: 20,
  },
  backIcon: {
    width: 20,
    height: 20,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#1B2E39',
    fontFamily: 'Montserrat-SemiBold',
    marginBottom: 10,
  },
  billDetailsContainer: {
    backgroundColor: '#F7F8FA',
    borderRadius: 10,
    padding: 16,
  },
  billItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  billItemText: {
    fontSize: 16,
    fontFamily: 'Montserrat-Medium',
    color: '#26424D',
  },
  addressText: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: '#888',
  },
  strikeThrough: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    color: 'red',
  },
});

export default BillDetailsScreen;
