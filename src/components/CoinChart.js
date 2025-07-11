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

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function CoinChart({ history, coinName }) {
  // Prepare labels (dates) and data (prices)
  const labels = history.map(item => new Date(item[0]).toLocaleDateString());
  const data = {
    labels,
    datasets: [
      {
        label: `${coinName} Price (USD)`,
        data: history.map(item => item[1]),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  return (
    <div style={{ maxWidth: '700px', margin: 'auto' }}>
      <Line data={data} />
    </div>
  );
}

export default CoinChart;
