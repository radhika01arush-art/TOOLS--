import React from "react";

const colors = [
  "text-colorful-primary",
  "text-colorful-secondary", 
  "text-colorful-accent",
  "text-colorful-success",
  "text-colorful-purple",
  "text-colorful-pink",
];

interface RainbowTextProps {
  text: string;
  className?: string;
}

export const RainbowText: React.FC<RainbowTextProps> = ({ text, className = "" }) => {
  const words = text.split(" ");
  
  return (
    <span className={className}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex}>
          <span className={colors[wordIndex % colors.length]}>{word}</span>
          {wordIndex < words.length - 1 && " "}
        </span>
      ))}
    </span>
  );
};

export const RainbowLetters: React.FC<RainbowTextProps> = ({ text, className = "" }) => {
  return (
    <span className={className}>
      {text.split("").map((char, index) => (
        <span key={index} className={char === " " ? "" : colors[index % colors.length]}>
          {char}
        </span>
      ))}
    </span>
  );
};

export const RainbowNumber: React.FC<{ value: string | number; className?: string }> = ({ 
  value, 
  className = "" 
}) => {
  const str = value.toString();
  return (
    <span className={className}>
      {str.split("").map((char, index) => (
        <span key={index} className={char === "," ? "text-muted-foreground" : colors[index % colors.length]}>
          {char}
        </span>
      ))}
    </span>
  );
};
