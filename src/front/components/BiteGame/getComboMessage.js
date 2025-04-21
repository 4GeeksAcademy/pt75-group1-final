const getComboMessage = (count) => {
    if (count % 100 === 0) return "💀 FOOD GOD MODE";
    if (count % 75 === 0) return "🔥 MASSIVE BITE COMBO!!";
    if (count % 50 === 0) return "💪 WOAH!";
    if (count % 25 === 0) return "😋 SNACK STREAK!";
    if (count % 10 === 0) return "✨ YUM!";
    return "🍴 Yum!";
  };
  
  export default getComboMessage;