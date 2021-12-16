import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import * as Analytics from 'expo-firebase-analytics';

import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Platform, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { db, app, auth } from '../Firebase'
import { collection, addDoc, getDoc, getDocs, setDoc, doc, updateDoc } from "firebase/firestore";

import styles from './styles'

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

const NotifyMe = () => {
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();
    const [userToken, setUserToken] = useState('');
    const [myUser, setMyUser] = useState('');

    const handleUserInfo = async () => {
        const srcUser = await getDoc(doc(db, "users", String(auth.currentUser?.uid)));
        setMyUser(srcUser.data())
    }

    useEffect(() => {
        Analytics.setCurrentScreen('Notifications')
        Analytics.logEvent('Notifications', {
            firebase_screen: 'Notifications',
            firebase_screen_class: NotifyMe
          });

        registerForPushNotificationsAsync().then(token => setUserToken(token.data)).catch(error => alert(error.message));

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
          });
    
          responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
          });

          handleUserInfo()
    
          return () => {
            Notifications.removeNotificationSubscription(notificationListener);
            Notifications.removeNotificationSubscription(responseListener);
          };
        }, []);

    registerForPushNotificationsAsync = async () => {
        //alert("n1")

        if (Constants.isDevice) {
        //alert("n2")

          const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
          let finalStatus = existingStatus;
          if (existingStatus !== 'granted') {
            const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            finalStatus = status;
          }
          if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
          }
          const token = await Notifications.getExpoPushTokenAsync();
          setExpoPushToken(token);
          console.log(token);
          return token
        } else {
        //alert("n3")

          alert('Must use physical device for Push Notifications');
        }
      
        if (Platform.OS === 'android') {
        //alert("n4")
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
          });
        }

        //alert("n5")
        console.log(expoPushToken)
    };

    const handleTestUsern2 = async () => {
        const srcUser = await getDoc(doc(db, "users", "vTxTk7OdMnYQ9NJ0dFJWOshO9go1"));
        //console.log(srcUser.data())
        const user = srcUser.data()
        setUserToken(user.token)
        console.log(userToken)
        return user
    }

    const sendPushNotification = (token) => {
        console.log(userToken)

        if(token){
            onAuthStateChanged(auth, user => {
                if(user){
                    try {
                        updateDoc(doc(db, "users", String(user.uid)), {
                            token: token,
                        });
                    }
                    catch (error) {
                        console.log(error);
                    }
                }
            })
        }
        else {
            handleTestUsern2()
            token = userToken
        }

        alert(token)

        fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                to: token,
                title: 'Firexpo : Nouvelle notification 👤',
                body: myUser.firstname + ' ' + myUser.lastname + ' vous a envoyé une notification !',
                data: { data: 'goes here' },
                _displayInForeground: true,
            }),
        })
        .then((res) => {
            //console.log(JSON.stringify(res))
            //alert("Success : " + res);
        })
        .catch((error) => {
            console.log(error); 
            //alert("Error : " + error.message);
        });
    }

    const sendLocalNotification = async () => {
        await Notifications.scheduleNotificationAsync({
            content: {
              title: "Firexpo : Nouvelle notification 📬",
              body: 'Voici votre notification locale !',
              data: { data: 'goes here' },
            },
            trigger: { seconds: 1 },
          });
    }

    return (
        <View style={styles.container} on>
            <Text style={styles.screenTitle}>
                {/* Notification : {myUser?.firstname} {myUser?.lastname} */}
            </Text>

            <TouchableOpacity
            onPress={() => sendLocalNotification()}
            style={[styles.button, styles.buttonColor1]}
            >
                <Text style={styles.buttonOutlineText}>Recevoir une notification</Text>
            </TouchableOpacity>

            <TouchableOpacity
            onPress={() => sendPushNotification(userToken)}
            style={[styles.button, styles.buttonColor6]}
            >
                <Text style={styles.buttonOutlineText}>Envoyer une notification</Text>
            </TouchableOpacity>

        </View>
    )

}

export default NotifyMe