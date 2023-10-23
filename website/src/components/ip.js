import React, { useState } from 'react';
import "tailwindcss/tailwind.css"


const IpPage = () => {
  const [ip, setIp] = useState('');
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setIp(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
    //   const response = await axios.get(`https://ipinfo.io/${ip}?token=74db65d4b0448e`);
    const response = await fetch(`https://ipinfo.io/${ip}?token=74db65d4b0448e`);
    const data = await response.json();
    console.log('data',data);
    setLocation(data);
    console.log('location',location);
    
    } catch (error) {
      setError('Failed to fetch location data');
    }
    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">IP Location Finder</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter IP address"
            value={ip}
            onChange={handleInputChange}
            className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Get Location'}
          </button>

          {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>

        <div>
      {location && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold">Location:</h2>
          <p>IP: {location.ip}</p>
          <p>Hostname: {location.hostname}</p>
          <p>City: {location.city}</p>
          <p>Region: {location.region}</p>
          <p>Country: {location.country}</p>
        </div>
      )}
    </div>
        {/* {location} */}
        {/* {location && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold">Location:</h2>
            <p>{location}</p>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default IpPage;