export const addPadding = (value: string) => value?.toString().padStart(2, "0");

export const removePadding = (value: string) =>
    value && Number(value).toString();
