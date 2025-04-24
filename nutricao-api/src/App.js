// filepath: c:\Users\naoca\Documents\GitHub\project2-2025a-rafael-rodrigo\nutricao-api\src\App.js
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import ExercisePage from './pages/ExercisePage';
import NutritionPage from './pages/NutritionPage';

function App() {
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
                <div className="circular-progress">
                  <p className="step-count">5,000</p>
                  <p className="step-label">Steps</p>
                </div>
                <div className="circular-progress">
                  <p className="step-count">1,200</p>
                  <p className="step-label">Calories</p>
                </div>
                <div className="circular-progress">
                  <p className="step-count">45 min</p>
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
                <button className="customize-button">
                  Customize my profile
                </button>
              </div>
            </div>
          }
        />
        {/* Página de Exercícios */}
        <Route path="/exercises" element={<ExercisePage />} />
        {/* Página de Nutrição */}
        <Route path="/nutrition" element={<NutritionPage />} />
      </Routes>
    </div>
  );
}

export default App;