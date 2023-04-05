import React, { useEffect, useState } from "react";
import {
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Brush,
    ComposedChart,
    Bar,
    Legend,
} from "recharts";

import { ClientResponse } from "../../../common/data.types";
import { UserInput } from "../../../common/dtos/UserInput.dto";
import { buildUrl } from "../utils/helper";
import { transformData } from "../utils/transform";
import UserInputForm from "./UserInputForm";

interface IProps {
    title: string;
}

const Chart: React.FC<IProps> = ({ title }: IProps) => {
    // main properties
    const [combinedData, setCombinedData] = useState<any>([]);
    const [meteringPointIds, setMeteringPointIds] = useState<string[]>([]);

    // url to fetch data from
    const [fetchDataUrl, setFetchDataUrl] = useState<string>("");

    /**
     * Fetch Prices and Usage data
     * @param {string} fetchDataUrl - the url
     */
    const fetchData = async (fetchDataUrl: string) => {
        const response = await fetch(fetchDataUrl);
        const { pricesData, usageData }: ClientResponse = await response.json();
        setCombinedData(transformData(pricesData, usageData));
    };

    useEffect(() => {
        if (fetchDataUrl) {
            fetchData(fetchDataUrl);
        }
    }, [fetchDataUrl]);

    const submitUserInput = ({
        year,
        month,
        day,
        meteringPointIds,
    }: UserInput) => {
        const meteringPointIdsArray = meteringPointIds?.split(",") || [];

        // build URL to fetch desired data from
        const fetchDataUrl = buildUrl({
            dateOptions: {
                year,
                month,
                day,
            },
            meteringPointIds: meteringPointIdsArray,
        });

        setFetchDataUrl(fetchDataUrl);
        setMeteringPointIds(meteringPointIdsArray);
    };

    return (
        <>
            <h1>{title}</h1>

            <UserInputForm onSubmit={submitUserInput} />

            {!combinedData?.length ? (
                <h2>No data available</h2>
            ) : (
                <ResponsiveContainer width="100%" height={700}>
                    <ComposedChart
                        width={500}
                        height={200}
                        data={combinedData}
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
                        <YAxis yAxisId="left" unit="kWh" />
                        <YAxis yAxisId="right" orientation="right" unit="BGN" />
                        <Brush />
                        <Tooltip />
                        <Legend />
                        {meteringPointIds.map((el, index) => {
                            return (
                                <Bar
                                    key={index}
                                    barSize={20}
                                    yAxisId="left"
                                    dataKey={el}
                                    fill="#ff7300"
                                />
                            );
                        })}
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="value"
                            stroke="#8884d8"
                            connectNulls
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            )}
        </>
    );
};

export default Chart;
