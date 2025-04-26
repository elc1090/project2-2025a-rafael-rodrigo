// ExerciseCard.js
import React, { useState } from 'react';

function ExerciseCard({ exercise, onFavoriteToggle, isFavorite }) {

    const imageNotFoundImage = (
        <svg
            className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-1p9wzm4 exercise-placeholder"
            focusable="false"
            aria-hidden="true"
            viewBox="0 0 24 24"
        >
            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2M8.5 13.5l2.5 3.01L14.5 12l4.5 6H5z"></path>
        </svg>
    )

    const englishTranslation = exercise.translations.find(
        (translation) => translation.language === 2
    );
    const name = englishTranslation?.name || 'Name not available';
    const categories = exercise.category.name || 'Category not available';
    const image = exercise.images.length > 0 ? exercise.images[0].image : imageNotFoundImage;

    return (
        <div key={name} style={{ position: 'relative', border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '320px', textAlign: 'center' }}>
            <button onClick={() => onFavoriteToggle(exercise.id)}
                style={{ position: 'absolute', top: '8px', left: '8px', background: 'white', borderRadius: '50%', border: '1px solid #ccc', padding: '8px', cursor: 'pointer' }}>
                {isFavorite ? '⭐' : '☆'}
            </button>
            {
                exercise.images.length > 0 ? (
                    <img
                        src={image}
                        alt={name}
                        style={{ width: '100%', height: '160px', objectFit: 'contain' }}
                    />
                ) : (
                    <div style={{ width: '50%', height: '160px', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto' }}>
                        {image}
                    </div>
                )
            }
            <div style={{ padding: '16px', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h3 style={{ fontSize: '20px', margin: '8px 0' }}>{name}</h3>
                <p style={{ fontSize: '14px', color: '#777' }}>{categories}</p>
            </div>
        </div>
    );
}

export default ExerciseCard;
