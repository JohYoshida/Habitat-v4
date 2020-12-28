import { URL } from "../constants/URLs";

// Get all goals from server
function fetchGoals() {
  return new Promise(resolve => {
    fetch(`${URL}/goals`, {
      method: "GET"
    })
      .then(res => res.json())
      .then(json => {
        resolve(json.data);
      });
  });
}

// Get all goals for an exercise from server
function fetchGoalsByExercise(exercise_id) {
  return new Promise(resolve => {
    fetch(`${URL}/goals/:exercise_id`, {
      method: "GET"
    })
      .then(res => res.json())
      .then(json => {
        resolve(json.data);
      });
  });
}

// Post goal to server
function postGoal(body) {
  return new Promise(resolve => {
    fetch(`${URL}/goal`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body
    }).then(() => resolve());
  });
}

// Delete goal from server
function deleteGoal() {
  return new Promise(resolve => {
    fetch(`${URL}/goal/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Methods": "DELETE"
      }
    }).then(() => resolve());
  });
}

export { fetchGoals, fetchGoalsByExercise, postGoal, deleteGoal };
