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

import { ClientResponse, Response } from "../../../common/data.types";
import { InputTime } from "../../../common/dtos/UserInput.dto";
import { buildUrl, createArray } from "../utils/helper";
import { transformData, TransformedUsageData } from "../utils/transform";
import Dropdown from "./Dropdown";

interface IProps {
    title: string;
}

const Chart: React.FC<IProps> = ({ title }: IProps) => {
    const availableDates = {
        years: ["2022", "2023"],
        months: createArray(12),
        days: createArray(31),
    };

    const [pricesData, setPricesData] = useState<Response[]>([]);
    const [usageData, setUsageData] = useState<TransformedUsageData[]>([]);
    const [meteringPointIds, setMeteringPointData] = useState<string[]>([]);

    const [shouldExecute, setShouldExecute] = useState<boolean>(false);

    const [dateOptions, setDateOptions] = useState<InputTime>({
        year: "2022",
        month: "1",
        day: "1",
    });

    useEffect(() => {
        async function fetchData() {
            const url = buildUrl({
                dateOptions,
                meteringPointIds,
            });
            const response = await fetch(url);
            const { pricesData, usageData }: ClientResponse =
                await response.json();
            setPricesData(pricesData);
            setUsageData(transformData(usageData));
        }

        if (shouldExecute) {
            fetchData();
            setShouldExecute(false);
        }
    }, [dateOptions, meteringPointIds, shouldExecute]);

    const submitRequest = () => {
        setShouldExecute(true);
    };

    return (
        <>
            <h1>{title}</h1>

            <Dropdown
                type="year"
                values={availableDates.years}
                onChange={setDateOptions}
            />
            <Dropdown
                type="month"
                values={availableDates.months}
                onChange={setDateOptions}
            />
            <Dropdown
                type="day"
                values={availableDates.days}
                onChange={setDateOptions}
            />

            <label htmlFor="meteringPoints">Metering Point Ids:</label>
            <input
                id="meteringPoints"
                type="text"
                value={meteringPointIds}
                onChange={(e) =>
                    setMeteringPointData(
                        e.target.value.replace(/\s+/g, "").split(",")
                    )
                }
            />

            <button type="button" onClick={submitRequest}>
                Submit Request
            </button>

            {pricesData?.length ? (
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
                        <Brush />
                        <Tooltip />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#8884d8"
                        />
                    </LineChart>
                </ResponsiveContainer>
            ) : null}

            {usageData.length &&
            meteringPointIds.some((el) => `${el}` in usageData[0]) ? (
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
                        {/* <Bar barSize={20} dataKey="1234" fill="#ff7300" />
              <Bar barSize={20} dataKey="5678" fill="#66fc03" /> */}
                        {/* {meteringPointIds.map(pointId => <Line type="monotone" dataKey={pointId} stroke="#ff7300" />)} */}
                        <Line type="monotone" dataKey="1234" stroke="#ff7300" />
                        <Line type="monotone" dataKey="5678" stroke="#66fc03" />
                    </ComposedChart>
                </ResponsiveContainer>
            ) : null}
        </>
    );
};

export default Chart;
