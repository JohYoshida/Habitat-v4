import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import ExerciseScreen from '../screens/ExerciseScreen';
import AddExerciseScreen from '../screens/AddExerciseScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { BottomTabParamList, ExerciseParamList, SettingsParamList } from '../types';

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="Exercise"
      tabBarOptions={{ activeTintColor: Colors[colorScheme].primary }}>
      <BottomTab.Screen
        name="Exercise"
        component={ExerciseNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="md-barbell" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Settings"
        component={SettingsNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="md-settings-sharp" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: { name: string; color: string }) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const ExerciseStack = createStackNavigator<ExerciseParamList>();

function ExerciseNavigator() {
  return (
    <ExerciseStack.Navigator>
      <ExerciseStack.Screen
        name="Exercise"
        component={ExerciseScreen}
        options={{ headerTitle: 'Exercise' }}
      />
      <ExerciseStack.Screen
        name="Add Exercise"
        component={AddExerciseScreen}
        options={{ headerTitle: 'Add Exercise' }}
      />
    </ExerciseStack.Navigator>
  );
}

const SettingsStack = createStackNavigator<SettingsParamList>();

function SettingsNavigator() {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ headerTitle: 'Settings' }}
      />
    </SettingsStack.Navigator>
  );
}
