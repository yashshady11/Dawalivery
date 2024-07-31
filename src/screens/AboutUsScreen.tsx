import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const AboutUsScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={require('../assets/images/checkout_screen/back-icon.png')} style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>About Us</Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>OUR MISSION STATEMENT</Text>
          <Text style={styles.text}>
            At Dawalivery, our mission is to revolutionize healthcare accessibility by delivering essential medical supplies and prescriptions directly to our customers' doorsteps. We strive to provide a seamless, hassle-free service that ensures timely and reliable access to the medications and healthcare products they need. Our commitment is to enhance the quality of life for our customers by offering convenience, reliability, and personalized care, ultimately fostering healthier and happier communities.
          </Text>
        </View>
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
        borderBottomColor: '#ddd',
    },
    backIcon: {
        width: 20,
        height: 20,
    },
    headerTitle: {
        fontSize: 22,
        color: '#178A80',
        fontFamily: 'Montserrat-SemiBold',
        marginLeft: 16,
    },
  content: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Montserrat-Bold',
    color: '#178A80',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: '#26424D',
    textAlign: 'left',
  },
});

export default AboutUsScreen;
