import dgram from "dgram";

const listenUdp = (onMessage, udpPort) => {
  const server = dgram.createSocket("udp4");

  server.on("error", (err) => {
    console.error(`server error:\n${err.stack}`);
    server.close();
  });

  server.on("message", (msg, rinfo) => {
    onMessage(msg, rinfo)
  });

  server.on("listening", () => {
    const address = server.address();
    console.log(`UDP server listening for Netflow messages at ${address.address}:${address.port}`);
  });

  server.bind(udpPort);
};

export { listenUdp }