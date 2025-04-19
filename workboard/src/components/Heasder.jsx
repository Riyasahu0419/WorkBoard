// src/components/Header.jsx
import React from 'react';

const Header = ({ addColumn }) => {
  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">WorkBoard</h1>
        <button 
          onClick={addColumn}
          className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-blue-100 transition-colors font-medium"
        >
          Add Column
        </button>
      </div>
    </header>
  );
};

export default Header;
