import * as React from 'react';
import { SafeAreaView, View, StyleSheet, Image, Text, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import appConstant from "config/constants";
import { StatusBar } from "expo-status-bar";
import { fetchUserMembership } from 'services/user';
import Loader from "components/Loader";
import { useToast } from "react-native-toast-notifications";

export default function Membership(props) {
    const [memberData, setMemberData] = React.useState({});
    const toast = useToast();

    //fetch member data
    // const { isLoading: loading, error, data, isFetching, refetch } = fetchUserMembership();
    // if (error) toast.show(error.message, { type: "danger", duration: 2000 });

    //get and set member data
    // React.useEffect(() => {
    //     setMemberData(data?.data);
    // }, [data]);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" backgroundColor={appConstant.statusBarColor} />
            <ScrollView style={styles.main} contentContainerStyle={styles.mainContent}>
                <View style={styles.card}>
                    <View style={styles.base}>
                        <View style={styles.baseTop} />
                        <View style={styles.baseBottom} />
                    </View>
                    <Text>Membership for 1 year</Text>
                    <Text>$ 120</Text>
                    <View style={styles.cardExpiry}>
                        <Text>Start Date</Text>
                        <Text>10 Feburary 2022</Text>
                    </View>
                </View>
            </ScrollView>
            {/* {(loading || isFetching) && (<Loader visible={true} />)} */}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    main: {
        flex: 1,
        backgroundColor: "#fff",
    },
    mainContent: {
        flexGrow: 1
    },
    card: {
        paddingTop: 90
    },
    base: {
        transform: [
            { rotateX: "180deg" }
        ],
        position:"absolute"
    },
    baseTop: {
        borderBottomWidth: 30,
        borderBottomColor: "red",
        borderLeftWidth: 20,
        borderLeftColor: "transparent",
        borderRightWidth: 20,
        borderRightColor: "transparent",
        height: 0,
        width: 0,
        left: 0,
        top: -30,
        position: "absolute",
    },
    baseBottom: {
        backgroundColor: "red",
        height: 40,
        width: 40,
    },

});
