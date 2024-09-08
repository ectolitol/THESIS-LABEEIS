import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Tooltip, Legend, Cell } from 'recharts';
import axios from 'axios'; // Import Axios
import './stockChart.scss';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF4444']; // Customize as needed

const StockChart = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/categories'); // Fetch data from your endpoint
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const chartData = categories.map(category => ({
    name: category.categoryName,
    value: category.itemCount,
  }));

  return (
    <div className="chart-container">
      <PieChart width={300} height={300}> {/* Adjust width and height as needed */}
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          outerRadius={100}
          fill="#8884d8"
          label
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default StockChart;
