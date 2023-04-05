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
    let url = `http://localhost:8080/?year=${year}`;

    if (Number(month)) url += `&month=${month}`;
    if (Number(day)) url += `&day=${day}`;
    if (meteringPointIds?.length && meteringPointIds.filter((p) => p).length)
        url += `&meteringPointIds=${meteringPointIds.join(",")}`;

    return url;
};
