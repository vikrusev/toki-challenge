import { ClientResponse } from "../../../common/data.types";

interface TransformedUsageData {
    pointId: number;
    datetime: string;
}

/**
 * Transform usageData into a beneficial for a Composed Rechart Chart
 * @param data - usageData from the API response
 * @returns an array of reduced usageData
 */
export const transformData = (
    pricesData: ClientResponse["pricesData"],
    usageData: ClientResponse["usageData"]
) => {
    const usageDataTransformed: TransformedUsageData[] = Object.values(
        usageData.reduce((acc, curr) => {
            curr.data.forEach((d) => {
                const date = d.datetime;
                // @ts-ignore
                if (!acc[date]) {
                    // @ts-ignore
                    acc[date] = { datetime: date };
                }
                // @ts-ignore
                acc[date][curr.pointId] = d.value;
            });
            return acc;
        }, {} as TransformedUsageData)
    );

    return usageDataTransformed.length
        ? usageDataTransformed.map((usage) => {
              const price = pricesData.find(
                  (price) => price.datetime === usage.datetime
              );
              return { ...usage, ...price };
          })
        : pricesData;
};
