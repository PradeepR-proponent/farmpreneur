import React from 'react';
import {Image, Modal, StyleSheet, Text, View} from "react-native";
import Button from "../Button/Button";
import appConstant from "../../config/constants";

const ModalMessage = (props) =>{
    return(
        <Modal
            animationType="slide"
            transparent={true}
            visible={props.visible}
            style={styles.errorModalWrapper}
        >
            <View style={styles.errorWrapper}>
                <View style={styles.errorMsgWrapper}>
                    {props.error?(<Image source={require('../../assets/icon/cancel.png')} style={styles.errorImg}/>):
                        (<Image source={require('../../assets/icon/checked.png')} style={styles.errorImg}/>)}
                    <Text style={styles.errorTxtMsg}>{props.errorMsg}</Text>
                    <View style={styles.btnWrapper}>
                        <Button title="OK" mode="contained" onPress={props.handleClick}/>
                    </View>
                </View>
            </View>

        </Modal>
    );
}

const styles = StyleSheet.create({
    errorWrapper:{
        flex:1,
        alignItems:"center",
        justifyContent:"center",
        backgroundColor:"rgba(0,0,0,0.79)"
    },
    errorMsgWrapper:{
        backgroundColor: "#fff",
        width:"70%",
        alignItems: "center",
        paddingBottom:0,
        borderRadius:12
    },
    errorImg:{
      width:70,
      height:70,
      marginVertical:10
    },
    errorTxtMsg:{
        marginTop:0,
        textAlign:"center",
        paddingHorizontal:20,
        fontSize:appConstant.basePrimaryFontSize+2,
        fontFamily: appConstant.baseFontFamily,
    }
});

export default ModalMessage;
