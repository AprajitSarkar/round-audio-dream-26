
import React from 'react';

const Header = () => {
  return (
    <header className="w-full text-center p-6 relative">
      <h1 className="text-3xl md:text-4xl font-bold mb-2 glow-text">
        AI Text to Speech
      </h1>
      <p className="text-sm text-gray-300 max-w-md mx-auto">
        Enter text, choose a voice style, and convert your words into natural flowing speech
      </p>
    </header>
  );
};

export default Header;
