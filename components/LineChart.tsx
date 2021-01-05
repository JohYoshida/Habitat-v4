import * as React from 'react';
import {
  View
} from '../components/Themed';
import {
  LineChart as Chart,
  Grid,
  XAxis,
  YAxis
} from "react-native-svg-charts";
import * as shape from "d3-shape";
import Colors from "../constants/Colors";
import useColorScheme from '../hooks/useColorScheme';

export function LineChart(props) {
  const colorScheme = useColorScheme();

  if (!props.data) {
    return (<View></View>);
  } else {
    return (
      <View
        style={{ height: 300, padding: 10, flexDirection: "row" }}
        key={`${props.name} line graph`}
      >
        <YAxis
          data={props.data}
          style={{ marginBottom: 30 }}
          contentInset={{ top: 10, bottom: 10 }}
          svg={{ fontSize: 10, fill: "grey" }}
          numberOfTicks={6}
          min={0}
        />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Chart
            style={{ flex: 1 }}
            data={props.data}
            contentInset={{ top: 10, bottom: 10 }}
            svg={{ stroke: Colors[colorScheme].primary }}
            gridMin={0}
          >
            <Grid />
          </Chart>
          <XAxis
            style={{ marginHorizontal: -10, height: 30 }}
            data={props.XAxisData}
            contentInset={{ left: 10, right: 10 }}
            svg={{ fontSize: 10, fill: "grey" }}
            formatLabel={(value, index) => props.XAxisData[index]}
            numberOfTicks={7}
          />
        </View>
      </View>
    );

  }

}