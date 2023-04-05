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
import { transformData, TransformedUsageData } from "../utils/transform";
import UserInput from "./UserInput";

interface IProps {
    title: string;
}

const Chart: React.FC<IProps> = ({ title }: IProps) => {
    const [pricesData, setPricesData] = useState<Response[]>([]);
    const [usageData, setUsageData] = useState<TransformedUsageData[]>([]);

    const [fetchUrl, setFetchUrl] = useState<string>();

    useEffect(() => {
        async function fetchData(fetchUrl: string) {
            const response = await fetch(fetchUrl);
            const { pricesData, usageData }: ClientResponse =
                await response.json();
            setPricesData(pricesData);
            setUsageData(transformData(usageData));
        }

        if (fetchUrl) {
            fetchData(fetchUrl);
        }
    }, [fetchUrl]);

    return (
        <>
            <h1>{title}</h1>

            <UserInput onSubmit={setFetchUrl} />

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

            {/* {usageData.length &&
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
            {/* {meteringPointIds.map(pointId => <Line type="monotone" dataKey={pointId} stroke="#ff7300" />)}
                        <Line type="monotone" dataKey="1234" stroke="#ff7300" />
                        <Line type="monotone" dataKey="5678" stroke="#66fc03" />
                    </ComposedChart>
                </ResponsiveContainer>
            ) : null}
             */}
        </>
    );
};

export default Chart;
