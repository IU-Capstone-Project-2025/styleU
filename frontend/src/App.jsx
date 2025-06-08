import { useState } from 'react';

function App() {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/hello');
      const data = await response.text();
      alert(data);
    } catch (error) {
      alert('Failed to connect to the backend.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#fff8dc] space-y-8">
      <h1 className="text-6xl font-bold text-gray-900">Hello, World!</h1>

      <button
        onClick={handleClick}
        disabled={loading}
        className="bg-[#1A169F] text-[#fff8dc] text-2xl font-medium px-20 py-5 rounded-full transition-all duration-300 hover:bg-[#18148c] hover:scale-105 disabled:opacity-50 focus:outline-none border-none"
      >
        {loading ? 'Connecting...' : 'Contact to backend'}
      </button>
    </div>
  );
}

export default App;
