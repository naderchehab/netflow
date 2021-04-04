import fs from "fs";
import path from "path";

const readFile = (filePath) => {
  try {
    const file = fs.readFileSync(path.resolve(filePath), "utf8");
    return file;
  } catch (err) {
    if (err.code === "ENOENT") {
      console.log(`${filePath} not found`);
    } else {
      console.log(err);
    }
    return '{}';
  }
};

export { readFile };
