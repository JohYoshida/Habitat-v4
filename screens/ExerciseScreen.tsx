import * as React from 'react';
import {
  RefreshControl,
  StyleSheet,
  ScrollView
} from 'react-native';
import {
  Button,
  Container,
  Content,
  Fab,
  Icon,
  Label,
  List,
  ListItem,
  Spinner,
  StyleProvider,
  Text as ButtonText
} from "native-base";
import {
  Text,
  View
} from '../components/Themed';
import GoalPanel from '../components/GoalPanel';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import {
  fetchExercises,
  fetchExerciseGoals
} from "../api/exercise"
import {
  fetchGoals
} from "../api/goal"
import {
  fetchWorkouts
} from "../api/workout"
// Native Base theme requirements
import getTheme from "../native-base-theme/components";
import platform from "../native-base-theme/variables/platform";

export default function ExerciseScreen(props) {
  const colorScheme = useColorScheme();
  const [exercises, setExercises] = React.useState([]);
  const [dailyGoalData, setDailyGoalData] = React.useState([]);
  const [weeklyGoalData, setWeeklyGoalData] = React.useState([]);
  const [monthlyGoalData, setMonthlyGoalData] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [fabIsActive, setFab] = React.useState(false);

  // Get exercises when the screen mounts or state updates
  React.useEffect(
    () => {
      onRefresh()
    },
    [exercises.length] // only run when exercises.length changes
  );

  // Manual exercises refresh
  const onRefresh = React.useCallback(
    () => {
      setRefreshing(true);
      // Get exercise data
      fetchExercises()
        .then(data => {
          setExercises(data);
          // Get daily, weekly, and monthly goals
          fetchExerciseGoals("daily")
            .then(data => {
              setDailyGoalData(data);
              fetchExerciseGoals("weekly")
                .then(data => {
                  setWeeklyGoalData(data);
                  fetchExerciseGoals("monthly")
                    .then(data => {
                      setMonthlyGoalData(data);
                      // Finally, set refreshing to false
                      setRefreshing(false);
                    })
                })
            })
        });
    },
    [refreshing]
  );

  // Assemble exercise list
  const ExercisesList = [];
  exercises.forEach((exercise, index) => {
    ExercisesList.push(
      <ListItem
        key={index}
        onPress={() =>
          props.navigation.navigate("View Exercise", {
            exercise,
            refreshLastScreen: onRefresh
          })
        }
      >
        <Text>{exercise.name}</Text>
      </ListItem>
    );
  });

  // Conditionally display exercise list or empty list text
  let ListDisplay;
  if (refreshing) {
    ListDisplay = (
      <View>
        <List>{ExercisesList}</List>
      </View>
    );
  } else if (exercises.length === 0 && !refreshing) {
    ListDisplay = (
      <Text style={styles.emptyListText}>
        exercises you add will appear here
      </Text>
    );
  } else ListDisplay = <List>{ExercisesList}</List>;

  return (
    <StyleProvider style={getTheme(platform)}>
      <Container>
        <View style={styles.container}>
          <Content
            padder
            contentContainerStyle={styles.content}
          >
            <ScrollView refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
              <Text style={styles.title}>Goals</Text>
              <GoalPanel
                navigator={props.navigation}
                dailyGoalData={dailyGoalData}
                weeklyGoalData={weeklyGoalData}
                monthlyGoalData={monthlyGoalData}
                onRefresh={onRefresh}
              />
              <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
              <Text style={styles.title}>Exercises</Text>
              {ListDisplay}
            </ScrollView>
          </Content>
          <Fab
            active={fabIsActive}
            direction="up"
            containerStyle={{}}
            style={
              !fabIsActive ?
                { backgroundColor: Colors[colorScheme].primary } :
                { backgroundColor: Colors[colorScheme].secondary }
            }
            position="bottomRight"
            onPress={() => setFab(!fabIsActive)}>
            <Icon
              name={!fabIsActive ? "add-circle-sharp" : "caret-down-circle-sharp"}
              style={
                !fabIsActive ?
                  { color: Colors[colorScheme].onPrimary } :
                  { color: Colors[colorScheme].onSecondary }
              }
            />
            <Button
              style={{ backgroundColor: Colors[colorScheme].primary }}
              onPress={() =>
                props.navigation.navigate("Add Workout", {
                  exercises,
                  refreshLastScreen: onRefresh
                })
              }
            >
              <Icon name="add-sharp" style={{ color: Colors[colorScheme].onPrimary }} />
            </Button>
            <Button
              style={{ backgroundColor: Colors[colorScheme].primary }}
              onPress={() =>
                props.navigation.navigate("Add Goal", {
                  exercises,
                  refreshLastScreen: onRefresh
                })
              }
            >
              <Icon name="star-sharp" style={{ color: Colors[colorScheme].onPrimary }} />
            </Button>
            <Button
              style={{ backgroundColor: Colors[colorScheme].primary }}
              onPress={() =>
                props.navigation.navigate("Add Exercise", {
                  exercises,
                  refreshLastScreen: onRefresh
                })
              }
            >
              <Icon name="analytics-sharp" style={{ color: Colors[colorScheme].onPrimary }} />
            </Button>
          </Fab>
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
  title: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  text: {
    textAlign: 'center'
  },
  separator: {
    alignSelf: "center",
    marginVertical: 10,
    height: 1,
    width: '80%',
  },
  emptyListText: {
    color: "#BDBDBD",
    textAlign: "center",
    marginVertical: 20
  }
});
