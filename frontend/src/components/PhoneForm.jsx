import { useState } from 'react';
import axios from 'axios';

export default function PhoneForm({ onStarted }) {
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'http://localhost:5050/api/start-verification',
        { phone }
      );
      if (res.data.success) {
        setStatus('Code sent!');
        onStarted(phone);
      } else {
        setStatus('Failed to send code.');
      }
    } catch (err) {
      setStatus('Error sending code.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4 p-4'>
      <input
        type='tel'
        placeholder='Enter phone number'
        className='border rounded p-2 w-full'
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <button
        className='bg-blue-500 text-white px-4 py-2 rounded'
        type='submit'
      >
        Send Code
      </button>
      <p>{status}</p>
    </form>
  );
}
