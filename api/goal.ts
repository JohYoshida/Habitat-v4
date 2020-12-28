import { URL } from "../constants/URLs";

// Get all workouts for an exercise from server
function fetchGoals(exercise_id) {
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

export { fetchGoals, postGoal, deleteGoal };
