import { useEffect, useState } from "react";
import { TimeBasis, UserInput } from "../../../common/dtos/UserInput.dto";
import { METERING_POINTIDS_REGEX, WHITESPACE_REGEX } from "../utils/regex";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface IProps {
    timeBasisOptions: TimeBasis[];
    disabled: boolean;
    onSubmit: (formData: UserInput) => void;
}

/**
 * The UserInputForm includes 3 dropdowns for year, month and day respectively
 * The values for them are created here
 * Also, one input field of type text for listing Metering Point Ids
 * @param param0 - submit event from parent component
 */
const UserInputForm: React.FC<IProps> = ({
    timeBasisOptions,
    disabled,
    onSubmit,
}: IProps) => {
    // data to be submitted from the form
    const [selectedTimeBasis, setSelectedTimeBasis] = useState<TimeBasis>(
        timeBasisOptions[0]
    );

    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [meteringPointIds, setMeteringPointIds] = useState<string>("");

    // if submit to parent should be executed
    const [shouldExecuteSubmit, setShouldExecuteSubmit] =
        useState<boolean>(false);

    useEffect(() => {
        // if the submit button is clicked
        if (shouldExecuteSubmit) {
            setShouldExecuteSubmit(false);

            // submit data to prent
            onSubmit({
                date: selectedDate,
                timeBasis: selectedTimeBasis,
                meteringPointIds: meteringPointIds?.replace(
                    WHITESPACE_REGEX,
                    ""
                ),
            });
        }
    }, [
        onSubmit,
        selectedDate,
        selectedTimeBasis,
        shouldExecuteSubmit,
        meteringPointIds,
    ]);

    const submitRequest = (event: any) => {
        event.preventDefault();

        if (disabled) return;

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
                    onChange={(event) =>
                        setMeteringPointIds(event.target.value)
                    }
                />

                <button disabled={disabled} type="submit">
                    Submit Request
                </button>
            </form>
        </>
    );
};

export default UserInputForm;
