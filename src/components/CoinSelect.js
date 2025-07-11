import React from 'react';

const COIN_LIST = [
  { id: 'bitcoin', name: 'Bitcoin' },
  { id: 'ethereum', name: 'Ethereum' },
  { id: 'dogecoin', name: 'Dogecoin' },
  { id: 'cardano', name: 'Cardano' },
  { id: 'solana', name: 'Solana' }
];

function CoinSelect({ coin, setCoin }) {
  return (
    <select
      className="border p-2 rounded mb-4"
      value={coin}
      onChange={(e) => setCoin(e.target.value)}
    >
      {COIN_LIST.map((c) => (
        <option key={c.id} value={c.id}>{c.name}</option>
      ))}
    </select>
  );
}

export default CoinSelect;