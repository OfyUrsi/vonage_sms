import { useState } from 'react';
import PhoneForm from './components/PhoneForm';
import CodeForm from './components/CodeForm';

function App() {
  const [phone, setPhone] = useState(null);

  return (
    <div className='max-w-md mx-auto mt-10 bg-white rounded shadow p-6'>
      <h1 className='text-2xl font-bold mb-4 text-center'>
        📱 Phone Verification
      </h1>
      {!phone ? <PhoneForm onStarted={setPhone} /> : <CodeForm phone={phone} />}
    </div>
  );
}

export default App;
