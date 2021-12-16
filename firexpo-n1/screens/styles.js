import { StyleSheet, Text, View } from 'react-native';

export default StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    screenTitle:{
        padding: 20,
        margin: 5,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 20
    },
    inputContainer: {
        width: '80%',
        marginBottom: 5,
    },
    input: {
        backgroundColor: 'white',
        borderRadius: 6,
        padding: 8,
        margin: 5
    },
    buttonContainer: {
        width: '80%',
    },
    buttonFlexContainer: {
        width: '80%',
        display: 'flex',
        flexDirection: 'row'
    },
    button: {
        borderRadius: 6,
        padding: 12,
        margin: 5,
        width: '47%',
    },
    buttonFullWidth: {
        borderRadius: 6,
        padding: 12,
        margin: 5,
        width: '97%',
    },
    buttonOutline: {

    },
    buttonOutlineText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    buttonColor1: {
        backgroundColor: 'skyblue',
    },
    buttonColor2: {
        backgroundColor: 'mediumpurple',
    },
    buttonColor3: {
        backgroundColor: 'crimson',
    },
    buttonColor4: {
        backgroundColor: 'mediumaquamarine',
    },
    buttonColor5: {
        backgroundColor: 'darkslateblue',
    },
    buttonColor6: {
        backgroundColor: 'orange',
    },
});