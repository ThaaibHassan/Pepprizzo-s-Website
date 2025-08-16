import React from 'react';

const TestImage: React.FC = () => {
  return (
    <div className="p-4 border border-red-500">
      <h3>Test Images</h3>
      <div className="space-y-4">
        <div>
          <p>Logo (g2.svg):</p>
          <img 
            src="/g2.svg" 
            alt="Test Logo" 
            className="h-20 w-auto border border-blue-500"
            onError={(e) => console.error('Logo failed to load:', e)}
            onLoad={() => console.log('Logo loaded successfully')}
          />
        </div>
        
        <div>
          <p>Pizza Placeholder (placeholder-pizza.svg):</p>
          <img 
            src="/placeholder-pizza.svg" 
            alt="Test Pizza" 
            className="h-20 w-auto border border-green-500"
            onError={(e) => console.error('Pizza image failed to load:', e)}
            onLoad={() => console.log('Pizza image loaded successfully')}
          />
        </div>
        
        <div>
          <p>Direct SVG content:</p>
          <div className="h-20 w-20 border border-purple-500">
            <svg width="100%" height="100%" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="400" height="300" fill="#F3F4F6"/>
              <circle cx="200" cy="150" r="80" fill="#F59E0B" stroke="#92400E" strokeWidth="3"/>
              <text x="200" y="280" textAnchor="middle" fill="#6B7280" fontFamily="Arial" fontSize="14">Test SVG</text>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestImage;
