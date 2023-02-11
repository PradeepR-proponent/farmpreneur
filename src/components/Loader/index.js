import React from 'react';
import {Modal, StyleSheet} from "react-native";
import AnimatedLoader from "react-native-animated-loader";

const Loader = (props) =>{
    return(
        <Modal
            animationType="slide"
            transparent={props.transparent?props.transparent:true}
            {...props}
        >
            <AnimatedLoader
                visible={true}
                overlayColor={props.loaderColor?props.loaderColor:"rgba(255,255,255,0.85)"}
                source={require("../../assets/loaders/spin.json")}
                animationStyle={styles.loader}
                speed={1}
            >

            </AnimatedLoader>
        </Modal>
    );
}

const styles = StyleSheet.create({
    loader:{
        width:100,
        height:100
    }
});

export default Loader;
