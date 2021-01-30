import * as React from "react";
import {
  // ListItem,
  Input
} from "react-native-elements";
import {
  Body,
  ListItem,
  Right
} from "native-base";
import {
  Text
} from '../components/Themed';
import Colors from "../constants/Colors";
import useColorScheme from '../hooks/useColorScheme';

const moment = require("moment");

function assembleChartData(workouts) {
  // const colorScheme = useColorScheme();
  workouts.reverse();
  const charts = {
    // bar chart or goal progress bar?
    daily: {
      data: [],
      dates: [],
      total: 0
    },
    // bar chart
    weekly: {
      data: [],
      dates: [],
      total: 0
    },
    // bar chart
    monthly: {
      data: [],
      dates: [],
      total: 0
    },
    // bar chart
    lifetime: {
      data: [],
      dates: [],
      total: 0
    },
    // line chart
    cumulative: {
      data: [],
      total: 0
    },
    workoutsList: []
  };

  const todayList = ["Today"];
  const thisWeekList = ["This Week"];
  const thisMonthList = ["This Month"];

  workouts.forEach((workout, index) => {
    // Calculate difference in days between workout and now
    const diff = moment()
      .startOf("day")
      .diff(moment(workout.createdAt)
        .startOf("day"), "days");
    let amount = calculateAmount(workout);

    // Insert data for lifetime chart
    charts.lifetime.total += amount;
    if (!charts.lifetime.data[diff]) {
      charts.lifetime.data[diff] = amount;
      charts.lifetime.dates[diff] = moment(workout.createdAt)
        .format(
          "MM-DD-YYYY"
        );
    } else {
      charts.lifetime.data[diff] += amount;
    }

    // Insert data for daily, weekly, monthly charts and lists
    if (diff == 0) {
      // Today
      charts.daily.total += amount;
      charts.daily.data.push(amount);
      let time = moment(workout.createdAt)
        .format("hh:mm");
      charts.daily.dates.push(time);
      // Add to list
      todayList.push(workout);
    }
    if (diff < 7) {
      // This week
      charts.weekly.total += amount;
      let data = charts.weekly.data;
      if (!data[diff]) {
        data[diff] = amount;
        let date = moment(workout.createdAt)
          .format("MMM Do");
        charts.weekly.dates[diff] = date;
      } else {
        data[diff] += amount;
      }
      // Add to list
      if (diff != 0) {
        thisWeekList.push(workout);
      }
    }
    if (diff < 30) {
      // This month
      charts.monthly.total += amount;
      let data = charts.monthly.data;
      if (!data[diff]) {
        data[diff] = amount;
        let date = moment(workout.createdAt)
          .format("MMM Do");
        charts.monthly.dates[diff] = date;
      } else {
        data[diff] += amount;
      }

      if (diff >= 7) {
        thisMonthList.push(workout);
      }
    }
  });

  // Replace nulls with zeroes
  cleanup(charts.cumulative, "MM-DD-YYYY");
  cleanup(charts.lifetime, "MM-DD-YYYY");
  cleanup(charts.weekly, "MMM Do");
  cleanup(charts.monthly, "MMM Do");

  // Reverse order of data
  charts.daily.data.reverse();
  charts.weekly.data.reverse();
  charts.weekly.dates.reverse();
  charts.monthly.data.reverse();
  charts.monthly.dates.reverse();
  charts.lifetime.data.reverse();
  charts.lifetime.dates.reverse();

  // Insert data for cumulative chart
  let cumulativeData = charts.cumulative.data;
  charts.lifetime.data.forEach((value, index) => {
    charts.cumulative.total = charts.lifetime.total;
    if (!cumulativeData[index]) {
      if (cumulativeData[index - 1]) {
        cumulativeData[index] = cumulativeData[index - 1] + value;
      } else {
        cumulativeData[index] = value;
      }
    } else {
      cumulativeData[index] += value;
    }
  });

  // Concatenate workout lists
  charts.workoutsList = todayList.concat(thisWeekList, thisMonthList);
  // Add cumulative marker
  charts.workoutsList.push("Cumulative");
  return charts;
}

// Calculate amount
function calculateAmount(workout) {
  let amount;
  if (workout.seconds) {
    amount = workout.seconds;
  } else {
    amount = workout.reps * workout.sets;
  }
  return amount;
}

// Remove null values and replace with zeroes or dates
function cleanup(dataset, format) {
  for (var i = 0; i < dataset.data.length; i++) {
    if (!dataset.data[i]) {
      dataset.data[i] = 0;
      if (dataset.dates) {
        dataset.dates[i] = moment()
          .subtract(i, "days")
          .format(format);
      }
    }
  }
}

