import React, { useState, useEffect } from 'react'
import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useNavigation } from '@react-navigation/core';
import { NavigationContainer } from '@react-navigation/native';

import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { db, app, auth } from '../Firebase'
import * as Analytics from 'expo-firebase-analytics';

import styles from './styles'

const LoginScreen = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigation = useNavigation()

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            if(user){
                navigation.replace("Home")
            }
        })
        Analytics.logEvent('Connexion', {
            firebase_screen: 'Connexion',
            firebase_screen_class: LoginScreen
          });
        return unsubscribe
    }, [])

    const handleSignUp = () => {
        navigation.navigate("Register")
    }

    const handleSignIn = () => {
        signInWithEmailAndPassword(auth, email, password)
        .then(userCredentials => {
            const user = userCredentials.user;
            console.log(user.email);
            alert('Succès vous êtes connecté/e!');
            Analytics.logEvent('login', {
                method: 'Email and password',
                user_id: user.uid,
                email: user.email,
            });
            navigation.navigate("Home")
        })
        .catch(error => alert(error.message))
    }

    return (
        <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
        >
            <View style={styles.inputContainer}>
                <Text style={styles.screenTitle}>Connexion</Text>

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

            <View style={styles.buttonFlexContainer}>
                <TouchableOpacity
                onPress={handleSignIn}
                style={[styles.button, styles.buttonColor1]}
                >
                <Text style={styles.buttonOutlineText}>Se connecter</Text>
                </TouchableOpacity>
                <TouchableOpacity
                onPress={handleSignUp}
                style={[styles.button, styles.buttonColor2]}
                >
                <Text style={styles.buttonOutlineText}>S'inscrire</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    )
}

export default LoginScreen