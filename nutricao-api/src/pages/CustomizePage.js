import React, { useState } from 'react';
import './CustomizePage.css';

function CustomizePage() {
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [stepGoal, setStepGoal] = useState(5000);
  const [activeTimeGoal, setActiveTimeGoal] = useState(30);
  const [calorieGoal, setCalorieGoal] = useState(2000);

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePhoto(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    alert('Profile updated successfully!');
  };

  return (
    <div className="customize-page">
      <h1>Customize Your Profile</h1>
      <div className="profile-photo-section">
        <label htmlFor="profile-photo">
          <img
            src={profilePhoto || '/images/default-profile.png'}
            alt="Profile"
            className="profile-photo"
          />
        </label>
        <input
          type="file"
          id="profile-photo"
          accept="image/*"
          onChange={handlePhotoChange}
          style={{ display: 'none' }}
        />
      </div>
      <div className="goal-section">
        <label>
          Step Goal:
          <input
            type="number"
            value={stepGoal}
            onChange={(e) => setStepGoal(e.target.value)}
          />
        </label>
        <label>
          Active Time Goal (minutes):
          <input
            type="number"
            value={activeTimeGoal}
            onChange={(e) => setActiveTimeGoal(e.target.value)}
          />
        </label>
        <label>
          Calorie Goal:
          <input
            type="number"
            value={calorieGoal}
            onChange={(e) => setCalorieGoal(e.target.value)}
          />
        </label>
      </div>
      <button className="save-button" onClick={handleSave}>
        Save Changes
      </button>
    </div>
  );
}

export default CustomizePage;
