import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label } from 'recharts';
import axios from 'axios';
import './logChart.scss';

const LogChart = () => {
  const [transactionData, setTransactionData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/borrow-return/br/aggregated-transactions'); // Fetch aggregated data from your endpoint

        // Process the fetched data
        const logs = response.data.map(entry => ({
          date: entry._id.date,
          totalBorrowed: entry.totalBorrowed || 0,
          totalReturned: entry.totalReturned || 0,
        }));

        setTransactionData(logs);
      } catch (error) {
        console.error("Error fetching transaction data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="chart-container">
      <LineChart
        width={600} // Adjust width as needed
        height={300} // Adjust height as needed
        data={transactionData}
        margin={{ top: 20, right: 30, left: 20, bottom: 60 }} // Increased bottom margin for legend
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date">
          <Label value="Date" offset={-20} position="insideBottom" />
        </XAxis>
        <YAxis>
          <Label value="Number of Transactions" angle={-90} position="insideLeft" offset={0} style={{ textAnchor: 'middle' }} />
        </YAxis>
        <Tooltip />
        <Legend
          layout="horizontal"
          align="center"
          verticalAlign="bottom"
          wrapperStyle={{ paddingTop: 20 }} // Adjust padding to fit the legend
        />
        <Line
          type="monotone"
          dataKey="totalBorrowed"
          stroke="#82ca9d"
          dot={false}
          strokeWidth={2}
          activeDot={{ r: 8 }}
        />
        <Line
          type="monotone"
          dataKey="totalReturned"
          stroke="#8884d8"
          dot={false}
          strokeWidth={2}
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </div>
  );
};

export default LogChart;
