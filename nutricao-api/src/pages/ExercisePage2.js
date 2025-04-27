import { useState, useEffect } from "react";
import ExerciseCard from "./ExerciseCard";

function ExercisePage2() {
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(false);
    const [languageFilter, setLanguageFilter] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [categories, setCategories] = useState([]);
    const [nextExercisesLink, setNextExercisesLink] = useState('https://wger.de/api/v2/exerciseinfo/');
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        // Load favorites from localStorage on initial render
        const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        setFavorites(storedFavorites);
    }, []);

    const fetchExercises = async () => {
        if (!nextExercisesLink || loading) return; // Stop if no more pages or already loading
        setLoading(true);
        const apiCategoryUrl = 'https://wger.de/api/v2/exercisecategory/';
        const apiKey = process.env.REACT_APP_API_KEY;

        try {
            const response = await fetch(nextExercisesLink, {
                headers: {
                    Authorization: `Token ${apiKey}`,
                },
            });
            const data = await response.json();
            setExercises((prev) => [...prev, ...data.results]);
            setNextExercisesLink(data.next);

            // Fetch categories only once
            if (categories.length === 0) {
                const categoryResponse = await fetch(apiCategoryUrl, {
                    headers: {
                        Authorization: `Token ${apiKey}`,
                    },
                });
                const categoryData = await categoryResponse.json();
                setCategories(categoryData.results.map((category) => category.name));
            }
        } catch (error) {
            console.error('Error fetching exercises:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100 && !loading) {
                fetchExercises();
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loading, nextExercisesLink]);

    const toggleFavorite = (exerciseId) => {
        const updatedFavorites = favorites.includes(exerciseId)
            ? favorites.filter(id => id !== exerciseId)
            : [...favorites, exerciseId];
        setFavorites(updatedFavorites);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    };

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

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', padding: '16px', justifyContent: 'center' }}>
                <select
                    style={{ border: '1px solid #ccc', padding: '8px', borderRadius: '4px' }}
                    value={languageFilter}
                    onChange={(e) => setLanguageFilter(e.target.value)}
                >
                    <option value="">Todas as Línguas</option>
                    <option value="1">Alemão</option>
                    <option value="2">Inglês</option>
                </select>

                <select
                    style={{ border: '1px solid #ccc', padding: '8px', borderRadius: '4px' }}
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                >
                    <option value="">Todas as Categorias</option>
                    {categories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', padding: '16px' }}>
                {effectiveExercises.map((exercise) => (
                    <ExerciseCard
                        key={exercise.id}
                        exercise={exercise}
                        onFavoriteToggle={toggleFavorite}
                        isFavorite={favorites.includes(exercise.id)}
                    />
                ))}
                {loading && Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="exercise-card loading-placeholder">
                        <div className="loading-bar title-bar"></div>
                        <div className="loading-bar description-bar"></div>
                        <div className="loading-bar description-bar"></div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ExercisePage2;