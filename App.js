import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker'
import * as Sharing from 'expo-sharing'
import uploadToAnonymousFilesAsync from 'anonymous-files';

import logo from "./assets/logo.png"

const Button = (props) => {
  const { type, children } = props

  return (
    <TouchableOpacity
      {...props}
      style={[styles.button, type === 'cancel' ? {backgroundColor: 'red'} : {backgroundColor: 'blue'}]}
    >
      <Text style={styles.buttonLabel}>{children}</Text>
    </TouchableOpacity>
  )
}

const App = () => {
  const [selectedImage, setSelectedImage] = React.useState(null);

  const openImagePickerAsync = async () => {
    let permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync();

    if (pickerResult.cancelled === true) {
      return;
    }

    if (Platform.OS === 'web') {
      let remoteUri = await uploadToAnonymousFilesAsync(pickerResult.uri);
      setSelectedImage({ localUri: pickerResult.uri, remoteUri });
    } else {
      setSelectedImage({ localUri: pickerResult.uri, remoteUri: null });
    }
  }

  const openShareDialogAsync = async () => {
    if (!(await Sharing.isAvailableAsync())) {
      alert(`The image is available for sharing at: ${selectedImage.remoteUri}`);
      return;
    }

    Sharing.shareAsync(selectedImage.localUri);
  };

  const removeImage = () => {
    setSelectedImage(null)
  }

  if (selectedImage !== null) {
    return (
      <View style={styles.container}>
        <Image
          source={{ uri: selectedImage.localUri }}
          style={styles.thumbnail}
        />
        <View style={styles.menu}>
          {/* <TouchableOpacity style={styles.buttonBack} onPress={removeImage}>
            <Text style={styles.buttonLabel}>Back</Text>
          </TouchableOpacity> */}
          <Button type="cancel" onPress={removeImage}>Back</Button>

          {/* <TouchableOpacity style={styles.button} onPress={openShareDialogAsync}>
            <Text style={styles.buttonLabel}>Share</Text>
          </TouchableOpacity> */}

          <Button onPress={openShareDialogAsync}>Share</Button>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Image source={logo} style={styles.logoImage} />
      <Text style={styles.header}>To share a photo from your phone with a friend, just press the button below!</Text>

      <Button onPress={openImagePickerAsync}>Pick a photo</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    color: '#888',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10
  },
  logoImage: {
    width: 350,
    height: 159,
    marginBottom: 20
  },
  button: {
    paddingHorizontal: 30,
    paddingVertical: 8,
    borderRadius: 20
  },

  buttonLabel: {
    fontSize: 20,
    color: "#fff",
    lineHeight: 25
  },
  menu: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    marginTop: 20,
  },
  thumbnail: {
    width: 300,
    height: 300,
    resizeMode: "contain",
    marginBottom: 10
  }
});

export default App
