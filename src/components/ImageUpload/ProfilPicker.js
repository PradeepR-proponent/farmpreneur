import React, {useState} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import MButton from "../Button/Button";

export default function PImagePicker(props) {
    const [image, setImage] = useState(null);

    const pickImage = async () => {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: false,
            aspect: [4, 3],
            quality: 1,
        });


        if (!result.cancelled) {
            setImage(result.uri);
        }
    };

    return (
        <View style={styles.btnWrapper}>
            {image &&
            (
                <View style={styles.uploadedImageWrapper}>
                    <Image source={{uri:image}} style={styles.uploadedImage}/>
                    <View style={styles.uploadedImageDoc}>
                        <Text>{props.docTitle}</Text>
                    </View>
                </View>
            )
            }

            {!image && (<MButton style={styles.uploadBtn} textStyle={styles.uploadBtnTxt} title="Upload" mode="contained"
                                 onPress={pickImage}/>)}
        </View>
    );
}

const styles = StyleSheet.create({

    btnWrapper: {
        flex: 1,
    },
    uploadedImageWrapper: {
        height:200,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,

        elevation: 10,
        borderWidth:0,
        marginTop:10,
    },
    uploadedImage:{
        width: "100%",
        height: "100%",
        resizeMode:"cover"
    },
    uploadedImageDoc:{
        position:"absolute",
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#ffffff",
        padding:10
    },
    uploadBtn: {
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
        width: 150
    },
    uploadBtnTxt: {
        color: "black"
    }
});
