import React, { Dispatch, SetStateAction } from "react";
import { InputTime } from "../../../common/dtos/UserInput.dto";

interface IProps {
    type: string;
    values: string[];
    onChange: Dispatch<SetStateAction<InputTime>>;
}

const Dropdown: React.FC<IProps> = ({ type, values, onChange }: IProps) => {
    return (
        <>
            <label htmlFor={`${type}-select`}>{type}:</label>
            <select
                defaultValue={values[0]}
                id={`${type}-select`}
                onChange={(event) =>
                    onChange((prevValue) => ({
                        ...prevValue,
                        [type]: event.target.value,
                    }))
                }
            >
                {type !== "year" && <option value="default">00</option>}

                {values.map((v) => (
                    <option key={v} value={v}>
                        {v}
                    </option>
                ))}
            </select>
        </>
    );
};

export default Dropdown;
