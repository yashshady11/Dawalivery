import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';

export const getLocation = async () => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
          if (response.data && response.data.display_name) {
            resolve(response.data.display_name);
          } else {
            reject('Unable to fetch location');
          }
        } catch (error) {
          reject('Error fetching location');
        }
      },
      (error) => {
        reject('Location access denied');
      },
      { enableHighAccuracy: true, timeout: 30000, maximumAge: 10000 }
    );
  });
};

export const clearCartData = async (pharmacyIds) => {
  try {
    await AsyncStorage.removeItem('cartItems');
    await AsyncStorage.removeItem('checkoutData');
    for (const pharmacyId of pharmacyIds) {
      await AsyncStorage.removeItem(`selectedItems_${pharmacyId}`);
    }
  } catch (error) {
    console.error('Error clearing cart data:', error);
  }
};

export const fetchOrders = async () => {
  try {
    const orders = await AsyncStorage.getItem('orders');
    return orders ? JSON.parse(orders) : [];
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
};
