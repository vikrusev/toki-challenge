import Joi from "joi";
import { UserInput } from "../../dtos/UserInput.dto";

const schema = Joi.object<UserInput>({
    year: Joi.number().integer().min(1900).max(9999).required(),
    // month is optional unless day is given
    // if day is given, then month is required
    month: Joi.number().integer().min(1).max(12).when("day", {
        is: Joi.exist(),
        then: Joi.required(),
        otherwise: Joi.optional(),
    }),
    day: Joi.number().integer().min(1).max(31),
    // regex to catch a string representation of array elements joined w/ `,`
    // example: '1,2,3,4' is valid, '1, 2,3' is invalid because of the space
    // '[1,2,3]' is invalid because of the brackets
    meteringPointIds: Joi.string().regex(/^\d+(?:,\d+)*$/),
});

export default schema;
