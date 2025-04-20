import React from 'react';
import Navbar from '../components/Navbar';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          Welcome to Paw Pal Marketplace
        </h1>
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-6">
            Find your perfect furry companion today!
          </p>
          <a 
            href="/pets" 
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
          >
            Browse Pets
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;