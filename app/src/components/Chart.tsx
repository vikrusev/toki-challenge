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
    ReferenceLine,
} from "recharts";

import { ClientResponse } from "../../../common/dtos/ClientResponse.dto";
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
    const [pricesUsageData, setPricesUsageData] = useState<
        ClientResponse["pricesUsageData"]
    >([]);

    // cycles to provide suggestions on
    const [increasedPriceCycles, setIncreasedPriceCycles] = useState<
        ClientResponse["increasedPriceCycles"]
    >([]);

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

            const responseJson: ClientResponse = JSON.parse(
                (await response.json()).body
            );
            setPricesUsageData(responseJson.pricesUsageData);
            setIncreasedPriceCycles(responseJson.increasedPriceCycles);
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
        position: "fixed",
        top: "45%",
        left: "45%",
        borderWidth: "5px",
        borderColor: "#ff8600 #ffc600 transparent",
        zIndex: "999",
        transform: "translate(-50%,-50%)",
    };

    return (
        <div id="chart-component">
            <h1>{title}</h1>

            <div id="user-input">
                <UserInputForm
                    timeBasisOptions={timeBasisOptions}
                    disabled={isLoading}
                    onSubmit={submitUserInput}
                />
            </div>

            {pricesUsageData?.length > 0 && (
                <div id="price-cut-suggestions">
                    <h1>Suggestions to reduce costs</h1>
                    {!increasedPriceCycles.length ? (
                        <h4>No available suggestions for this date period</h4>
                    ) : (
                        <div className="suggestions-list">
                            {increasedPriceCycles.map((el, index) => (
                                <h4 key={index}>
                                    #{index + 1} High electricity price detected
                                    between{" "}
                                    {tickFormatter(
                                        pricesUsageData[el.start].datetimeKey,
                                        timeBasis
                                    )}{" "}
                                    and{" "}
                                    {tickFormatter(
                                        pricesUsageData[el.end].datetimeKey,
                                        timeBasis
                                    )}
                                </h4>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <div id="chart-container">
                <ClipLoader
                    id="clip-loader"
                    size={150}
                    loading={isLoading}
                    cssOverride={clipLoaderCss}
                />

                {!pricesUsageData?.length ? (
                    !isLoading && (
                        <div className="no-data">
                            <h2>
                                No electricity price and usage data available
                            </h2>
                        </div>
                    )
                ) : (
                    <ResponsiveContainer width="100%" height={700}>
                        <ComposedChart
                            width={500}
                            height={200}
                            data={pricesUsageData}
                            syncId="anyId"
                            margin={{
                                top: 10,
                                right: 20,
                                left: 20,
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
                            <YAxis
                                yAxisId="left"
                                unit="kWh"
                                stroke={
                                    meteringPointIds.length
                                        ? chartDataColors[0]
                                        : "#000"
                                }
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                unit="BGN"
                                stroke="#0000FF"
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
                                    pricesUsageData.some((e) =>
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
