import React, { ChangeEventHandler } from "react";

interface IProps {
    type: string;
    values: string[];
    onChange: ChangeEventHandler<HTMLSelectElement>;
}

const Dropdown: React.FC<IProps> = ({ type, values, onChange }: IProps) => {
    return (
        <>
            <label htmlFor={`${type}-select`}>{type}:</label>
            <select
                defaultValue={values[0]}
                id={`${type}-select`}
                name={type}
                onChange={onChange}
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
