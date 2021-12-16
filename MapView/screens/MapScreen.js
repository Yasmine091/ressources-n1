import React, { useEffect, useState, useRef } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Callout, Circle } from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import { useIsFocused, useNavigation } from '@react-navigation/core';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Geolocation from '@react-native-community/geolocation';
import MapViewDirections from 'react-native-maps-directions';
import * as geolib from 'geolib';
import Geocoder from 'react-native-geocoding';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

const MapScreen = () => {

    const navigation = useNavigation()

    const [coords, setCoords] = useState(0.0)
    const defaultCoords = {
          shortname: 'Impasse Calvinet',
          latitude: 43.611817,
          longitude: 1.473166,
    }

    const [distance, setDistance] = useState('')

    const ref = useRef();

    const onPressAdress = (data, details) => {
      console.log('DATA ==>> ', data);
      console.log('DETAILS ==>> ', details);

      let choosenCoords = {
        shortname: details.address_components[1].short_name,
        latitude: details.geometry.location.lat,
        longitude: details.geometry.location.lng,
      }
      
      //console.log(details.address_components[1].short_name)
      setCoords(choosenCoords)

      //Geolocation.getCurrentPosition(info => console.log(info));
    }

    // async function requestPermissions() {
    //   if (Platform.OS === 'ios') {
    //     const auth = await Geolocation.requestAuthorization("whenInUse");
    //     if(auth === "granted") {
    //       Geolocation.getCurrentPosition(device => {
    //         console.log(device)
    //         const currentLocation = {
    //           latitude: device.coords.latitude,
    //           longitude: device.coords.longitude,
    //         }
    //         setCoords(currentLocation)
    //       })
    //     }
    //   }
    
    //   if (Platform.OS === 'android') {
    //     await PermissionsAndroid.request(
    //       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    //     );
    //     if ('granted' === PermissionsAndroid.RESULTS.GRANTED) {
    //       Geolocation.getCurrentPosition(device => {
    //         console.log(device)
    //         const currentLocation = {
    //           latitude: device.coords.latitude,
    //           longitude: device.coords.longitude,
    //         }
    //         setCoords(currentLocation)
    //       })
    //     }
    //   }
    // }
  
    useEffect(() => {
      if(!coords){
        setCoords(defaultCoords)
      }
    }, [])

    return (
      <SafeAreaView>

          <View style={styles.container}>
            <MapView
              provider={PROVIDER_GOOGLE} // remove if not using Google Maps
              style={styles.map}
              region={{
                latitude: coords.latitude,
                longitude: coords.longitude,
                latitudeDelta: 0.09,
                longitudeDelta: 0.03,
                distance: 0,
              }}
              >

              {/* // requête recup toutes les coiffeuses disponibles dans la prochaine heure (?)
              // array de distances [] -> coiffeuse + distance (?)
                for coiffeuse in coiffeuses {
                  // transformer adresse en coordonnées
                  if is -> geolib.isPointWithinRadius(
                    // Impasse Calvinet, 31500 Toulouse
                    { latitude: 51.525, longitude: 7.4575 },
                    { latitude: 51.5175, longitude: 7.4678 },
                    5000
                  ); == true {
                    // les afficher directement (?)
                    // declencher une action..
                    // enregistrer coiffeuse + distance dans array
                  }

                }

                // trier par proximité
                // afficher tout */}



              <Circle
              center={{
                latitude: coords.latitude,
                longitude: coords.longitude,
              }}
              radius={3000}
              strokeColor={'rgba(255, 199, 41, 0.6)'}
              fillColor={'rgba(255, 199, 41, 0.3)'}
              >
              </Circle>


              <Marker
              pinColor={'red'}
              coordinate={{
                latitude: 43.611817,
                longitude: 1.473166,
              }}
              title={'Impasse calvinet'}
              ></Marker>

              <Marker
              pinColor={'blue'}
              coordinate={{
                latitude: coords.latitude,
                longitude: coords.longitude,
              }}
              title={coords.shortname}
              ></Marker>


              <MapViewDirections
              origin={{
                latitude: 43.611817,
                longitude: 1.473166,
              }}
              destination={{
                latitude: coords.latitude,
                longitude: coords.longitude,
              }}
              apikey={''}
              strokeWidth={3}
              strokeColor="hotpink"
              onReady={(data) => {
                console.log(data.distance)
                setDistance(data.distance)
              }}
              />


            </MapView>
          </View>
  
          <View style={styles.searchBar}>
            <Text style={styles.label}>Vous êtes à {distance}m de votre destination</Text>
            <Text style={styles.label}>Rechercher :</Text>
              <GooglePlacesAutocomplete
                ref={ref}
                placeholder='Adresse..'
                onPress={(data, details = null) => {
                  onPressAdress(data, details)
                }}
                fetchDetails={true}
                query={{
                  key: '',
                  language: 'fr',
                  components: 'country:fr',
                }}
                styles={{
                  textInput: styles.input,
                }}
                //currentLocation={true}
                //currentLocationLabel='Ma localisation'
                onFail={error => console.error(error)}
                />
          </View>
  
      </SafeAreaView>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      //...StyleSheet.absoluteFillObject,
      height: 1000,
      width: 500,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    map: {
      ...StyleSheet.absoluteFillObject,
      height: '100%',
      width: '100%',
    },
    searchBar: {
      position: 'absolute',
      top: 0,
      backgroundColor: 'white',
      width: '100%',
      padding: 15,
      borderBottomEndRadius: 24,
      borderBottomStartRadius: 24,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 10,
      },
      shadowOpacity: 1,
      shadowRadius: 13.97,
      elevation: 21,
    },
    label: {
      fontWeight: 'bold',
      color: 'black',
    },
    input: {
      marginTop: 15,
      paddingLeft: 15,
      padding: 12,
      borderRadius: 8,
      borderWidth: 1.5,
      borderColor: 'rgba(0,0,0,0.1)',
    }
  });

export default MapScreen;