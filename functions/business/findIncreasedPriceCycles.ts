import { TimeBasis } from "../../common/dtos/UserInput.dto";

export interface IncreasedPriceCycle {
    start: number;
    end: number;
}

/**
 * Prolong cycles which end w/ a point which is right before
 * the starting point of the next cycle
 * Example
 *   [{ start: 2, end: 10 },{ start: 14, end: 16 },{ start: 17, end: 20 },{ start: 22, end: 23 }]
 *   becomes
 *   { start: 2, end: 10 }, { start: 14, end: 20 }, { start: 22, end: 23 }]
 */
const mergeAdjacentCycles = (cycles: IncreasedPriceCycle[]) => {
    const mergedCycles: IncreasedPriceCycle[] = [];

    for (let i = 0; i < cycles.length; i++) {
        const currentObj = cycles[i];
        const nextObj = cycles[i + 1];

        if (nextObj && currentObj.end === nextObj.start - 1) {
            currentObj.end = nextObj.end;
            ++i;
        }
        mergedCycles.push(currentObj);
    }

    return mergedCycles;
};

/**
 * Find cycles w/ start of increasing and the corresponding end of decreasing in prices
 * @param values of electricity price
 * @param timeBasis used to define the threshold
 */
const findIncreasedPriceCycles = (
    values: number[],
    timeBasis: TimeBasis
): IncreasedPriceCycle[] => {
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

    return mergeAdjacentCycles(bigIncreaseCycles);
};

export default findIncreasedPriceCycles;
