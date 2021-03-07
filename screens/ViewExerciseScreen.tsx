import * as React from 'react';
import {
  RefreshControl,
  TouchableHighlight,
  ScrollView,
  StyleSheet
} from 'react-native';
import {
  Button,
  Container,
  Content,
  List,
  StyleProvider,
  Text as ButtonText
} from "native-base";
import {
  Text,
  View
} from '../components/Themed';
import {
  BarChart
} from '../components/BarChart';
import {
  LineChart
} from '../components/LineChart';
import ProgressBar from '../components/ProgressBar';
import * as Haptics from 'expo-haptics';
import {
  Grid,
  XAxis,
  YAxis
} from "react-native-svg-charts";
import * as shape from "d3-shape";
import NumberPad from "../components/NumberPad";
import {
  ConfirmDeletionButtons
} from "../components/ConfirmDeletionButtons";
import {
  fetchExercise,
  updateExercise,
  deleteExercise,
} from "../api/exercise";
import {
  fetchWorkouts,
  deleteWorkout
} from "../api/workout";
import {
  fetchGoalsByExercise,
  postGoal,
  deleteGoal
} from "../api/goal";
import {
  assembleChartData,
  assembleWorkoutsList
} from "../lib/viewExerciseScreenHelpers";
import Colors from "../constants/Colors";
import useColorScheme from '../hooks/useColorScheme';
// Native base theme requirements
import getTheme from "../native-base-theme/components";
import platform from "../native-base-theme/variables/platform";

const moment = require("moment");

