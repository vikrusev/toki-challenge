import { useEffect, useState } from "react";
import { UserInput } from "../../../common/dtos/UserInput.dto";
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
    const [formData, setFormData] = useState<UserInput>({
        year: "2022",
        month: "1",
        day: "1",
        meteringPointIds: "",
    });

    // if submit to parent should be executed
    const [shouldExecuteSubmit, setShouldExecuteSubmit] =
        useState<boolean>(false);

    useEffect(() => {
        if (shouldExecuteSubmit) {
            setShouldExecuteSubmit(false);

            const { year, month, day, meteringPointIds } = formData;

            // build URL to fetch desired data from
            const fetchDataUrl = buildUrl({
                dateOptions: {
                    year,
                    month,
                    day,
                },
                meteringPointIds: meteringPointIds
                    ?.replace(WHITESPACE_REGEX, "")
                    .split(","),
            });

            onSubmit(fetchDataUrl);
        }
    }, [onSubmit, formData, shouldExecuteSubmit]);

    const submitRequest = (event: any) => {
        event.preventDefault();

        // basic regex check if the metering points are comma seperated numbers
        if (
            formData.meteringPointIds &&
            !METERING_POINTIDS_REGEX.test(formData.meteringPointIds)
        ) {
            alert(
                `Input field for Metering Point Ids must contain comma seperated numbers. Current: ${formData.meteringPointIds}`
            );
            return;
        }

        setShouldExecuteSubmit(true);
    };

    // general handle of input form change
    const handleChange = (event: any) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    return (
        <>
            <form onSubmit={submitRequest}>
                <Dropdown
                    type="year"
                    values={availableDates.years}
                    onChange={handleChange}
                />

                <Dropdown
                    type="month"
                    values={availableDates.months}
                    onChange={handleChange}
                />

                <Dropdown
                    type="day"
                    values={availableDates.days}
                    onChange={handleChange}
                />

                <label htmlFor="meteringPoints">Metering Point Ids:</label>
                <input
                    id="meteringPoints"
                    type="text"
                    name="meteringPointIds"
                    onChange={handleChange}
                />

                <button type="submit">Submit Request</button>
            </form>
        </>
    );
};

export default UserInputForm;
