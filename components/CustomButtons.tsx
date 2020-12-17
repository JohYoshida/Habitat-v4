import * as React from "react";
import {
  View
} from "react-native";
import {
  Col,
  Row,
  Grid
} from "react-native-easy-grid";
import {
  Button,
  Text
} from "native-base";
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';

export default function CustomButtons(props) {
  const colorScheme = useColorScheme();
  const Buttons = [];
  props.buttons.forEach((label, index) => {
    let custom = false;
    if (label === "custom") custom = true;
    if (props.selectedIndex === index) {
      Buttons.push(
        <Col style={custom ? { width: 100 } : null} key={index}>
          <Button
            block
            onPress={() => props.onPress(index)}
            backgroundColor={Colors[colorScheme].primary}
          >
            <Text
              style={{
                color: Colors[colorScheme].onPrimary
              }}
            >
              {label}
            </Text>
          </Button>
        </Col>
      );
    } else {
      Buttons.push(
        <Col style={custom ? { width: 100 } : null} key={index}>
          <Button
            bordered
            block
            onPress={() => props.onPress(index)}
            borderColor={Colors[colorScheme].primary}
            backgroundColor={Colors[colorScheme].surface}
          >
            <Text
              style={{
                color: Colors[colorScheme].primary
              }}
            >
              {label}
            </Text>
          </Button>
        </Col>
      );
    }
  });

  return (
    <View style={props.style}>
      <Grid>{Buttons}</Grid>
    </View>
  );
}