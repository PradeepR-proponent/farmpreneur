import * as React from 'react';
import { SafeAreaView, View, StyleSheet, ScrollView } from "react-native";
import appConstant from "config/constants";
import { StatusBar } from "expo-status-bar";
import { useToast } from "react-native-toast-notifications";
import TextInput from "components/Text/TextInput";
import MButton from "components/Button/Button";
import Loader from "components/Loader";
import { createEnquiry } from 'services/enquiry';
import { translate } from '../../languageFeature'
import { useSelector } from 'react-redux';
import axios from 'axios';
import * as SecureStore from "expo-secure-store";


export default function Enquiry(props) {


    const { appLanguage } = useSelector(state => state.auth)
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [phone, setPhone] = React.useState("");
    const [subject, setSubject] = React.useState("")
    const [message, setMessage] = React.useState("");
    const toast = useToast();
    const enquiryMutation = createEnquiry();
    const [isLoading, setisLoading] = React.useState(false)

    // if (isError) toast.show(enquiryMutation.error.message, { type: "danger", duration: 2000 });

    const submitEnquiry = async () => {
        try {
            setisLoading(true)
            let token = await SecureStore.getItemAsync('userToken');
            if (name != "" && email != "" && phone != "" && subject != "" && message != "") {
                const res = await axios({
                    method: 'post',
                    url: `${appConstant.apiUrl}/enquiry`,
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    data: { name, email, phone, subject, message }
                })
                if (res.data) {
                    setisLoading(false)
                    toast.show(res.data.message, { type: "info", duration: 2000 })
                    setName(""); setEmail(""); setPhone(""); setSubject(""); setMessage("");

                }
            }
        } catch (error) {
            setisLoading(false)
            toast.show(error.response.data.message, { type: "danger", duration: 2000 })
        }

    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" backgroundColor={appConstant.statusBarColor} />
            <ScrollView style={styles.main} contentContainerStyle={styles.mainContent}>
                <View style={styles.card}>
                    <TextInput
                        label={translate(appLanguage, "Name *")}
                        style={styles.cardInput}
                        value={name}
                        onChangeText={(t) => setName(t)} />
                    <TextInput
                        label={translate(appLanguage, "Email *")}
                        style={styles.cardInput}
                        textContentType="emailAddress"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={(t) => setEmail(t)}
                    />
                    <TextInput
                        label={translate(appLanguage, "Phone *")}
                        style={styles.cardInput}
                        textContentType="telephoneNumber"
                        value={phone}
                        onChangeText={(t) => setPhone(t)}
                    />
                    <TextInput
                        label={translate(appLanguage, "Subject *")}
                        style={styles.cardInput}
                        value={subject}
                        onChangeText={(t) => setSubject(t)} />

                    <TextInput
                        label={translate(appLanguage, "Message *")}
                        style={[styles.cardInput, styles.cardTextarea]}
                        multiline={true}
                        numberOfLines={3}
                        value={message}
                        onChangeText={(t) => setMessage(t)}
                    />
                    <MButton title={translate(appLanguage, "Submit")} mode="contained" onPress={submitEnquiry} />
                </View>
            </ScrollView>
            {(isLoading) && (<Loader visible={true} />)}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    main: {
        flex: 1,
    },
    mainContent: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    card: {
        padding: 40,
        paddingTop: 20,
        width: "90%",
        borderRadius: 10,
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,

        elevation: 7,
    },
    cardInput: {
        backgroundColor: "#fff",
        marginVertical: 5,
        paddingHorizontal: -1,
    },
    cardTextarea: {

    }
});
