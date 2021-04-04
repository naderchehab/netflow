import { resolveHostnames } from "./dns";
import { getOrgNames } from "./whois"

const sortByBandwidth = (datedDestHostsObj) => {
  const sortedBandwidthObj = Object.keys(datedDestHostsObj).reduce((acc, date) => {
    const destHostsObj = datedDestHostsObj[date];
    const destHostsArray = Object.keys(destHostsObj).reduce((acc, destHost) => {
      acc.push({ destHost, ...destHostsObj[destHost] });
      return acc;
    }, []);
    destHostsArray.sort((a, b) => b.bandwidth - a.bandwidth);
    const sortedDestHostsArray = destHostsArray.map((host) => {
      const sourcesArray = Object.keys(host.sources).reduce(
        (acc, sourceHost) => {
          acc.push({ sourceHost, bandwidth: host.sources[sourceHost] });
          return acc;
        },
        []
      );
      sourcesArray.sort((a, b) => b.bandwidth - a.bandwidth);
      return {
        ...host,
        sources: sourcesArray,
      };
    });
    acc[date] = sortedDestHostsArray;
    return acc;
  }, {});
  return sortedBandwidthObj;
};

const formatBytes = (a, b = 2) => {
  if (0 === a) return "0 Bytes";
  const c = 0 > b ? 0 : b,
    d = Math.floor(Math.log(a) / Math.log(1024));
  return (
    parseFloat((a / Math.pow(1024, d)).toFixed(c)) +
    " " +
    ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"][d]
  );
};

const formatBandwidth = (datedDestHostsObj) => {
  const formattedBandwidthObj = Object.keys(datedDestHostsObj).reduce((acc, date) => {
    const hostsArray = datedDestHostsObj[date];
    const formattedHostsArray = hostsArray.map((host) => {
      return {
        ...host,
        bandwidth: formatBytes(host.bandwidth),
        bandwidthBytes: host.bandwidth,
        sources: host.sources.map((source) => ({
          ...source,
          bandwidth: formatBytes(source.bandwidth),
        })),
      };
    });
    acc[date] = formattedHostsArray;
    return acc;
  }, {});
  return formattedBandwidthObj;
};

const formatHosts = async (destHostsObj, dnsCache, whoisCache, isCallDns, isCallWhois) => {
  const sortedBandwidthObj = sortByBandwidth(destHostsObj);
  const formattedBandwidthObj = formatBandwidth(sortedBandwidthObj);
  const resolvedHostnamesArray = await resolveHostnames(
    formattedBandwidthObj,
    dnsCache,
    isCallDns,
  );
  const resolvedOrgNamesArray = await getOrgNames(
    resolvedHostnamesArray,
    whoisCache,
    isCallWhois
  );
  return resolvedOrgNamesArray;
};

export { formatHosts };
