import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { Insights } from './views/Insights';
import { Network } from './views/Network';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <nav className="nav">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
            Insights
          </NavLink>
          <NavLink to="/network" className={({ isActive }) => (isActive ? 'active' : '')}>
            Network
          </NavLink>
        </nav>
        <main className="main">
          <Routes>
            <Route path="/" element={<Insights />} />
            <Route path="/network" element={<Network />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
