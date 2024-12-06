'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Dropdown from '@/components/Dropdown';

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
    topLeft: null,
    topRight: null,
    bottomLeft: null,
    bottomRight: null,
  });

  useEffect(() => {
    // Fetch available streams from the database
    fetch('/api/streams')
      .then((res) => res.json())
      .then(setStreams);

    // Fetch current active sources from files
    fetch('/api/getActive')
      .then((res) => res.json())
      .then((data) => {
        console.log('Fetched activeSources:', data); // Debug log
        setActiveSources(data);
      })
      .catch((err) => console.error('Error fetching active sources:', err));
  }, []);

  const handleSetActive = async (screen: keyof typeof activeSources, id: number | null) => {
    const selectedStream = streams.find((stream) => stream.id === id);

    // Update local state
    setActiveSources((prev) => ({
      ...prev,
      [screen]: selectedStream?.obs_source_name || null,
    }));

    // Update the backend
    try {
      if (id) {
        console.log('Setting screen ', screen)
        const response = await fetch('/api/setActive', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ screen, id }),
        });

        if (!response.ok) {
          throw new Error('Failed to set active stream');
        }

        const data = await response.json();
        console.log(data.message);
      }
    } catch (error) {
      console.error('Error setting active stream:', error);
    }
  };

  return (
    <div>
      {/* Add New Stream Link */}
      <div className="text-center mb-5">
        <Link
          href="/add"
          className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
        >
          Add New Stream
        </Link>
      </div>

      <div className="text-center mb-5">
        <h1 className="text-2xl font-bold">Manage Streams</h1>
      </div>

      {/* Large Screen on its own line */}
      <div className="flex justify-center p-5">
        <div className="text-center border border-gray-400 p-4 rounded-lg shadow w-full max-w-md">
          <h2 className="text-lg font-semibold mb-2">Large</h2>
          <Dropdown
            options={streams}
            activeId={
              streams.find((stream) => stream.obs_source_name === activeSources.large)?.id || null
            }
            onSelect={(id) => handleSetActive('large', id)}
            label="Select a Stream..."
          />
        </div>
      </div>

      {/* Row for Left and Right Screens */}
      <div className="flex justify-around p-5">
        {/* Left Screen */}
        <div className="flex-1 text-center border border-gray-400 p-4 rounded-lg shadow mx-2">
          <h2 className="text-lg font-semibold mb-2">Left</h2>
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
        <div className="flex-1 text-center border border-gray-400 p-4 rounded-lg shadow mx-2">
          <h2 className="text-lg font-semibold mb-2">Right</h2>
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

      {/* 2x2 Square for Additional Sources */}
      <div className="grid grid-cols-2 gap-4 p-5">
        {/* Top Left */}
        <div className="text-center border border-gray-400 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Top Left</h2>
          <Dropdown
            options={streams}
            activeId={
              streams.find((stream) => stream.obs_source_name === activeSources.topLeft)?.id || null
            }
            onSelect={(id) => handleSetActive('topLeft', id)}
            label="Select a Stream..."
          />
        </div>

        {/* Top Right */}
        <div className="text-center border border-gray-400 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Top Right</h2>
          <Dropdown
            options={streams}
            activeId={
              streams.find((stream) => stream.obs_source_name === activeSources.topRight)?.id || null
            }
            onSelect={(id) => handleSetActive('topRight', id)}
            label="Select a Stream..."
          />
        </div>

        {/* Bottom Left */}
        <div className="text-center border border-gray-400 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Bottom Left</h2>
          <Dropdown
            options={streams}
            activeId={
              streams.find((stream) => stream.obs_source_name === activeSources.bottomLeft)?.id || null
            }
            onSelect={(id) => handleSetActive('bottomLeft', id)}
            label="Select a Stream..."
          />
        </div>

        {/* Bottom Right */}
        <div className="text-center border border-gray-400 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Bottom Right</h2>
          <Dropdown
            options={streams}
            activeId={
              streams.find((stream) => stream.obs_source_name === activeSources.bottomRight)?.id || null
            }
            onSelect={(id) => handleSetActive('bottomRight', id)}
            label="Select a Stream..."
          />
        </div>
      </div>
    </div>

  );
}
