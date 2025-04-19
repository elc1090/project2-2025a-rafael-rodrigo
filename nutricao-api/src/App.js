import React, { useEffect, useState } from 'react';
import './App.css';



function App() {
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

  {exercises.map((exercise) => {
    console.log(exercise.translations);
    const englishTranslation = exercise.translations.find(
      (translation) => translation.language === 2
    );
    return (
      <div key={exercise.id} className="exercise-item">
        <h3>{englishTranslation.name}</h3>
        <p>{englishTranslation.description || 'Sem descrição disponível.'}</p>
        {exercise.images.length > 0 && (
          <img
            src={exercise.images[0].image}
            alt={englishTranslation.name}
            className="exercise-image"
          />
        )}
      </div>
    );
  })}

  return (
    <div className="App">
      <header className="App-header">
        <h1>Exercícios</h1>
      </header>
      <main>
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <div className="exercise-list">
            {exercises.map((exercise) => (
              <div key={exercise.id} className="exercise-item">
                <h3>{exercise.translations[0].name}</h3>
                <p>{exercise.translations[0].description || 'Sem descrição disponível.'}</p>
                {exercise.images.length > 0 && (
                  <img
                    src={exercise.images[0].image}
                    alt={exercise.name}
                    className="exercise-image"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;