import { MessageType } from '@/interfaces';
import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

const MessageOptions = ({ message }: {message: MessageType}) => {

  const [showOptions, setShowOptions] = useState(false);
  const optionsRef = useRef<HTMLDivElement>(null);

  const handleOptionsToggle = () => {
    setShowOptions(!showOptions);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text || '');
    toast.success('Text copied to clipboard');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        optionsRef.current &&
        !optionsRef.current.contains(event.target as Node)
      ) {
        setShowOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <div className="flex flex-row bg-secondary text-white py-2 px-3 rounded-lg rounded-tr-none items-center">
        <p>{message.text}</p>
        <span
          className="ml-2 cursor-pointer"
          onClick={handleOptionsToggle}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </div>


      {showOptions && (
        <div className="absolute right-0 mt-2 bg-white shadow-md rounded-md py-2 z-10 w-36" ref={optionsRef}>
          <div className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
            Read By
          </div>
          <div className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleCopy}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
              <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
            </svg>
            Copy
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageOptions;