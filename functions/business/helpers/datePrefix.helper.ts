export const addPadding = (value: string | number) =>
    value?.toString().padStart(2, "0");

export const removePadding = (value: string | number) =>
    value && Number(value).toString();
