import promptSync from "prompt-sync";
import { analyseLogFile } from "./src/logParser";
import { doesFileExist } from "./src/fileReader";

const EXAMPLE_LOG_FILE_PATH = "./assets/mockData/programming-task-example-data.log";

const prompt = promptSync({ sigint: true });

const init = async () => {
  printWelcome();
  const filePath = getFilePath();
  if (await doesFileExist(filePath)) {
    analyseLogFile(filePath);
  }
};

const printWelcome = (): void => {
  console.log("Welcome to Log Parser!");
  console.log("This application finds:");
  console.log("  - The number of unique IP addresses");
  console.log("  - The top 3 most visited URLs");
  console.log("  - The top 3 most active IP addresses");
  console.log("\n");
};

const getFilePath = (): string => {
  const filePath = prompt(
    "Enter the path to the log file you want to analyse (leave empty to use example log file): "
  );
  if (!filePath) {
    return EXAMPLE_LOG_FILE_PATH;
  }
  return filePath;
};

init();
