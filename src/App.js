import React from 'react';
import FileList from './components/FileList';

const App = () => {
  return (
    <div className="min-h-screen bg-teal-50">
      <header className="w-full py-4 bg-teal-600 text-white">
        <h1 className="text-center text-2xl font-semibold">Brain Imaging</h1>
      </header>
      <main className="p-4">
        <FileList />
      </main>
    </div>
  );
};

export default App;