function assembleWorkoutsList(
  chartData,
  name,
  mode,
  displayChart,
  setDisplayChart,
  workoutDeleteID,
  setWorkoutDeleteID
) {
  const WorkoutsList = [];
  chartData.workoutsList.forEach(item => {
    if (item == "Today") {
      let title = assembleTitle(mode, chartData.daily.total, name);
      WorkoutsList.push(
        <ListItem
          key="daily-header"
          title="Today"
          topDivider={true}
          bottomDivider={true}
          rightTitle={title}
        >
          <Body>
            <Text>Today</Text>
           </Body>
          <Right>
            <Text>{title}</Text>
          </Right>
        </ListItem>
      );
    } else if (item == "This Week") {
      let title = assembleTitle(mode, chartData.weekly.total, name);
      WorkoutsList.push(
        <ListItem
          key="weekly-header"
          title="This Week"
          topDivider={true}
          bottomDivider={true}
          rightTitle={title}
          onPress={() => {
            if (displayChart === "weekly") {
              setDisplayChart(null);
            } else {
              setDisplayChart("weekly");
            }
          }}
        >
          <Body>
            <Text>This Week</Text>
            <Text style={{ color: "#BDBDBD" }}>since {chartData.weekly.dates[0]}</Text>
           </Body>
          <Right>
            <Text>{title}</Text>
          </Right>
        </ListItem>
      );
    } else if (item == "This Month") {
      let title = assembleTitle(mode, chartData.monthly.total, name);
      WorkoutsList.push(
        <ListItem
          key="monthly-header"
          title="This Month"
          topDivider={true}
          bottomDivider={true}
          rightTitle={title}
          onPress={() => {
            if (displayChart === "monthly") {
              setDisplayChart(null);
            } else {
              setDisplayChart("monthly");
            }
          }}
        >
          <Body>
            <Text>This Month</Text>
            <Text style={{ color: "#BDBDBD" }}>since {chartData.monthly.dates[0]}</Text>
           </Body>
          <Right>
            <Text>{title}</Text>
          </Right>
        </ListItem>
      );
    } else if (item == "Cumulative") {
      let title = assembleTitle(mode, chartData.cumulative.total, name);
      console.log(chartData.lifetime.dates[0]);
      WorkoutsList.push(
        <ListItem
          key="cumulative-header"
          title="Cumulative"
          topDivider={true}
          bottomDivider={true}
          rightTitle={title}
          onPress={() => {
            if (displayChart === "cumulative") {
              setDisplayChart(null);
            } else {
              setDisplayChart("cumulative");
            }
          }}
        >
          <Body>
            <Text>Cumulative</Text>
            <Text style={{ color: "#BDBDBD" }}>since {chartData.lifetime.dates[0]}</Text>
           </Body>
          <Right>
            <Text>{title}</Text>
          </Right>
        </ListItem>
      );
    } else {
      let rightTitle;
      let timestamp = moment(item.createdAt)
        .format("h:mm a MM-DD-YYYY");
      if (mode === "time") rightTitle = assembleTitle(mode, item.seconds, name);
      else rightTitle = assembleTitle(mode, item.reps * item.sets, name);
      let title;
      mode === "time" ?
        title = `${item.seconds} seconds` :
        title = `${item.reps} reps, ${item.sets} sets`
      WorkoutsList.push(
        <ListItem
          key={item.id}
          title={
            mode === "time"
              ? `${item.seconds} seconds`
              : `${item.reps} reps, ${item.sets} sets`
          }
          rightTitle={rightTitle}
          subtitle={timestamp}
          onLongPress={() => {
            if (item.id === workoutDeleteID) {
              setWorkoutDeleteID(null);
            } else {
              setWorkoutDeleteID(item.id);
            }
          }}
        >
          <Body>
            <Text>{title}</Text>
            <Text style={{ color: "#BDBDBD" }}>{timestamp}</Text>
          </Body>
          <Right>
            <Text>{rightTitle}</Text>
          </Right>
        </ListItem>
      );
    }
  });

  return WorkoutsList;
}

const assembleTitle = (mode, number, name) => {
  let title;
  if (mode === "time") {
    let hours = Math.floor(number / 3600);
    let minutes = Math.floor((number - hours * 3600) / 60);
    let seconds = Math.floor(number - hours * 3600 - minutes * 60);
    title = `${hours} h ${minutes} m ${seconds} s`;
  } else if (mode === "reps and sets") {
    title = `${number} ${name}`;
  }
  return title;
};

export {
  assembleChartData,
  assembleWorkoutsList
};