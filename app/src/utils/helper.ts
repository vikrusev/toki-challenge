interface UrlBuildData {
  year: string;
  month?: string;
  day?: string;
  meteringPointIds?: string[];
}

export const createArray = (untilNumber: number) =>
  Array.from({ length: untilNumber }, (_, i) => String(i + 1).padStart(2, "0"));

export const buildUrl = ({
  year,
  month,
  day,
  meteringPointIds,
}: UrlBuildData) => {
  let url = `https://price-usage-aggregation-tkqhweb3ja-ew.a.run.app/?year=${year}`;
  if (month) url += `&month=${month}`;
  if (day) url += `&day=${day}`;
  console.log(meteringPointIds?.length);
  if (meteringPointIds?.length)
    url += `&meteringPointIds=${meteringPointIds.join(",")}`;

  return url;
};
