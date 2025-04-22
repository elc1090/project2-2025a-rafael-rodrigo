import React, { useEffect, useState } from 'react';
import '../App.css'; // Certifique-se de ajustar o caminho para o CSS, se necessário.

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
        console.error('Erro ao buscar os exercícios:', error);
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
            const portugueseTranslation = exercise.translations.find(
              (translation) => translation.language === 2
            );

            const name = portugueseTranslation?.name || 'Nome não disponível';
            const description =
              portugueseTranslation?.description || 'Descrição não disponível';

            return (
              <div key={exercise.id} className="exercise-item">
                <h3>{name}</h3>
                <p>{description}</p>
                {exercise.images.length > 0 && (
                  <img
                    src={exercise.images[0].image}
                    alt={name}
                    className="exercise-image"
                  />
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