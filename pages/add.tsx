import { useState } from 'react';

export default function AddStream() {
  const [formData, setFormData] = useState({
    name: '',
    obs_source_name: '',
    url: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await fetch('/api/addStream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setFormData({ name: '', obs_source_name: '', url: '' });
      } else {
        setMessage(data.error || 'Something went wrong.');
      }
    } catch (error) {
      console.error('Error adding stream:', error);
      setMessage('Failed to add stream.');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px', border: '1px solid #ccc' }}>
      <h2>Add New Stream</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{ display: 'block', width: '100%', padding: '8px', margin: '5px 0' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>
            OBS Source Name:
            <input
              type="text"
              name="obs_source_name"
              value={formData.obs_source_name}
              onChange={handleChange}
              required
              style={{ display: 'block', width: '100%', padding: '8px', margin: '5px 0' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>
            URL:
            <input
              type="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              required
              style={{ display: 'block', width: '100%', padding: '8px', margin: '5px 0' }}
            />
          </label>
        </div>
        <button type="submit" style={{ padding: '10px 20px', background: '#0070f3', color: '#fff', border: 'none', cursor: 'pointer' }}>
          Add Stream
        </button>
      </form>
      {message && <p style={{ marginTop: '20px', color: message.includes('successfully') ? 'green' : 'red' }}>{message}</p>}
    </div>
  );
}
