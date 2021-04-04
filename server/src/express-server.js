import express from "express";
import path from "path";
import { readFile } from "./file-read";
import { writeFile } from "./file-write";
import { formatHosts } from "./format";

const startExpressServer = (destHostsFilePath, port) => {
  const app = express();
  app.use(express.static('build'));
  
  app.get("/data", async (req, res) => {
    try {
      const destHostsObj = JSON.parse(readFile(destHostsFilePath));
      const dnsCache = JSON.parse(readFile("dnsCache.json"));
      const whoisCache = JSON.parse(readFile("whoisCache.json"));
      const isCallDns = req.query.isCallDns === "y";
      const isCallWhois = req.query.isCallWhois === "y";
      const formattedDestHostsObj = await formatHosts(
        destHostsObj,
        dnsCache,
        whoisCache,
        isCallDns,
        isCallWhois
      );
      writeFile("dnsCache.json", dnsCache);
      writeFile("whoisCache.json", whoisCache);
      res.json(formattedDestHostsObj);
    } catch (err) {
      console.log(err);
      res.json(err);
    }
  });

  app.listen(port, () => {
    console.log(`Express server listening at http://localhost:${port}`);
  });
};

export { startExpressServer };
