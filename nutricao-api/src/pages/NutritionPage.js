import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './NutritionPage.css';

function NutritionPage() {
    const [foods, setFoods] = useState([]);
    const [nutritionPlans, setNutritionPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [activeTab, setActiveTab] = useState('today');
    const [newMeal, setNewMeal] = useState({
        name: '',
        time: '',
        items: []
    });
    const [selectedFood, setSelectedFood] = useState('');
    const [quantity, setQuantity] = useState(100);
    const [allMeals, setAllMeals] = useState({}); // Objeto para armazenar todas as refeições por data

    // Carrega todas as refeições salvas no localStorage ao iniciar
    useEffect(() => {
        const savedMeals = localStorage.getItem('nutritionData');
        if (savedMeals) {
            setAllMeals(JSON.parse(savedMeals));
        }

        const fetchNutritionData = async () => {
            const apiKey = process.env.REACT_APP_API_KEY;
            
            try {
                // Fetch common foods
                const foodsResponse = await fetch('https://wger.de/api/v2/ingredient/?limit=100', {
                    headers: { Authorization: `Token ${apiKey}` }
                });
                const foodsData = await foodsResponse.json();
                setFoods(foodsData.results);

                // Fetch nutrition plans
                const plansResponse = await fetch('https://wger.de/api/v2/nutritionplan/', {
                    headers: { Authorization: `Token ${apiKey}` }
                });
                const plansData = await plansResponse.json();
                setNutritionPlans(plansData.results);

            } catch (error) {
                console.error('Error fetching nutrition data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNutritionData();
    }, []);

    // Atualiza as refeições quando a data selecionada ou allMeals muda
    const meals = allMeals[selectedDate] || [];

    const calculateDailyNutrition = () => {
        let calories = 0;
        let protein = 0;
        let carbs = 0;
        let fat = 0;

        meals.forEach(meal => {
            meal.items.forEach(item => {
                const food = foods.find(f => f.id === item.foodId) || item;
                const multiplier = item.quantity / 100;
                calories += (food.energy || 0) * multiplier;
                protein += (food.protein || 0) * multiplier;
                carbs += (food.carbohydrates || 0) * multiplier;
                fat += (food.fat || 0) * multiplier;
            });
        });

        return { calories, protein, carbs, fat };
    };

    const dailyNutrition = calculateDailyNutrition();

    const handleAddFood = () => {
        if (!selectedFood) return;
        
        const food = foods.find(f => f.id === parseInt(selectedFood));
        if (!food) return;

        setNewMeal(prev => ({
            ...prev,
            items: [...prev.items, {
                ...food,
                foodId: food.id,
                quantity: quantity
            }]
        }));
    };

    const handleRemoveFood = (index) => {
        setNewMeal(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index)
        }));
    };

    const handleSaveMeal = () => {
        if (!newMeal.name || newMeal.items.length === 0) return;

        const updatedAllMeals = {
            ...allMeals,
            [selectedDate]: [
                ...(allMeals[selectedDate] || []),
                {
                    ...newMeal,
                    id: Date.now(),
                    date: selectedDate
                }
            ]
        };

        setAllMeals(updatedAllMeals);
        localStorage.setItem('nutritionData', JSON.stringify(updatedAllMeals));
        
        setNewMeal({
            name: '',
            time: '',
            items: []
        });
    };

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    const handleDeleteMeal = (mealId) => {
        const updatedAllMeals = {
            ...allMeals,
            [selectedDate]: allMeals[selectedDate].filter(meal => meal.id !== mealId)
        };

        setAllMeals(updatedAllMeals);
        localStorage.setItem('nutritionData', JSON.stringify(updatedAllMeals));
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading nutrition data...</p>
            </div>
        );
    }

    return (
        <div className="nutrition-page">
            <div className="nutrition-header">
                <Link to="/" className="back-button">←</Link>
                <h1>Nutrition</h1>
                <p>Track your daily food intake and nutrition</p>
                <div className="date-selector">
                    <label htmlFor="date">Select Date: </label>
                    <input 
                        type="date" 
                        id="date"
                        value={selectedDate}
                        onChange={handleDateChange}
                        max={new Date().toISOString().split('T')[0]} // Não permite datas futuras
                    />
                </div>
            </div>

            <div className="nutrition-tabs">
                <button 
                    className={`tab-button ${activeTab === 'today' ? 'active' : ''}`}
                    onClick={() => setActiveTab('today')}
                >
                    Today
                </button>
                <button 
                    className={`tab-button ${activeTab === 'foods' ? 'active' : ''}`}
                    onClick={() => setActiveTab('foods')}
                >
                    Foods
                </button>
                <button 
                    className={`tab-button ${activeTab === 'plans' ? 'active' : ''}`}
                    onClick={() => setActiveTab('plans')}
                >
                    Plans
                </button>
            </div>

            {activeTab === 'today' && (
                <div className="today-nutrition">
                    <div className="nutrition-summary-card">
                        <h3>Daily Summary - {new Date(selectedDate).toLocaleDateString()}</h3>
                        <div className="nutrition-macros">
                            <div className="macro-item">
                                <div className="macro-value">{dailyNutrition.calories.toFixed(0)}</div>
                                <div className="macro-label">Calories</div>
                            </div>
                            <div className="macro-item">
                                <div className="macro-value">{dailyNutrition.protein.toFixed(0)}g</div>
                                <div className="macro-label">Protein</div>
                            </div>
                            <div className="macro-item">
                                <div className="macro-value">{dailyNutrition.carbs.toFixed(0)}g</div>
                                <div className="macro-label">Carbs</div>
                            </div>
                            <div className="macro-item">
                                <div className="macro-value">{dailyNutrition.fat.toFixed(0)}g</div>
                                <div className="macro-label">Fat</div>
                            </div>
                        </div>
                    </div>

                    <div className="add-meal-section">
                        <h3>Add New Meal</h3>
                        <div className="meal-form">
                            <div className="form-group">
                                <label>Meal Name</label>
                                <input 
                                    type="text" 
                                    value={newMeal.name}
                                    onChange={(e) => setNewMeal({...newMeal, name: e.target.value})}
                                    placeholder="Breakfast, Lunch, etc."
                                />
                            </div>
                            <div className="form-group">
                                <label>Time</label>
                                <input 
                                    type="time" 
                                    value={newMeal.time}
                                    onChange={(e) => setNewMeal({...newMeal, time: e.target.value})}
                                />
                            </div>
                            <div className="form-group">
                                <label>Add Food Item</label>
                                <div className="food-selector">
                                    <select
                                        value={selectedFood}
                                        onChange={(e) => setSelectedFood(e.target.value)}
                                    >
                                        <option value="">Select a food</option>
                                        {foods.map(food => (
                                            <option key={food.id} value={food.id}>
                                                {food.name} ({food.energy || 0}kcal)
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => setQuantity(e.target.value)}
                                        min="1"
                                        placeholder="Quantity (g)"
                                    />
                                    <button onClick={handleAddFood}>Add</button>
                                </div>
                            </div>

                            {newMeal.items.length > 0 && (
                                <div className="added-items">
                                    <h4>Items in this meal:</h4>
                                    <ul>
                                        {newMeal.items.map((item, index) => (
                                            <li key={index}>
                                                <span>
                                                    {item.name} - {item.quantity}g (
                                                    {((item.energy || 0) * item.quantity / 100).toFixed(0)}kcal, 
                                                    {((item.protein || 0) * item.quantity / 100).toFixed(1)}gP, 
                                                    {((item.carbohydrates || 0) * item.quantity / 100).toFixed(1)}gC, 
                                                    {((item.fat || 0) * item.quantity / 100).toFixed(1)}gF)
                                                </span>
                                                <button onClick={() => handleRemoveFood(index)}>×</button>
                                            </li>
                                        ))}
                                    </ul>
                                    <button 
                                        className="save-meal-button"
                                        onClick={handleSaveMeal}
                                    >
                                        Save Meal
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="meals-container">
                <h3>Meals for {new Date(selectedDate).toLocaleDateString()}</h3>
                {meals.length > 0 ? (
                    meals.map(meal => (
                        <div key={meal.id} className="meal-card">
                            <div className="meal-header">
                                <h4>{meal.name}</h4>
                                <div>
                                    <span className="meal-time">{meal.time}</span>
                                    <button 
                                        className="delete-meal-button"
                                        onClick={() => handleDeleteMeal(meal.id)}
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>
                            <ul className="meal-items">
                                {meal.items.map((item, index) => {
                                    const food = foods.find(f => f.id === item.foodId) || item;
                                    return (
                                        <li key={index} className="meal-item">
                                            <span className="item-name">
                                                {food.name} ({item.quantity}g)
                                            </span>
                                            <span className="item-calories">
                                                {((food.energy || 0) * item.quantity / 100).toFixed(0)} kcal | 
                                                P: {((food.protein || 0) * item.quantity / 100).toFixed(1)}g | 
                                                C: {((food.carbohydrates || 0) * item.quantity / 100).toFixed(1)}g | 
                                                F: {((food.fat || 0) * item.quantity / 100).toFixed(1)}g
                                            </span>
                                        </li>
                                    );
                                })}
                            </ul>
                            <div className="meal-total">
                                Total: {meal.items.reduce((sum, item) => {
                                    const food = foods.find(f => f.id === item.foodId) || item;
                                    return sum + ((food.energy || 0) * item.quantity / 100);
                                }, 0).toFixed(0)} kcal
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="no-meals">No meals recorded for this day</p>
                )}
            </div>
                </div>
            )}

            {activeTab === 'foods' && (
                <div className="foods-container">
                    <h3>Food Database</h3>
                    <div className="food-search">
                        <input type="text" placeholder="Search foods..." />
                    </div>
                    <div className="foods-grid">
                        {foods.map(food => (
                            <div key={food.id} className="food-card">
                                <h4>{food.name}</h4>
                                <div className="food-macros">
                                    <span>{food.energy || 0} kcal</span>
                                    <span>P: {food.protein || 0}g</span>
                                    <span>C: {food.carbohydrates || 0}g</span>
                                    <span>F: {food.fat || 0}g</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'plans' && (
                <div className="plans-container">
                    <h3>Nutrition Plans</h3>
                    {nutritionPlans.length > 0 ? (
                        nutritionPlans.map(plan => (
                            <div key={plan.id} className="plan-card">
                                <h4>{plan.description}</h4>
                                <p>Created: {new Date(plan.creation_date).toLocaleDateString()}</p>
                            </div>
                        ))
                    ) : (
                        <p className="no-plans">No nutrition plans available</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default NutritionPage;