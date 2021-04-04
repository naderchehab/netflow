import Dequeue from "dequeue";
import { readFile } from "./file-read";
import { listenUdp } from "./udp-server";
import { startExpressServer } from "./express-server";
import { writeFileInterval } from "./file-write";
import { processPacketsInterval } from "./netflow-process";

const DEST_HOSTS_FILE_PATH = "hosts.json";
const HTTP_PORT = 3001;
const NETFLOW_UDP_PORT = 9995;
const WRITE_FILE_INTERVAL = 16000;
const PROCESS_PACKET_INTERVAL = 500;

const queue = new Dequeue();
const destHostsObj = JSON.parse(readFile(DEST_HOSTS_FILE_PATH));

const onMessage = (msg, rinfo) => {
  queue.push({ msg, rinfo });
};

// Listen for Netflow messages
listenUdp(onMessage, NETFLOW_UDP_PORT);

// Process incoming Netflow packets at regular intervals
processPacketsInterval(queue, destHostsObj, PROCESS_PACKET_INTERVAL);

// Write Netflow data to file at regular intervals
writeFileInterval(DEST_HOSTS_FILE_PATH, destHostsObj, WRITE_FILE_INTERVAL);

// Start Web server to serve Netflow data
startExpressServer(DEST_HOSTS_FILE_PATH, HTTP_PORT);
