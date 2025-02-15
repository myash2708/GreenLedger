import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import RegisterLand from './pages/RegisterLand';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import BuyCredits from './pages/BuyCredits';
import MonitoringLogs from './pages/MonitoringLogs';
import History from './components/History'; // Import the History component

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' exact element={<Home />}></Route>
          <Route path='/registerLand' exact element={<RegisterLand />}></Route>
          <Route path='/order' exact element={<RegisterLand />}></Route>

          <Route path='/buyCredits' exact element={<BuyCredits />}></Route>
          <Route
            path='/monitoringLogs'
            exact
            element={<MonitoringLogs />}
          ></Route>
          <Route path='/analytics' exact element={<Analytics />}></Route>
          <Route path='/settings' exact element={<Settings />}></Route>
          <Route
            path='/history/:landId'
            exact
            element={<History />} // Add the History component to the route
          ></Route>{' '}
          {/* Add History route */}
        </Routes>
      </BrowserRouter>
    </>
  );
}
