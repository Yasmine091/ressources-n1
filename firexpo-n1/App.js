import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import * as Analytics from 'expo-firebase-analytics';
import Constants from 'expo-constants';

import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Platform, LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import SettingsScreen from './screens/SettingsScreen';
import NotifyMe from './screens/NotifyMe';

LogBox.ignoreLogs(['Setting a timer']);

const Stack = createNativeStackNavigator();

export default function App() {

  useEffect(() => {
    Analytics.setClientId(Constants.installationId)
  })

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen} />
        <Stack.Screen options={{ headerShown: false }} name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="PushNotify" component={NotifyMe} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});