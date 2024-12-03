import React, { useState } from 'react';
import styles from '../styles/CheckSource.module.css';

export default function CheckSource() {
  const [sourceName, setSourceName] = useState('');
  const [result, setResult] = useState<null | string>(null);

  const handleCheck = async () => {
    if (!sourceName) {
      alert('Please enter a source name.');
      return;
    }

    try {
      const res = await fetch(`/api/checkSource?sourceName=${encodeURIComponent(sourceName)}`);
      const data = await res.json();

      if (res.ok) {
        setResult(data.exists ? `${sourceName} exists in OBS.` : `${sourceName} does not exist in OBS.`);
      } else {
        setResult(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error('Error checking source:', err);
      setResult('Failed to check source.');
    }
  };

  return (
    <div className={styles.container}>
      <h2>Check OBS Source</h2>
      <input
        type="text"
        placeholder="Enter source name"
        value={sourceName}
        onChange={(e) => setSourceName(e.target.value)}
        className={styles.input}
      />
      <button onClick={handleCheck} className={styles.button}>Check</button>
      {result && <p>{result}</p>}
    </div>
  );
}
