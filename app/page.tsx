'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Dropdown from '@/components/Dropdown';
// import styles from './global.css';

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
          className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600">Add New Stream
        </Link>
      </div>
    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
      <h1>Manage Streams</h1>  {/* TODO: style me please */}
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-around', padding: '20px' }}>
      {/* Large Screen */}
      <div style={{ flex: 1, textAlign: 'center', border: '1px solid black', padding: '10px' }}>
        <h2>Large</h2>
        <Dropdown
          options={streams}
          activeId={
            streams.find((stream) => stream.obs_source_name === activeSources.large)?.id || null
          }
          onSelect={(id) => handleSetActive('large', id)}
          label="Select a Stream..."
        />
        </div>

      {/* Left Screen */}
      <div style={{ flex: 1, textAlign: 'center', border: '1px solid black', padding: '10px' }}>
        <h2>Left</h2>
        <Dropdown
          options={streams}
          activeId={
            streams.find((stream) => stream.obs_source_name === activeSources.left)?.id || null
          }
          onSelect={(id) => handleSetActive('left', id)}
          label="Select a Stream..."
        />
      </div>

      {/* Right Screen */}
      <div style={{ flex: 1, textAlign: 'center', border: '1px solid black', padding: '10px' }}>
        <h2>Right</h2>
        <Dropdown
          options={streams}
          activeId={
            streams.find((stream) => stream.obs_source_name === activeSources.right)?.id || null
          }
          onSelect={(id) => handleSetActive('right', id)}
          label="Select a Stream..."
        />
      </div>
    </div>
    </div>
  );
}
