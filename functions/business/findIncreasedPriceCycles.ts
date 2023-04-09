import { TimeBasis } from "../../common/dtos/UserInput.dto";

export interface IncreasedPriceCycle {
    start: number;
    end: number;
}

const findIncreasedPriceCycles = (values: number[], timeBasis: TimeBasis) => {
    // time basis is defining the threshold
    const threshold =
        timeBasis === "monthly" ? 70 : timeBasis === "daily" ? 50 : 30;

    // early exit when no data is given
    if (!values?.length) {
        return [];
    }

    // store all cycles
    const bigIncreaseCycles: IncreasedPriceCycle[] = [];

    // initialize start index
    let start = -1;

    // initialize start value
    let previousValue = values[0];

    // loop all values to find the start and end of a cycle
    // store result(s) in bigIncreaseCycles
    for (let i = 1; i < values.length; i++) {
        const diff = values[i] - previousValue;

        // if we are still searching for a start index and we have a big "increase"
        // we do not use Math.abs(diff), because we want to find cycles
        // which start w/ an "increase", instead of w/ a "decrease"
        if (start === -1 && diff > threshold) {
            // save the start of a big increase
            start = i - 1;
        }
        // if we have a start index
        // and we are no more in a big "decrease"
        else if (start !== -1 && Math.abs(diff) <= threshold) {
            // save the big "increase" - "decrease" cycle indices
            bigIncreaseCycles.push({ start, end: i - 1 });

            // reset the start index
            start = -1;
        }

        // prepare for next iteration
        previousValue = values[i];
    }

    // handle case where a big increase is ongoing at the end of the values
    if (start !== -1) {
        bigIncreaseCycles.push({ start, end: values.length - 1 });
    }

    return bigIncreaseCycles;
};

export default findIncreasedPriceCycles;
