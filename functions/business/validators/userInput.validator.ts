import Joi from "joi";
import { UserInput } from "../../../common/dtos/UserInput.dto";
import { ARRAY_JOIN_COMMA } from "../../config/constants";

const schema = Joi.object<UserInput>({
    datetime: Joi.number().min(1000000000000).required(),
    timeBasis: Joi.string().valid("monthly", "daily", "hourly"),
    meteringPointIds: Joi.string().regex(ARRAY_JOIN_COMMA),
});

export default schema;
