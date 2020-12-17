import * as React from "react";
import {
  StyleSheet,
  View
} from "react-native";
import {
  Input
} from "react-native-elements";
import {
  Col,
  Row,
  Grid
} from "react-native-easy-grid";
import {
  Button,
  Container,
  StyleProvider,
  Text,
  H3
} from "native-base";
import Colors from "../constants/Colors";
import useColorScheme from '../hooks/useColorScheme';

export default function NumberPad(props) {
  const colorScheme = useColorScheme();
  const initialValue = props.initialValue ? props.initialValue : "000000";
  const [mode, setMode] = React.useState(props.mode);
  const [hours, setHours] = React.useState(mode == "number" ? null : initialValue.slice(0, 2));
  const [minutes, setMinutes] = React.useState(mode == "number" ? null : initialValue.slice(2, 4));
  const [seconds, setSeconds] = React.useState(mode == "number" ? null : initialValue.slice(4, 6));
  const [amount, setAmount] = React.useState(() => {
    if (mode === "time") {
      return Number(initialValue) !== 0 ? Number(initialValue).toString() : "";
    } else if (mode === "number") {
      return Number(initialValue) == 0 ? "" : initialValue.toString();
    }
  });

  const updateAmount = value => {
    let num; // Up to 6 digits. No leading zeroes
    let str; // Will always be 6 digits, including any leading zeroes
    if (value === "back") {
      if (mode === "number" && amount.length === 1) {
        num = "0";
      } else {
        num = amount.slice(0, -1);
      }
      str = "000000".slice(0, -amount.length + 1) + num;
    } else {
      num = Number(amount + value);
      str = "000000".slice(0, -amount.length - 1) + num;
    }
    str += "000000";
    str = str.slice(0, 6);
    setHours(str.slice(0, 2));
    setMinutes(str.slice(2, 4));
    setSeconds(str.slice(4, 6));
    setAmount(num.toString().slice(0, 6));
    props.callback(str);
  };

  let Display;
  if (mode === "time") {
    Display = (
      <Button transparent block>
        <H3 style={{ color: Colors[colorScheme].primary }}>
          {hours} h {minutes} m {seconds} s
        </H3>
      </Button>
    );
  } else if (mode === "number") {
    Display = (
      <Button transparent block>
        <H3 style={{ color: Colors[colorScheme].primary }}>
          {amount}
        </H3>
      </Button>
    );
  }

  return (
    <View>
      <Grid>
        <Row>
          <Col>{Display}</Col>
          <Col>
            <PadButton updateAmount={updateAmount} amount="back" value="<-"/>
          </Col>
        </Row>
        <Row>
          <Col>
            <PadButton updateAmount={updateAmount} amount="1" value={1}/>
          </Col>
          <Col>
            <PadButton updateAmount={updateAmount} amount="2" value={2}/>
          </Col>
          <Col>
            <PadButton updateAmount={updateAmount} amount="3" value={3}/>
          </Col>
        </Row>
        <Row>
          <Col>
            <PadButton updateAmount={updateAmount} amount="4" value={4}/>
          </Col>
          <Col>
            <PadButton updateAmount={updateAmount} amount="5" value={5}/>
          </Col>
          <Col>
            <PadButton updateAmount={updateAmount} amount="6" value={6}/>
          </Col>
        </Row>
        <Row>
          <Col>
            <PadButton updateAmount={updateAmount} amount="7" value={7}/>
          </Col>
          <Col>
            <PadButton updateAmount={updateAmount} amount="8" value={8}/>
          </Col>
          <Col>
            <PadButton updateAmount={updateAmount} amount="9" value={9}/>
          </Col>
        </Row>
        <Row>
          <Col>
            <PadButton updateAmount={updateAmount} amount="0" value={0}/>
          </Col>
        </Row>
      </Grid>
    </View>
  );
}

function PadButton(props) {
  const colorScheme = useColorScheme();
  return (
    <Button
      transparent
      block
      onPress={() => props.updateAmount(props.amount)}
      backgroundColor={Colors[colorScheme].surface}
    >
      <Text style={{ color: Colors[colorScheme].primary }}>{props.value}</Text>
    </Button>
  );
}

const styles = StyleSheet.create({});