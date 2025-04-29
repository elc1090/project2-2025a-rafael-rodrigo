import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ExerciseCard from './ExerciseCard';
import './FavoritesPage.css';

function FavoritesPage() {
    const [favorites, setFavorites] = useState([]);
    const [favoriteExercises, setFavoriteExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Load favorites from localStorage
        const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        setFavorites(storedFavorites);
    }, []);

    useEffect(() => {
        const fetchFavoriteExercises = async () => {
            const apiKey = process.env.REACT_APP_API_KEY;
            const fetchedExercises = await Promise.all(
                favorites.map(async (id) => {
                    try {
                        const response = await fetch(`https://wger.de/api/v2/exerciseinfo/${id}/`, {
                            headers: {
                                Authorization: `Token ${apiKey}`,
                            },
                        });
                        return await response.json();
                    } catch (error) {
                        console.error('Error fetching favorite exercise:', error);
                        return null;
                    }
                })
            );
            setFavoriteExercises(fetchedExercises.filter((exercise) => exercise !== null));
            setLoading(false);
        };

        if (favorites.length > 0) {
            fetchFavoriteExercises();
        } else {
            setLoading(false);
        }
    }, [favorites]);

    return (
        <div className="favorites-page-container">
            <div className="favorites-header">
                <Link to="/" className="back-button">←</Link>
                <h1>Favorite Exercises</h1>
                <p>View and manage your favorite exercises</p>
            </div>

            {loading ? (
                <p className="loading-text">Loading...</p>
            ) : favoriteExercises.length > 0 ? (
                <div className="favorites-grid">
                    {favoriteExercises.map((exercise) => (
                        <div
                            key={exercise.id}
                            className="exercise-card-container"
                            onClick={() => navigate(`/exercise/${exercise.id}`)} // Navigate to exercise details
                        >
                            <ExerciseCard
                                exercise={exercise}
                                onFavoriteToggle={(id, event) => {
                                    if (event) event.stopPropagation(); // Prevent navigation when clicking the favorite button
                                    const updatedFavorites = favorites.includes(id)
                                        ? favorites.filter((favId) => favId !== id)
                                        : [...favorites, id];
                                    setFavorites(updatedFavorites);
                                    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
                                }}
                                isFavorite={favorites.includes(exercise.id)}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <p className="no-favorites-text">You have no favorite exercises.</p>
            )}
        </div>
    );
}

export default FavoritesPage;
