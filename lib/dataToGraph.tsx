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

function sortWorkouts(workouts, dateToNum, numToDate) {
  const data = [];
  const dates = [];
  // Sort data by timestamp
  workouts.forEach(workout => {
    let value = dateToNum(workout.createdAt);
    let sum = (Number(workout.reps) * Number(workout.sets)) + Number(workout.seconds);
    // Check if workout has new date value
    if (dates[dates.length - 1] !== value) {
      dates[dates.length] = value;
      data[data.length] = sum;
    } else { // add to data at that date value
      data[data.length - 1] += sum;
    }
  });
  // Fill in gaps
  dates.push(dateToNum()); // Add today's date to end
  for (var i = 1; i < dates.length; i++) {
    let insert = dates[i - 1] + 1;
    while (insert < dates[i]) {
      dates.splice(i, 0, insert);
      data.splice(i, 0, 0);
      insert++;
    }
  }
  dates.pop(); // Remove today's date
  // Convert sorting values into formatted dates
  dates.forEach((value, i) => {
    dates[i] = numToDate(value);
  });
  return {
    data,
    dates
  };
}

export function sortDaily(workouts) {
  const dateToNum = (date) => {
    return moment(date)
      .dayOfYear();
  }
  const numToDate = (value) => {
    return moment()
      .dayOfYear(value)
      .format("MMM D, YYYY");
  }
  return sortWorkouts(workouts, dateToNum, numToDate);
};

export function sortWeekly(workouts) {
  const dateToNum = (date) => {
    return moment(date)
      .week();
  }
  const numToDate = (value) => {
    let week = moment()
      .week(value);
    let month = week.format("MMM");
    let start = week.startOf("week")
      .format("MMM D");
    let end = week.endOf("week")
      .format("MMM D");
    let year = week.format("YYYY");
    return `${start}-${end} ${year}`
  }
  return sortWorkouts(workouts, dateToNum, numToDate);
};

export function sortMonthly(workouts) {
  const dateToNum = (date) => {
    return moment(date)
      .month();
  }
  const numToDate = (value) => {
    return moment()
      .month(value)
      .format("MMM YYYY");
  }
  return sortWorkouts(workouts, dateToNum, numToDate);
}