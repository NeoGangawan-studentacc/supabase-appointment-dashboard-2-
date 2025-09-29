
import React from 'react';

interface ApiKeyWarningProps {
  instructions: string[];
}

const ApiKeyWarning: React.FC<ApiKeyWarningProps> = ({ instructions }) => {
  return (
    <div 
      className="bg-yellow-900/40 border-2 border-dashed border-yellow-600 text-yellow-200 px-6 py-5 rounded-xl max-w-4xl mx-auto animate-fade-in"
      role="alert"
    >
      <div className="flex items-center mb-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-400 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <strong className="font-extrabold text-2xl text-yellow-300">Action Required: Configure API Key</strong>
      </div>
      <div className="ml-12">
        <p className="mb-4">
            The connection to the Gemini AI service failed. To enable AI-generated facts, you need to provide your API key securely.
        </p>
        <ul className="list-disc list-inside space-y-2 text-yellow-100">
          {instructions.map((line, index) => (
            <li key={index}>{line}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ApiKeyWarning;
