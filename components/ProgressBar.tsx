import * as React from 'react';
import {
  Text,
  View
} from '../components/Themed';
import {
  BarChart,
  Grid,
  XAxis,
  YAxis
} from "react-native-svg-charts";
import * as shape from "d3-shape";
import * as scale from 'd3-scale'
import Colors from "../constants/Colors";
import useColorScheme from '../hooks/useColorScheme';

export function ProgressBar(props) {
  const colorScheme = useColorScheme();

  if (!props.data) {
    return (<View></View>);
  } else {
    const total = props.data.reduce((a, b) => a + b, 0);
    let fill = Colors[colorScheme].primary;
    let max = props.goal;
    if (total >= props.goal) {
      fill = Colors[colorScheme].secondary;
      max = total;
    }
    return (
      <View
        style={{ height: 35, padding: 5, flexDirection: "row", justifyContent: "flex-end" }}
        key={`${props.name} graph`}
      >
        <View style={{ marginLeft: 10, flex: 1 }}>
          <YAxis
            style={{ marginHorizontal: 1, marginVertical: 1, height: 15 }}
            data={[props.name]}
            scale={scale.scaleBand}
            contentInset={{ top: 10, bottom: 10 }}
            svg={{ fontSize: 10, fill: "grey" }}
          />
          <BarChart
            horizontal={true}
            style={{ height: 2, marginVertical: 0, padding: 0 }}
            data={[total]}
            contentInset={{ top: 10, bottom: 10 }}
            svg={{ fill }}
            gridMin={0}
            gridMax={max}
          >
            <Grid
              direction={Grid.Direction.VERTICAL} />
          </BarChart>
          <XAxis
            style={{ marginHorizontal: 1, marginVertical: 1 }}
            data={props.data}
            contentInset={{ left: 10, right: 10 }}
            svg={{ fontSize: 8, fill: "grey" }}
            numberOfTicks={10}
            min={0}
            max={max}
          />
        </View>
      </View>
    );

  }

}
