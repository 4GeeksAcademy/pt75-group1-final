import React from "react";

const getBiteMessage = (count) => {
    if (count >= 100) return "🥳 Legend! You've devoured 100+!";
    if (count >= 75) return "🔥 You're on fire!";
    if (count >= 50) return "😋 You’ve got an appetite!";
    if (count >= 25) return "🍽️ You’re stuffed!";
    if (count >= 10) return "😄 Keep going!";
    return "Welcome, Foodies!";
};

const getNextMilestone = (count) => {
    if (count < 10) return 10;
    if (count < 25) return 25;
    if (count < 50) return 50;
    if (count < 75) return 75;
    return 500;
};

const BiteCounter = ({ count }) => {
    if (count === 0) return null;

    return (
        <div className="floating-bite-container">
            <div className="bite-counter floating-bite-box shake-on-update">
                <div className="bite-count-text">
                    🍴 Eaten: <strong>{count}</strong>
                </div>
                <div className="bite-message">{getBiteMessage(count)}</div>
                <div className="bite-milestone">
                    Next award at {getNextMilestone(count)} bites!! 🎯🥇🚀
                </div>
            </div>
        </div>
    );
};

export default BiteCounter;