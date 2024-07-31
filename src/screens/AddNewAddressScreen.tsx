import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, PermissionsAndroid, Platform, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';
import { RFPercentage } from 'react-native-responsive-fontsize';

const AddNewAddressScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [currentLocation, setCurrentLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const status = await Geolocation.requestAuthorization('whenInUse');
      return status === 'granted';
    }
  
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Access Permission',
          message: 'We need access to your location to show your current address',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
  };

  const handleGetLocation = async () => {
    const hasLocationPermission = await requestLocationPermission();
  
    if (!hasLocationPermission) {
      alert('Permission to access location was denied');
      return;
    }
  
    setLoadingLocation(true);
  
    Geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
          );
          const location = response.data;
          setCurrentLocation({ latitude, longitude, location });
          setLoadingLocation(false);
        } catch (error) {
          console.error('Error fetching location:', error);
          setLoadingLocation(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        alert(`Geolocation error: ${error.message}`);
        setLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      }
    );
  };

  const handleDone = () => {
    const newAddress = {
      id: Date.now().toString(),
      title: name || 'Unnamed Address',
      details: `${address}, ${pincode}, Lat: ${currentLocation?.latitude}, Lon: ${currentLocation?.longitude}, Address: ${currentLocation?.location.display_name}`,
    };
    navigation.navigate('AddressBook', { newAddress });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../assets/images/checkout_screen/back-icon.png')} style={styles.backIcon} />
        </TouchableOpacity>
          <Text style={styles.headerTitle}>Add New Address</Text>
        </View>
        <View style={styles.form}>
          <Text style={styles.label}>Any name for this address?</Text>
          <TextInput
            style={styles.input}
            placeholder="Please enter name for this address"
            value={name}
            onChangeText={setName}
          />
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Please enter address line 2"
            value={address}
            onChangeText={setAddress}
          />
          <Text style={styles.label}>Pincode*</Text>
          <TextInput
            style={styles.input}
            placeholder="Please enter your pincode"
            value={pincode}
            onChangeText={setPincode}
          />
          <Text style={styles.label}>Your Current Location*</Text>
          {loadingLocation ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="small" color="#fff" />
            </View>
          ) : currentLocation ? (
            <View style={styles.locationContainer}>
              <Text style={styles.locationText}>Got the location! Good to go</Text>
            </View>
          ) : (
            <TouchableOpacity style={styles.locationButton} onPress={handleGetLocation}>
              <Text style={styles.locationButtonText}>Click Here</Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
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
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    fontSize: 18,
    color: '#1B2E39',
  },
  headerTitle: {
    fontSize: RFPercentage(3),
    fontFamily: 'Montserrat-Bold',
    color: '#1A998E',
    marginLeft: 16,
  },
  form: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: '#1B2E39',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F7F8FA',
    borderRadius: 10,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: '#1B2E39',
    marginBottom: 16,
  },
  locationButton: {
    backgroundColor: '#178A80',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  locationButtonText: {
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
    color: '#FFFFFF',
  },
  loaderContainer: {
    backgroundColor: '#4AA366',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  locationContainer: {
    backgroundColor: '#4AA366',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  backIcon: {
    width: 20,
    height: 20,
  },
  locationText: {
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
    color: '#FFFFFF',
  },
  doneButton: {
    backgroundColor: '#178A80',
    borderRadius: 10,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 16,
  },
  doneButtonText: {
    fontSize: 16,
    fontFamily: 'Montserrat-SemiBold',
    color: '#FFFFFF',
  },
});

export default AddNewAddressScreen;
