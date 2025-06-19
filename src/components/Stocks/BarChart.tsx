import { VictoryBar, VictoryChart } from 'victory';

const data = [
  { year: 2021, revenue: 100 },
  { year: 2022, revenue: 130 },
  { year: 2023, revenue: 150 },
  { year: 2024, revenue: 180 },
];

<VictoryChart domainPadding={20}>
  <VictoryBar
    data={data}
    x="year"
    y="revenue"
    style={{ data: { fill: '#A678F1' } }}
  />
</VictoryChart>
