import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "./ExerciseDetailsPage.css";

function ExerciseDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [exercise, setExercise] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timer, setTimer] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        const fetchExerciseDetails = async () => {
            const apiUrl = `https://wger.de/api/v2/exerciseinfo/${id}/`;
            const apiKey = process.env.REACT_APP_API_KEY;

            try {
                const response = await fetch(apiUrl, {
                    headers: {
                        Authorization: `Token ${apiKey}`,
                    },
                });
                const data = await response.json();
                setExercise(data);
            } catch (error) {
                console.error("Error fetching exercise details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchExerciseDetails();
    }, [id]);

    const handleStartTimer = () => {
        if (timer > 0) {
            setIsRunning(true);
        }
    };

    useEffect(() => {
        let interval;
        if (isRunning && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0 && isRunning) {
            clearInterval(interval);
            setIsRunning(false);

            // Update total active time in localStorage
            const storedMetrics = JSON.parse(localStorage.getItem("metrics")) || { activeTime: 0 };
            const updatedMetrics = {
                ...storedMetrics,
                activeTime: storedMetrics.activeTime + parseInt(timer),
            };
            localStorage.setItem("metrics", JSON.stringify(updatedMetrics));

            // Show completion message before redirect
            setTimeout(() => navigate("/"), 1500);
        }
        return () => clearInterval(interval);
    }, [isRunning, timer, navigate]);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading exercise details...</p>
            </div>
        );
    }

    if (!exercise) {
        return (
            <div className="not-found-container">
                <h2>Exercise not found</h2>
                <Link to="/" className="back-button">← Back to Exercises</Link>
            </div>
        );
    }

    const { translations, category, equipment, muscles, muscles_secondary, images } = exercise;
    const translation = translations.find((t) => t.language === 2); // English translation

    return (
        <div className="exercise-details-container">
            <div className="exercise-header">
                <Link to="/exercises" className="back-button">←</Link>
                <h1>{translation?.name || "Exercise Details"}</h1>
            </div>

            <div className="exercise-content">
                {images.length > 0 && (
                    <div className="exercise-image-container">
                        <img src={images[0].image} alt="Exercise demonstration" className="exercise-main-image" />
                    </div>
                )}

                <div className="exercise-description">
                    <h3>Description</h3>
                    <p dangerouslySetInnerHTML={{ __html: translation?.description || "No description available." }}></p>
                </div>

                <div className="exercise-details-card">
                    <h3>Exercise Details</h3>
                    <div className="detail-item">
                        <span className="detail-label">Category:</span>
                        <span className="detail-value">{category?.name || "N/A"}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Equipment:</span>
                        <span className="detail-value">{equipment.map((eq) => eq.name).join(", ") || "None"}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Primary Muscles:</span>
                        <span className="detail-value">{muscles.map((m) => m.name).join(", ") || "None"}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Secondary Muscles:</span>
                        <span className="detail-value">{muscles_secondary.map((m) => m.name).join(", ") || "None"}</span>
                    </div>
                </div>

                <div className="timer-card">
                    <h3>Workout Timer</h3>
                    <div className="timer-input">
                        <input
                            type="number"
                            min="1"
                            max="60"
                            placeholder="Minutes"
                            value={Math.floor(timer / 60)}
                            onChange={(e) => setTimer(e.target.value * 60)}
                            disabled={isRunning}
                        />
                        <button 
                            onClick={handleStartTimer} 
                            disabled={isRunning || timer <= 0}
                            className={isRunning ? "timer-button active" : "timer-button"}
                        >
                            {isRunning ? "Timer Running" : "Start Timer"}
                        </button>
                    </div>
                    {isRunning && (
                        <div className="timer-display">
                            <div className="time-remaining">
                                {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")}
                            </div>
                            <div className="timer-progress">
                                <div 
                                    className="progress-bar" 
                                    style={{ width: `${(timer / (Math.floor(timer / 60) * 60)) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ExerciseDetailsPage;