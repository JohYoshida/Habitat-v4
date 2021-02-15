import * as React from 'react';
import {
  TouchableHighlight,
  StyleSheet
} from "react-native";
import {
  Text,
  View
} from '../components/Themed';
import ProgressBar from '../components/ProgressBar';
import CustomButtons from '../components/CustomButtons';
import Colors from "../constants/Colors";
import useColorScheme from '../hooks/useColorScheme';

export default function GoalPanel(props) {
  const colorScheme = useColorScheme();

  const typeButtons = ["daily", "weekly", "monthly"];
  const [type, updateType] = React.useState("daily");
  const [typeIndex, updateTypeIndex] = React.useState(0);

  const panelItem = (item, index) => {
    return (
      <TouchableHighlight
        key={index}
        onPress={() => props.navigator.navigate("View Exercise", {
          exercise: item.exercise,
          refreshLastScreen: props.onRefresh
        })}>
        <ProgressBar
          data={[item.total]}
          goal={item.goal}
          name={item.name}
        />
      </TouchableHighlight>
    );
  }

  let goalPanel = [];
  switch (type) {
    case "daily":
      goalPanel = [];
      if (props.dailyGoalData.length > 0) {
        props.dailyGoalData.forEach((item, index) => {
          goalPanel.push(
            panelItem(item, index)
          );
        });
      }
      break;
    case "weekly":
      goalPanel = [];
      if (props.weeklyGoalData.length > 0) {
        props.weeklyGoalData.forEach((item, index) => {
          goalPanel.push(
            panelItem(item, index)
          );
        });
      }
      break;
    case "monthly":
      goalPanel = [];
      if (props.monthlyGoalData.length > 0) {
        props.monthlyGoalData.forEach((item, index) => {
          goalPanel.push(
            panelItem(item, index)
          );
        });
      }
      break;
    default:
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
      {goalPanel}
    </View>
  );
}

const styles = StyleSheet.create({
  buttons: {
    margin: 10
  }
});