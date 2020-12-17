import * as Linking from "expo-linking";

export default {
  prefixes: [Linking.makeUrl("/")],
  config: {
    screens: {
      Root: {
        screens: {
          Exercise: {
            screens: {
              ExerciseScreen: "exercise",
              AddExerciseScreen: "add-exercise"
            }
          },
          Settings: {
            screens: {
              SettingsScreen: "settings"
            }
          }
        }
      },
      NotFound: "*"
    }
  }
};
