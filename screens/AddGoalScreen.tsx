import * as React from "react";
import {
  ScrollView,
  StyleSheet
} from "react-native";
import {
  Button,
  Container,
  Content,
  Form,
  Item,
  Picker,
  StyleProvider,
  Text as ButtonText
} from "native-base";
import * as Haptics from 'expo-haptics';
import {
  fetchExercises
} from "../api/exercise";
import {
  postGoal
} from "../api/goal";
import {
  Text,
  View
} from '../components/Themed';
import NumberPad from "../components/NumberPad";
import CustomButtons from "../components/CustomButtons";
import Colors from "../constants/Colors";
import useColorScheme from '../hooks/useColorScheme';
// Native base theme requirements
import getTheme from "../native-base-theme/components";
import platform from "../native-base-theme/variables/platform";

export default function AddGoalScreen(props) {
  const colorScheme = useColorScheme();
  // Hooks for exercise picker
  const [exercises, setExercises] = React.useState([]);
  const [pickerIndex, setPickerIndex] = React.useState();

  // Hooks for type
  const typeButtons = ["daily", "weekly", "monthly"];
  const [type, updateType] = React.useState("daily");
  const [typeIndex, updateTypeIndex] = React.useState(0);

  // Hooks for number value
  const [value, updateValue] = React.useState();
  // Hooks for time values
  const [seconds, updateSeconds] = React.useState(0);
  const [minutes, updateMinutes] = React.useState(0);
  const [hours, updateHours] = React.useState(0);

  // Get exercises when the screen mounts or state updates
  React.useEffect(
    () => {
      fetchExercises()
        .then(data => {
          data.forEach((item, index) => {
            if (
              props.route.params.exercise &&
              props.route.params.exercise.id === item.id
            ) {
              setPickerIndex(index);
            }
          });
          setExercises(data);
        });
    },
    [exercises.length] // only run when exercises.length changes
  );

  // Construct and post goal to server
  const submitGoal = () => {
    let mode = props.route.params.exercise.mode;
    const body = JSON.stringify({
      exercise_id: exercises[pickerIndex].id,
      type: type,
      value: mode === "time" ? Number(seconds + minutes * 60 + hours * 3600) : Number(value)
    })
    postGoal(body)
      .then(() => {
        props.route.params.refreshLastScreen();
        props.navigation.goBack();
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      })
      .catch(err => {
        console.log(err);
      });
  }

  // Construct PickerList
  const PickerList = [];
  exercises.forEach((item, index) => {
    PickerList.push(
      <Picker.Item
        label={item.name}
        value={index}
        key={item.id}
        color={Colors[colorScheme].primary}
        backgroundColor={Colors[colorScheme].background}
        style={{ backgroundColor: '#788ad2' }}
      />
    );
  });

  // Construct ExercisePicker
  let ExercisePicker;
  ExercisePicker = (
    <View>
      <Item picker>
        <Picker
          selectedValue={pickerIndex}
          onValueChange={value => setPickerIndex(value)}
          placeholder="select a workout"
          itemStyle={{ backgroundColor: 'black' }}
          itemTextStyle={{ fontSize: 18, color: 'white' }}
        >
          {PickerList}
        </Picker>
      </Item>
    </View>
  );

  const numberPad = () => {
    if (props.route.params.exercise.mode === "time") {
      return <NumberPad
        mode={"time"}
        callback={string => {
          updateHours(Number(string.slice(0, 2)));
          updateMinutes(Number(string.slice(2, 4)));
          updateSeconds(Number(string.slice(4, 6)));
        }}
      />
    } else {
      return <NumberPad
      mode={"number"}
      callback={text => {
        updateValue(text);
      }}
    />
    }
  }

  const InputDisplay = (
    <View>
      <CustomButtons
        onPress={index => {
          updateTypeIndex(index);
          updateType(typeButtons[index]);
        }}
        selectedIndex={typeIndex}
        buttons={typeButtons}
      />
      {numberPad()}
    </View>
  );

  return (
    <StyleProvider style={getTheme(platform)}>
      <Container>
        <View style={styles.container}>
          <Content padder contentContainerStyle={styles.content}>
            <ScrollView>
              <Form>
                {ExercisePicker}
                {InputDisplay}
              </Form>
              <Button
                block
                style={styles.margin}
                backgroundColor={Colors[colorScheme].primary}
                onPress={submitGoal}
              >
                <ButtonText style={{ color: Colors[colorScheme].onPrimary }}>
                  Submit
                </ButtonText>
              </Button>
            </ScrollView>
          </Content>
        </View>

      </Container>
    </StyleProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  margin: {
    marginTop: 10
  }
});