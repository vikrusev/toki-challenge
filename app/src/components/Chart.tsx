import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Brush,
  ComposedChart,
} from "recharts";

import { ClientResponse, Response } from '../../../common/data.types'
import { transformData, TransformedUsageData } from "../utils/transform";
import Dropdown from "./Dropdown";

interface IProps {
  title: string;
}

export const createArray = (untilNumber: number) =>
  Array.from({ length: untilNumber }, (_, i) => String(i + 1).padStart(2, "0"));

const Chart: React.FC<IProps> = ({ title }: IProps) => {
  const years = ["2022", "2023"];
  const months = createArray(12);
  const days = createArray(31);
  
  const [pricesData, setPricesData] = useState<Response[]>()
  const [usageData, setUsageData] = useState<TransformedUsageData[]>()

  const [year, setYear] = useState<string>('2022')
  const [month, setMonth] = useState<string>('04')
  const [day, setDay] = useState<string>('01')

  useEffect(() => {
    async function fetchData() {
      const url = `https://price-usage-aggregation-tkqhweb3ja-ew.a.run.app/?year=${year}&month=${month}&day=${day}&meteringPointIds=1234,5678`
      const response = await fetch(url);
      const { pricesData, usageData }: ClientResponse = await response.json();
      setPricesData(pricesData)
      setUsageData(transformData(usageData));
    }
    fetchData();
  }, [year, month, day])

  return (
    <>
      <h1>{title}</h1>

      <Dropdown label="year" values={years} onChange={setYear}/>
      <Dropdown label="month" values={months} onChange={setMonth}/>
      <Dropdown label="day" values={days} onChange={setDay}/>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart
          width={500}
          height={200}
          data={pricesData}
          syncId="anyId"
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="datetime" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>

      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart
          width={500}
          height={200}
          data={usageData}
          syncId="anyId"
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="datetime" />
          <YAxis />
          <Tooltip />
          <Brush />
          {/* <Bar barSize={20} dataKey="1234" fill="#ff7300" />
          <Bar barSize={20} dataKey="5678" fill="#66fc03" /> */}
          <Line type="monotone" dataKey="1234" stroke="#ff7300" />
          <Line type="monotone" dataKey="5678" stroke="#66fc03" />
        </ComposedChart>
      </ResponsiveContainer>
    </>
  );
};

export default Chart;
