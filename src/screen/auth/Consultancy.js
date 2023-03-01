import React from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  useWindowDimensions,
  FlatList,ScrollView,
  Pressable,
} from "react-native";
import { useSelector } from "react-redux";
import user from "../../assets/icon/DrHarsh.jpg";
import { translate } from '../../languageFeature'



const Consultancy = ({ navigation }) => {

  const { appLanguage } = useSelector(state => state.auth)
  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;


  const ExpertList = [
    {
      id: "1",
      sector: translate(appLanguage,"Ganoderma and other Mushrooms"),
      description: translate(appLanguage, "Expert_descrition"),
      image: user,
      name: translate(appLanguage, "Dr. N.S.K Harsh"),
      title: translate(appLanguage, "(Retd. Scientist - G, FRI, Dehradun)"),
      title2:translate(appLanguage, "Retd"),
      onClick: (data) => {
        navigation.navigate("Consultant", { data: data });
      },
    },
    {
      sector: translate(appLanguage,"Ganoderma and other Mushrooms"),
      id: "2",
      description: translate(appLanguage, "Expert_descrition"),
      image: user,
      name: translate(appLanguage, "Dr. Kushwaha"),
      title: translate(appLanguage, "(Director, Pantnagar University)"),
      onClick: (data) => {
        return
      },
    },
    {
      sector: translate(appLanguage,"Ganoderma and other Mushrooms"),
      id: "3",
      description: translate(appLanguage, "Expert_descrition"),
      image: user,
      name: translate(appLanguage, "Dr. S.K Mishra"),
      title: translate(appLanguage, "(Scientist-Pantnagar University)"),

      onClick: (data) => {
        return
      },
    },
    {
      sector: translate(appLanguage,"Ganoderma and other Mushrooms"),
      id: "4",
      description: translate(appLanguage, "Expert_descrition"),
      image: user,
      name: translate(appLanguage, "Mr. Keshav Sharma"),
      title: translate(appLanguage, "(Krishivan Doon, Dehradun)"),
      onClick: (data) => {
        return
      },
    },
    {
      sector: translate(appLanguage,"Ganoderma and other Mushrooms"),
      id: "5",
      description: translate(appLanguage, "Expert_descrition"),
      image: user,
      name: translate(appLanguage, "Mr. Pramod Chaurasia"),
      title: translate(appLanguage, "(Krishivan Doon, Dehradun)"),

      onClick: (data) => {
        return
      },
    },
//    {
//      sector: translate(appLanguage,"Ganoderma and other Mushrooms"),
//      id: "6",
//      description: translate(appLanguage, "Expert_descrition"),
//      image: user,
//      name: translate(appLanguage, "Mr. Navdeep Rana"),
//      title: translate(appLanguage, "(Expert - Mushroom/Honey)"),
//
//      onClick: (data) => {
//        return
//      },
//    },
  ];

  const multipleExpertList = [
   {
        id: "3",
        description: translate(appLanguage, "Expert_descrition"),
        image: user,
        name: translate(appLanguage, "Mr Durga Verma"),
        title: translate(appLanguage, "(Business Maker, Motivational Speaker)"),
        onClick: (data) => {
          return
        },
      },
    {
      id: "1",
      description: translate(appLanguage, "Expert_descrition"),
      image: user,
      name: translate(appLanguage, "Miss Shikha Sharma"),
      title: translate(appLanguage, "(Retd. NABARD)"),
      onClick: (data) => {
        return
      },
    },
    {
      id: "2",
      description: translate(appLanguage, "Expert_descrition"),
      image: user,
      name: translate(appLanguage, "Mr. Nitesh Kaushik"),
      title: translate(appLanguage, "(Scientist, Envt. & Water Solution)"),
      onClick: (data) => {
        return
      },
    },

    {
      id: "4",
      description: translate(appLanguage, "Expert_descrition"),
      image: user,
      name: translate(appLanguage, "Mr. Amarpreet S Chawala"),
      title: translate(appLanguage, "Business Maker & Mentor"),
      onClick: (data) => {
        return
      },
    },
  ];

  const marketingExpertList = [
    {
      id: "1",
      description: translate(appLanguage, "Expert_descrition"),
      image: user,
      name: translate(appLanguage, "Mr Avinash Kumar"),
      title: translate(appLanguage, "(Export / Marketing Expert)"),
      onClick: (data) => {
        return
      },
    },
    {
      id: "2",
      description: translate(appLanguage, "Expert_descrition"),
      image: user,
      name: translate(appLanguage, "Mr. Sagar Rai"),
      title: translate(appLanguage, "Business, Uttarakhand"),

      onClick: (data) => {
        return
      },
    },
    {
      id: "3",
      description: translate(appLanguage, "Expert_descrition"),
      image: user,
      name: translate(appLanguage, "Mr. Alok Jha"),
      title: translate(appLanguage, "(Digital Solution Provider)"),
      onClick: (data) => {
        return
      },
    },
  ];

  const agricutureExpertList = [
    {
      id: "1",
      description: translate(appLanguage, "Expert_descrition"),
      image: user,
      name: translate(appLanguage, "Mr. Navdeep Rana"),
      title: translate(appLanguage, "(Expert - Mushroom/Honey)"),

      onClick: (data) => {
        return
      },
    },
      {
          id: "2",
          description: translate(appLanguage, "Expert_descrition"),
          image: user,
          name: translate(appLanguage, "Mr. Shubham Rana"),
          title: translate(appLanguage, "Expert – Bee Honey"),

          onClick: (data) => {
            return
          },
        },
    {
      id: "3",
      description: translate(appLanguage, "Expert_descrition"),
      image: user,
      name: translate(appLanguage, "Mr. Chintamani"),
      title: translate(appLanguage, "( Expert,Krishivan Doon)"),

      onClick: (data) => {
        return
      },
    },
  ];

  return (
    <SafeAreaView>
    <ScrollView>
      <View style={{...styles.container,width: windowWidth,height: windowHeight,}}>
        <Text style={styles.textStyle}>{translate(appLanguage, "Consultancy - Expert List:")}</Text>
        <View>
          <Text style={styles.headingStyle}>{translate(appLanguage, "Mushroom Sector:")}</Text>
          <FlatList
            data={ExpertList}
            renderItem={({ item }) => (
              <Pressable onPress={() => item.onClick(item)}>
                <Text
                  style={styles.text}
                >{`${item.id}. ${item.name} ${item.title}`}</Text>
              </Pressable>
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
        <View>
          <Text style={styles.headingStyle}>{translate(appLanguage, "Multiple Experts:")}</Text>
          <FlatList
            data={multipleExpertList}
            renderItem={({ item }) => (
              <Pressable onPress={() => item.onClick(item)}>
                <Text
                  style={styles.text}
                >{`${item.id}. ${item.name} ${item.title}`}</Text>
              </Pressable>
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
        <View>
          <Text style={styles.headingStyle}>
            {translate(appLanguage, "Business / Digital Marketing Sector:")}
          </Text>
          <FlatList
            data={marketingExpertList}
            renderItem={({ item }) => (
              <Pressable onPress={() => item.onClick(item)}>
                <Text
                  style={styles.text}
                >{`${item.id}. ${item.name} ${item.title}`}</Text>
              </Pressable>
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
        <View style={{paddingBottom:20}} >
          <Text style={styles.headingStyle}>{translate(appLanguage, "Agriculture expert:")}</Text>
          <FlatList
            data={agricutureExpertList}
            renderItem={({ item }) => (
              <Pressable onPress={() => item.onClick(item)}>
                <Text
                  style={styles.text}
                >{`${item.id}. ${item.name} ${item.title}`}</Text>
              </Pressable>
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Consultancy;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  headingStyle: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#0b5b80",
    marginBottom: 8,
    marginTop: 20,
  },

  textStyle: {
    fontSize: 16,
    color: "green",
    fontWeight: "bold",
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    color: "#0b5b80",
    marginBottom: 5,
  },
});
