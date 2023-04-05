import React, { Dispatch, SetStateAction } from "react";

interface IProps {
    label: string;
    values: string[];
    onChange: Dispatch<SetStateAction<string>>;
}

const Dropdown: React.FC<IProps> = ({ label, values, onChange }: IProps) => {
    return (
        <>
            <label htmlFor={`${label}-select`}>{label}:</label>
            <select
                id={`${label}-select`}
                onChange={(event) => onChange(event.target.value)}
            >
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
