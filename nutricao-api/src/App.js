// filepath: c:\Users\naoca\Documents\GitHub\project2-2025a-rafael-rodrigo\nutricao-api\src\App.js
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import ExercisePage from './pages/ExercisePage';
import ExercisePage2 from './pages/ExercisePage2';
import NutritionPage from './pages/NutritionPage';
import CustomizePage from './pages/CustomizePage'; // Import da nova página
import ExerciseCard from './pages/ExerciseCard';

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

    const [favorites, setFavorites] = useState([]);
    const [favoriteExercises, setFavoriteExercises] = useState([]);
    const [favoriteLoading, setFavoriteLoading] = useState(true);

    useEffect(() => {
        // Carrega os favoritos do localStorage na primeira renderização
        const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        setFavorites(storedFavorites);
    }, []);

    useEffect(() => {
        // Generate random values for simulation
        const randomMetrics = {
            steps: Math.floor(Math.random() * goals.steps),
            calories: Math.floor(Math.random() * goals.calories),
            activeTime: Math.floor(Math.random() * goals.activeTime),
        };
        setMetrics(randomMetrics);
    }, []);

    useEffect(() => {
        async function fetchExercise(id) {
            const apiUrl = 'https://wger.de/api/v2/exerciseinfo/' + id + '/';
            const apiKey = process.env.REACT_APP_API_KEY;

            try{
                let response = await fetch(apiUrl, {
                    headers: {
                        Authorization: `Token ${apiKey}`,
                    },
                });
                let data = await response.json();
                return data; // n eh results aqui
            }catch(error){
                console.log(error);
            }
        }
        const exs = favorites.map((exerciseId) => fetchExercise(exerciseId));
        Promise.all(exs).then((exercises) => {
            setFavoriteExercises(exercises);
            setFavoriteLoading(false);
            console.log("carregou favoritos:", exercises); // Verifica o que está sendo salvo
        });
    }, [favorites]);

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

                            {/* aqui vai ir o treino atual */}
                            <div>

                            </div>

                            {/* aqui vai ir os treinos favoritados */}
                            <h2>Favorite Exercises</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', padding: '16px' }}>
                                {
                                    favoriteExercises.map((exercise) => (
                                        <ExerciseCard key={exercise.id}
                                            exercise={exercise}
                                            onFavoriteToggle={(id) => {
                                                const newFavorites = favorites.includes(id) ? favorites.filter((favId) => favId !== id) : [...favorites, id];
                                                setFavorites(newFavorites);
                                                localStorage.setItem('favorites', JSON.stringify(newFavorites));
                                            }}
                                            isFavorite={favorites.includes(exercise.id)} />
                                    ))
                                    
                                }
                            </div>
                        </div>
                    }
                />
                {/* Página de Exercícios */}
                <Route path="/exercises" element={<ExercisePage2 />} />
                {/* Página de Nutrição */}
                <Route path="/nutrition" element={<NutritionPage />} />
                {/* Página de Customização */}
                <Route path="/customize" element={<CustomizePage />} />
            </Routes>
        </div>
    );
}

export default App;