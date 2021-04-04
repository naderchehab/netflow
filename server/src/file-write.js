import path from "path";
import fs from "fs";

const writeFile = (filePath, destHostsObj) => {
  fs.writeFileSync(
    path.resolve(filePath),
    JSON.stringify(destHostsObj, null, 4)
  );
};

const writeFileInterval = (filePath, destHostsObj, intervalMs) => {
  setInterval(() => writeFile(filePath, destHostsObj), intervalMs);
};

export { writeFile, writeFileInterval };
