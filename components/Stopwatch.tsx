import * as React from "react";
import {
  StyleSheet,
  TouchableHighlight,
  Pressable,
  View
} from "react-native";
import {
  Button,
  Icon,
  Text
} from "native-base";
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';

/**
 * [Stopwatch description]
 * @props       {function} getTime Returns the value of timer (total elapsed seconds)
 * @constructor
 */
export default function Stopwatch(props) {
  const colorScheme = useColorScheme();

  const [timer, setTimer] = React.useState(0);
  const [isActive, setIsActive] = React.useState(false);
  const [isPaused, setIsPaused] = React.useState(false);
  const countRef = React.useRef(null)

  /*
    Stopwatch functions adapted from:
    https://dev.to/abdulbasit313/how-to-develop-a-stopwatch-in-react-js-with-custom-hook-561b
   */
  const handleStart = () => {
    setIsActive(true)
    setIsPaused(true)
    countRef.current = setInterval(() => {
      props.getTime(timer)
      setTimer((timer) => timer + 1)
    }, 1000)
  }

  const handlePause = () => {
    clearInterval(countRef.current)
    setIsPaused(false)
    props.getTime(timer);
  }

  const handleResume = () => {
    setIsPaused(true)
    countRef.current = setInterval(() => {
      setTimer((timer) => timer + 1)
    }, 1000)
  }

  const handleReset = () => {
    clearInterval(countRef.current)
    setIsActive(false)
    setIsPaused(false)
    setTimer(0)
    props.getTime(0)
  }

  const formatTime = () => {
    const getSeconds = `0${(timer % 60)}`.slice(-2)
    const minutes = `${Math.floor(timer / 60)}`
    const getMinutes = `0${minutes % 60}`.slice(-2)
    const getHours = `0${Math.floor(timer / 3600)}`.slice(-2)

    return `${getHours} : ${getMinutes} : ${getSeconds}`
  }

  const buttons = () => {
    let onPress = !isActive && !isPaused ?
      handleStart :
      (
        isPaused ? handlePause :
        handleResume
      )
    return (
      <View style={{ flexDirection: "row", alignSelf: "center" }}>
        <Pressable
          onPress={onPress}
          android_ripple={{ color: Colors[colorScheme].primary, borderless: true, radius: 40 }}
        >
          <View style={styles.button}>
            <Icon
              style={{
                color: Colors[colorScheme].onPrimary,
                alignSelf: "center"
              }}
              name={
                onPress = !isActive && !isPaused ?
                "play" : (isPaused ? "pause" : "play" )
              }
            />
          </View>
        </Pressable>
        <Pressable
          onPress={handleReset}
          android_ripple={{ color: Colors[colorScheme].primary, borderless: true, radius: 40 }}
        >
          <View style={styles.button}>
            <Icon
              name="refresh"
              style={{
                color: Colors[colorScheme].onPrimary,
                alignSelf: "center"
              }}

            />
          </View>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.timer}>
        <Text style={styles.text}>{formatTime()}</Text>
      </View>
      {buttons()}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    // position: 'relative',
    // zIndex: 0,
    // justifyContent: "space-between"
  },
  text: {
    color: Colors.dark.secondary,
    textAlign: "center",
    fontSize: 35,
  },
  timer: {
    backgroundColor: Colors.dark.background,
    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: "center",
    borderWidth: 5,
    borderColor: Colors.dark.onBackground,
    borderRadius: 100,
    width: 200,
    height: 200,
    margin: 20
  },
  button: {
    backgroundColor: Colors.dark.primary,
    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: "center",
    borderRadius: 100,
    width: 70,
    height: 70,
    margin: 5
  },
});