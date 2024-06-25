import React, { useState } from 'react';
import { View, Pressable, Image, Alert, StyleSheet, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

const ImageUploadComponent = () => {
  const [imageUri, setImageUri] = useState(null);
  const [message, setMessage] = useState('');

  const pickImage = async () => {
    console.log('Pick image button pressed');
    Alert.alert('Pick image button pressed');

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log('Image picker result', result);

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      setMessage('');
      console.log('Image URI set:', uri);
      Alert.alert('Image selected', uri);
    } else {
      console.log('Image selection cancelled');
      Alert.alert('Image selection cancelled');
    }
  };

  const takePicture = async () => {
    console.log('Take picture button pressed');
    Alert.alert('Take picture button pressed');

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log('Camera result', result);

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      setMessage('');
      console.log('Image URI set:', uri);
      Alert.alert('Image taken', uri);
    } else {
      console.log('Image capture cancelled');
      Alert.alert('Image capture cancelled');
    }
  };

 
  const uploadImage = async () => {
    console.log('Upload button pressed');
    Alert.alert('Upload button pressed');
  
    if (!imageUri) {
      Alert.alert('No image selected', 'Please select an image to upload');
      return;
    }
  
    const formData = new FormData();
    formData.append('file', {
      uri: imageUri,
      name: 'photo.jpg',
      type: 'image/jpeg',
    });
  
    console.log('Form data prepared', formData);
  
    try {
      const response = await fetch('https://9imktv4xuc.execute-api.us-east-2.amazonaws.com/test', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        mode: 'cors' // Ensure CORS mode is set
      });
  
      console.log('Fetch response', response);
  
      if (response.ok) {
        const responseJson = await response.json();
        setMessage('Upload Success: ' + JSON.stringify(responseJson));
        Alert.alert('Upload Success', JSON.stringify(responseJson));
      } else {
        setMessage('Upload Failed: ' + response.statusText);
        Alert.alert('Upload Failed', response.statusText);
      }
    } catch (error) {
      setMessage('Upload Failed: ' + error.message);
      Alert.alert('Upload Failed', error.message);
    }
  };
  

  return (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Pick an image from gallery</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={takePicture}>
        <Text style={styles.buttonText}>Take a picture</Text>
      </Pressable>
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      <Pressable style={styles.button} onPress={uploadImage}>
        <Text style={styles.buttonText}>Upload Image</Text>
      </Pressable>
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 16,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  message: {
    marginTop: 20,
    fontSize: 16,
    color: 'blue',
    textAlign: 'center',
  },
});

export default ImageUploadComponent;
