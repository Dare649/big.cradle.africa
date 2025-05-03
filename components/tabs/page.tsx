import React, { useState } from 'react';

interface TabProps {
  titles: string[];
  content: React.ReactNode[]; // Add content as a prop
}

const Tab: React.FC<TabProps> = ({ titles, content }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>
      {/* Tab Titles */}
      <div className="flex space-x-4 border-b-2 border-gray-300">
        {titles.map((title, index) => (
          <button
            key={index}
            className={`py-2 px-4 ${
              activeTab === index ? 'text-primary-1 border-b-2 border-primary-1 font-bold' : ''
            }`}
            onClick={() => setActiveTab(index)}
          >
            {title}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4">{content[activeTab]}</div>
    </div>
  );
};

export default Tab;