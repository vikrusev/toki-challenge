import { UserInput } from "../models/UserInput.model";

/**
 * Checks if the user input is valid or not
 * TODO add additional checks for year, month and day
 * TODO e.g. they should be positive integers
 * @param {UserInput} userInput consists of requested time and eventually metering point ids
 * @returns {boolean} if the input is valid or not
 */
const isUserInputValid = (userInput: UserInput): boolean => {
  return !(
    !userInput.year || // year must be provided
    (userInput.year && userInput.day && !userInput.month) || // year and day must have month
    isNaN(Number(userInput.year)) || // year should be a number|
    isNaN(Number(userInput.month)) || // month should be a number|
    isNaN(Number(userInput.day)) || // day should be a number|
    // all meteringPointIds should be number
    userInput.meteringPointIds?.some((id) => isNaN(Number(id)))
  );
};

export default isUserInputValid;
