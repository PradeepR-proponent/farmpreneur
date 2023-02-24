import React, { useEffect, useState } from 'react'
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
    View
} from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import SelectBox from '../../components/selectBox/SelectBox';
import { LANGUAGE } from '../../_slice/authSlice';
import appConstant from '../../config/constants';
import { translate } from '../../languageFeature'
import * as SecureStore from 'expo-secure-store';


const UserSetting = () => {

    const { appLanguage } = useSelector(state => state.auth)
    const dispatch = useDispatch()
    const [selected, setSelected] = useState("")

    const height = useWindowDimensions().height;
    const windowWidth = useWindowDimensions().width

    const getLang = async () => {
        const lang = await SecureStore.getItemAsync('appLang');
        if (lang != null) {
            setSelected(lang)
        }
    }

    const setLang = async (appLang) => {
        try {
            await SecureStore.setItemAsync('appLang', appLang);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (selected != "") {
            dispatch(LANGUAGE({ language: selected }));
        }
        if (selected === "English") {
            setLang("English")
        } else if (selected === "Hindi") {
            setLang("Hindi")
        }
    }, [selected])


    useEffect(() => {
        getLang()
    }, [])


    return (<SafeAreaView>
        <View style={{ ...styles.container, width: windowWidth, height: height }} >

            <View style={styles.flexbox}>
                <Text style={styles.textHeading}>
                    {translate(appLanguage, "Choose Language")}
                </Text>
                <SelectBox
                    options={appConstant.Languages}
                    setSelected={setSelected}
                    defaultvalue={selected}
                />
            </View>
        </View>
    </SafeAreaView>
    )
}

export default UserSetting



const styles = StyleSheet.create({

    container: {
        flexGrow: 1,
        padding: 20
    },
    flexbox: {
        display: 'flex',
        flexDirection: "row",
        justifyContent: "space-between"
    },
    textHeading: {
        color: "#333",
        fontSize: 16,
    }
})