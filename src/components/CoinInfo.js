import React from 'react';

function CoinInfo({ data, predictedPrice }) {
  return (
    <div className="bg-gray-100 p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-2">{data.name}</h2>
      <p>💰 Price: ${data.market_data.current_price.usd}</p>
      <p>📉 24h Change: {data.market_data.price_change_percentage_24h.toFixed(2)}%</p>
      <p>📈 Predicted Price (next day): ${predictedPrice}</p>
    </div>
  );
}

export default CoinInfo;