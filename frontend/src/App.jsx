import React from 'react';
import './App.css';  // Make sure to style the app, if you have a custom CSS
import AdminMenu from './admin_menu';
const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Admin Panel</h1>
      </header>

      <main>
        <AdminMenu />
      </main>
    </div>
  );
};

export default App;
