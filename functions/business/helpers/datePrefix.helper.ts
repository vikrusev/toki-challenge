import { Time } from "../../../common/dtos/UserInput.dto";

export const addPadding = (value: Time | undefined) =>
    value?.toString().padStart(2, "0");

export const removePadding = (value: Time | undefined) =>
    value && Number(value).toString();
