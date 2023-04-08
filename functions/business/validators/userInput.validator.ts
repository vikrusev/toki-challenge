import Joi from "joi";
import { UserInput } from "../../../common/dtos/UserInput.dto";

const schema = Joi.object<UserInput>({
    datetime: Joi.number().min(1000000000000).required(),
    timeBasis: Joi.string().valid("monthly", "daily", "hourly"),
    // regex to catch a string representation of array elements joined w/ `,`
    // example: '1,2,3,4' is valid, '1, 2,3' is invalid because of the space
    // '[1,2,3]' is invalid because of the brackets
    meteringPointIds: Joi.string().regex(/^\d+(?:,\d+)*$/),
});

export default schema;
