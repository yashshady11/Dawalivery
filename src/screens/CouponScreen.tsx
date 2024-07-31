import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RFPercentage } from 'react-native-responsive-fontsize';

const coupons = [
  { code: '15OFF', type: 'percentage', value: 15, description: 'Get 15% off on all eligible medicine' },
  { code: 'FREEDEL', type: 'delivery', description: 'Get free delivery on all orders' },
  { code: '20OFF', type: 'percentage', value: 20, description: 'Get 20% off on all eligible medicine' },
];

const CouponScreen = () => {
  const navigation = useNavigation();

  const applyCoupon = (coupon) => {
    navigation.navigate('Checkout', { coupon });
  };

  const renderItem = ({ item }) => (
    <View style={styles.couponItem}>
      <View style={styles.couponCodeContainer}>
        <Image source={require('../assets/images/coupon_screen/tag.png')} style={styles.couponIcon} />
        <Text style={styles.couponCode}>{item.code}</Text>
      </View>
      <Text style={styles.couponDescription}>{item.description}</Text>
      <TouchableOpacity onPress={() => applyCoupon(item)} style={styles.applyButtonContainer}>
        <Text style={styles.applyText}>Apply</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image source={require('../assets/images/pharmacy_shop_screen/back-icon.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Coupons</Text>
      </View>
      <FlatList
        data={coupons}
        renderItem={renderItem}
        keyExtractor={(item) => item.code}
        contentContainerStyle={styles.couponList}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    marginRight: 20,
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: '#1B2E39',
  },
  headerTitle: {
    fontSize: RFPercentage(3),
    fontFamily: 'Montserrat-Bold',
    color: '#1A998E',
  },
  couponList: {
    padding: 20,
  },
  couponItem: {     
    backgroundColor: 'rgba(241, 241, 241, 0.5)',     
    borderRadius: 10,     
    padding: 20,     
    marginBottom: 15,   
  },
  couponCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  couponIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  couponCode: {
    fontSize: RFPercentage(2.5),
    fontFamily: 'Montserrat-Bold',
    color: '#178A80',
  },
  couponDescription: {
    fontSize: RFPercentage(2),
    fontFamily: 'Montserrat-Medium',
    color: '#26424D',
    marginBottom: 10,
  },
  applyButtonContainer: {
    alignSelf: 'flex-start',
  },
  applyText: {
    fontSize: RFPercentage(2),
    fontFamily: 'Montserrat-Medium',
    color: '#00796B',
    textDecorationLine: 'underline',
  },
});

export default CouponScreen;
