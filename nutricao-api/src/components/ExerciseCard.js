import React from 'react';
import './ExerciseCard.css';

function ExerciseCard({ exercise, isFavorite, onFavoriteToggle }) {
    return (
        <div className="exercise-card">
            <h3>{exercise.name}</h3>
            <p>{exercise.description}</p>
            <button
                className={`favorite-button ${isFavorite ? 'favorited' : ''}`}
                onClick={(event) => {
                    event.stopPropagation(); // Prevent the click from propagating to the card
                    onFavoriteToggle(exercise.id, event); // Pass the event to the handler
                }}
            >
                {isFavorite ? 'Unfavorite' : 'Favorite'}
            </button>
        </div>
    );
}

export default ExerciseCard;