import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RFPercentage } from 'react-native-responsive-fontsize';

const { width } = Dimensions.get('window');

const initialAddresses = [
  { id: '1', title: 'Yash Home', details: 'Hno.11, Street-1, Sector-1, Rewari, Haryana (123401)' },
  { id: '2', title: 'Yash Home', details: 'Hno.11, Street-1, Sector-1, Rewari, Haryana (123401)' },
  { id: '3', title: 'Yash Home', details: 'Hno.11, Street-1, Sector-1, Rewari, Haryana (123401)' },
  { id: '4', title: 'Yash Home', details: 'Hno.11, Street-1, Sector-1, Rewari, Haryana (123401)' },
];

const AddressBookScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [addresses, setAddresses] = useState(initialAddresses);
  const [selectedAddressId, setSelectedAddressId] = useState(addresses[0]?.id);
  const fromMyAccount = route.params?.from === 'MyAccount';

  useEffect(() => {
    if (route.params?.newAddress) {
      const newAddress = route.params.newAddress;
      setAddresses([...addresses, newAddress]);
      setSelectedAddressId(newAddress.id);
    }
  }, [route.params?.newAddress]);

  const handleAddressSelect = (id) => {
    setSelectedAddressId(id);
  };

  const handleDone = () => {
    const selectedAddress = addresses.find(address => address.id === selectedAddressId);
    if (selectedAddress) {
      navigation.navigate('Checkout', { selectedAddress });
    }
  };

  const renderAddressItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.addressContainer,
        item.id === selectedAddressId && styles.selectedAddressContainer,
      ]}
      onPress={() => handleAddressSelect(item.id)}
    >
      <Text style={styles.addressTitle}>{item.title}</Text>
      <Text style={styles.addressDetails}>{item.details}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../assets/images/checkout_screen/back-icon.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Address Book</Text>
      </View>
      <FlatList
        data={addresses}
        renderItem={renderAddressItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.addressList}
        ListFooterComponent={
          <TouchableOpacity onPress={() => navigation.navigate('AddNewAddress')} style={styles.addNewAddressContainer}>
            <Text style={styles.addNewAddressText}>Add New Address</Text>
          </TouchableOpacity>
        }
      />
      {!fromMyAccount && (
        <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backIcon: {
    width: 20,
    height: 20,
  },
  headerTitle: {
    fontSize: RFPercentage(3),
    fontFamily: 'Montserrat-Bold',
    color: '#1A998E',
    marginLeft: 16,
  },
  addressList: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  addressContainer: {
    backgroundColor: '#F7F8FA',
    borderRadius: 10,
    padding: 16,
    marginVertical: 8,
  },
  selectedAddressContainer: {
    borderWidth: 1,
    borderColor: '#178A80',
  },
  addressTitle: {
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
    color: '#000',
  },
  addressDetails: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: '#000',
    marginTop: 4,
  },
  addNewAddressContainer: {
    alignItems: 'flex-end',
    marginTop: 16,
    marginRight: 16,
  },
  addNewAddressText: {
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
    color: '#178A80',
    textDecorationLine: 'underline',
  },
  doneButton: {
    backgroundColor: '#178A80',
    borderRadius: 10,
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignSelf: 'center',
    marginVertical: 16,
    width: width - 32, // Same width as the address container
  },
  doneButtonText: {
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

export default AddressBookScreen;
