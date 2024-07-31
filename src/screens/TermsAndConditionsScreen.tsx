import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const TermsAndConditionsScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../assets/images/checkout_screen/back-icon.png')} style={styles.backIcon} />
        </TouchableOpacity>
          <Text style={styles.headerTitle}>Terms & Conditions</Text>
        </View>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <Text style={styles.text}>
            A terms and conditions agreement outlines the website administrator’s rules regarding user behavior and provides information about the actions the website administrator can and will perform.
          </Text>
          <Text style={styles.text}>
            Essentially, your terms and conditions text is a contract between your website and its users. In the event of a legal dispute, arbitrators will look at it to determine whether each party acted within their rights.
          </Text>
          <Text style={styles.text}>
            A terms and conditions agreement outlines the website administrator’s rules regarding user behavior. A terms and conditions agreement outlines the website administrator’s rules regarding user behavior and provides information about the actions the website administrator can and will perform.
          </Text>
          <Text style={styles.text}>
            Essentially, your terms and conditions text is a contract between your website and its users. In the event of a legal dispute, arbitrators will look at it to determine whether each party acted within their rights. A terms and conditions agreement outlines the website administrator’s rules regarding user behavior and provides information about the actions the website administrator can and will perform.
          </Text>
          <Text style={styles.text}>
            Essentially, your terms and conditions text is a contract between your website and its users. In the event of a legal dispute, arbitrators will look at it to determine whether each party acted within their rights.
          </Text>
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
  contentContainer: {
    padding: 16,
  },
  text: {
    fontSize: 16,
    fontFamily: 'Montserrat-Light',
    color: '#1B2E39',
    marginBottom: 16,
  },
});

export default TermsAndConditionsScreen;
