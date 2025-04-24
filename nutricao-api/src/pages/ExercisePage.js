import React, { useEffect, useState } from 'react';
import '../App.css'; 

function ExercisePage() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchExercises() {
      const apiUrl = 'https://wger.de/api/v2/exerciseinfo/';
      const apiKey = process.env.REACT_APP_API_KEY;

      try {
        const response = await fetch(apiUrl, {
          headers: {
            Authorization: `Token ${apiKey}`,
          },
        });
        const data = await response.json();
        const filteredExercises = data.results.filter((exercise) =>
          exercise.translations.some((translation) => translation.language === 2)
        );
        setExercises(filteredExercises);
      } catch (error) {
        console.error('Error searching for exercises', error);
      } finally {
        setLoading(false);
      }
    }

    fetchExercises();
  }, []);

  return (
    <div className="exercise-page">
      <h1>Página de Exercícios</h1>
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className="exercise-list">
          {exercises.map((exercise) => {
            const englishTranslation = exercise.translations.find(
              (translation) => translation.language === 2
            );

            const name = englishTranslation?.name || 'Name not available';
            const categories = exercise.category.name;

            return (
              <div key={exercise.id} className="exercise-item">
                <h3>{name}</h3>
                <p>{categories}</p>
                {exercise.images.length > 0 ? (
                  <img
                    src={exercise.images[0].image}
                    alt={name}
                    className="exercise-image"
                  />
                ) : (
                  // Exibe o ícone SVG se não houver imagens
                  <svg
                    className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-1p9wzm4 exercise-placeholder"
                    focusable="false"
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                  >
                    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2M8.5 13.5l2.5 3.01L14.5 12l4.5 6H5z"></path>
                  </svg>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ExercisePage;