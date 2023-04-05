import { useEffect, useState } from "react";
import { InputTime } from "../../../common/dtos/UserInput.dto";
import { buildUrl, createArray } from "../utils/helper";
import { METERING_POINTIDS_REGEX, WHITESPACE_REGEX } from "../utils/regex";
import Dropdown from "./Dropdown";

interface IProps {
    onSubmit: React.Dispatch<React.SetStateAction<string>>;
}
/**
 * The UserInputForm includes 3 dropdowns for year, month and day respectively
 * The values for them are created here
 * Also, one input field of type text for listing Metering Point Ids
 * @param param0 - submit event from parent component
 */
const UserInputForm: React.FC<IProps> = ({ onSubmit }: IProps) => {
    // values to be used for the 3 dropdowns
    const availableDates = {
        years: ["2022", "2023"],
        months: createArray(12),
        days: createArray(31),
    };

    // main properties
    const [meteringPointIds, setMeteringPointData] = useState<string>("");
    const [dateOptions, setDateOptions] = useState<InputTime>({
        year: "2022",
        month: "1",
        day: "1",
    });

    // if submit to parent should be executed
    const [shouldExecuteSubmit, setShouldExecuteSubmit] =
        useState<boolean>(false);

    useEffect(() => {
        if (shouldExecuteSubmit) {
            setShouldExecuteSubmit(false);

            // build URL to fetch desired data from
            const fetchDataUrl = buildUrl({
                dateOptions,
                meteringPointIds: meteringPointIds
                    .replace(WHITESPACE_REGEX, "")
                    .split(","),
            });

            onSubmit(fetchDataUrl);
        }
    }, [onSubmit, dateOptions, meteringPointIds, shouldExecuteSubmit]);

    const submitRequest = (event: any) => {
        event.preventDefault();

        // basic regex check if the metering points are comma seperated numbers
        if (
            meteringPointIds &&
            !METERING_POINTIDS_REGEX.test(meteringPointIds)
        ) {
            alert(
                `Input field for Metering Point Ids must contain comma seperated numbers. Current: ${meteringPointIds}`
            );
            return;
        }

        setShouldExecuteSubmit(true);
    };

    return (
        <>
            <form onSubmit={submitRequest}>
                <Dropdown
                    type="year"
                    values={availableDates.years}
                    onChange={setDateOptions}
                />

                <Dropdown
                    type="month"
                    values={availableDates.months}
                    onChange={setDateOptions}
                />

                <Dropdown
                    type="day"
                    values={availableDates.days}
                    onChange={setDateOptions}
                />

                <label htmlFor="meteringPoints">Metering Point Ids:</label>
                <input
                    id="meteringPoints"
                    type="text"
                    value={meteringPointIds}
                    onChange={(event) =>
                        setMeteringPointData(event.target.value)
                    }
                />

                <button type="submit">Submit Request</button>
            </form>
        </>
    );
};

export default UserInputForm;
