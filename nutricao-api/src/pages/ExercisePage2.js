import { useState, useEffect } from "react";
import ExerciseCard from "./ExerciseCard";
import './ExercisePage2.css';

function ExercisePage2() {
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(false);
    const [languageFilter, setLanguageFilter] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [equipmentFilter, setEquipmentFilter] = useState("");
    const [categories, setCategories] = useState([]);
    const [equipmentOptions, setEquipmentOptions] = useState([]);
    const [nextExercisesLink, setNextExercisesLink] = useState('https://wger.de/api/v2/exerciseinfo/');
    const [favorites, setFavorites] = useState([]);
    const [activeFilters, setActiveFilters] = useState(false);

    useEffect(() => {
        const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        setFavorites(storedFavorites);
    }, []);

    useEffect(() => {
        const fetchEquipment = async () => {
            const apiEquipmentUrl = 'https://wger.de/api/v2/equipment/';
            const apiKey = process.env.REACT_APP_API_KEY;

            try {
                const response = await fetch(apiEquipmentUrl, {
                    headers: {
                        Authorization: `Token ${apiKey}`,
                    },
                });
                const data = await response.json();
                setEquipmentOptions(data.results.map((equipment) => equipment.name));
            } catch (error) {
                console.error('Error fetching equipment:', error);
            }
        };

        fetchEquipment();
    }, []);

    const fetchExercises = async (initialLoad = false, reset = false, minExercises = 0) => {
        if ((!nextExercisesLink && !reset) || loading) return;
        setLoading(true);
        const apiCategoryUrl = 'https://wger.de/api/v2/exercisecategory/';
        const apiKey = process.env.REACT_APP_API_KEY;

        try {
            let loadedCount = 0;
            let currentLink = reset ? 'https://wger.de/api/v2/exerciseinfo/' : nextExercisesLink;
            const newExercises = [];
            let nextLink = null;

            while ((initialLoad && loadedCount < 20) || (minExercises > 0 && loadedCount < minExercises)) {
                if (!currentLink) break;
                
                const response = await fetch(currentLink, {
                    headers: {
                        Authorization: `Token ${apiKey}`,
                    },
                });
                const data = await response.json();
                newExercises.push(...data.results);
                currentLink = data.next;
                nextLink = data.next;
                loadedCount += data.results.length;
            }

            setExercises(reset ? newExercises : (prev) => [...prev, ...newExercises]);
            setNextExercisesLink(nextLink);

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
        fetchExercises(true);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100 && !loading) {
                if (activeFilters) {
                    fetchExercises(false, false, 5); // Load at least 5 exercises when filtered
                } else {
                    fetchExercises();
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loading, nextExercisesLink, activeFilters]);

    const handleFilterChange = (filterType, value) => {
        if (filterType === "language") setLanguageFilter(value);
        if (filterType === "category") setCategoryFilter(value);
        if (filterType === "equipment") setEquipmentFilter(value);

        const hasFilters = value || 
            (filterType === "language" ? categoryFilter || equipmentFilter : 
             filterType === "category" ? languageFilter || equipmentFilter : 
             languageFilter || categoryFilter);
        
        setActiveFilters(!!hasFilters);
        
        setExercises([]);
        setNextExercisesLink('https://wger.de/api/v2/exerciseinfo/');
        fetchExercises(false, true, hasFilters ? 10 : 0); // Load at least 10 exercises when filtered
    };

    const filteredExercises = exercises.filter((exercise) => {
        const categoryMatch = categoryFilter ? exercise.category.name === categoryFilter : true;
        const languageMatch = languageFilter ? exercise.translations.some((translation) => translation.language === parseInt(languageFilter)) : true;
        const equipmentMatch = equipmentFilter ? exercise.equipment.some((eq) => eq.name === equipmentFilter) : true;
        return categoryMatch && languageMatch && equipmentMatch;
    });

    return (
        <div className="exercise-page-container">
            <div className="exercise-page-header">
                <h1>Exercises</h1>
                <p>Find the perfect workout for your goals</p>
            </div>

            <div className="filters-container">
                <div className="filter-select">
                    <label htmlFor="language-filter">Language</label>
                    <select
                        id="language-filter"
                        value={languageFilter}
                        onChange={(e) => handleFilterChange("language", e.target.value)}
                    >
                        <option value="">All Languages</option>
                        <option value="1">German</option>
                        <option value="2">English</option>
                    </select>
                </div>

                <div className="filter-select">
                    <label htmlFor="category-filter">Category</label>
                    <select
                        id="category-filter"
                        value={categoryFilter}
                        onChange={(e) => handleFilterChange("category", e.target.value)}
                    >
                        <option value="">All Categories</option>
                        {categories.map((category) => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-select">
                    <label htmlFor="equipment-filter">Equipment</label>
                    <select
                        id="equipment-filter"
                        value={equipmentFilter}
                        onChange={(e) => handleFilterChange("equipment", e.target.value)}
                    >
                        <option value="">All Equipment</option>
                        {equipmentOptions.map((equipment) => (
                            <option key={equipment} value={equipment}>{equipment}</option>
                        ))}
                    </select>
                </div>
            </div>

            {filteredExercises.length === 0 && !loading ? (
                <div className="no-results">
                    <p>No exercises found matching your filters</p>
                    <button 
                        className="clear-filters-button"
                        onClick={() => {
                            setLanguageFilter("");
                            setCategoryFilter("");
                            setEquipmentFilter("");
                            setActiveFilters(false);
                            setExercises([]);
                            setNextExercisesLink('https://wger.de/api/v2/exerciseinfo/');
                            fetchExercises(true);
                        }}
                    >
                        Clear Filters
                    </button>
                </div>
            ) : (
                <div className="exercises-grid">
                    {filteredExercises.map((exercise) => (
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
                    {loading && Array.from({ length: activeFilters ? 5 : 3 }).map((_, index) => (
                        <div key={`loading-${index}`} className="exercise-card loading-placeholder">
                            <div className="loading-bar title-bar"></div>
                            <div className="loading-bar description-bar"></div>
                            <div className="loading-bar description-bar"></div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ExercisePage2;