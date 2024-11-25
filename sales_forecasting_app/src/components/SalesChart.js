import React, { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Brush, Label
} from 'recharts';
import { Card, Form } from 'react-bootstrap';

const SalesChart = ({ data, predictions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const chartData = [...data, ...predictions];

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredData = searchTerm
    ? chartData.filter(d => d.product_description.toLowerCase().includes(searchTerm.toLowerCase()))
    : chartData;

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip" style={{
          backgroundColor: 'white',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '5px'
        }}>
          <p><strong>Date:</strong> {label}</p>
          {payload.map((p, idx) => (
            <p key={idx} style={{ color: p.color }}>
              {p.name}: {p.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="mt-4">
      <Card.Header>Sales Forecast Visualization</Card.Header>
      <Card.Body>
        <div className="mb-3">
          <Form>
            <Form.Group>
              <Form.Label>Search Products:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter product name"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </Form.Group>
          </Form>
        </div>

        <ResponsiveContainer width="100%" height={500}>
          <LineChart
            data={filteredData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="sales_date"
              angle={-45}
              textAnchor="end"
              height={70}
            >
              <Label value="Sales Date" offset={-10} position="insideBottom" />
            </XAxis>
            <YAxis>
              <Label
                value="Quantity Sold"
                angle={-90}
                position="insideLeft"
                style={{ textAnchor: 'middle' }}
              />
            </YAxis>
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} />
            <Line
              type="monotone"
              dataKey="quantity_sold"
              stroke="#8884d8"
              name="Actual Sales"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="predicted_quantity"
              stroke="#82ca9d"
              name="Predicted Sales"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 3 }}
            />
            <Brush
              dataKey="sales_date"
              height={30}
              stroke="#8884d8"
              startIndex={Math.max(0, filteredData.length - 12)}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card.Body>
    </Card>
  );
};

export default SalesChart;