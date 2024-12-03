import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

type Stream = {
  id: number;
  name: string;
  obs_source_name: string;
  url: string;
};

export default function Home() {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [activeSources, setActiveSources] = useState({
    large: null,
    left: null,
    right: null,
  });
  useEffect(() => {
    // Fetch available streams from the database
    fetch('/api/streams')
      .then((res) => res.json())
      .then(setStreams);

    // Fetch current active sources from files
    fetch('/api/getActive')
      .then((res) => res.json())
      .then(setActiveSources)
      .catch((err) => console.error('Error fetching active sources:', err));
  }, []);

  const handleSetActive = (screen: 'large' | 'left' | 'right', id: number | null) => {
    const selectedStream = streams.find((stream) => stream.id === id);

    setActiveSources((prev) => ({
      ...prev,
      [screen]: selectedStream?.obs_source_name || null,
    }));

    if (id) {
      fetch('/api/setActive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ screen, id }),
      })
        .then((res) => res.json())
        .then((data) => console.log(data.message))
        .catch((err) => console.error('Error setting active stream:', err));
    }
  };

  return (
    <div>
         {/* Add New Stream Link */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <Link href="/add"
          className={styles.linkButton}>Add New Stream
        </Link>
      </div>
    <div style={{ display: 'flex', justifyContent: 'space-around', padding: '20px' }}>
      {/* Large Screen */}
      <div style={{ flex: 1, textAlign: 'center', border: '1px solid black', padding: '10px' }}>
        <h2>Large</h2>
        <select
          value={
            streams.find((stream) => stream.obs_source_name === activeSources.large)?.id || ''
          }
          onChange={(e) => handleSetActive('large', Number(e.target.value) || null)}
        >
          <option value="">Select a Stream...</option>
          {streams.map((stream) => (
            <option key={stream.id} value={stream.id}>
              {stream.name}
            </option>
          ))}
        </select>
      </div>

      {/* Left Screen */}
      <div style={{ flex: 1, textAlign: 'center', border: '1px solid black', padding: '10px' }}>
        <h2>Left</h2>
        <select
          value={
            streams.find((stream) => stream.obs_source_name === activeSources.left)?.id || ''
          }
          onChange={(e) => handleSetActive('left', Number(e.target.value) || null)}
        >
          <option value="">Select a Stream...</option>
          {streams.map((stream) => (
            <option key={stream.id} value={stream.id}>
              {stream.name}
            </option>
          ))}
        </select>
      </div>

      {/* Right Screen */}
      <div style={{ flex: 1, textAlign: 'center', border: '1px solid black', padding: '10px' }}>
        <h2>Right</h2>
        <select
          value={
            streams.find((stream) => stream.obs_source_name === activeSources.right)?.id || ''
          }
          onChange={(e) => handleSetActive('right', Number(e.target.value) || null)}
        >
          <option value="">Select a Stream...</option>
          {streams.map((stream) => (
            <option key={stream.id} value={stream.id}>
              {stream.name}
            </option>
          ))}
        </select>
      </div>
    </div>
    </div>
  );
}
