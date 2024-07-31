import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RFPercentage } from 'react-native-responsive-fontsize';

const PaymentMethodScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { currentMethod } = route.params;

  const [selectedMethod, setSelectedMethod] = useState(currentMethod);

  const paymentMethods = [
    { method: 'Cash', icon: require('../assets/images/payment_method_screen/cash-icon.png') },
    { method: 'Card', icon: require('../assets/images/payment_method_screen/card-icon.png') },
    { method: 'UPI', icon: require('../assets/images/payment_method_screen/upi-icon.png') },
  ];

  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
  };

  const handleDone = () => {
    navigation.navigate('Checkout', { paymentMethod: selectedMethod });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image source={require('../assets/images/checkout_screen/back-icon.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Method</Text>
      </View>
      <View style={styles.paymentMethodsContainer}>
        {paymentMethods.map((item) => (
          <TouchableOpacity
            key={item.method}
            style={styles.paymentMethodItem}
            onPress={() => handleMethodSelect(item.method)}
          >
            <View style={styles.methodInfo}>
              <Image source={item.icon} style={styles.methodIcon} />
              <Text style={styles.methodText}>{item.method}</Text>
            </View>
            <View style={styles.radioContainer}>
              <View style={[styles.radioButton, selectedMethod === item.method && styles.selectedRadioButton]}>
                {selectedMethod === item.method && <View style={styles.radioButtonSelected} />}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
        <Text style={styles.doneButtonText}>Done</Text>
      </TouchableOpacity>
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
  paymentMethodsContainer: {
    padding: 20,
  },
  paymentMethodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(241, 241, 241, 0.5)', 
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  methodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  methodIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  methodText: {
    fontSize: RFPercentage(2.2),
    fontFamily: 'Montserrat-Bold',
    color: '#26424D',
  },
  radioContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1B2E39',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRadioButton: {
    borderColor: '#00796B',
  },
  radioButtonSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#00796B',
  },
  doneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A998E',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  doneButtonText: {
    fontSize: RFPercentage(2.2),
    fontFamily: 'Montserrat-Bold',
    color: '#FFFFFF',
    marginRight: 10,
  },
});

export default PaymentMethodScreen;
