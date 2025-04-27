import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import ExercisePage2 from './pages/ExercisePage2';
import NutritionPage from './pages/NutritionPage';
import CustomizePage from './pages/CustomizePage';
import FavoritesPage from './pages/FavoritesPage';
import ExerciseDetailsPage from './pages/ExerciseDetailsPage'; // Import the new ExerciseDetailsPage

function App() {
    const [metrics, setMetrics] = useState({
        steps: 0,
        calories: 0,
        activeTime: 0,
        heartRate: 72,
        sleep: 7.5,
    });

    const goals = {
        steps: 10000,
        calories: 2000,
        activeTime: 60, // in minutes
        heartRate: 60,
        sleep: 8, // in hours
    };

    useEffect(() => {
        // Generate random values for simulation and load active time from localStorage
        const storedMetrics = JSON.parse(localStorage.getItem("metrics")) || { activeTime: 0 };
        const randomMetrics = {
            steps: Math.floor(Math.random() * goals.steps),
            calories: Math.floor(Math.random() * goals.calories),
            activeTime: storedMetrics.activeTime, // Load active time
            heartRate: Math.floor(Math.random() * 40) + 60,
            sleep: (Math.random() * 3 + 5).toFixed(1),
        };
        setMetrics(randomMetrics);
    }, []);

    const calculatePercentage = (value, goal) => Math.min((value / goal) * 100, 100);

    return (
        <div className="App">
            <Routes>
                {/* Home Page */}
                <Route
                    path="/"
                    element={
                        <div className="home-page">
                            <div className="app-header">
                                <img src="/images/logo.png" alt="Home" className="home-logo" />
                                <h1 className="app-title">CrossPão</h1>
                            </div>
                            
                            <div className="health-summary">
                                <div className="health-metric">
                                    <h3>Heart Rate</h3>
                                    <div className="metric-value">
                                        {metrics.heartRate} <span className="metric-unit">bpm</span>
                                    </div>
                                </div>
                                <div className="health-metric">
                                    <h3>Sleep</h3>
                                    <div className="metric-value">
                                        {metrics.sleep} <span className="metric-unit">hrs</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="tracker-container">
                                <div className="circular-progress" style={{ background: `conic-gradient(#00a0e9 ${calculatePercentage(metrics.steps, goals.steps)}%, #e8f5ff 0)` }}>
                                    <p className="step-count">{metrics.steps}</p>
                                    <p className="step-label">Steps</p>
                                </div>
                                <div className="circular-progress" style={{ background: `conic-gradient(#ff6b81 ${calculatePercentage(metrics.calories, goals.calories)}%, #ffecef 0)` }}>
                                    <p className="step-count">{metrics.calories}</p>
                                    <p className="step-label">Calories</p>
                                </div>
                                <div className="circular-progress" style={{ background: `conic-gradient(#7dcd40 ${calculatePercentage(metrics.activeTime, goals.activeTime)}%, #f0f9e8 0)` }}>
                                    <p className="step-count">{metrics.activeTime} min</p>
                                    <p className="step-label">Active Time</p>
                                </div>
                            </div>
                            
                            <div className="action-grid">
                                <Link to="/exercises" className="action-card exercise">
                                    <i className="icon">🏃‍♂️</i>
                                    <span>Exercise</span>
                                </Link>
                                <Link to="/nutrition" className="action-card nutrition">
                                    <i className="icon">🥗</i>
                                    <span>Nutrition</span>
                                </Link>
                                <Link to="/favorites" className="action-card favorites">
                                    <i className="icon">❤️</i>
                                    <span>Favorites</span>
                                </Link>
                                <Link to="/customize" className="action-card customize">
                                    <i className="icon">⚙️</i>
                                    <span>Settings</span>
                                </Link>
                            </div>
                        </div>
                    }
                />
                
                {/* Exercise Page */}
                <Route
                    path="/exercises"
                    element={
                        <div className="exercise-page">
                            <ExercisePage2 />
                        </div>
                    }
                />
                
                {/* Exercise Details Page */}
                <Route 
                    path="/exercise/:id" 
                    element={<ExerciseDetailsPage />} 
                />
                
                {/* Nutrition Page */}
                <Route 
                    path="/nutrition" 
                    element={
                        <div className="nutrition-page">
                            <NutritionPage />
                        </div>
                    } 
                />
                
                {/* Customization Page */}
                <Route 
                    path="/customize" 
                    element={
                        <div className="customize-page">
                            <div className="page-header">
                                <Link to="/" className="back-button">
                                    <i className="icon">←</i>
                                </Link>
                                <h2>Settings</h2>
                            </div>
                            <CustomizePage />
                        </div>
                    } 
                />
                
                {/* Favorites Page */}
                <Route 
                    path="/favorites" 
                    element={
                        <div className="favorites-page">
                            <FavoritesPage />
                        </div>
                    } 
                />
            </Routes>
        </div>
    );
}

export default App;