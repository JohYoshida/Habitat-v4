import * as React from 'react';
import {
  TouchableHighlight,
  StyleSheet
} from "react-native";
import {
  Text,
  View
} from '../components/Themed';
import {
  BarChart
} from '../components/BarChart';
import CustomButtons from '../components/CustomButtons';
import Colors from "../constants/Colors";
import useColorScheme from '../hooks/useColorScheme';

export default function GraphPanel(props) {
  const colorScheme = useColorScheme();

  const typeButtons = ["daily", "weekly", "monthly"];
  const [type, updateType] = React.useState("daily");
  const [typeIndex, updateTypeIndex] = React.useState(0);

  const makeGraph = (item, goal, time) => {
    if (item && time) {
      let value = goal ? goal.value : 0;
      return (
        <BarChart
          data={item.data}
          XAxisData={item.dates}
          goal={value}
          name={`${time} graph`}
        />
      );
    } else
      return <View></View>
  }

  let graph = [];
  if (props.goals.length >= 0) {
    switch (type) {
      case "daily":
        if (props.dailyGraphData) {
          const goal = Array.from(props.goals)
            .find(element => element.type === "daily")
          graph = makeGraph(props.dailyGraphData, goal, "daily");
        }
        break;
      case "weekly":
        if (props.weeklyGraphData) {
          const goal = Array.from(props.goals)
            .find(element => element.type === "weekly")
          graph = makeGraph(props.weeklyGraphData, goal, "weekly");
        }
        break;
      case "monthly":
        if (props.monthlyGraphData) {
          const goal = Array.from(props.goals)
            .find(element => element.type === "monthly")
          graph = makeGraph(props.monthlyGraphData, goal, "monthly");
        }
        break;
      default:
    }
  }
  return (
    <View>
      <CustomButtons
        style={styles.buttons}
        onPress={index => {
          updateTypeIndex(index);
          updateType(typeButtons[index]);
        }}
        selectedIndex={typeIndex}
        buttons={typeButtons}
      />
    { graph }
    </View>
  );
}

const styles = StyleSheet.create({
  buttons: {
    margin: 10
  }
});