import { useEffect, useState } from "react";
import { UserInput } from "../../../common/dtos/UserInput.dto";
import { METERING_POINTIDS_REGEX, WHITESPACE_REGEX } from "../utils/regex";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
    const [selectedDate, setSelectedDate] = useState<Date>();

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
    const handleChange = (date: Date) => {
        setSelectedDate(date);
    };

    return (
        <>
            <form onSubmit={submitRequest}>
                <DatePicker
                    selected={selectedDate}
                    onChange={handleChange}
                    dateFormat="yyyy"
                    placeholderText="YYYY"
                    openToDate={new Date("2022/04/01")}
                    showYearPicker
                    todayButton="This Year"
                    maxDate={new Date()}
                />
                <DatePicker
                    selected={selectedDate}
                    onChange={handleChange}
                    dateFormat="MMM-yy"
                    placeholderText="MMM-YY"
                    showMonthYearPicker
                    openToDate={new Date("2022/04/01")}
                    todayButton="This Month"
                    maxDate={new Date()}
                />
                <DatePicker
                    selected={selectedDate}
                    onChange={handleChange}
                    dateFormat="dd-MMM-yy"
                    placeholderText="DD-MM-YY"
                    openToDate={new Date("2022/04/01")}
                    todayButton="Today"
                    maxDate={new Date()}
                    showMonthDropdown
                    useShortMonthInDropdown
                    showYearDropdown
                    scrollableYearDropdown
                />

                <label htmlFor="meteringPoints">Metering Point Ids:</label>
                <input
                    id="meteringPoints"
                    type="text"
                    name="meteringPointIds"
                    // @ts-ignore
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
