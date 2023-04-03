interface UrlBuildData {
  year: string;
  month?: string;
  day?: string;
  meteringPointIds?: string[];
}

export const createArray = (untilNumber: number) =>
  Array.from({ length: untilNumber }, (_, i) => String(i).padStart(2, "0"));

export const buildUrl = ({
  year,
  month,
  day,
  meteringPointIds,
}: UrlBuildData) => {
  let url = `https://price-usage-aggregation-tkqhweb3ja-ew.a.run.app/?year=${year}`;

  if (Number(month)) url += `&month=${month}`;
  if (Number(day)) url += `&day=${day}`;
  if (meteringPointIds?.length && meteringPointIds.filter((p) => p).length)
    url += `&meteringPointIds=${meteringPointIds.join(",")}`;

  return url;
};
