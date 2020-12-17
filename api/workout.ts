import { URL } from "../constants/URLs";

// Get all workouts for an exercise from server
function fetchWorkouts(exercise_id) {
  return new Promise(resolve => {
    fetch(`${URL}/workouts/${exercise_id}`, {
      method: "GET"
    })
      .then(res => res.json())
      .then(json => {
        resolve(json.data);
      });
  });
}

function postWorkout(body) {
  return new Promise(resolve => {
    fetch(`${URL}/workout`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body
    }).then(() => resolve());
  });
}

function deleteWorkout(id, exercise_id, amount) {
  return new Promise(resolve => {
    fetch(`${URL}/workout`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Methods": "DELETE"
      },
      body: JSON.stringify({
        id,
        exercise_id,
        amount
      })
    }).then(() => resolve());
  });
}

export { fetchWorkouts, postWorkout, deleteWorkout };
