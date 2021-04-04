import format from "date-fns/format";
import { nf5PktDecode } from "./netflow-decode";

const processNextPacket = (queue, datedDestHostsObj) => {
  if (queue.length <= 0) {
    return;
  }
  const { msg, rinfo } = queue.shift();
  const startTime = new Date().getTime();
  const packet = nf5PktDecode(msg, rinfo);
  const timeMs = new Date().getTime() - startTime;
  if (packet && packet.flows.length > 0) {
    const date = new Date();
    const currentDate = format(date, "MMM-yyyy");
    if (!datedDestHostsObj[currentDate]) {
      datedDestHostsObj[currentDate] = {};
    }
    const destHostsObj = datedDestHostsObj[currentDate];
    packet.rinfo = rinfo;
    packet.packet = msg;
    packet.decodeMs = timeMs;
    packet.flows.map((flow) => {
      if (!destHostsObj[flow.dstaddr]) {
        destHostsObj[flow.dstaddr] = { bandwidth: 0, sources: {} };
      }
      destHostsObj[flow.dstaddr].bandwidth += flow.dOctets;
      if (!destHostsObj[flow.dstaddr].sources[flow.srcaddr]) {
        destHostsObj[flow.dstaddr].sources[flow.srcaddr] = 0;
      }
      destHostsObj[flow.dstaddr].sources[flow.srcaddr] += flow.dOctets;
    });
  } else {
    console.error("Undecoded flows", o);
  }
};

const processPacketsInterval = (queue, destHostsObj, intervalMs) => {
  setInterval(() => processNextPacket(queue, destHostsObj), intervalMs);
};

export { processPacketsInterval };
