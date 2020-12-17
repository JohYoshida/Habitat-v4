import * as React from 'react';
import {
  ScrollView,
  StyleSheet
} from 'react-native';
import {
  Input
} from "react-native-elements";
import {
  Button,
  Container,
  Content,
  StyleProvider,
  Text as ButtonText
} from "native-base";
import * as Haptics from 'expo-haptics';
import {
  postExercise
} from "../api/exercise";
import {
  Text,
  View
} from '../components/Themed';
import CustomButtons from "../components/CustomButtons";
import Colors from "../constants/Colors";
import useColorScheme from '../hooks/useColorScheme';
// Native base theme requirements
import getTheme from "../native-base-theme/components";
import platform from "../native-base-theme/variables/platform";

export default function AddExerciseScreen(props) {
  const colorScheme = useColorScheme();
  // Hooks for exercises
  const [exercise, setExercise] = React.useState();
  const [errorTextExercise, setErrorTextExercise] = React.useState();
  const inputExercise = React.createRef();

  // Hooks for mode
  const modeButtons = ["reps and sets", "time"];
  const [modeIndex, setMode] = React.useState(0);

  const submitExercise = () => {
    const {
      exercises
    } = props.route.params;
    if (exercises.length === 0) {
      postExercise(exercise, modeButtons[modeIndex]).then(() => {
        props.route.params.refreshLastScreen();
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        props.navigation.goBack();
      });
    } else {
      let duplicate = false;
      exercises.forEach(item => {
        if (item.name === exercise) {
          duplicate = true;
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          inputError();
        }
      });
      if (!duplicate) {
        postExercise(exercise, modeButtons[modeIndex]).then(() => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          props.route.params.refreshLastScreen();
          props.navigation.goBack();
        });
      }
    }
  };

  const inputError = () => {
    inputExercise.current.shake();
    setExercise("");
    setErrorTextExercise("an exercise with that name already exists");
  };

  return (
    <StyleProvider style={getTheme(platform)}>
      <Container>
        <View style={styles.container}>
          <Content padder contentContainerStyle={styles.content}>
            <ScrollView>
              <Text style={styles.title}>Add Exercise</Text>
              <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
              <Input
                ref={inputExercise}
                value={exercise}
                autoFocus={true}
                placeholder={
                  errorTextExercise ? errorTextExercise : "name of exercise"
                }
                onChangeText={text => {
                  setErrorTextExercise(null);
                  setExercise(text);
                }}
                style={{ color: Colors[colorScheme].onBackground }}
              />
              <CustomButtons
                onPress={index => {
                  if (index === 0) setMode(0);
                  else if (index === 1) setMode(1);
                }}
                selectedIndex={modeIndex}
                buttons={modeButtons}
                style={styles.buttons}
              />
              <Button
                block
                backgroundColor={Colors[colorScheme].primary}
                onPress={submitExercise}>
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
  buttons: {
    margin: 10
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  separator: {
    alignSelf: "center",
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});