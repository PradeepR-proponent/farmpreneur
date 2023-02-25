import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import DrawerContent from "./DrawerContent";
import appConstant from "config/constants";
import TabNavigator from 'navigation/navigator/TabNavigator';
import ProfileStack from "navigation/stacks/ProfileStack";
import BuyerProductStack from "navigation/stacks/BuyerProductStack";
import UserProductStack from "navigation/stacks/UserProductStack";
import BankInfoScreen from "screen/user/supplier/BankInfoScreen";
import UserDocScreen from "screen/user/supplier/UserDocScreen";
import About from "screen/other/About";
import Privacy from "screen/other/Privacy";
import Terms from "screen/other/Terms";
import { userType } from 'slice/authSlice';
import { useSelector } from "react-redux";
import { Image } from 'react-native';
import ContactUS from "../../screen/auth/ContactUS";
import Consultancy from "../../screen/auth/Consultancy";
import ConsultancyExperts from "../../screen/consultancyExperts/ConsultancyExperts";
import ServiceScreen from "../../screen/auth/ServiceScreen";
import WeatherForcast from "../../screen/services/weatherForcast";
import HygridModel from "../../screen/services/hygridModel";
import InsurancePolicy from "../../screen/services/insurancePolicy";
import SolarTechnology from "../../screen/services/solarTechnology";
import AgroEquipment from "../../screen/services/agroEquipment";
import TrainingStack from "../../navigations/stacks/TrainingStack";
import OtherWebView from '../../screen/other/OtherWebView';
import UserSetting from '../../screen/settings/UserSetting';
import { translate } from '../../languageFeature'
import DwaerTraningStack from '../stacks/DrawrTraining'

const DrawerNavigator = (props) => {

  const { appLanguage } = useSelector(state => state.auth)
  const Drawer = createDrawerNavigator();
  const usertype = useSelector(userType);
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerStyle={{
        width: 260
      }}
      drawerContent={props => <DrawerContent {...props} />}
      drawerContentOptions={{
        activeTintColor: appConstant.themePrimaryColor,
        contentContainerStyle: {
          paddingTop: 0,
        }
      }}
      screenOptions={{
        headerStyle: {
          backgroundColor: appConstant.themeSecondaryColor
        },
        headerTintColor: "#fff"
      }}
    >
      <Drawer.Screen name="TabNavigator" component={TabNavigator} />
      <Drawer.Screen name="UserSetting" component={UserSetting} options={{
        headerShown: true,
        title: translate(appLanguage, "Settings"),
      }}/>


      <Drawer.Screen name="ProfileStack" component={ProfileStack} />
      <Drawer.Screen name="OtherWebView" component={OtherWebView} options={{
        headerShown: true,
        title: "",
      }} />

      <Drawer.Screen
        name="contactus"
        component={ContactUS}
        options={{
          headerShown: true,
          title: translate(appLanguage, "Contact Us"),
        }}
      />

      <Drawer.Screen
        name="consultancy"
        component={Consultancy}
        options={{
          headerShown: true,
          title:translate(appLanguage,"Consultancy") ,
        }}
      />
      <Drawer.Screen
        name="Consultant"
        component={ConsultancyExperts}
        options={{
          headerShown: true,
        }}
      />

      <Drawer.Screen
        name="ServiceScreen"
        component={ServiceScreen}
        options={{
          headerShown: true,
          title: translate(appLanguage,"Services"), 
        }}
      />

      <Drawer.Screen
        name="WeatherForcast"
        component={WeatherForcast}
        options={{
          headerShown: true,
          title: ""
        }}
      />

      <Drawer.Screen
        name="HygridModel"
        component={HygridModel}
        options={{
          headerShown: true,
          title: ""
        }}
      />
      <Drawer.Screen
        name="SolarTechnology"
        component={SolarTechnology}
        options={{
          headerShown: true,
          title: ""

        }}
      />

      <Drawer.Screen
        name="AgroEquipment"
        component={AgroEquipment}
        options={{
          headerShown: true,
          title: ""

        }}
      />

      <Drawer.Screen
        name="InsurancePolicies"
        component={InsurancePolicy}
        options={{
          headerShown: true,
          title: ""

        }}
      />
      <Drawer.Screen
        name="Training"
        component={DwaerTraningStack}
        options={{
          headerShown: true,
          title: translate(appLanguage,"Training")
        }}
      />


      {/* <Drawer.Screen name="About" component={About} options={{
                        headerShown:true,
                        title:"About Us"
                    }}/>
            <Drawer.Screen name="Privacy" component={Privacy} options={{
                        headerShown:true,
                        title:"Privacy Policy"
                    }}/>
            <Drawer.Screen name="Terms" component={Terms} options={{
                        headerShown:true,
                        title:"Term & Conditions"
                    }}/> */}

      <Drawer.Screen name="UserProductStack" component={UserProductStack} />
      <Drawer.Screen name="BankInfoScreen" component={BankInfoScreen} options={{
        headerShown: true,
        title:translate(appLanguage,"Bank Details") 
      }} />
      <Drawer.Screen name="UserDocScreen" component={UserDocScreen} options={{
        headerShown: true,
        title:translate(appLanguage,"User Documents")  
      }} />
      <Drawer.Screen name="BuyerProductStack" component={BuyerProductStack} />
    </Drawer.Navigator>
  );
}

export default DrawerNavigator;
