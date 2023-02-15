// development
// const apiUrl = "http://192.168.1.114:8000/api";
// const appUrl = "http://192.168.:8000";

//production
const apiUrl = "https://api.farmpreneur.in/api";
const appUrl = "https://api.farmpreneur.in";

const appConstant = {

    Languages: [
        "English",
        "Hindi"
    ],
    headerBackground: "#0B5B80",
    wetherAppId: `90d178e42e1f3b47fe9dcf11a83b09a6`,
    // themePrimaryColor: "#6DBA49",
    themePrimaryColor: "#519F2F",
    // themeSecondaryColor: "#393939",
    themeSecondaryColor: "#0B5B80",
    themePrimaryLightColor: "#BFE4C2",
    statusBarColor: "#474747",
    baseFontFamily: "Montserrat_400Regular",
    textSecondaryColor: "#8d8d8d",
    basePrimaryFontSize: 16,
    baseSecondaryFontSize: 14,
    drawerItemTextColor: "#519F2F",
    drawerActiveBackgroundColor: "#448625",
    drawerItemIconSize: 25,
    productBoldFamily: "Montserrat_500Medium",
    apiUrl,
    appUrl,
    instamojo_redirect_url: `${appUrl}/payment/instamojo/callback`,
    environment: "development",

    aboutUrl: "https://farmpreneur.in/our-farm/",
    privacyUrl: "https://farmpreneur.in/privacy-policy/",
    termUrl: "https://farmpreneur.in/term-and-condition/",
    rateUs: 'https://play.google.com/store/apps/details?id=com.farmpreneur'
};
export default appConstant;