export default function ViewExerciseScreen(props) {
  const colorScheme = useColorScheme();

  // Hook for storing workout data
  const [workouts, setWorkouts] = React.useState([]);

  // Hooks for storing goal data
  const [goals, setGoals] = React.useState({});

  // Hooks for deleting data
  const [workoutDeleteID, setWorkoutDeleteID] = React.useState(null);
  const [confirmDeleteWorkout, setConfirmDeleteWorkout] = React.useState(false);
  const [goalDeleteID, setGoalDeleteID] = React.useState(null);
  const [confirmDeleteGoal, setConfirmDeleteGoal] = React.useState(false);
  const [confirmDeleteExercise, setConfirmDeleteExercise] = React.useState(
    false
  );

  // Hooks for refreshing data
  const [refreshing, setRefreshing] = React.useState(false);
  const [lifetimeTotal, setLifetimeTotal] = React.useState(
    Number(props.route.params.exercise.lifetimeTotal)
  );

  // Hooks for chart data and list construction
  const [displayChart, setDisplayChart] = React.useState(null);
  const [chartData, setChartData] = React.useState({
    daily: {
      data: [],
      dates: [],
      total: 0
    },
    weekly: {
      data: [],
      dates: [],
      total: 0
    },
    monthly: {
      data: [],
      dates: [],
      total: 0
    },
    lifetime: {
      data: [],
      dates: [],
      total: 0
    },
    cumulative: {
      data: [],
      total: 0
    },
    workoutsList: []
  });

  // TODO: remove reference to dailyGoal
  // Hooks for daily goal
  const [dailyGoal, setDailyGoal] = React.useState(Number(props.route.params.exercise.dailyGoal));

  // Get workouts and goals when the screen mounts or state updates
  React.useEffect(
    () => {
      onRefresh();
      refreshLifetimeTotal();
    },
    [workouts.length] // only run when workouts.length changes
  );

  // Get and update workout and goal data
  const onRefresh = React.useCallback(
    () => {
      const exercise_id = props.route.params.exercise.id;
      setRefreshing(true);
      // Get and set workouts from database
      fetchWorkouts(exercise_id)
        .then(data => {
          setWorkouts(data);
          setChartData(assembleChartData(data));
          fetchGoalsByExercise(exercise_id)
            .then(data => {
              setGoals(data);
              data.forEach(datum => {
                if (datum.type === "daily") setDailyGoal(datum.value);
              })
              setRefreshing(false);
            });
        });
    },
    [refreshing]
  );

  const removeGoal = goal => {
    if (goal === null) {
      setGoalDeleteID(null);
    } else if (goal.id === goalDeleteID) {
      deleteGoal(goal.id)
      onRefresh();
      props.route.params.refreshLastScreen();
      setGoalDeleteID(null);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      setGoalDeleteID(goal.id);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  }

  // Delete exercise from server database by id
  const removeExercise = () => {
    let {
      id,
      name
    } = props.route.params.exercise;
    deleteExercise(id, name)
      .then(() => {
        props.route.params.refreshLastScreen();
        setConfirmDeleteExercise(false);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        props.navigation.goBack();
      });
  };

  // Delete workout from server database by id
  const removeWorkout = () => {
    // Calculate amount to decrease lifetimeTotal by
    let amount;
    workouts.forEach(workout => {
      if (workout.id === workoutDeleteID) {
        let {
          mode
        } = props.route.params.exercise;
        if (mode === "time") {
          amount = workout.seconds;
        } else if (mode === "reps and sets") {
          amount = workout.reps * workout.sets;
        }
      }
    });
    deleteWorkout(workoutDeleteID, props.route.params.exercise.id, amount)
      .then(
        () => {
          setWorkoutDeleteID(null);
          setConfirmDeleteWorkout(false);
          onRefresh();
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      );
  };

  // Get the exercise again and refresh the lifetimeTotal
  const refreshLifetimeTotal = () => {
    const id = props.route.params.exercise.id;
    fetchExercise(id)
      .then(exercise => {
        setLifetimeTotal(exercise.lifetimeTotal);
      });
  };

  // Assemble workouts list
  const name = props.route.params.exercise.name.toLowerCase();
  const mode = props.route.params.exercise.mode;
  const WorkoutsList = assembleWorkoutsList(chartData, name, mode, displayChart, setDisplayChart, workoutDeleteID, setWorkoutDeleteID);

  // Conditionally display workouts list, empty list text, or loading spinner
  let ListDisplay;
  if (workouts.length === 0) {
    ListDisplay = (
      <Text style={styles.emptyListText}>
        workouts you add will appear here
      </Text>
    );
  } else ListDisplay = WorkoutsList;

  // Conditional rendering for workout delete/confirm buttons
  let DeleteWorkoutButtons;
  if (confirmDeleteWorkout) {
    DeleteWorkoutButtons = (
      <ConfirmDeletionButtons
        key={"confirmDelete"}
        confirm={removeWorkout}
        cancel={() => {
          setConfirmDeleteWorkout(false);
          setWorkoutDeleteID(null);
        }}
      />
    );
  } else {
    DeleteWorkoutButtons = (
      <Button
        block bordered danger
        key={"delete"}
        borderColor={Colors[colorScheme].error}
        backgroundColor={Colors[colorScheme].surface}
        onPress={() => {
          setConfirmDeleteWorkout(true);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        }}
      >
        <ButtonText
          style={{
            color: Colors[colorScheme].error
          }}
        >
          Delete Workout
        </ButtonText>
      </Button>
    );
  }

  // Conditionally render workout delete buttons in workout list
  if (workoutDeleteID !== null) {
    WorkoutsList.forEach((object, index) => {
      if (object && object.key === workoutDeleteID) {
        WorkoutsList.splice(index + 1, 0, DeleteWorkoutButtons)
          .join();
      }
    });
  }

  // Conditional rendering for exercise delete/confirm buttons
  let DeleteExerciseButtons;
  if (confirmDeleteExercise) {
    DeleteExerciseButtons = (
      <ConfirmDeletionButtons
        confirm={removeExercise}
        cancel={() => setConfirmDeleteExercise(false)}
      />
    );
  } else {
    DeleteExerciseButtons = (
      <Button
        block bordered danger
        borderColor={Colors[colorScheme].error}
        backgroundColor={Colors[colorScheme].surface}
        onLongPress={() => {
          setConfirmDeleteExercise(true);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        }}
      >
        <ButtonText
          style={{
            color: Colors[colorScheme].error
          }}
        >
          Hold to Delete {name}
        </ButtonText>
      </Button>
    );
  }

  // Conditionally splice charts into list
  if (displayChart !== null) {
    let chart;
    if (displayChart == "cumulative") {
      chart = (
        <LineChart
          data={chartData.cumulative.data}
          XAxisData={chartData.lifetime.dates}
          name={displayChart}
        />
      );
    } else {
      chart = (
        <BarChart
          data={chartData[displayChart].data}
          XAxisData={chartData[displayChart].dates}
          name={displayChart}
          goal={dailyGoal}
        />
      )
    }
    WorkoutsList.forEach((object, index) => {
      if (object && object.key == `${displayChart}-header`) {
        WorkoutsList.splice(index + 1, 0, chart)
          .join();
      }
    });
  }

  // Conditionally render progress bars for goals
  let GoalPanel = null;
  if (goals.length > 0) {
    GoalPanel = [];
    goals.forEach(goal => {
      let label = goal.type
      if (goalDeleteID === goal.id) {
        GoalPanel.push(
          <ConfirmDeletionButtons
            key={"confirmDeleteGoal"}
            confirm={() => removeGoal(goal)}
            cancel={() => removeGoal()}
          />
        );
      } else {
        GoalPanel.push(
          <TouchableHighlight onLongPress={() => removeGoal(goal)}>
            <ProgressBar
              data={chartData[label].data}
              goal={goal.value}
              name={goal.type}
              mode={props.route.params.exercise.mode}
            />
          </TouchableHighlight>
        );
      }
    });
  }

  return (
    <StyleProvider style={getTheme(platform)}>
      <Container>
        <View style={styles.container}>
          <Content
            padder
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <ScrollView>
              <Button
                block bordered
                style={styles.buttons}
                borderColor={Colors[colorScheme].primary}
                backgroundColor={Colors[colorScheme].surface}
                onPress={() =>
                  props.navigation.navigate("Add Workout", {
                    exercise: props.route.params.exercise,
                    refreshLastScreen: onRefresh,
                    refreshHomeScreen: props.route.params.refreshLastScreen
                  })
                }
              >
                <ButtonText style={{ color: Colors[colorScheme].primary }} >
                  Add workout
                </ButtonText>
              </Button>
              <BarChart
                data={chartData.lifetime.data}
                XAxisData={chartData.lifetime.dates}
                goal={dailyGoal}
                name="lifetime"
              />
              <Button
                block bordered
                style={styles.buttons}
                borderColor={Colors[colorScheme].primary}
                backgroundColor={Colors[colorScheme].surface}
                onPress={() => props.navigation.navigate("Add Goal", {
                  exercise: props.route.params.exercise,
                  refreshLastScreen: onRefresh
                })
                }
              >
                <ButtonText style={{ color: Colors[colorScheme].primary }} >
                  Set goal
                </ButtonText>
              </Button>
              {GoalPanel}
              {WorkoutsList}
              <View style={styles.buttons}>{DeleteExerciseButtons}</View>
            </ScrollView>
          </Content>
        </View>
      </Container>
    </StyleProvider>
  );
}

const styles = StyleSheet.create({
  emptyListText: {
    color: "#BDBDBD",
    textAlign: "center",
    marginVertical: 20
  },
  buttons: {
    margin: 10,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});