// See: https://www.cisco.com/c/en/us/td/docs/net_mgmt/netflow_collection_engine/3-6/user/guide/format.html#wp1006108

const nf5PktDecode = (msg, rinfo) => {
  const out = {
    header: {
      version: msg.readUInt16BE(0),
      count: msg.readUInt16BE(2),
      sys_uptime: msg.readUInt32BE(4),
      unix_secs: msg.readUInt32BE(8),
      unix_nsecs: msg.readUInt32BE(12),
      flow_sequence: msg.readUInt32BE(16),
      engine_type: msg.readUInt8(20),
      engine_id: msg.readUInt8(21),
      sampling_interval: msg.readUInt16BE(22),
    },
    flows: [],
  };
  var buf = msg.slice(24);
  var t;
  while (buf.length > 0) {
    out.flows.push({
      srcaddr:
        ((t = buf.readUInt32BE(0)),
        (parseInt(t / 16777216) % 256) +
          "." +
          (parseInt(t / 65536) % 256) +
          "." +
          (parseInt(t / 256) % 256) +
          "." +
          (t % 256)),
      dstaddr:
        ((t = buf.readUInt32BE(4)),
        (parseInt(t / 16777216) % 256) +
          "." +
          (parseInt(t / 65536) % 256) +
          "." +
          (parseInt(t / 256) % 256) +
          "." +
          (t % 256)),
      nexthop:
        ((t = buf.readUInt32BE(8)),
        (parseInt(t / 16777216) % 256) +
          "." +
          (parseInt(t / 65536) % 256) +
          "." +
          (parseInt(t / 256) % 256) +
          "." +
          (t % 256)),
      input: buf.readUInt16BE(12),
      output: buf.readUInt16BE(14),
      dPkts: buf.readUInt32BE(16),
      dOctets: buf.readUInt32BE(20),
      first: buf.readUInt32BE(24),
      last: buf.readUInt32BE(28),
      srcport: buf.readUInt16BE(32),
      dstport: buf.readUInt16BE(34),
      tcp_flags: buf.readUInt8(37),
      prot: buf.readUInt8(38),
      tos: buf.readUInt8(39),
      src_as: buf.readUInt16BE(40),
      dst_as: buf.readUInt16BE(42),
      src_mask: buf.readUInt8(44),
      dst_mask: buf.readUInt8(45),
    });
    buf = buf.slice(48);
  }
  return out;
}

export { nf5PktDecode }
