import { InputTime } from "../../../common/dtos/UserInput.dto";

interface UrlBuildData {
    dateOptions: InputTime;
    meteringPointIds?: string[];
}

export const createArray = (untilNumber: number) =>
    Array.from({ length: untilNumber }, (_, i) =>
        String(i + 1).padStart(2, "0")
    );

export const buildUrl = ({ dateOptions, meteringPointIds }: UrlBuildData) => {
    let url = `http://localhost:8080/?year=${dateOptions.year}`;

    if (meteringPointIds?.length && meteringPointIds.filter(Boolean).length)
        url += `&meteringPointIds=${meteringPointIds.join(",")}`;

    if (dateOptions.month !== "default") {
        url += `&month=${dateOptions.month}`;
        if (dateOptions.day !== "default") url += `&day=${dateOptions.day}`;
    }

    return url;
};
