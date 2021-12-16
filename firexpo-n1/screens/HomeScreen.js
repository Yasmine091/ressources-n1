import { NavigationContainer } from '@react-navigation/native'
import { useIsFocused, useNavigation } from '@react-navigation/core';
import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'

import { auth, db } from '../Firebase'
import { signOut, onAuthStateChanged, deleteUser } from '@firebase/auth'
import { collection, doc, getDoc, deleteDoc, setDoc } from "firebase/firestore";

import * as Analytics from 'expo-firebase-analytics';
import { getExpoPushTokenAsync } from 'expo-notifications';

import NotifyMe from './NotifyMe';
import styles from './styles'

const HomeScreen = () => {
    const [myUser, setUser] = useState('')

    const navigation = useNavigation()

    const handleUserInfo = async () => {
        const srcUser = await getDoc(doc(db, "users", String(auth.currentUser?.uid)));
        await setUser(srcUser.data())
        await Analytics.setUserId(String(auth.currentUser?.uid))
        await Analytics.setUserProperties({
            firstname: myUser?.firstname,
            lastname: myUser?.lastname,
        });
        Analytics.logEvent('User', {
            Prénom: myUser?.firstname,
            Nom: myUser?.lastname,
            Email: auth.currentUser?.email
        });
    }

    const isFocused = useIsFocused();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            if (!user) {
                navigation.replace("Login")
            }
            else {
                Analytics.setCurrentScreen('Profil')
                Analytics.logEvent('Profil', {
                    firebase_screen: 'Profil',
                    firebase_screen_class: HomeScreen
                  });
                handleUserInfo()
            }
        })
        return unsubscribe
    }, [isFocused])

    const goToSettings = () => {
        navigation.navigate("Settings")
    }

    const goToNotifyMe = () => {
        navigation.navigate("PushNotify")
    }

    const handleSignOut = () => {
        signOut(auth)
            .then(() => {
                navigation.replace("Login")
            })
            .catch(error => alert(error.message))
    }

    const deleteAccount = async () => {
        await deleteDoc(doc(db, "users", String(auth.currentUser?.uid)));

        await deleteUser(auth.currentUser)
            .then(() => {
                alert("Votre compte à été supprimé!")
            }).catch(error => console.log(error.message))

        await signOut(auth)
            .then(() => {
                navigation.replace("Login")
            })
            .catch(error => console.log(error.message))
    }

    return (
        <View style={styles.container} on>
            <Text style={styles.screenTitle}>
                Profil de : {myUser?.firstname} {myUser?.lastname}
            </Text>

            <Text style={styles.accountInfo}>
                Prénom : {myUser?.firstname}{'\n'}
                Nom : {myUser?.lastname}{'\n'}
                Email : {auth.currentUser?.email}{'\n'}
            </Text>

            <TouchableOpacity
                onPress={goToNotifyMe}
                style={[styles.button, styles.buttonColor6]}
            >
                <Text style={styles.buttonOutlineText}>Notification push</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={goToSettings}
                style={[styles.button, styles.buttonColor4]}
            >
                <Text style={styles.buttonOutlineText}>Paramètres</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={handleSignOut}
                style={[styles.button, styles.buttonColor5]}
            >
                <Text style={styles.buttonOutlineText}>Se déconnecter</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={deleteAccount}
                style={[styles.button, styles.buttonColor3]}
            >
                <Text style={styles.buttonOutlineText}>Supprimer mon compte</Text>
            </TouchableOpacity>

        </View>
    )
}

export default HomeScreen