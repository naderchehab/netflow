import whoisJson from "whois-json";

const getOrgName = async (ip, whoisCache, isCallWhois) => {
  if (whoisCache[ip]) {
    if (whoisCache[ip] === 'ERR' || whoisCache[ip] === 'N/A') {
      return undefined;
    }
    return whoisCache[ip];
  }
  if (!isCallWhois) {
    return undefined;
  }
  try {
    console.log("Calling whois", ip);
    const whois = await whoisJson(ip);
    if (whois.orgName === "Internet Assigned Numbers Authority") {
      whoisCache[ip] = "IANA";
      return whoisCache[ip];
    } else if (!whois.orgName) {
      whoisCache[ip] = "N/A";
      return undefined;
    } else {
      whoisCache[ip] = whois.orgName;
      return whoisCache[ip];
    }
  } catch (err) {
    whoisCache[ip] = "ERR";
    console.error("whois error", err);
    return undefined;
  }
};

const getOrgNames = async (datedHostsObj, whoisCache, isCallWhois) => {
  const result = Object.keys(datedHostsObj).reduce(async (acc, date) => {
    const hostsArray = datedHostsObj[date];
    acc[date] = await Promise.all(
      hostsArray.map(async (host) => {
        const orgName = await getOrgName(host.destHost, whoisCache, isCallWhois);
        const obj = {
          ...host,
          sources: await Promise.all(
            host.sources.map(async (source) => {
              const orgName = await getOrgName(source.sourceHost, whoisCache, isCallWhois);
              const obj = {
                ...source,
              };
              if (orgName) {
                obj.orgName = orgName;
              }
              return obj;
            })
          ),
        };
        if (orgName) {
          obj.orgName = orgName;
        }
        return obj;
      })
    );
    return acc;
  }, {});
  return result;
};

export { getOrgNames };
