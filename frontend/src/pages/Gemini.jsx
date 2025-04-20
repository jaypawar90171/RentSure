import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import PageTransition from './PageTransition';

const BACKEND_URL = 'http://localhost:5000/api/generate';


const BotIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-indigo-600">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Zm.75-12h9v9h-9v-9Z" />
  </svg>
);


const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-600">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
  </svg>
);


function App() {
  //State Management
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hello! I am RentSure Assistant. How can I help you with Indian rental regulations today?',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null); //  Auto scroll to latest message

  // Auto scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

   // Helper function to detect and format code blocks
   const renderBotResponse = (text) => {
    // First handle code blocks
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts = text.split(codeBlockRegex);
    
    return parts.map((part, index) => {
      if (index % 3 === 0) { // Regular text
        // Process markdown formatting in regular text
        return processMarkdownText(part);
      }
      if (index % 3 === 1) { // Language identifier
        return null; // We'll use it in the next code block
      }
      // Code block
      const language = parts[index - 1] || 'text';
      return (
        <SyntaxHighlighter
          key={index}
          language={language.toLowerCase()}
          style={atomOneDark}
          className="rounded-lg p-4 my-2 text-sm"
          customStyle={{
            background: '#282c34',
            borderRadius: '0.5rem',
            padding: '1rem',
            margin: '1rem 0'
          }}
        >
          {part.trim()}
        </SyntaxHighlighter>
      );
    });
  };

  // Helper function to process markdown text
  const processMarkdownText = (text) => {
    // Handle bold text (both ** and __ formats)
    const boldRegex = /(\*\*|__)(.*?)\1/g;
    const parts = text.split(boldRegex);
    
    return (
      <p key={Math.random()} className="whitespace-pre-wrap">
        {parts.map((part, i) => {
          if (i % 3 === 1) { // This is a bold marker
            return null;
          } else if (i % 3 === 2) { // This is the bold text
            return <strong key={i}>{part}</strong>;
          } else { // Regular text
            return part;
          }
        })}
      </p>
    );
  };

  // Function to render message content based on sender
  const renderMessageContent = (msg) => {
    if (msg.sender === 'bot') {
      return (
        <div className="space-y-2">
          {renderBotResponse(msg.text)}
        </div>
      );
    }
    return <p className="whitespace-pre-wrap">{msg.text}</p>;
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt || isLoading) return;

    setError(null);
    setIsLoading(true);

    const newUserMessage = { sender: 'user', text: trimmedPrompt };
    setMessages((prev) => [...prev, newUserMessage]);
    setPrompt('');

    try {
      const response = await axios.post(BACKEND_URL, { prompt: trimmedPrompt });

      let botText = response.data?.response;
      try {
        // Parse JSON response if formatted
        if (botText.startsWith('```json') && botText.endsWith('```')) {
          const jsonString = botText.substring(7, botText.length - 3).trim();
          const parsed = JSON.parse(jsonString);
          if (parsed.text) botText = parsed.text;
        }
      } catch (parseError) {
        console.warn('Fallback to raw response text.', parseError);
      }

      const newBotMessage = { sender: 'bot', text: botText };
      setMessages((prev) => [...prev, newBotMessage]);
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || err.message || 'Failed to get response from server.';
      setError(errorMessage);
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: `Sorry, an error occurred: ${errorMessage}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition>
    <div className="flex flex-col h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-100">
      {/* Header */}
      <header className="bg-white shadow-md p-4 flex items-center space-x-3">
        <BotIcon />
        <h1 className="text-2xl font-bold text-gray-800">RentSure Assistant</h1>
        <span className="text-sm text-gray-500 mt-1">Your guide to Indian rental laws</span>
      </header>

      {/* Chat Area */}
      <div className="flex-grow overflow-y-auto p-4 md:p-6 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender === 'bot' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center">
                <BotIcon />
              </div>
            )}
            <div
              className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-xl shadow ${
                msg.sender === 'user'
                  ? 'bg-blue-500 text-white rounded-br-none'
                  : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'
              }`}
            >
              {renderMessageContent(msg)}
            </div>
            {msg.sender === 'user' && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center">
                <UserIcon />
              </div>
            )}
          </div>
        ))}

        

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center">
              <BotIcon />
            </div>
            <div className="px-4 py-3 rounded-lg shadow bg-white text-gray-500 border border-gray-200">
              Thinking...
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && !isLoading && (
          <div className="flex justify-center">
            <p className="text-red-600 bg-red-100 border border-red-400 rounded px-4 py-2 text-sm">
              Error: {error}
            </p>
          </div>
        )}

        {/* Scroll Reference */}
        <div ref={messagesEndRef} />
      </div>

      {/* ⌨️ Input Footer */}
      <footer className="bg-white border-t border-gray-200 p-4 sticky bottom-0">
        <form onSubmit={handleSubmit} className="flex items-center space-x-3">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask about Indian rental agreements, rights, laws..."
            className="flex-grow px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            disabled={isLoading}
            aria-label="Chat input"
          />
          <button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className={`px-5 py-2 rounded-full text-white font-semibold transition duration-200 flex items-center justify-center ${
              isLoading || !prompt.trim()
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
            }`}
            aria-label="Send message"
          >
            {isLoading ? (
              // Simple spinner
               <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
               </svg>
            ) : (
              // Send Icon
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
              </svg>
            )}
          </button>
        </form>
      </footer>
    </div>
    </PageTransition>
  );
}

export default App;