import { useEffect, useState } from "react";
import { UserInput } from "../../../common/dtos/UserInput.dto";
import { METERING_POINTIDS_REGEX, WHITESPACE_REGEX } from "../utils/regex";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface IProps {
    disabled: boolean;
    onSubmit: (formData: UserInput) => void;
}

type TimeBasis = "monthly" | "daily" | "hourly";

/**
 * The UserInputForm includes 3 dropdowns for year, month and day respectively
 * The values for them are created here
 * Also, one input field of type text for listing Metering Point Ids
 * @param param0 - submit event from parent component
 */
const UserInputForm: React.FC<IProps> = ({ disabled, onSubmit }: IProps) => {
    const [selectedDate, setSelectedDate] = useState<Date>();

    const timeBasisOptions: TimeBasis[] = ["monthly", "daily", "hourly"];
    const [selectedTimeBasis, setSelectedTimeBasis] = useState<TimeBasis>(
        timeBasisOptions[0]
    );

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
    const handleSelectedDateChange = (date: Date) => {
        setSelectedDate(date);
    };

    return (
        <>
            <form onSubmit={submitRequest}>
                <p>Please select time basis:</p>

                {timeBasisOptions.map((basis, index) => (
                    <div key={index.toString()}>
                        <label htmlFor={basis}>{basis}</label>
                        <input
                            type="radio"
                            id={basis}
                            name="time-basis"
                            value={basis}
                            checked={selectedTimeBasis === basis}
                            onChange={(event) => {
                                setSelectedTimeBasis(
                                    event.target.value as TimeBasis
                                );
                            }}
                        />
                    </div>
                ))}

                {selectedTimeBasis === "monthly" && (
                    <DatePicker
                        selected={selectedDate}
                        onChange={handleSelectedDateChange}
                        dateFormat="yyyy"
                        placeholderText="YYYY"
                        openToDate={new Date("2022/04/01")}
                        showYearPicker
                        todayButton="This Year"
                        maxDate={new Date()}
                    />
                )}

                {selectedTimeBasis === "daily" && (
                    <DatePicker
                        selected={selectedDate}
                        onChange={handleSelectedDateChange}
                        dateFormat="MMM-yy"
                        placeholderText="MMM-YY"
                        showMonthYearPicker
                        openToDate={new Date("2022/04/01")}
                        todayButton="This Month"
                        maxDate={new Date()}
                    />
                )}

                {selectedTimeBasis === "hourly" && (
                    <DatePicker
                        selected={selectedDate}
                        onChange={handleSelectedDateChange}
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
                )}

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
