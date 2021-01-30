import * as React from 'react';
import {
  StyleSheet
} from "react-native";
import {
  Col,
  Row,
  Grid
} from "react-native-easy-grid";
import {
  Text,
  View
} from '../components/Themed';
import Colors from "../constants/Colors";
import useColorScheme from '../hooks/useColorScheme';

export default function Calendar(props) {
  const colorScheme = useColorScheme();

  const Month = []
  let days = [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun"
  ];

  for (var i = 0; i < 7; i++) {
    Month.push(
      <View style={styles.day}>
        <Text style={styles.text}>{days[i]}</Text>
      </View>
    )
  }

  let counter = Math.ceil(props.days / 7) * 7;
  for (var i = 1; i <= counter; i++) {
    if (i - props.offset > 0 && i - props.offset <= props.days) {
      Month.push(
        <View style={styles.day}>
          <Text style={styles.number}>{i - props.offset}</Text>
        </View>
      );
    } else {
      Month.push(<View style={styles.day}></View>)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.cal}>
        {Month}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 10
  },
  text: {
    textAlign: "center"
  },
  number: {
    textAlign: "center",
    backgroundColor: Colors.dark.secondary,
    borderRadius: 50,
    lineHeight: 25,
    width: 25
  },
  cal: {
    flex: 1,
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "flex-end",
    // margin: 15,
  },
  day: {
    flexBasis: "14%",
    flexShrink: 0,
    marginBottom: 5
  },
  circle: {}
});