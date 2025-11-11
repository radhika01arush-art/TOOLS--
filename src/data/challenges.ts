export interface Challenge {
  id: number;
  text: string;
  category: "fitness" | "creativity" | "kindness" | "mindfulness" | "fun";
  emoji: string;
}

export const challenges: Challenge[] = [
  // Fitness Challenges
  { id: 1, text: "Do 20 jumping jacks right now!", category: "fitness", emoji: "💪" },
  { id: 2, text: "Take a 10-minute walk outside", category: "fitness", emoji: "🚶" },
  { id: 3, text: "Hold a plank for 30 seconds", category: "fitness", emoji: "🏋️" },
  { id: 4, text: "Do 15 squats with perfect form", category: "fitness", emoji: "🦵" },
  { id: 5, text: "Stretch for 5 minutes", category: "fitness", emoji: "🧘" },
  { id: 6, text: "Take the stairs instead of the elevator today", category: "fitness", emoji: "🪜" },
  { id: 7, text: "Do 10 push-ups (modified is okay!)", category: "fitness", emoji: "💥" },
  { id: 8, text: "Dance to your favorite song", category: "fitness", emoji: "💃" },

  // Creativity Challenges
  { id: 9, text: "Draw something you see right now", category: "creativity", emoji: "🎨" },
  { id: 10, text: "Write a haiku about your day", category: "creativity", emoji: "✍️" },
  { id: 11, text: "Take a photo of something beautiful", category: "creativity", emoji: "📸" },
  { id: 12, text: "Doodle for 5 minutes without judgment", category: "creativity", emoji: "🖍️" },
  { id: 13, text: "Create a new recipe with ingredients you have", category: "creativity", emoji: "👨‍🍳" },
  { id: 14, text: "Write down 3 ideas (any ideas!)", category: "creativity", emoji: "💡" },
  { id: 15, text: "Rearrange something in your space", category: "creativity", emoji: "🎭" },
  { id: 16, text: "Make up a short story about your pet or favorite object", category: "creativity", emoji: "📖" },

  // Kindness Challenges
  { id: 17, text: "Compliment someone genuinely", category: "kindness", emoji: "💝" },
  { id: 18, text: "Send a thank you message to someone", category: "kindness", emoji: "💌" },
  { id: 19, text: "Hold the door open for someone", category: "kindness", emoji: "🚪" },
  { id: 20, text: "Share something you love with someone", category: "kindness", emoji: "🎁" },
  { id: 21, text: "Call or text someone you haven't talked to in a while", category: "kindness", emoji: "📞" },
  { id: 22, text: "Leave a positive review for a local business", category: "kindness", emoji: "⭐" },
  { id: 23, text: "Donate something you don't use anymore", category: "kindness", emoji: "🤲" },
  { id: 24, text: "Smile at 5 strangers today", category: "kindness", emoji: "😊" },

  // Mindfulness Challenges
  { id: 25, text: "Take 5 deep breaths slowly", category: "mindfulness", emoji: "🧘‍♀️" },
  { id: 26, text: "Write down 3 things you're grateful for", category: "mindfulness", emoji: "🙏" },
  { id: 27, text: "Sit in silence for 2 minutes", category: "mindfulness", emoji: "🤫" },
  { id: 28, text: "Notice 5 things you can see, 4 you can touch, 3 you can hear", category: "mindfulness", emoji: "👀" },
  { id: 29, text: "Drink a glass of water mindfully", category: "mindfulness", emoji: "💧" },
  { id: 30, text: "Put your phone away for 30 minutes", category: "mindfulness", emoji: "📵" },
  { id: 31, text: "Watch the sunset or sunrise", category: "mindfulness", emoji: "🌅" },
  { id: 32, text: "Journal about how you feel right now", category: "mindfulness", emoji: "📝" },

  // Fun Challenges
  { id: 33, text: "Learn one fun fact and share it", category: "fun", emoji: "🤓" },
  { id: 34, text: "Try a new food or drink", category: "fun", emoji: "🍜" },
  { id: 35, text: "Listen to a song in a language you don't speak", category: "fun", emoji: "🎵" },
  { id: 36, text: "Wear something colorful today", category: "fun", emoji: "🌈" },
  { id: 37, text: "Make someone laugh", category: "fun", emoji: "😂" },
  { id: 38, text: "Do something with your non-dominant hand", category: "fun", emoji: "✋" },
  { id: 39, text: "Watch a 5-minute video on something you know nothing about", category: "fun", emoji: "📺" },
  { id: 40, text: "Create a weird face and take a selfie", category: "fun", emoji: "🤪" },
];

export const motivationalQuotes = [
  "You're on fire! Keep going! 🔥",
  "Amazing progress! You're unstoppable! 🚀",
  "Look at you go! So proud! 🌟",
  "You're building amazing habits! 💪",
  "One step at a time, you're crushing it! ⭐",
  "Your consistency is inspiring! 🎯",
  "Small actions, big results! Keep it up! 🌱",
  "You're doing great! Don't stop now! 💫",
];
