import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register required components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function PriceChart({ history }) {
  // Prepare labels (dates) and prices for the chart
  const labels = history.map(([time]) => new Date(time).toLocaleDateString());
  const prices = history.map(([, price]) => price);

  const data = {
    labels,
    datasets: [
      {
        label: 'Price in USD',
        data: prices,
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        tension: 0.3,
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Price History (Last 7 days)' },
    },
  };

  return <Line data={data} options={options} />;
}
