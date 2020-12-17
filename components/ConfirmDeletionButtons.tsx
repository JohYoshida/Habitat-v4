import * as React from "react";
import { View } from "react-native";
import { Button, Text } from "native-base";
import Colors from "../constants/Colors";
import useColorScheme from '../hooks/useColorScheme';

export function ConfirmDeletionButtons(props) {
  const colorScheme = useColorScheme();
  return (
    <View>
      <Button
        block
        danger
        backgroundColor={Colors[colorScheme].error}
        onPress={props.confirm}
      >
        <Text
          style={{
            color: Colors[colorScheme].onError
          }}
        >
          Delete forever - Are you sure?
      </Text>
      </Button>
      <Button
        block
        bordered
        borderColor={Colors[colorScheme].error}
        backgroundColor={Colors[colorScheme].surface}
        onPress={props.cancel}
      >
        <Text
          style={{
            color: Colors[colorScheme].error
          }}
        >
          Cancel
      </Text>
      </Button>
    </View>
  );
}
