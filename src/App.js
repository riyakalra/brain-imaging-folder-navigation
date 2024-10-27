import React from 'react';
import FileList from './components/FileList'; 

const App = () => {
  return (
    <div className="App min-h-screen bg-gray-100 flex flex-col items-center">
      <h1 className="text-3xl font-bold my-4">Brain Imaging</h1>
      <FileList />
    </div>
  );
};


export default App;