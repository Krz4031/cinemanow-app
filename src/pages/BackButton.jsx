import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BackButton.css';

const BackButton = () => {
    const navigate = useNavigate();

    return (
        <div className="back-container">
            <button className="back-btn" onClick={() => navigate(-1)}>
                <span className="arrow">‹</span> ย้อนกลับ
            </button>
        </div>
    );
};

export default BackButton;