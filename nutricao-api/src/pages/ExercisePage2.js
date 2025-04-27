import { useState, useEffect } from "react";
import ExerciseCard from "./ExerciseCard";

function ExercisePage2() {
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(false);
    const [languageFilter, setLanguageFilter] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [equipmentFilter, setEquipmentFilter] = useState("");
    const [categories, setCategories] = useState([]);
    const [nextExercisesLink, setNextExercisesLink] = useState('https://wger.de/api/v2/exerciseinfo/');
    const [favorites, setFavorites] = useState([]);

    const equipmentOptions = [
        "Barbell", "Bench", "Dumbbell", "Gym mat", "Incline bench",
        "Kettlebell", "Pull up bar", "SZ bar", "Swiss ball", "none"
    ];

    useEffect(() => {
        // Load favorites from localStorage on initial render
        const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        setFavorites(storedFavorites);
    }, []);

    const fetchExercises = async (initialLoad = false) => {
        if (!nextExercisesLink || loading) return; // Stop if no more pages or already loading
        setLoading(true);
        const apiCategoryUrl = 'https://wger.de/api/v2/exercisecategory/';
        const apiKey = process.env.REACT_APP_API_KEY;

        try {
            let loadedCount = 0;
            let currentLink = nextExercisesLink;
            const newExercises = [];

            while (initialLoad && loadedCount < 20 && currentLink) {
                const response = await fetch(currentLink, {
                    headers: {
                        Authorization: `Token ${apiKey}`,
                    },
                });
                const data = await response.json();
                newExercises.push(...data.results);
                currentLink = data.next;
                loadedCount += data.results.length;
            }

            if (!initialLoad) {
                const response = await fetch(nextExercisesLink, {
                    headers: {
                        Authorization: `Token ${apiKey}`,
                    },
                });
                const data = await response.json();
                newExercises.push(...data.results);
                currentLink = data.next;
            }

            setExercises((prev) => [...prev, ...newExercises]);
            setNextExercisesLink(currentLink);

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
        // Load at least 20 exercises on initial render
        fetchExercises(true);
    }, []);

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
    effectiveExercises = effectiveExercises.filter((exercise) => {
        return equipmentFilter ? exercise.equipment.some((eq) => eq.name === equipmentFilter) : true;
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

                <select
                    style={{ border: '1px solid #ccc', padding: '8px', borderRadius: '4px' }}
                    value={equipmentFilter}
                    onChange={(e) => setEquipmentFilter(e.target.value)}
                >
                    <option value="">Todos os Equipamentos</option>
                    {equipmentOptions.map((equipment) => (
                        <option key={equipment} value={equipment}>{equipment}</option>
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