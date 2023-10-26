import React, { useState,useEffect } from 'react';
import axios from 'axios';
import "tailwindcss/tailwind.css"
import { data } from 'autoprefixer';


const IpAddress = () => {
    const [ipAddress, setIpAddress] = useState('');
    const [location, setLocation] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [ipLocation, setIpLocation] = useState('');
    const [userAgent, setUserAgent] = useState('');
    const [os, setOs] = useState('');
    
    useEffect(() => {
    fetchData();
      const ua = navigator.userAgent;
      setUserAgent(ua);
  
      const os = window.navigator.platform;
      setOs(os);
        console.log('os',os);
        console.log('ua',ua);
    }, [location]);

    const fetchData = async () => {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            // console.log(data.ip);
            setIpLocation(data.ip);
            // setIpAddress(data.ip);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await axios.get(`https://ipapi.co/${ipAddress}/json/`);
            // const response = await fetch(`https://ipinfo.io/${ip}?token=74db65d4b0448e`);
            console.log('response', response.data);
            setLocation(response.data);
        } catch (error) {
            setError('Unable to fetch location data');
        }

        setIsLoading(false);
    };

    return (
        <div className="container mx-auto">
            {/*<h1 className="text-3xl font-bold text-center mt-8 mb-4">IP Address Lookup</h1>*/}
            <h1 className="text-5xl font-bold text-center tracking-tight mb-4">IP Address Lookup</h1>
            <p className="text-base text-center font-normal">"Whoer IP" is an online service by whoer.net, enabling users to easily check their current IP address. It provides detailed IP information like the location, country, and Internet Service Provider. This tool serves a key role in improving users' understanding of their own online presence and maintaining internet privacy and security.</p>
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div className="flex items-center border-b border-b-2 border-blue-500 py-2">
                    <input
                        type="text"
                        placeholder="Enter IP Address"
                        className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                        value={ipAddress}
                        onChange={(e) => setIpAddress(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="flex-shrink-0 bg-blue-500 hover:bg-blue-700 border-blue-500 hover:border-blue-700 text-sm border-4 text-white py-1 px-2 rounded"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Loading...' : 'Get Location'}
                    </button>
                </div>
                {error && <p className="text-red-500 mt-2">{error}</p>}
            </form>

            {/*{!location && (<h2 className="text-lg font-family text-2xl text-center mb-3">Your IP Address is: {ipLocation}</h2>)}            */}
            {!location && (<h2 className="font-semibold text-black">Your IP Address is: {ipLocation}</h2>)}


            {location && (
                <div class="relative flex min-h-screen flex-col justify-center overflow-hidden bg-gray-50 py-6 sm:py-12">
                <div class="relative bg-white px-6 pb-8 pt-10 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:max-w-lg sm:rounded-lg sm:px-10">
                  <div className="text-3xl font-bold  mt-8 mb-4">
                    <h2 className="text-lg font-family text-center text-2xl">IP Address Information:</h2>
                    <hr />
                    <table className="border divide-y divide-gray-200 w-full whitespace-nowrap table-auto mx-auto mt-4 text-center">
                      <tbody>
                        <tr>
                          <td className="px-4 py-2 text-gray-700 font-medium">IP:</td>
                          <td className="px-4 py-2 text-gray-700 font-medium">{location.ip}</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-gray-700 font-medium">Hostname:</td>
                          <td className="px-4 py-2 text-gray-700 font-medium">{location.hostname}</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-gray-700 font-medium">City:</td>
                          <td className="px-4 py-2 text-gray-700 font-medium">{location.city}</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-gray-700 font-medium">Region:</td>
                          <td className="px-4 py-2 text-gray-700 font-medium">{location.region}</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-gray-700 font-medium">Country:</td>
                          <td className="px-4 py-2 text-gray-700 font-medium">{location.country_name}</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-gray-700 font-medium">Latitude:</td>
                          <td className="px-4 py-2 text-gray-700 font-medium">{location.latitude}</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-gray-700 font-medium">Longitude:</td>
                          <td className="px-4 py-2 text-gray-700 font-medium">{location.longitude}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>              
            )}

        </div>
    );
};

export default IpAddress;
