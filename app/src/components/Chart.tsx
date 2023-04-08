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
import { TimeBasis, UserInput } from "../../../common/dtos/UserInput.dto";
import {
    buildFetchUrl,
    chartDataColors,
    tickFormatter,
} from "../utils/chart.utils";
import UserInputForm from "./UserInputForm";

import "./Chart.css";

interface IProps {
    title: string;
}

const Chart: React.FC<IProps> = ({ title }: IProps) => {
    // specifies which datepicker to show
    const timeBasisOptions: TimeBasis[] = ["monthly", "daily", "hourly"];

    // user input data
    const [timeBasis, setTimeBasis] = useState<TimeBasis>(timeBasisOptions[0]);
    const [meteringPointIds, setMeteringPointIds] = useState<string[]>([]);

    // data for charts
    const [combinedData, setCombinedData] = useState<ClientResponse[]>([]);

    // url to fetch data from
    const [fetchDataUrl, setFetchDataUrl] = useState<string>("");

    // always know if a request is in progress
    const [isLoading, setIsLoading] = useState<boolean>(false);

    /**
     * Fetch Prices and Usage data
     * @param {string} fetchDataUrl - the url
     */
    const fetchData = async (fetchDataUrl: string) => {
        setIsLoading(true);

        try {
            const response = await fetch(fetchDataUrl);
            if (response.status > 400) {
                throw new Error(response.statusText);
            }

            const responseJson = await response.json();
            setCombinedData(JSON.parse(responseJson.body));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (fetchDataUrl) {
            fetchData(fetchDataUrl);
        }
    }, [fetchDataUrl]);

    const submitUserInput = ({
        datetime,
        timeBasis,
        meteringPointIds,
    }: UserInput) => {
        // build URL to fetch desired data from
        const fetchDataUrl = buildFetchUrl({
            datetime,
            timeBasis,
            meteringPointIds,
        });

        setFetchDataUrl(fetchDataUrl);
        setTimeBasis(timeBasis);
        setMeteringPointIds(meteringPointIds.split(","));
    };

    const clipLoaderCss: CSSProperties = {
        display: "block",
        margin: "0 auto",
        position: "absolute",
        top: "45%",
        left: "45%",
        borderWidth: "5px",
        borderColor: "#ff8600 #ffc600 transparent",
        zIndex: "999",
    };

    return (
        <div className="chart-component">
            <h1>{title}</h1>

            <div className="user-input">
                <UserInputForm
                    timeBasisOptions={timeBasisOptions}
                    disabled={isLoading}
                    onSubmit={submitUserInput}
                />
            </div>

            <div className="chart-container">
                <ClipLoader
                    size={150}
                    loading={isLoading}
                    cssOverride={clipLoaderCss}
                />

                {!combinedData?.length ? (
                    <div className="no-data">
                        <h2>No electricity price and usage data available</h2>
                    </div>
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
                                    tickFormatter(value, timeBasis)
                                }
                            />
                            <YAxis yAxisId="left" unit="kWh" />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                unit="BGN"
                            />
                            <Brush
                                dataKey="datetimeKey"
                                tickFormatter={(value) =>
                                    tickFormatter(value, timeBasis)
                                }
                            />
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
        </div>
    );
};

export default Chart;
