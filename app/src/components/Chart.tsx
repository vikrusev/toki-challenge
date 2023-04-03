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
import { buildUrl, createArray } from "../utils/helper";
import { transformData, TransformedUsageData } from "../utils/transform";
import Dropdown from "./Dropdown";

interface IProps {
  title: string;
}

const Chart: React.FC<IProps> = ({ title }: IProps) => {
  const years = ["2022", "2023"];
  const months = createArray(12);
  const days = createArray(31);
  
  const [pricesData, setPricesData] = useState<Response[]>([])
  const [usageData, setUsageData] = useState<TransformedUsageData[]>([])
  const [meteringPointIds, setMeteringPointData] = useState<string[]>([])

  const [shouldExecute, setShouldExecute] = useState<boolean>(false)

  const [year, setYear] = useState<string>('2022')
  const [month, setMonth] = useState<string>('')
  const [day, setDay] = useState<string>('')

  useEffect(() => {
    async function fetchData() {
      const url = buildUrl({
        year, month, day, meteringPointIds
      })
      console.log(url)
      const response = await fetch(url);
      const { pricesData, usageData }: ClientResponse = await response.json();
      setPricesData(pricesData)
      setUsageData(transformData(usageData));
    }

    if (shouldExecute) {
      fetchData();
      setShouldExecute(false)
    }
  }, [year, month, day, meteringPointIds, shouldExecute])
  
  const submitRequest = () => {
    setShouldExecute(true)
  }

  return (
    <>
      <h1>{title}</h1>

      <Dropdown label="year" values={years} onChange={setYear}/>
      <Dropdown label="month" values={months} onChange={setMonth}/>
      <Dropdown label="day" values={days} onChange={setDay}/>

      <label htmlFor="meteringPoints">Metering Point Ids:</label>
      <input id="meteringPoints" type="text" value={meteringPointIds} onChange={(e) => setMeteringPointData(e.target.value.split(','))} />

      <button type="button" onClick={submitRequest}>Submit Request</button>

      {
        pricesData?.length ?
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
          : null
      }

      { 
        meteringPointIds?.length ? 
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
              {meteringPointIds.map(pointId => <Line type="monotone" dataKey={pointId} stroke="#ff7300" />)}
            </ComposedChart>
          </ResponsiveContainer>
          : null
      }
    </>
  );
};

export default Chart;
