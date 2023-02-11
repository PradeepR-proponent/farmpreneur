import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  useWindowDimensions,
  Image,
  PermissionsAndroid,
  geolocation,
} from "react-native";
import axios from "axios";
import weather from "../../assets/images/weather.png";
import snow from "../../assets/images/13d.png";
import thunderStrom from "../../assets/images/11d.png";
import rain from "../../assets/images/09d.png";
import scatterCloud from "../../assets/images/03d.png";
import fewClowd from "../../assets/images/02d.png";
import ClearSky from "../../assets/images/01d.png";
import * as Location from "expo-location";
import ClearSkyNight from "../../assets/images/01n.png";
import fewClowdNight from "../../assets/images/02n.png";
import rainNight from "../../assets/images/09n.png";
import defaltWeather from "../../assets/images/defaltWeather.jpg";
import appConstant from "../../config/constants";
import { translate } from "../../languageFeature";
import { useSelector } from "react-redux";


const WeatherForcast = () => {


  const { appLanguage } = useSelector(state => state.auth)
  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;
  const { wetherAppId } = appConstant;

  const [searchInput, setSearchInput] = useState("");
  const [searResult, setSearResult] = useState([]);
  const [selctedCity, setSelctedCity] = useState(null);
  const [weatherData, setWeatherData] = useState({});
  const [location, setLocation] = useState(null);
  const [userLocation, setuserLocation] = useState({
    lat: "",
    lon: "",
    name: "",
  });

  const getCities = async (city) => {
    try {
      const url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${wetherAppId}`;
      const { data } = await axios.get(url);
      setSearResult(data);
    } catch (err) {
      console.log(err);
    }
  };

  const getWeatherData = async (citydata) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${citydata.lat}&lon=${citydata.lon}&appid=${wetherAppId}&units=metric`;
    try {
      const { data } = await axios.get(url);
      const newData = JSON.parse(JSON.stringify(data));
      setWeatherData(newData);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSelect = (data) => {
    setSelctedCity(data);
    setSearResult([]);
  };

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Geolocation Permission",
          message: "Can we access your location?",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      console.log("granted", granted);
      if (granted === "granted") {
        console.log("You can use Geolocation");
        return true;
      } else {
        console.log("You cannot use Geolocation");
        return false;
      }
    } catch (err) {
      return false;
    }
  };

  const getLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        console.log("permission denied");
        requestLocationPermission();
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    getCities(searchInput);
  }, [searchInput]);

  useEffect(() => {
    if (selctedCity !== null) {
      getWeatherData(selctedCity);
    } else {
      getWeatherData(userLocation);
    }
  }, [selctedCity, userLocation]);

  useEffect(() => {
    if (location !== null) {
      const data = {
        lat: location["coords"].latitude,
        lon: location["coords"].longitude,
      };
      setuserLocation(data);
    }
  }, [location]);

  return (
    <View
      style={{
        ...styles.mainContainer,
        width: windowWidth,
        height: windowHeight,
      }}
    >
      <View style={styles.containerTop}>
        <Text style={styles.text}>{translate(appLanguage, 'Search Location')} </Text>
        <TextInput
          style={styles.input}
          onChangeText={(e) => setSearchInput(e)}
          value={searchInput}
          placeholder={translate(appLanguage, "Enter Your Location")}
        />
        {searResult.length !== 0 && (
          <View style={styles.containerInner}>
            {searResult.map((data, idx) => (
              <Pressable onPress={() => handleSelect(data)} key={idx}>
                <Text style={styles.result}>
                  {data.name} ( {data.state} )
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>
      {Object.keys(weatherData).length !== 0 ? (
        <View style={styles.containerBottom}>
          <View style={styles.flexView}>
            <View>
              <Image
                source={
                  weatherData["weather"][0].icon == "01d"
                    ? ClearSky
                    : weatherData["weather"][0].icon == "01n"
                      ? ClearSkyNight
                      : weatherData["weather"][0].icon == "02d"
                        ? fewClowd
                        : weatherData["weather"][0].icon == "02n"
                          ? fewClowdNight
                          : weatherData["weather"][0].icon == "03d" ||
                            weatherData["weather"][0].icon == "03n"
                            ? scatterCloud
                            : weatherData["weather"][0].icon == "09d"
                              ? rain
                              : weatherData["weather"][0].icon == "09n"
                                ? rainNight
                                : weatherData["weather"][0].icon == "13d" ||
                                  weatherData["weather"][0].icon == "13n"
                                  ? snow
                                  : weatherData["weather"][0].icon == "11d" ||
                                    weatherData["weather"][0].icon == "11d"
                                    ? thunderStrom
                                    : defaltWeather
                }
                style={styles.weatherImage}
              />
            </View>

            <View>
              <Text style={styles.text}>
                {translate(appLanguage, "Weather")}: {weatherData["weather"][0].main}
              </Text>
              <Text>
                {" "}
                {translate(appLanguage, "Description")}: {weatherData["weather"][0].description}{" "}
              </Text>
            </View>
          </View>

          <View style={styles.temp}>
            <Text style={styles.headingText}>{translate(appLanguage, "Temperature")}</Text>
            <View>
              <Text style={styles.mainText}>
                {" "}
                {weatherData["main"].temp} °C{" "}
              </Text>
              <Text style={{ ...styles.tempText, marginTop: 20 }}>
                {translate(appLanguage, "Location")}: {weatherData.name}{" "}
              </Text>
              <Text style={styles.tempText}>
                {translate(appLanguage, "Wind Speed")}: {weatherData["wind"].speed} km/h
              </Text>
            </View>

            <View style={styles.humidityCard}>
              <View style={styles.tempCard}>
                <Text style={styles.humidity}>{translate(appLanguage, "Feels Like")}</Text>
                <Text style={styles.feels}>
                  {weatherData["main"].feels_like}°
                </Text>
                <Text style={styles.humidity}>{translate(appLanguage, "Min Temp")} </Text>
                <Text style={styles.feels}>
                  {weatherData["main"].temp_min}°
                </Text>
              </View>
              <View style={styles.tempCard}>
                <Text style={styles.humidity}> {translate(appLanguage, "Humidity")} </Text>
                <Text style={styles.feels}>
                  {weatherData["main"].humidity}%
                </Text>

                <Text style={styles.humidity}> {translate(appLanguage, "Max Temp")}</Text>
                <Text style={styles.feels}>
                  {weatherData["main"].temp_max}°
                </Text>
              </View>
            </View>
          </View>
        </View>
      ) : (
        <Text style={styles.text}> No data </Text>
      )}
    </View>
  );
};

export default WeatherForcast;

const styles = StyleSheet.create({
  mainContainer: {
    borderWidth: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  containerTop: {
    padding: 20,
    position: "relative",
  },
  containerBottom: {
    padding: 20,
  },
  containerInner: {
    position: "absolute",
    top: 90,
    left: 20,
    textAlign: "center",
    width: 200,
    zIndex: 2,
  },
  flexView: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  temp: {
    marginTop: 70,
  },
  input: {
    borderWidth: 1,
    padding: 5,
    borderRadius: 5,
    borderColor: "#B3B6B7",
    color: "black",
  },
  text: {
    fontSize: 14,
    marginBottom: 10,
  },
  result: {
    fontSize: 14,
    backgroundColor: "#ECF0F1",
    padding: 10,
  },
  mainText: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#0b5b80",
  },
  headingText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#0b5b80",
  },
  weatherImage: {
    height: 100,
    width: 100,
  },
  tempText: {
    fontSize: 14,
    marginBottom: 10,
  },
  humidityCard: {
    marginTop: 10,
    marginBottom: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    borderColor: "#B3B6B7",
    borderWidth: 1,
    borderColor: "#B3B6B7",
    borderRadius: 5,
    shadowColor: "#000",
  },
  tempCard: {
    padding: 10,
  },
  feels: {
    fontSize: 16,
    padding: 10,
    textAlign: "center",
  },

  humidity: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0b5b80",
    textAlign: "center",
  },
});
// "weather"
