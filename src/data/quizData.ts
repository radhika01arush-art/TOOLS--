export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export const gkQuestions: QuizQuestion[] = [
  {
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: 2
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: 1
  },
  {
    question: "Who painted the Mona Lisa?",
    options: ["Vincent van Gogh", "Leonardo da Vinci", "Pablo Picasso", "Michelangelo"],
    correctAnswer: 1
  },
  {
    question: "What is the largest ocean on Earth?",
    options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
    correctAnswer: 3
  },
  {
    question: "Which country is home to the kangaroo?",
    options: ["New Zealand", "Australia", "South Africa", "Brazil"],
    correctAnswer: 1
  }
];

export const mathQuestions: QuizQuestion[] = [
  {
    question: "What is 15 + 27?",
    options: ["40", "42", "44", "46"],
    correctAnswer: 1
  },
  {
    question: "What is 8 × 7?",
    options: ["54", "56", "58", "60"],
    correctAnswer: 1
  },
  {
    question: "What is 144 ÷ 12?",
    options: ["10", "11", "12", "13"],
    correctAnswer: 2
  },
  {
    question: "What is 25²?",
    options: ["525", "625", "725", "825"],
    correctAnswer: 1
  },
  {
    question: "What is √81?",
    options: ["7", "8", "9", "10"],
    correctAnswer: 2
  }
];

export const triviaFacts = [
  "Honey never spoils. Archaeologists have found 3000-year-old honey in Egyptian tombs that's still edible!",
  "Octopuses have three hearts and blue blood.",
  "Bananas are berries, but strawberries aren't!",
  "A day on Venus is longer than its year.",
  "The Eiffel Tower can be 15 cm taller during summer due to thermal expansion.",
  "Dolphins have names for each other.",
  "The shortest war in history lasted 38 minutes.",
  "Your brain uses 20% of your body's total energy.",
  "Hot water freezes faster than cold water (Mpemba effect).",
  "There are more stars in the universe than grains of sand on Earth."
];
