import { createReadStream } from "fs";
import { doesFileExist, getFileReader } from "./fileUtils";
import { Interface, createInterface } from "readline";
import { stat } from "fs/promises";

jest.mock("fs");
jest.mock("fs/promises");
jest.mock("readline");

const EXAMPLE_LOG_FILE_PATH = "./assets/mockData/programming-task-example-data.log";

describe("getFileReader", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should create a read stream with the file path", () => {
    const createReadStreamMock = createReadStream as jest.Mock;
    const mockFileStream = {} as any;
    createReadStreamMock.mockReturnValue(mockFileStream);

    const createInterfaceMock = createInterface as jest.Mock;
    const mockReadlineInterface = {} as Interface;
    createInterfaceMock.mockReturnValue(mockReadlineInterface);

    getFileReader(EXAMPLE_LOG_FILE_PATH);

    expect(createReadStreamMock).toHaveBeenCalledWith(EXAMPLE_LOG_FILE_PATH);

    jest.restoreAllMocks();
  });

  it("should return a readline Interface with the correct file stream", () => {
    const createReadStreamMock = createReadStream as jest.Mock;
    const mockFileStream = {} as any;
    createReadStreamMock.mockReturnValue(mockFileStream);

    const createInterfaceMock = createInterface as jest.Mock;
    const mockReadlineInterface = {} as Interface;
    createInterfaceMock.mockReturnValue(mockReadlineInterface);

    const fileReader = getFileReader(EXAMPLE_LOG_FILE_PATH);

    expect(createInterfaceMock).toHaveBeenCalledWith({
      input: mockFileStream,
      crlfDelay: Infinity
    });
    expect(fileReader).toBe(mockReadlineInterface);

    jest.restoreAllMocks();
  });
});

describe("doesFileExist", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should return true if the file exists", async () => {
    (stat as jest.Mock).mockResolvedValueOnce({} as any);

    const filePath = "existingFile.log";
    const result = await doesFileExist(filePath);

    expect(result).toBe(true);
    expect(stat).toHaveBeenCalledWith(filePath);
  });

  it("should return false and log an error if the file does not exist", async () => {
    jest.spyOn(console, "log").mockImplementation(() => {});

    const error = new Error("File not found");
    (stat as jest.Mock).mockRejectedValueOnce(error);

    const filePath = "nonExistingFile.log";
    const result = await doesFileExist(filePath);

    expect(result).toBe(false);
    expect(stat).toHaveBeenCalledWith(filePath);
    expect(console.log).toHaveBeenCalledWith("Error: file could not be found");
  });

  it("should return false and log an error if an unexpected error occurs", async () => {
    jest.spyOn(console, "log").mockImplementation(() => {});

    const unexpectedError = new Error("Unexpected error");
    (stat as jest.Mock).mockRejectedValueOnce(unexpectedError);

    const filePath = "unexpectedErrorFile.txt";
    const result = await doesFileExist(filePath);

    expect(result).toBe(false);
    expect(stat).toHaveBeenCalledWith(filePath);
    expect(console.log).toHaveBeenCalledWith("Error: file could not be found");
  });
});