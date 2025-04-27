import React, { useState, useEffect } from 'react';
import ExerciseCard from './ExerciseCard';

function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [favoriteExercises, setFavoriteExercises] = useState([]);
  const [loading, setLoading] = useState(true);

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
    <div style={{ minHeight: '100vh', padding: '16px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '24px' }}>Favorite Exercises</h1>
      {loading ? (
        <p style={{ textAlign: 'center' }}>Loading...</p>
      ) : favoriteExercises.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
          {favoriteExercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              onFavoriteToggle={(id) => {
                const updatedFavorites = favorites.includes(id)
                  ? favorites.filter((favId) => favId !== id)
                  : [...favorites, id];
                setFavorites(updatedFavorites);
                localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
              }}
              isFavorite={favorites.includes(exercise.id)}
            />
          ))}
        </div>
      ) : (
        <p style={{ textAlign: 'center' }}>You have no favorite exercises.</p>
      )}
    </div>
  );
}

export default FavoritesPage;
