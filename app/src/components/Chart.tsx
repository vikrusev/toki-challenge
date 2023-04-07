import ClipLoader from "react-spinners/ClipLoader";
import React, { CSSProperties, useEffect, useState } from "react";
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

import { ClientResponse } from "../../../common/response.types";
import { InputTime, UserInput } from "../../../common/dtos/UserInput.dto";
import { buildUrl, chartDataColors, tickFormatter } from "../utils/chart.utils";
import UserInputForm from "./UserInputForm";

interface IProps {
    title: string;
}

const Chart: React.FC<IProps> = ({ title }: IProps) => {
    // data for charts
    const [combinedData, setCombinedData] = useState<ClientResponse[]>([]);

    // user input data
    const [timeInput, setTimeInput] = useState<InputTime>();
    const [meteringPointIds, setMeteringPointIds] = useState<string[]>([]);

    // url to fetch data from
    const [fetchDataUrl, setFetchDataUrl] = useState<string>("");

    const [isLoading, setIsLoading] = useState<boolean>(false);

    /**
     * Fetch Prices and Usage data
     * @param {string} fetchDataUrl - the url
     */
    const fetchData = async (fetchDataUrl: string) => {
        setIsLoading(true);

        const response = await fetch(fetchDataUrl);
        const responseJson: ClientResponse[] = await response.json();
        setCombinedData(responseJson);

        setIsLoading(false);
    };

    useEffect(() => {
        if (fetchDataUrl) {
            fetchData(fetchDataUrl);
        }
    }, [fetchDataUrl]);

    const submitUserInput = ({
        meteringPointIds,
        ...dateOptions
    }: UserInput) => {
        const meteringPointIdsArray = meteringPointIds?.split(",") || [];

        // build URL to fetch desired data from
        const fetchDataUrl = buildUrl({
            dateOptions,
            meteringPointIds: meteringPointIdsArray,
        });

        setFetchDataUrl(fetchDataUrl);
        setTimeInput(dateOptions);
        setMeteringPointIds(meteringPointIdsArray);
    };

    const clipLoaderCss: CSSProperties = {
        display: "block",
        margin: "0 auto",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
    };

    return (
        <div style={{ position: "relative" }}>
            <h1>{title}</h1>

            <ClipLoader
                color="red"
                size={150}
                loading={isLoading}
                cssOverride={clipLoaderCss}
            />

            <UserInputForm disabled={isLoading} onSubmit={submitUserInput} />

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
                        <XAxis
                            dataKey="datetimeKey"
                            tickFormatter={(value) =>
                                tickFormatter(value, timeInput)
                            }
                        />
                        <YAxis yAxisId="left" unit="kWh" />
                        <YAxis yAxisId="right" orientation="right" unit="BGN" />
                        <Brush />
                        <Tooltip />
                        <Legend />
                        {/* Adding a Bar for each metering point
                        from the user input that exists in the data */}
                        {meteringPointIds.map((el, index) => {
                            return (
                                combinedData.some((e) =>
                                    e.hasOwnProperty(el)
                                ) && (
                                    <Bar
                                        key={index}
                                        barSize={20}
                                        yAxisId="left"
                                        dataKey={el}
                                        fill={chartDataColors[index]}
                                    />
                                )
                            );
                        })}
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="electricityPrice"
                            stroke="#0000FF"
                            strokeWidth={4}
                            activeDot={{ r: 8 }}
                            connectNulls
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            )}
        </div>
    );
};

export default Chart;
