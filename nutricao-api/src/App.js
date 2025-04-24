// filepath: c:\Users\naoca\Documents\GitHub\project2-2025a-rafael-rodrigo\nutricao-api\src\App.js
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import ExercisePage from './pages/ExercisePage';
import NutritionPage from './pages/NutritionPage';
import CustomizePage from './pages/CustomizePage'; // Import da nova página

function App() {
  const [metrics, setMetrics] = useState({
    steps: 0,
    calories: 0,
    activeTime: 0,
  });

  const goals = {
    steps: 10000,
    calories: 2000,
    activeTime: 60, // in minutes
  };

  useEffect(() => {
    // Generate random values for simulation
    const randomMetrics = {
      steps: Math.floor(Math.random() * goals.steps),
      calories: Math.floor(Math.random() * goals.calories),
      activeTime: Math.floor(Math.random() * goals.activeTime),
    };
    setMetrics(randomMetrics);
  }, []);

  const calculatePercentage = (value, goal) => Math.min((value / goal) * 100, 100);

  return (
    <div className="App">
      <Routes>
        {/* Página inicial */}
        <Route
          path="/"
          element={
            <div className="home-page">
              <img src="/images/logo.png" alt="Home" className="home-logo" />
              <div className="tracker-container">
                <div className="circular-progress" style={{ background: `conic-gradient(#4caf50 ${calculatePercentage(metrics.steps, goals.steps)}%, #e0e0e0 0)` }}>
                  <p className="step-count">{metrics.steps}</p>
                  <p className="step-label">Steps</p>
                </div>
                <div className="circular-progress" style={{ background: `conic-gradient(#ff9800 ${calculatePercentage(metrics.calories, goals.calories)}%, #e0e0e0 0)` }}>
                  <p className="step-count">{metrics.calories}</p>
                  <p className="step-label">Calories</p>
                </div>
                <div className="circular-progress" style={{ background: `conic-gradient(#2196f3 ${calculatePercentage(metrics.activeTime, goals.activeTime)}%, #e0e0e0 0)` }}>
                  <p className="step-count">{metrics.activeTime} min</p>
                  <p className="step-label">Active Time</p>
                </div>
              </div>
              <div className="button-container">
                <Link to="/exercises" className="action-button">
                  Start Exercising
                </Link>
                <Link to="/nutrition" className="action-button">
                  Go to Nutrition
                </Link>
              </div>
              <div className="customize-container">
                <Link to="/customize" className="customize-button">
                  Customize my profile
                </Link>
              </div>
            </div>
          }
        />
        {/* Página de Exercícios */}
        <Route path="/exercises" element={<ExercisePage />} />
        {/* Página de Nutrição */}
        <Route path="/nutrition" element={<NutritionPage />} />
        {/* Página de Customização */}
        <Route path="/customize" element={<CustomizePage />} />
      </Routes>
    </div>
  );
}

export default App;