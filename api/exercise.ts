import { URL } from "../constants/URLs";
const moment = require("moment");

// Get a particular exercise from server
function fetchExercise(id) {
  return new Promise(resolve => {
    fetch(`${URL}/exercise/${id}`, {
      method: "GET"
    })
      .then(res => res.json())
      .then(json => {
        resolve(json.data);
      });
  });
}

// Get all exercises from server
function fetchExercises() {
  return new Promise(resolve => {
    fetch(`${URL}/exercises`, {
      method: "GET"
    })
      .then(res => res.json())
      .then(json => {
        resolve(json.data);
      });
  });
}

// Get daily goal data
function fetchDailyGoals() {
  return new Promise(resolve => {
    const to = moment()
      .utc()
      .format();
    const from = moment()
      .startOf("day")
      .utc()
      .format();
    fetch(`${URL}/dailyGoal/${from}/${to}`, {
      method: "GET"
    })
      .then(res => res.json())
      .then(json => {
        resolve(json.data);
      });
  });
}

// Post an exercise to the server
function postExercise(name, mode, dailyGoal) {
  return new Promise(resolve => {
    fetch(`${URL}/exercise`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        mode,
        dailyGoal: dailyGoal ? dailyGoal : 0
      })
    }).then(() => resolve());
  });
}

// Update an exercise
function updateExercise(exercise) {
  const { id, name, mode, dailyGoal, lifetimeTotal } = exercise;
  return new Promise(resolve => {
    fetch(`${URL}/exercise/${id}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        mode,
        lifetimeTotal,
        dailyGoal: dailyGoal ? dailyGoal : 0
      })
    }).then(() => {
      resolve();
    });
  });
}

// Delete a particular exercise by id
function deleteExercise(id, name) {
  return new Promise(resolve => {
    fetch(`${URL}/exercise`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Methods": "DELETE"
      },
      body: JSON.stringify({ id, name })
    }).then(() => resolve());
  });
}

export {
  fetchExercise,
  fetchExercises,
  fetchDailyGoals,
  postExercise,
  updateExercise,
  deleteExercise
};
