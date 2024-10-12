import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Tooltip, Legend, Cell } from 'recharts';
import axios from 'axios'; // Import Axios
import './stockChart.scss';

const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#FF9F40', '#4BC0C0', '#9966FF']; // Customize as needed

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

  // Map the API data to a format compatible with Recharts PieChart
  const chartData = categories.map((category, index) => ({
    name: category.categoryName, // Name for the label
    value: category.itemCount, // Value for the pie slice
  }));

  return (
    <div className="cat-chart-container">
      <h2 className="cat-chart-title">Category Stock Levels</h2>
      <PieChart width={300} height={300}>
  <Pie
    data={chartData}
    dataKey="value"
    nameKey="name"
    outerRadius={100}
    innerRadius={60}
    fill="#8884d8"
    isAnimationActive={true}
    label={false} // Set label to false to hide labels
  >
    {chartData.map((entry, index) => (
      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
    ))}
  </Pie>
  <Tooltip />
  <Legend layout="horizontal" verticalAlign="bottom" align="center" />
</PieChart>

    </div>
  );
};

export default StockChart;
