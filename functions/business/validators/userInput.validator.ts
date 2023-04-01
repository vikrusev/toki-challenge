import { UserInput } from "../../dtos/UserInput.dto";

/**
 * Checks if the user input is valid or not
 * TODO add additional checks for year, month and day
 * TODO e.g. they should be positive integers
 * TODO add JOI
 * @param {UserInput} param0 consists of requested time and eventually metering point ids
 * @returns {boolean} if the input is valid or not
 */
const isUserInputValid = ({
  year,
  month,
  day,
  meteringPointIds,
}: UserInput): boolean => {
  const pointIds = meteringPointIds?.split(",");

  return !Boolean(
    !year || // year must be provided
      isNaN(Number(year)) || // year should be a number
      Boolean(year && day && !month) || // year and day must have month
      Boolean(month && isNaN(Number(month))) || // month should be a number
      Boolean(day && isNaN(Number(day))) || // day should be a number
      // all meteringPointIds should be number
      pointIds?.some((id) => isNaN(Number(id)))
  );
};

export default isUserInputValid;
