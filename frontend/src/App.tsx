import React from 'react';
import AuthTest from './components/AuthTest';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Traffic Dashboard - Authentication Test
          </h1>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        <AuthTest />
      </main>
    </div>
  );
}

export default App;
