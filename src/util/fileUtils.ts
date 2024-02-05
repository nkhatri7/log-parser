import { createInterface, Interface } from "readline";
import { createReadStream } from "fs";
import { stat } from "fs/promises";

export const getFileReader = (filePath: string): Interface => {
  // Create readable stream from the file
  const fileStream = createReadStream(filePath);
  // Create interface to read lines from the stream
  return createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
};

export const doesFileExist = async (filePath: string): Promise<boolean> => {
  try {
    await stat(filePath);
    return true;
  } catch (error) {
    console.log("Error: file could not be found");
    return false;
  }
};
