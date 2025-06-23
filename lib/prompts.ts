// Journal prompts organized by mood and category
export interface Prompt {
  id: string;
  text: string;
  category: 'memory' | 'growth' | 'mindfulness' | 'creative' | 'gratitude' | 'relationship';
  mood?: string;
}

export const journalPrompts: Prompt[] = [
  // General prompts
  { id: '1', text: "What moment from today would you want to remember in 5 years?", category: "memory" },
  { id: '2', text: "What challenged you today, and how did you grow from it?", category: "growth" },
  { id: '3', text: "Describe a small detail you noticed today that others might have missed.", category: "mindfulness" },
  { id: '4', text: "If today had a color, what would it be and why?", category: "creative" },
  { id: '5', text: "What are three things you're grateful for today?", category: "gratitude" },
  { id: '6', text: "How did you make someone else's day better today?", category: "relationship" },
  
  // Mood-specific prompts
  // Amazing/Happy
  { id: '7', text: "What made you smile the most today?", category: "memory", mood: "amazing" },
  { id: '8', text: "How can you create more moments like today?", category: "growth", mood: "amazing" },
  { id: '9', text: "Who would you want to share this feeling with and why?", category: "relationship", mood: "amazing" },
  
  // Good
  { id: '10', text: "What went right today that you didn't expect?", category: "mindfulness", mood: "good" },
  { id: '11', text: "What small victory are you celebrating today?", category: "growth", mood: "good" },
  { id: '12', text: "How did you contribute to your own happiness today?", category: "gratitude", mood: "good" },
  
  // Okay/Neutral
  { id: '13', text: "What would have made today more meaningful?", category: "growth", mood: "okay" },
  { id: '14', text: "What are you looking forward to tomorrow?", category: "mindfulness", mood: "okay" },
  { id: '15', text: "What lesson is today trying to teach you?", category: "creative", mood: "okay" },
  
  // Bad
  { id: '16', text: "What do you need right now to feel better?", category: "mindfulness", mood: "bad" },
  { id: '17', text: "How can you be kind to yourself during this difficult time?", category: "growth", mood: "bad" },
  { id: '18', text: "What would you tell a friend going through the same thing?", category: "relationship", mood: "bad" },
  
  // Terrible
  { id: '19', text: "What emotions are you feeling, and where do you feel them in your body?", category: "mindfulness", mood: "terrible" },
  { id: '20', text: "What's one small thing you can do to take care of yourself right now?", category: "growth", mood: "terrible" },
  { id: '21', text: "Who or what gives you strength during tough times?", category: "relationship", mood: "terrible" },
];

export function getPromptsForMood(mood?: string): Prompt[] {
  if (!mood) {
    // Return general prompts if no mood is selected
    return journalPrompts.filter(p => !p.mood).slice(0, 4);
  }
  
  // Get mood-specific prompts
  const moodPrompts = journalPrompts.filter(p => p.mood === mood);
  
  // If we have mood-specific prompts, return them
  if (moodPrompts.length >= 3) {
    return moodPrompts.slice(0, 4);
  }
  
  // Otherwise, mix mood-specific with general prompts
  const generalPrompts = journalPrompts.filter(p => !p.mood);
  return [...moodPrompts, ...generalPrompts.slice(0, 4 - moodPrompts.length)];
}

export function getRandomPrompts(count: number = 4, excludeMood?: string): Prompt[] {
  const availablePrompts = excludeMood 
    ? journalPrompts.filter(p => p.mood !== excludeMood)
    : journalPrompts;
    
  const shuffled = [...availablePrompts].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}