import dns from "dns";

const resolveHostname = async (ip, dnsCache, isCallDns) => {
  return new Promise((resolve, reject) => {
    if (dnsCache[ip]) {
      return resolve(dnsCache[ip]);
    }
    if (!isCallDns) {
      return resolve(ip);
    }
    console.log('Calling dns', ip)
    dns.reverse(ip, (err, hostnames) => {
      if (err || !hostnames[0]) {
        dnsCache[ip] = ip;
        console.error("dns error", err);
        return resolve(ip);
      }
      dnsCache[ip] = hostnames[0];
      return resolve(hostnames[0]);
    });
  });
};

const resolveHostnames = async (datedHostsObj, dnsCache, isCallDns) => {
  const result = Object.keys(datedHostsObj).reduce(async (acc, date) => {
    const hostsArray = datedHostsObj[date];
    acc[date] = await Promise.all(
      hostsArray.map(async (host) => {
        return {
          ...host,
          destHost: await resolveHostname(host.destHost, dnsCache, isCallDns),
          sources: await Promise.all(
            host.sources.map(async (source) => ({
              ...source,
              sourceHost: await resolveHostname(source.sourceHost, dnsCache, isCallDns),
            }))
          ),
        };
      })
    );
    return acc;
  }, {});
  return result;
};

export { resolveHostnames };
