
import React from 'react';

const Header = () => {
  return (
    <header className="w-full text-center p-6 relative">
      <h1 className="text-3xl md:text-4xl font-bold mb-2 glow-text">
        AI 文本转音频
      </h1>
      <p className="text-sm text-gray-300 max-w-md mx-auto">
        输入文本，选择语音风格，一键将文字转换为自然流畅的语音
      </p>
    </header>
  );
};

export default Header;
