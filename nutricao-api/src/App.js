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
              <div className="icon-container">
                <Link to="/exercises" className="icon-link">
                  <img
                    src="/icons/exercise-icon.png"
                    alt="Exercises"
                    className="icon"
                  />
                  <p>Exercises</p>
                </Link>
                <Link to="/nutrition" className="icon-link">
                  <img
                    src="/icons/nutrition-icon.png"
                    alt="Nutrition"
                    className="icon"
                  />
                  <p>Nutrition</p>
                </Link>
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