import * as React from 'react';
import { FlatList, SafeAreaView, View, StyleSheet,Pressable,Image,Text } from "react-native";
import appConstant from "config/constants";
import { StatusBar } from "expo-status-bar";
import { fetchEnrolledCourses } from 'services/course';
import Loader from "components/Loader";
import { useToast } from "react-native-toast-notifications";
import moment from 'moment';
import InfoCard from "components/Card/InfoCard";

export default function EnrolledCourses(props) {
    
    const [courses, setCourses] = React.useState([]);
    const toast = useToast();
    const {navigation} = props;

    function handleProductClick(id) {
        if(id)
            props.navigation.navigate('CourseDetail',{id});
    }

    //fetch prodcuts
    const { isLoading: loading, error, data, isFetching ,refetch} = fetchEnrolledCourses();
    if (error) toast.show(error.message, { type: "danger", duration: 2000 });

    React.useEffect(() => {
        setCourses(data?.data);
    }, [data]);

    const formatDate = (date) =>{
        let newDate = new Date(date);
        return moment(newDate).format('DD MMMM YYYY');
    }

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            refetch()
        });
        return unsubscribe;
    }, [navigation]);

    const Item = ({title,description,image,duration,price,startDate,handleClick}) =>{
        return (
            <Pressable style={styles.itemWrapper} onPress={() => {
                handleClick();
            }}>
                <View style={styles.itemImgWrapper}>
                    <Image source={image} style={styles.itemImg} />
                </View>
                <View style={styles.itemDetails}>
                    <Text style={styles.itemTitle} numberOfLines={2}>{title}</Text>
                    <Text style={styles.itemTags} numberOfLines={3} >{description}</Text>
                    {props.rating !== undefined && (<View style={styles.itemRating}>
                        {fetchRatings(props.rating)}
                    </View>)}
                    <View style={styles.itemInfo}>
                        <View style={styles.itemPriceWrapper}>
                            <Text style={styles.itemPriceTxt}>₹ <Text style={styles.itemPrice}>{price}</Text></Text>
                        </View>
                        <View style={styles.itemAddCartWrapper}>
                            <Text style={styles.itemCount}>{duration} Hours</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.dateWrapper}>
                    <Text style={styles.dateTxt} >{formatDate(startDate)}</Text>
                </View>
            </Pressable>
        );
    }

    
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" backgroundColor={appConstant.statusBarColor} />
            <View style={styles.main}>
                {courses?.length != 0 && <FlatList 
                    keyExtractor={(item) => item.id} 
                    data={courses} 
                    onRefresh={refetch}
                    refreshing={loading}
                    renderItem={({ item }) => {
                        return (
                            <Item title={item?.course?.title} description={item?.course?.description} price={item?.course?.price} startDate={item?.course?.start_date}
                                image={{uri:item?.course?.course_image_url}} duration={item?.course?.duration} handleClick={()=>{handleProductClick(item?.course?.id)}} />
                        );
                    }} 
                />}
            {courses?.length == 0 && <InfoCard type={"notFound"} message={"No courses found. Please check later"}/>}
            </View>
            {(loading || isFetching ) && (<Loader visible={true} />)}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    main: {
        flex: 1,
        backgroundColor: "#fff",
    },
    itemWrapper: {
        flex:1,
        flexDirection: "row",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,

        elevation: 6,
        backgroundColor: "#ffffff",
        margin: 20,
        marginBottom: 10,
        borderRadius:8
    },
    itemImgWrapper: {
        width: "40%",
    },
    itemImg: {
        width: 120,
        height: "100%",
        resizeMode:"cover",
        borderBottomLeftRadius:8,
        borderTopLeftRadius:8
    },
    itemDetails: {
        width: "50%",
        flexGrow: 1,
        padding: 15,
        paddingHorizontal:5
    },
    itemRating: {
        flexDirection: "row"
    },
    itemInfo: {
        flexDirection: "row",
        marginTop: 10,
        alignItems: "center",
        justifyContent: "space-between"
    },
    itemPriceWrapper: {
        width: "30%"
    },
    itemPriceTxt: {
        fontFamily: appConstant.baseFontFamily,
        fontSize: 16,
        color:appConstant.themePrimaryColor
    },
    itemPrice: {
        fontFamily: appConstant.productBoldFamily,
        fontSize: 16
    },
    itemAddCartWrapper: {
        flexDirection: "row",
        width: "60%",
        justifyContent: "space-evenly"
    },
    itemTitle: {
        fontFamily: appConstant.productBoldFamily,
        fontSize: 18,
        marginBottom: 5,
        marginTop:5,
        color:appConstant.themeSecondaryColor
    },
    itemTags: {
        fontFamily: appConstant.baseFontFamily,
        fontSize: 12,
        color:appConstant.themeSecondaryColor
    },
    itemCount: {
        fontSize: 16,
        color:appConstant.themePrimaryColor
    },
    dateWrapper:{
        position:"absolute",
        top:-12,
        right:-5,
        backgroundColor:appConstant.themeSecondaryColor,
        padding:5,
        paddingHorizontal:10,
        borderRadius:8
    },
    dateTxt:{
        fontFamily: appConstant.baseFontFamily,
        fontSize: 12,
        color:"#fff"
    }
});
