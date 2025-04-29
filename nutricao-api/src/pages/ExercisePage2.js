import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
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
    const navigate = useNavigate();

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

    const fetchExercises = async (reset = false, url = null) => {
        if (loading) return;
        setLoading(true);
        const apiKey = process.env.REACT_APP_API_KEY;
        const apiCategoryUrl = 'https://wger.de/api/v2/exercisecategory/';

        try {
            const currentLink = url || (reset ? 'https://wger.de/api/v2/exerciseinfo/' : nextExercisesLink);
            if (!currentLink) return;

            const response = await fetch(currentLink, {
                headers: { Authorization: `Token ${apiKey}` },
            });
            const data = await response.json();

            setExercises(prev => reset ? data.results : [...prev, ...data.results]);
            setNextExercisesLink(data.next);

            if (categories.length === 0) {
                const categoryResponse = await fetch(apiCategoryUrl, {
                    headers: { Authorization: `Token ${apiKey}` },
                });
                const categoryData = await categoryResponse.json();
                setCategories(categoryData.results.map(c => c.name));
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
            if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100 && !loading && nextExercisesLink) {
                fetchExercises();
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loading, nextExercisesLink]);

    const handleFilterChange = (filterType, value) => {
        // Update the filter state
        if (filterType === "language") setLanguageFilter(value);
        if (filterType === "category") setCategoryFilter(value);
        if (filterType === "equipment") setEquipmentFilter(value);

        // Reset and fetch new exercises
        setExercises([]);
        setNextExercisesLink('https://wger.de/api/v2/exerciseinfo/');
        fetchExercises(true);
    };

    const clearFilters = () => {
        setLanguageFilter("");
        setCategoryFilter("");
        setEquipmentFilter("");
        setExercises([]);
        setNextExercisesLink('https://wger.de/api/v2/exerciseinfo/');
        fetchExercises(true);
    };

    const filteredExercises = exercises.filter(exercise => {
        const categoryMatch = categoryFilter ? exercise.category.name === categoryFilter : true;
        const languageMatch = languageFilter ? exercise.translations.some(t => t.language === parseInt(languageFilter)) : true;
        const equipmentMatch = equipmentFilter ? exercise.equipment.some(eq => eq.name === equipmentFilter) : true;
        return categoryMatch && languageMatch && equipmentMatch;
    });

    const hasFilters = languageFilter || categoryFilter || equipmentFilter;

    return (
        <div className="exercise-page-container">
            <div className="exercise-page-header">
                <button onClick={() => navigate('/')} className="back-button">
                    ←
                </button>
                <div className="header-text">
                    <h1>Exercises</h1>
                    <p>Find the perfect workout for your goals</p>
                </div>
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

                {hasFilters && (
                    <button className="clear-filters-button" onClick={clearFilters}>
                        Clear Filters
                    </button>
                )}
            </div>

            {filteredExercises.length === 0 && !loading ? (
                <div className="no-results">
                    <p>No exercises found{hasFilters ? " matching your filters" : ""}</p>
                    {hasFilters && (
                        <button className="clear-filters-button" onClick={clearFilters}>
                            Clear Filters
                        </button>
                    )}
                </div>
            ) : (
                <div className="exercises-grid">
                    {filteredExercises.map((exercise) => (
                        <Link to={`/exercise/${exercise.id}`} key={exercise.id} className="exercise-link">
                            <ExerciseCard
                                exercise={exercise}
                                onFavoriteToggle={(id) => {
                                    const updatedFavorites = favorites.includes(id)
                                        ? favorites.filter(favId => favId !== id)
                                        : [...favorites, id];
                                    setFavorites(updatedFavorites);
                                    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
                                }}
                                isFavorite={favorites.includes(exercise.id)}
                            />
                        </Link>
                    ))}
                    {loading && Array.from({ length: 3 }).map((_, index) => (
                        <div key={`loading-${index}`} className="exercise-card loading-placeholder">
                            <div className="loading-bar title-bar"></div>
                            <div className="loading-bar description-bar"></div>
                            <div className="loading-bar description-bar"></div>
                        </div>
                    ))}
                </div>
            )}

            {loading && filteredExercises.length > 0 && (
                <div className="loading-more">
                    Loading more exercises...
                </div>
            )}
        </div>
    );
}

export default ExercisePage2;