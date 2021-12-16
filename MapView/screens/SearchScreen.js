import React, { useEffect, useState, useRef } from 'react';
import MapView, { PROVIDER_GOOGLE, Marker, Callout, Circle } from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Geolocation from '@react-native-community/geolocation';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
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

const SearchScreen = () => {

    const [coords, setCoords] = useState(0.0)
    const defaultCoords = {
          latitude: 43.611817,
          longitude: 1.473166,
    }

    const ref = useRef();
  
    useEffect(() => {
      if(!coords){
        setCoords(defaultCoords)
      }
    }, [])

    const onPressAdress = (data, details) => {
      console.log('DATA ==>> ', data);
      console.log('DETAILS ==>> ', details);
      //Geolocation.getCurrentPosition(info => console.log(info));
    }
  
    return (
      <SafeAreaView>
          <View style={styles.searchBar}>
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
      flex: 1,
      height: '100%',
      width: '100%',
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    searchBar: {
      backgroundColor: 'white',
      height: '100%',
      width: '100%',
      padding: 15,
    },
    label: {
      fontWeight: 'bold',
      color: 'black',
    },
    input: {
      marginTop: 15,
      paddingLeft: 15,
      padding: 6,
      borderRadius: 8,
      borderWidth: 1.5,
      borderColor: 'rgba(0,0,0,0.1)',
    }
  });

export default SearchScreen;