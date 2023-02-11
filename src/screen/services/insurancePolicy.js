import React from "react";
import {
  Button,
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  Pressable,
  Linking,
  View,
} from "react-native";

const InsurancePolicy = () => {

  
const height=useWindowDimensions().height;
const windowWidth=useWindowDimensions().width

  return (
    <View style={{...styles.container,width:windowWidth,height:height}} >
    <Text style={styles.text} >Comming Soon .. . </Text>
  </View>
  );
};

export default InsurancePolicy;



const styles=StyleSheet.create({

  container:{
    borderWidth:1,
    display:'flex',
    justifyContent:"center",
    alignItems:"center"
  },

  text:{
fontSize:40,
color :"lightgray"
  }
})