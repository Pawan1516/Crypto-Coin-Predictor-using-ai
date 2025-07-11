import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function App() {
  const [coins, setCoins] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredCoins, setFilteredCoins] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState('bitcoin');
  const [coinData, setCoinData] = useState(null);
  const [history, setHistory] = useState([]);
  const [predictedPrice, setPredictedPrice] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const inputRef = useRef(null);

  // Fetch all coins on mount
  useEffect(() => {
    async function fetchCoins() {
      try {
        const res = await axios.get('https://api.coingecko.com/api/v3/coins/list');
        setCoins(res.data);
      } catch (error) {
        console.error('Error fetching coin list:', error);
      }
    }
    fetchCoins();
  }, []);

  // Fetch selected coin info & history
  useEffect(() => {
    if (!selectedCoin) return;

    async function fetchCoinInfo() {
      try {
        const res = await axios.get(`https://api.coingecko.com/api/v3/coins/${selectedCoin}`);
        setCoinData(res.data);
      } catch (error) {
        console.error('Error fetching coin info:', error);
      }
    }

    async function fetchHistory() {
      try {
        const res = await axios.get(`https://api.coingecko.com/api/v3/coins/${selectedCoin}/market_chart`, {
          params: { vs_currency: 'usd', days: 7 }
        });
        setHistory(res.data.prices);
        predictPrice(res.data.prices.map(p => p[1]));
      } catch (error) {
        console.error('Error fetching coin history:', error);
      }
    }

    fetchCoinInfo();
    fetchHistory();
  }, [selectedCoin]);

  // Predict next day price with simple linear regression
  const predictPrice = (prices) => {
    const x = prices.map((_, i) => i);
    const y = prices;
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    const prediction = slope * n + intercept;
    setPredictedPrice(prediction.toFixed(2));
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);

    if (val.trim() === '') {
      setFilteredCoins([]);
      setShowSuggestions(false);
      return;
    }

    const filtered = coins
      .filter(c => c.name.toLowerCase().includes(val.toLowerCase()))
      .slice(0, 10);
    setFilteredCoins(filtered);
    setShowSuggestions(true);
  };

  // When a coin from suggestions is clicked
  const handleSelectCoin = (coinId, coinName) => {
    setSelectedCoin(coinId);
    setSearch(coinName);
    setShowSuggestions(false);
  };

  // Hide suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Chart data and options
  const chartData = {
    labels: history.map(p => new Date(p[0]).toLocaleDateString()),
    datasets: [
      {
        label: `${coinData?.name || ''} Price (USD)`,
        data: history.map(p => p[1]),
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Price History (Last 7 Days)' },
    },
    scales: { y: { beginAtZero: false } },
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', fontFamily: 'Arial, sans-serif', padding: 20 }}>
      <h1>Crypto Coin Predictor</h1>

      <div style={{ position: 'relative' }} ref={inputRef}>
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search coins..."
          style={{ width: '100%', padding: 8, fontSize: 16 }}
          onFocus={() => {
            if (filteredCoins.length > 0) setShowSuggestions(true);
          }}
        />
        {showSuggestions && filteredCoins.length > 0 && (
          <ul
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              border: '1px solid #ccc',
              maxHeight: 200,
              overflowY: 'auto',
              backgroundColor: 'white',
              margin: 0,
              padding: 0,
              listStyle: 'none',
              zIndex: 1000
            }}
          >
            {filteredCoins.map(c => (
              <li
                key={c.id}
                style={{ padding: 8, cursor: 'pointer' }}
                onClick={() => handleSelectCoin(c.id, c.name)}
              >
                {c.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {coinData && (
        <div style={{ marginTop: 20 }}>
          <h2>{coinData.name}</h2>
          <p>Current Price: ${coinData.market_data.current_price.usd}</p>
          <p>24h Change: {coinData.market_data.price_change_percentage_24h.toFixed(2)}%</p>
          <p>Predicted Price (next day): ${predictedPrice}</p>
        </div>
      )}

      {history.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <Line data={chartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
}
