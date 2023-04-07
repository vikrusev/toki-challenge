import { useEffect, useState } from "react";
import { UserInput } from "../../../common/dtos/UserInput.dto";
import { createArray } from "../utils/chart.utils";
import { METERING_POINTIDS_REGEX, WHITESPACE_REGEX } from "../utils/regex";
import Dropdown from "./Dropdown";

interface IProps {
    disabled: boolean;
    onSubmit: (formData: UserInput) => void;
}
/**
 * The UserInputForm includes 3 dropdowns for year, month and day respectively
 * The values for them are created here
 * Also, one input field of type text for listing Metering Point Ids
 * @param param0 - submit event from parent component
 */
const UserInputForm: React.FC<IProps> = ({ disabled, onSubmit }: IProps) => {
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
            onSubmit(formData);
        }
    }, [onSubmit, formData, shouldExecuteSubmit]);

    const submitRequest = (event: any) => {
        event.preventDefault();

        if (disabled) return;

        const { meteringPointIds } = formData;

        // basic regex check if the metering points are comma seperated numbers
        if (
            meteringPointIds &&
            !METERING_POINTIDS_REGEX.test(meteringPointIds)
        ) {
            alert(
                `Input field for Metering Point Ids must contain comma seperated numbers. Current: ${formData.meteringPointIds}`
            );
            return;
        }

        formData.meteringPointIds = meteringPointIds?.replace(
            WHITESPACE_REGEX,
            ""
        );

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

                <button disabled={disabled} type="submit">
                    Submit Request
                </button>
            </form>
        </>
    );
};

export default UserInputForm;
