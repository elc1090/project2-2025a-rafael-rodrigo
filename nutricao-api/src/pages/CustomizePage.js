import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CustomizePage.css';

function CustomizePage() {
  const [profilePhoto, setProfilePhoto] = useState('/public/images/no_photo.png');
  const [stepGoal, setStepGoal] = useState(10000);
  const [activeTimeGoal, setActiveTimeGoal] = useState(60);
  const [calorieGoal, setCalorieGoal] = useState(2000);
  const [sleepGoal, setSleepGoal] = useState(8);
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Load saved profile data from localStorage
    const savedPhoto = localStorage.getItem('profilePhoto');
    const savedName = localStorage.getItem('name');
    const savedGender = localStorage.getItem('gender');
    const savedBirthDate = localStorage.getItem('birthDate');
    const savedStepGoal = localStorage.getItem('stepGoal');
    const savedActiveTimeGoal = localStorage.getItem('activeTimeGoal');
    const savedCalorieGoal = localStorage.getItem('calorieGoal');
    const savedSleepGoal = localStorage.getItem('sleepGoal');

    if (savedPhoto) setProfilePhoto(savedPhoto);
    if (savedName) setName(savedName);
    if (savedGender) setGender(savedGender);
    if (savedBirthDate) setBirthDate(savedBirthDate);
    if (savedStepGoal) setStepGoal(Number(savedStepGoal));
    if (savedActiveTimeGoal) setActiveTimeGoal(Number(savedActiveTimeGoal));
    if (savedCalorieGoal) setCalorieGoal(Number(savedCalorieGoal));
    if (savedSleepGoal) setSleepGoal(Number(savedSleepGoal));
  }, []);

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const photoUrl = reader.result;
        setProfilePhoto(photoUrl);
        localStorage.setItem('profilePhoto', photoUrl); // Save photo to localStorage
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // Save profile data to localStorage
    localStorage.setItem('name', name);
    localStorage.setItem('gender', gender);
    localStorage.setItem('birthDate', birthDate);
    localStorage.setItem('stepGoal', stepGoal);
    localStorage.setItem('activeTimeGoal', activeTimeGoal);
    localStorage.setItem('calorieGoal', calorieGoal);
    localStorage.setItem('sleepGoal', sleepGoal);

    // Show success message and redirect to home page
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
      navigate('/');
    }, 2000);
  };

  return (
    <div className="customize-page">
      <h1 className="page-title">Customize Your Profile</h1>
      
      <div className="profile-section">
        <div className="profile-photo-container">
          <label className="photo-upload-label">
            <img src={profilePhoto} alt="Profile" className="profile-photo" />
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handlePhotoChange}
            />
            <div className="photo-edit-icon">✎</div>
          </label>
        </div>
        
        <div className="basic-info">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="birthDate">Birth Date</label>
            <input
              id="birthDate"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      <div className="goals-section">
        <h2 className="section-title">Health Goals</h2>
        
        <div className="goal-card">
          <div className="goal-info">
            <span className="goal-icon">👟</span>
            <div>
              <h3>Step Goal</h3>
              <p>Daily steps target</p>
            </div>
          </div>
          <input
            type="number"
            value={stepGoal}
            onChange={(e) => setStepGoal(e.target.value)}
            className="goal-input"
          />
        </div>
        
        <div className="goal-card">
          <div className="goal-info">
            <span className="goal-icon">⏱️</span>
            <div>
              <h3>Active Time</h3>
              <p>Minutes per day</p>
            </div>
          </div>
          <input
            type="number"
            value={activeTimeGoal}
            onChange={(e) => setActiveTimeGoal(e.target.value)}
            className="goal-input"
          />
        </div>
        
        <div className="goal-card">
          <div className="goal-info">
            <span className="goal-icon">🔥</span>
            <div>
              <h3>Calorie Goal</h3>
              <p>Daily calories</p>
            </div>
          </div>
          <input
            type="number"
            value={calorieGoal}
            onChange={(e) => setCalorieGoal(e.target.value)}
            className="goal-input"
          />
        </div>
        
        <div className="goal-card">
          <div className="goal-info">
            <span className="goal-icon">😴</span>
            <div>
              <h3>Sleep Goal</h3>
              <p>Hours per night</p>
            </div>
          </div>
          <input
            type="number"
            value={sleepGoal}
            onChange={(e) => setSleepGoal(e.target.value)}
            className="goal-input"
            step="0.5"
            min="4"
            max="12"
          />
        </div>
      </div>
      
      <button className="save-button" onClick={handleSave}>
        Save Changes
      </button>
      {showSuccessMessage && (
        <div className="success-message">Changes saved successfully!</div>
      )}
    </div>
  );
}

export default CustomizePage;