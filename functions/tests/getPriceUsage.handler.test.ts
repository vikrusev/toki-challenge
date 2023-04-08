import getPriceUsageData from "../handlers/getPriceUsage.handler";
import CloudStorageClient from "../business/CloudStorageClient";
import validationSchema from "../business/validators/userInput.validator";
import { BadRequestException } from "../utils/exceptions";
import { UserInput } from "../../common/dtos/UserInput.dto";

// Mock CloudStorageClient class
jest.mock("../business/CloudStorageClient");
const MockCloudStorageClient = CloudStorageClient as jest.MockedClass<
    typeof CloudStorageClient
>;

describe("getPriceUsageData", () => {
    const userInput: UserInput = {
        datetime: 1640995200000,
        timeBasis: "daily",
        meteringPointIds: "1234,5678",
    };

    it("should throw BadRequestException when user input is invalid", async () => {
        // Mock Joi.validate to return an error
        jest.spyOn(validationSchema, "validate").mockReturnValue({
            // @ts-ignore
            error: new Error("Invalid user input"),
            value: userInput,
        });

        await expect(getPriceUsageData({ query: userInput })).rejects.toThrow(
            BadRequestException
        );

        expect(MockCloudStorageClient).not.toHaveBeenCalled();
    });
});
