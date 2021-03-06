import * as React from 'react';
import {
  StyleSheet
} from "react-native";
import {
  Text,
  View
} from '../components/Themed';
import Colors from "../constants/Colors";
import useColorScheme from '../hooks/useColorScheme';

export default function ProgressBar(props) {
  const colorScheme = useColorScheme();

  const formatTime = (seconds) => {
    if (props.mode !== "time") {
      return seconds;
    }
    const getSeconds = Number(`0${(seconds % 60)}`.slice(-2));
    const minutes = Number(`${Math.floor(seconds / 60)}`);
    const getMinutes = Number(`0${minutes % 60}`.slice(-2));
    const getHours = Number(`0${Math.floor(seconds / 3600)}`.slice(-2));

    if (seconds >= 3600) {
      return `${getHours}h ${getMinutes}m ${getSeconds}s`
    } else if (seconds >= 60) {
      return `${getMinutes}m ${getSeconds}s`
    } else {
      return `${getSeconds}s`
    }
  }

  if (!props.data) {
    return (<View></View>);
  } else {
    const total = props.data.reduce((a, b) => a + b, 0);
    if (total >= props.goal) {
      let extra = total - props.goal;
      return (
        <View
          key={`${props.name} ProgressBar`}
        >
          <Text style={styles.title}>{props.name}</Text>
          <View style={{ flexDirection: "row", height: 5, marginHorizontal: 10 }}>
            <View style={{ flex: props.goal, backgroundColor: Colors[colorScheme].secondary }} />
            <View style={{ flex: extra, backgroundColor: Colors[colorScheme].primary }} />
          </View>
          <View style={{ flexDirection: "row", height: 10, marginHorizontal: 10 }}>
            <Text style={styles.numberLine}>0</Text>
            <View style={{ flex: props.goal }} />
            <Text style={styles.numberLine}>{props.goal === formatTime(total) ? "" : formatTime(props.goal)}</Text>
            <View style={{ flex: extra }} />
            <Text style={styles.numberLine}>{formatTime(total)}</Text>
          </View>
        </View>
      );
    } else {
      let remainder = props.goal - total;
      return (
        <View
          key={`${props.name} ProgressBar`}
        >
          <Text style={styles.title}>{props.name}</Text>
          <View style={{ flexDirection: "row", height: 5, marginHorizontal: 10 }}>
            <View style={{ flex: total, backgroundColor: Colors[colorScheme].secondaryVariant }} />
            <View style={{ flex: remainder, backgroundColor: Colors[colorScheme].tint }} />
          </View>
          <View style={{ flexDirection: "row", height: 10, marginHorizontal: 10 }}>
            <Text style={styles.numberLine}>0</Text>
            <View style={{ flex: total }} />
            <Text style={styles.numberLine}>{total === 0 ? "" : formatTime(total)}</Text>
            <View style={{ flex: remainder }} />
            <Text style={styles.numberLine}>{formatTime(props.goal)}</Text>
          </View>
        </View>
      );
    }
  }

}

const styles = StyleSheet.create({
  title: {
    flex: 1,
    color: "grey",
    textAlign: "center",
    fontSize: 10
  },
  numberLine: {
    color: "grey",
    textAlign: "center",
    fontSize: 8
  }
});