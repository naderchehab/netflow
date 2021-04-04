import React, { useState, useEffect } from 'react';
import { BarChart, Bar, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const data = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

const Chart = () => {
  const [chartData, setChartData] = useState([]);
  
  useEffect(async () => {
    const response = await fetch('/data')
    const netflowData = await response.json()
    const data = convertNeflowData(netflowData)
    setChartData(data)
    console.log(netflowData)
  }, [])

  const convertNeflowData = (netflowData) => {
    const dates = Object.keys(netflowData)
    const destHosts = netflowData[dates[0]].slice(0, 5)
    const data = destHosts.map(destHost => ({
      host: destHost.destHost,
      bandwidth: destHost.bandwidthBytes / 1000000,
    }))
    console.log(data)
    return data
  }

  return (
    <div style={{ width: '100%', height: '800px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="host" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="bandwidth" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default Chart