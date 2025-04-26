import { useState, useEffect } from "react";
import ExerciseCard from "./ExerciseCard";

function ExercisePage2() {

    function toggleFavorite(exerciseId) {
        const updatedFavorites = favorites.includes(exerciseId)
                ? favorites.filter(id => id !== exerciseId)
                : [...favorites, exerciseId];
        setFavorites(updatedFavorites);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        console.log("Salvei favoritos:", updatedFavorites);  // Verifica o que está sendo salvo
    }
    
    
    
    
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [languageFilter, setLanguageFilter] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [categories, setCategories] = useState([]);
    const [nextExercisesLink, setNextExercisesLink] = useState(null);
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        // Carrega os favoritos do localStorage na primeira renderização
        const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        setFavorites(storedFavorites);
    }, []);

    useEffect(() => {
        async function fetchExercises() {
            const apiUrl = 'https://wger.de/api/v2/exerciseinfo/';
            const apiCategoryUrl = 'https://wger.de/api/v2/exercisecategory/';
            const apiKey = process.env.REACT_APP_API_KEY;

            try {
                let response = await fetch(apiUrl, {
                    headers: {
                        Authorization: `Token ${apiKey}`,
                    },
                });
                let data = await response.json();
                setExercises(data.results);
                setNextExercisesLink(data.next);

                // procura as categorias
                response = await fetch(apiCategoryUrl, {
                    headers: {
                        Authorization: `Token ${apiKey}`,
                    }
                });
                data = await response.json();
                setCategories(data.results.map((category) => {
                    return category.name
                }));
            } catch (error) {
                console.error('Error searching for exercises', error);
                return [];
            }
        }
        fetchExercises()
        setLoading(false);
    }, []);

    let effectiveExercises = exercises.filter((exercise) => {
        return categoryFilter ? exercise.category.name === categoryFilter : true;
    });
    effectiveExercises = effectiveExercises.filter((exercise) => {
        return languageFilter ? exercise.translations.some((translation) => translation.language === parseInt(languageFilter)) : true;
    });

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ backgroundColor: '#ccc', padding: '24px 0', textAlign: 'center', fontSize: '24px', fontWeight: 'bold' }}>
                Exercícios
            </div>

            {
                loading ? (
                    <div style={{ textAlign: 'center', padding: '24px' }}>
                        <p style={{ fontSize: '18px' }}>Carregando...</p>
                    </div>
                ) : (
                    <div style={{ padding: '24px', textAlign: 'center' }}>
                        <p style={{ fontSize: '18px' }}>Total de Exercícios: {effectiveExercises.length}</p>
                    </div>
                )
            }

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', padding: '16px', justifyContent: 'center' }}>
                <select
                    style={{ border: '1px solid #ccc', padding: '8px', borderRadius: '4px' }}
                    value={languageFilter}
                    onChange={
                        (e) => {
                            setLanguageFilter(e.target.value)
                        }
                    }
                >
                    <option value="">Todas as Línguas</option>
                    <option value="1">Alemão</option>
                    <option value="2">Inglês</option>
                </select>

                <select
                    style={{ border: '1px solid #ccc', padding: '8px', borderRadius: '4px' }}
                    value={categoryFilter}
                    onChange={(e) => {
                        setCategoryFilter(e.target.value)
                    }}
                >
                    <option value="">Todas as Categorias</option>
                    {
                        categories.map((category) => {
                            return (
                                <option key={category} value={category}>{category}</option>
                            )
                        })
                    }
                </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', padding: '16px' }}>
                {
                    effectiveExercises.map((exercise) => (
                        <ExerciseCard key={exercise.id} 
                            exercise={exercise} 
                            onFavoriteToggle={toggleFavorite} 
                            isFavorite={favorites.includes(exercise.id)}/>
                    ))
                }
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', padding: '24px' }}>
                <button style={{ padding: '8px 16px', border: '1px solid #ccc', borderRadius: '4px', background: '#007bff', color: 'white', cursor: 'pointer' }}
                    onClick={() => {
                        async function loadMore() {
                            const apiKey = process.env.REACT_APP_API_KEY;
                            try {
                                const response = await fetch(nextExercisesLink, {
                                    headers: {
                                        Authorization: `Token ${apiKey}`,
                                    },
                                });
                                const data = await response.json();
                                const newEx = exercises.concat(data.results);
                                setExercises(newEx);
                                setNextExercisesLink(data.next);
                            } catch (error) {

                            } finally {

                            }
                        }

                        setLoading(true);
                        loadMore();
                        setLoading(false);
                    }}>Carregar mais</button>
            </div>
        </div>
    );
}

export default ExercisePage2;