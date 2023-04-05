import { useEffect, useState } from "react";
import { InputTime } from "../../../common/dtos/UserInput.dto";
import { buildUrl, createArray } from "../utils/helper";
import Dropdown from "./Dropdown";

interface IProps {
    onSubmit: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const UserInput: React.FC<IProps> = ({ onSubmit }: IProps) => {
    const availableDates = {
        years: ["2022", "2023"],
        months: createArray(12),
        days: createArray(31),
    };

    const [meteringPointIds, setMeteringPointData] = useState<string[]>([]);
    const [dateOptions, setDateOptions] = useState<InputTime>({
        year: "2022",
        month: "1",
        day: "1",
    });

    const [shouldExecute, setShouldExecute] = useState<boolean>(false);

    useEffect(() => {
        async function fetchData() {
            const url = buildUrl({
                dateOptions,
                meteringPointIds,
            });
        }

        if (shouldExecute) {
            fetchData();
            setShouldExecute(false);
        }
    }, [dateOptions, meteringPointIds, shouldExecute]);

    const submitRequest = () => {
        setShouldExecute(true);
    };

    return (
        <>
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
                onChange={(e) =>
                    setMeteringPointData(
                        e.target.value.replace(/\s+/g, "").split(",")
                    )
                }
            />

            <button type="button" onClick={submitRequest}>
                Submit Request
            </button>
        </>
    );
};

export default UserInput;
