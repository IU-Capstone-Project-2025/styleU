import { useState } from 'react';

export default function Home() {
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
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-5rem)] space-y-8 p-4">
      <h1 className="text-6xl font-bold text-gray-900 text-center">Hello, World!</h1>
      
      <button
        onClick={handleClick}
        disabled={loading}
        className="bg-[#1A169F] text-[#fff8dc] text-2xl font-medium px-20 py-5 rounded-full 
                 transition-all duration-300 hover:bg-[#18148c] hover:scale-105 
                 disabled:opacity-50 focus:outline-none border-none"
      >
        {loading ? 'Connecting...' : 'Contact to backend'}
      </button>
    </div>
  );
}