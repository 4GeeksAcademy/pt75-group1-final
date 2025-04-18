const getComboMessage = (count) => {
    if (count % 100 === 0) return "💀 FOOD GOD MODE";
    if (count % 75 === 0) return "🔥 MASSIVE BITE COMBO!";
    if (count % 50 === 0) return "💪 You’re crushing it!";
    if (count % 25 === 0) return "😋 Snack streak!";
    if (count % 10 === 0) return "✨ Combo Time!";
    return "🍴 Yum!";
  };
  
  export default getComboMessage;