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
    setData({ 
      pricesData: [
        { datetime: 'Jan', price: 100 },
        { datetime: 'Feb', price: 200 },
        { datetime: 'Mar', price: 150 },
        { datetime: 'Apr', price: 350 },
        { datetime: 'May', price: 250 },
        { datetime: 'Jun', price: 450 },
        { datetime: 'Jul', price: 400 },
        { datetime: 'Aug', price: 300 },
        { datetime: 'Sep', price: 500 },
        { datetime: 'Oct', price: 550 },
        { datetime: 'Nov', price: 700 },
        { datetime: 'Dec', price: 800 },
      ],
      usageData: []
    })
  }, [year, month, day])

  return (
    <>
      <h1>{title}</h1>

      <Dropdown label="year" values={years} onChange={setYear}/>
      <Dropdown label="month" values={months} onChange={setMonth}/>
      <Dropdown label="day" values={days} onChange={setDay}/>

      {
        data?.pricesData && 
        <LineChart width={600} height={300} data={data.pricesData}>
          <XAxis dataKey="datetime" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      }
    </>
  );
};

export default Chart;
