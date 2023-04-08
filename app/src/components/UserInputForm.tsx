import { useEffect, useState } from "react";
import { TimeBasis, UserInput } from "../../../common/dtos/UserInput.dto";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import "./UserInputForm.css";

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
    const [meteringPointIds, setMeteringPointIds] = useState<{
        [x: string]: boolean;
    }>({});

    // if submit to parent should be executed
    const [shouldExecuteSubmit, setShouldExecuteSubmit] =
        useState<boolean>(false);

    useEffect(() => {
        // if the submit button is clicked
        if (shouldExecuteSubmit) {
            setShouldExecuteSubmit(false);

            // get an array of checked meteringPointIds
            const meteringPointIdsStringArray = Object.entries(meteringPointIds)
                .filter(([pointId, isChecked]) => isChecked)
                .map(([pointId]) => pointId);

            // submit data to parent
            onSubmit({
                datetime: selectedDate.getTime(),
                timeBasis: selectedTimeBasis,
                meteringPointIds: meteringPointIdsStringArray.join(","),
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

        setShouldExecuteSubmit(true);
    };

    // general handle of input form change
    const handleSelectedDateChange = (date: Date) => {
        setSelectedDate(date);
    };

    // handle metering point checkbox change
    const handleMeteringPointCheckboxChange = (event: any) => {
        const { name, checked } = event.target;
        setMeteringPointIds((prevState) => ({ ...prevState, [name]: checked }));
    };

    return (
        <div id="user-input-form-component">
            <div className="input">
                <div className="date-input">
                    <h3>Please select time basis</h3>

                    {timeBasisOptions.map((basis, index) => (
                        <div className="time-basis" key={index.toString()}>
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
                            <label htmlFor={basis}>{basis}</label>
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
                            inline
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
                            inline
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
                            inline
                        />
                    )}
                </div>

                <div className="metering-points-input">
                    <h3>Metering Point Ids</h3>

                    {["1234", "5678"].map((pointId) => (
                        <div key={pointId}>
                            <input
                                type="checkbox"
                                id={pointId}
                                name={pointId}
                                value={pointId}
                                onChange={handleMeteringPointCheckboxChange}
                            />
                            <label htmlFor={pointId}>{pointId}</label>
                        </div>
                    ))}
                </div>
            </div>

            <button
                className={"submit-button " + (disabled ? "disabled" : "")}
                onClick={submitRequest}
            >
                Submit Request
            </button>
        </div>
    );
};

export default UserInputForm;
