import React, { useState, useEffect } from 'react'
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useNavigation } from '@react-navigation/core';
import { NavigationContainer } from '@react-navigation/native';

import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { db, app, auth } from '../Firebase'
import { collection, addDoc, getDocs, setDoc, doc } from "firebase/firestore";
import * as Analytics from 'expo-firebase-analytics';

import styles from './styles'

const RegisterScreen = () => {
    const [lastname, setLastName] = useState('')
    const [firstname, setFirstName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigation = useNavigation()

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            if(user){
                navigation.replace("Home")
            }
        })
        Analytics.logEvent('Inscription', {
            firebase_screen: 'Inscription',
            firebase_screen_class: RegisterScreen
          });
        return unsubscribe
    }, [])

    const handleSignUp = async () => {
        await createUserWithEmailAndPassword(auth, email, password)
        .then(async userCredentials => {
            const user = userCredentials.user;
            await console.log(user.email);
            await console.log(user.uid);
        })
        .catch(error => alert(error.message))

        handleSignIn();

        await onAuthStateChanged(auth, user => {

            if(user){
                try {
                    setDoc(doc(db, "users", String(user.uid)), {
                        lastname: lastname,
                        firstname: firstname,
                        token: "",
                    });
                    alert('Succès vous vous êtes inscrit/e!');
                    Analytics.logEvent('sign_up', {
                        method: 'Email and password',
                    });
                }
                catch (error) {
                    alert("Error adding document");
                    console.log(error);
                }

            }
        })
                
    }

    const handleSignIn = () => {
        signInWithEmailAndPassword(auth, email, password)
        .then(userCredentials => {
            const user = userCredentials.user;
            console.log(user.email);
            //navigation.replace("Home")
        })
        .catch(error => alert(error.message))
    }

    return (
        <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
        >
            <View style={styles.inputContainer}>
                <Text style={styles.screenTitle}>Inscription</Text>

                <TextInput
                placeholder="Prénom"
                value={firstname}
                onChangeText={text => setFirstName(text)}
                style={styles.input}
                ></TextInput>


                <TextInput
                placeholder="Nom"
                value={lastname}
                onChangeText={text => setLastName(text)}
                style={styles.input}
                ></TextInput>


                <TextInput
                placeholder="Adresse email"
                value={email}
                onChangeText={text => setEmail(text)}
                style={styles.input}
                ></TextInput>


                <TextInput
                placeholder="Mot de passe"
                value={password}
                onChangeText={text => setPassword(text)}
                style={styles.input}
                secureTextEntry
                ></TextInput>

            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                onPress={handleSignUp}
                style={[styles.buttonFullWidth, styles.buttonColor2]}
                >
                <Text style={styles.buttonOutlineText}>S'inscrire</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    )
}

export default RegisterScreen