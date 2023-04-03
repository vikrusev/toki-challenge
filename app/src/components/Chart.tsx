import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import { ClientResponse } from '../../../common/data.types'
import Dropdown from "./Dropdown";

interface IProps {
  title: string;
}

const createArray = (untilNumber: number) => Array.from({ length: untilNumber }, (_, i) => String(i + 1).padStart(2, '0'))

const Chart: React.FC<IProps> = ({ title }: IProps) => {
  const years = ["2022", "2023"];
  const months = createArray(12);
  const days = createArray(31);
  
  const [data, setData] = useState<ClientResponse>()

  const [year, setYear] = useState<string>('2022')
  const [month, setMonth] = useState<string>('04')
  const [day, setDay] = useState<string>('01')

  useEffect(() => {
    async function fetchData() {
      const url = `https://price-usage-aggregation-tkqhweb3ja-ew.a.run.app/?year=${year}&month=${month}&day=${day}&meteringPointIds=1234`
      const response = await fetch(url);
      const jsonData = await response.json();
      setData(jsonData);
    }
    fetchData();
  }, [year, month, day])

  return (
    <>
      <h1>{title}</h1>

      <Dropdown label="year" values={years} onChange={setYear}/>
      <Dropdown label="month" values={months} onChange={setMonth}/>
      <Dropdown label="day" values={days} onChange={setDay}/>

      {
        data?.pricesData && 
        <LineChart width={1000} height={300} data={data.pricesData}>
          <XAxis dataKey="datetime" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      }
    </>
  );
};

export default Chart;
