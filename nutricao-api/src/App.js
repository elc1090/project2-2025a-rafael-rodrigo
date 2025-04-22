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
              <h1>Bem-vindo à Aplicação</h1>
              <div className="icon-container">
                <Link to="/exercises" className="icon-link">
                  <img
                    src="/icons/exercise-icon.png"
                    alt="Exercícios"
                    className="icon"
                  />
                  <p>Exercícios</p>
                </Link>
                <Link to="/nutrition" className="icon-link">
                  <img
                    src="/icons/nutrition-icon.png"
                    alt="Nutrição"
                    className="icon"
                  />
                  <p>Nutrição</p>
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