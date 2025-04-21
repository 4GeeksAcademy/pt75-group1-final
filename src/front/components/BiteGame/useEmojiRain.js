import { useEffect } from "react";
import getComboMessage from "./getComboMessage";
import biteSound from "../../assets/sounds/bite.mp3";

import combo1 from "../../assets/sounds/combo1.mp3";
import combo2 from "../../assets/sounds/combo2.mp3";
import combo3 from "../../assets/sounds/combo3.mp3";
import combo4 from "../../assets/sounds/combo4.mp3";
import combo5 from "../../assets/sounds/combo5.mp3";

const biteAudio = new Audio(biteSound);
biteAudio.volume = 0.6;

const comboAudios = {
  10: new Audio(combo1),
  25: new Audio(combo2),
  50: new Audio(combo3),
  75: new Audio(combo4),
  100: new Audio(combo5),
};

Object.values(comboAudios).forEach((audio) => (audio.volume = 0.8));

const comboThresholds = [10, 25, 50, 75, 100];

const useEmojiRain = (setEmojiEatenCount) => {
  useEffect(() => {
    const emojiList = ["🍕", "🍔", "🍣", "🍩", "🌮", "🍟", "🍜", "🍦"];
    const container = document.querySelector(".emoji-rain-background");
    if (!container) return;

    container.style.height = "100vh"; // Ensure full viewport height
    container.style.pointerEvents = "none"; // Prevent the background from blocking clicks

    const createParticles = (x, y) => {
      const particleCount = 18;
      const colors = ["#f5deb3", "#e0c083", "#d9a74f", "#fff2cc"];

      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement("div");
        particle.classList.add("emoji-particle");
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;

        const size = Math.random() * 6 + 4;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.borderRadius = "50%";
        particle.style.background =
          colors[Math.floor(Math.random() * colors.length)];

        const angle = Math.random() * 2 * Math.PI;
        const distance = 80 + Math.random() * 60;
        const translateX = Math.cos(angle) * distance;
        const translateY = Math.sin(angle) * distance;

        particle.style.setProperty("--tx", `${translateX}px`);
        particle.style.setProperty("--ty", `${translateY}px`);

        container.appendChild(particle);

        setTimeout(() => particle.remove(), 1000);
      }
    };

    const createEmoji = () => {
      const emoji = document.createElement("div");
      emoji.classList.add("emoji");
      emoji.textContent =
        emojiList[Math.floor(Math.random() * emojiList.length)];

      // Position across the whole width
      emoji.style.left = `${Math.random() * 100}%`;

      emoji.style.animationDuration = `${5 + Math.random() * 5}s`;
      emoji.style.fontSize = `${1 + Math.random() * 2}rem`;
      emoji.style.opacity = 0.8;

      emoji.addEventListener("click", (e) => {
        e.stopPropagation();
        biteAudio.currentTime = 0;
        biteAudio.play();

        createParticles(e.clientX, e.clientY);
        emoji.remove();

        const counterBox = document.querySelector(".bite-counter");
        if (counterBox) {
          counterBox.classList.remove("shake");
          void counterBox.offsetWidth;
          counterBox.classList.add("shake");
        }

        setEmojiEatenCount((prev) => {
          const nextCount = prev + 1;
          const comboMessage = getComboMessage(nextCount);
          const matchedThreshold = comboThresholds.find(
            (threshold) => nextCount % threshold === 0
          );

          if (matchedThreshold) {
            const comboText = document.createElement("div");
            comboText.classList.add("combo-popup");
            comboText.textContent = comboMessage;

            comboText.style.position = "fixed";
            comboText.style.left = `${e.clientX}px`;
            comboText.style.top = `${e.clientY - 20}px`;
            comboText.style.zIndex = 9999;

            document.body.appendChild(comboText);

            const audio = comboAudios[matchedThreshold];
            if (audio) {
              audio.currentTime = 0;
              audio.play();
            }

            setTimeout(() => {
              comboText.remove();
            }, 1500);
          }

          return nextCount;
        });
      });

      container.appendChild(emoji);

      setTimeout(() => {
        if (emoji.parentElement) {
          emoji.remove();
        }
      }, 10000);
    };

    const interval = setInterval(() => {
      if (document.body.contains(container)) {
        createEmoji();
      }
    }, 800);

    return () => clearInterval(interval);
  }, [setEmojiEatenCount]);
};

export default useEmojiRain;