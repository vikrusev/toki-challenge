import { ClientResponse } from "../../../common/data.types";

export interface TransformedUsageData {
  pointId: number;
  datetime: string;
}

export const transformData = (
  data: ClientResponse["usageData"]
): TransformedUsageData[] =>
  Object.values(
    data.reduce((acc, curr) => {
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
