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
  Label,
  Picker,
  StyleProvider,
  Text as ButtonText
} from "native-base";
import * as Haptics from 'expo-haptics';
import {
  fetchExercises
} from "../api/exercise";
import {
  postWorkout
} from "../api/workout";
import {
  Text,
  View
} from '../components/Themed';
import NumberPad from "../components/NumberPad";
import CustomButtons from "../components/CustomButtons";
import Stopwatch from "../components/Stopwatch";
import Colors from "../constants/Colors";
import useColorScheme from '../hooks/useColorScheme';
// Native base theme requirements
import getTheme from "../native-base-theme/components";
import platform from "../native-base-theme/variables/platform";

const moment = require("moment");

export default function AddWorkoutScreen(props) {
  const colorScheme = useColorScheme();
  // Hooks for exercise picker
  const [exercises, setExercises] = React.useState([]);
  const [pickerIndex, setPickerIndex] = React.useState();

  // Hooks for reps
  const repsButtons = ["5", "10", "20", "30", "40", "custom"];
  const [reps, updateReps] = React.useState("0");
  const [repsIndex, updateRepsIndex] = React.useState(repsButtons.length - 1);

  // Hooks for sets, set input/errors
  const setsButtons = ["1", "2", "3", "4", "5", "custom"];
  const [sets, updateSets] = React.useState("1");
  const [setsIndex, updateSetsIndex] = React.useState(0);

  // Hooks for time
  const timeInputButtons = ["input", "stopwatch"]
  const [timeInputMode, updateTimeInputMode] = React.useState(0)
  const [seconds, updateSeconds] = React.useState(0);
  const [minutes, updateMinutes] = React.useState(0);
  const [hours, updateHours] = React.useState(0);

  // Get exercises when the screen mounts or state updates
  React.useEffect(
    () => {
      // updateExercises();
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

  // Fetch and set exercises
  const updateExercises = () => {
    fetchExercises()
      .then(data => {
        setExercises(data);
      });
  };

  const getTime = (time) => {
    updateSeconds(time);
    return time;
  }

  // Construct and post workout to server
  const submitWorkout = () => {
    let body = {
      createdAt: moment()
        .format()
    };
    const totalSeconds = seconds + minutes * 60 + hours * 3600;
    body.exercise_id = exercises[pickerIndex].id;
    if (exercises[pickerIndex].mode === "reps and sets") {
      body.reps = reps;
      body.sets = sets;
    } else if (exercises[pickerIndex].mode === "time") {
      body.seconds = totalSeconds;
    }
    body = JSON.stringify(body);
    postWorkout(body)
      .then(() => {
        props.route.params.refreshLastScreen();
        props.route.params.refreshHomeScreen();
        props.navigation.goBack();
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      });
  };

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
      <Button
        block
        transparent
        onPress={() =>
          props.navigation.navigate("Add Exercise", {
            exercises,
            refreshLastScreen: updateExercises
          })
        }
      >
        <Text>or add exercise</Text>
      </Button>
    </View>
  );

  // Conditional rendering for custom reps input
  let RepsInput;
  // if last button (custom option) is selected
  if (repsIndex == repsButtons.length - 1) {
    // display input
    RepsInput = (
      <NumberPad
        mode={"number"}
        callback={text => {
          updateReps(text);
        }}
      />
    );
  } else RepsInput = null;

  // Conditional rendering for custom sets input
  let SetsInput;
  // if last button (custom option) is selected
  if (setsIndex == setsButtons.length - 1) {
    // display input
    SetsInput = (
      <NumberPad
        mode={"number"}
        callback={text => {
          updateSets(text);
        }}
      />
    );
  } else SetsInput = null;

  // Construct RepsAndSetsDisplay
  const RepsAndSetsDisplay = (
    <View>
      <Item fixedLabel>
        <Label>Reps</Label>
      </Item>
      <CustomButtons
        onPress={index => {
          updateRepsIndex(index);
          if (repsButtons[index] !== "custom") updateReps(repsButtons[index]);
          else updateReps("");
        }}
        selectedIndex={repsIndex}
        buttons={repsButtons}
      />
      {RepsInput}
      <Item fixedLabel>
        <Label>Sets</Label>
      </Item>
      <CustomButtons
        onPress={index => {
          updateSetsIndex(index);
          if (setsButtons[index] !== "custom") updateSets(setsButtons[index]);
          else updateSets("");
        }}
        selectedIndex={setsIndex}
        buttons={setsButtons}
      />
      {SetsInput}
    </View>
  );

  // Construct TimeDisplay
  const TimeDisplay = (
    <View>
      <CustomButtons
        onPress={index => {
          updateTimeInputMode(index);
        }}
        selectedIndex={timeInputMode}
        buttons={timeInputButtons}
      />
      {
        timeInputMode === 0 ?
        <NumberPad
          mode={"time"}
          callback={string => {
            updateHours(Number(string.slice(0, 2)));
            updateMinutes(Number(string.slice(2, 4)));
            updateSeconds(Number(string.slice(4, 6)));
          }}
        /> :
        <Stopwatch getTime={getTime}/>
      }

    </View>
  );

  // Conditional rendering for different input modes
  let InputDisplay = null;
  if (exercises[pickerIndex]) {
    if (exercises[pickerIndex].mode === "reps and sets") {
      InputDisplay = RepsAndSetsDisplay;
    } else if (exercises[pickerIndex].mode === "time") {
      InputDisplay = TimeDisplay;
    }
  }

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
                onPress={submitWorkout}
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