import React, { useState, useEffect } from 'react'
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useNavigation } from '@react-navigation/core';

import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { db, app, auth } from '../Firebase'
import { collection, addDoc, getDoc, getDocs, setDoc, doc, updateDoc } from "firebase/firestore";
import { NavigationContainer } from '@react-navigation/native';

import * as Analytics from 'expo-firebase-analytics';

import styles from './styles'

const SettingsScreen = () => {
    const [myUser, setUser] = useState('')
    const [lastname, setLastName] = useState('')
    const [firstname, setFirstName] = useState('')

    const navigation = useNavigation()

    const handleUserInfo = async () => {
        const srcuser = await getDoc(doc(db, "users", String(auth.currentUser?.uid)));
        setUser(srcuser.data())
        setLastName(srcuser.data().lastname)
        setFirstName(srcuser.data().firstname)
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            if(!user){
                navigation.replace("Login")
            }
            else {
                Analytics.setCurrentScreen('Paramètres')
                Analytics.logEvent('Paramètres', {
                    firebase_screen: 'Paramètres',
                    firebase_screen_class: SettingsScreen
                  });
                handleUserInfo()
            }
        })
        return unsubscribe
    }, [])

    const saveSettings = async () => {
        await onAuthStateChanged(auth, user => {
            if(user){
                try {
                    updateDoc(doc(db, "users", String(user.uid)), {
                        lastname: lastname,
                        firstname: firstname,
                    });
                    alert('Succès vous informations ont été enregistrés!');
                    
                }
                catch (error) {
                    alert("Error adding document");
                    console.log(error);
                }
            }
        })
        navigation.goBack()
    }

    //alert(myUser.firstname)

    return (
        <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
        >
            <View style={styles.inputContainer}>
                <Text style={styles.screenTitle}>Paramètres</Text>

                <TextInput
                placeholder="Prénom"
                value={[myUser.firstname, firstname]}
                defaultValue={myUser.firstname}
                onChangeText={text => setFirstName(text)}
                style={styles.input}
                ></TextInput>


                <TextInput
                placeholder="Nom"
                value={[myUser.lastname, lastname]}
                defaultValue={myUser.lastname}
                onChangeText={text => setLastName(text)}
                style={styles.input}
                ></TextInput>

            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                onPress={saveSettings}
                style={[styles.buttonFullWidth, styles.buttonColor4]}
                >
                <Text style={styles.buttonOutlineText}>Enregistrer</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    )
}

export default SettingsScreen