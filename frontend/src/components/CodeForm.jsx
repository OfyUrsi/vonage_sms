import { useState } from 'react';
import axios from 'axios';

export default function CodeForm({ phone }) {
  const [code, setCode] = useState('');
  const [result, setResult] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'http://localhost:5050/api/check-verification',
        { phone, code }
      );
      if (res.data.success) {
        setResult('✅ Verified!');
      } else {
        setResult('❌ Invalid code.');
      }
    } catch (err) {
      setResult('Error verifying code.');
    }
  };

  return (
    <form onSubmit={handleVerify} className='space-y-4 p-4'>
      <input
        type='text'
        placeholder='Enter code'
        className='border rounded p-2 w-full'
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <button
        className='bg-green-500 text-white px-4 py-2 rounded'
        type='submit'
      >
        Verify Code
      </button>
      <p>{result}</p>
    </form>
  );
}
