export type Task = {
  id: string;
  label: string;
  points: number;
  category: 'warmup' | 'cardio' | 'toning' | 'arms' | 'habits';
};

export const STANDARD_WORKOUT: Task[] = [
  { id: 'wu_1', label: '5–10 min walk or light cardio', points: 5, category: 'warmup' },
  { id: 'ca_1', label: 'Walk / incline walk', points: 7, category: 'cardio' },
  { id: 'ca_2', label: 'Bike / stair climber', points: 7, category: 'cardio' },
  { id: 'ca_3', label: 'Jog', points: 6, category: 'cardio' },
  { id: 'to_1', label: 'Squats (15–20)', points: 5, category: 'toning' },
  { id: 'to_2', label: 'Lunges (10–15 each leg)', points: 5, category: 'toning' },
  { id: 'to_3', label: 'Plank (20–40 sec)', points: 5, category: 'toning' },
  { id: 'ar_1', label: 'Bicep curls (15–20)', points: 3, category: 'arms' },
  { id: 'ar_2', label: 'Hammer curls (15–20)', points: 3, category: 'arms' },
  { id: 'ar_3', label: 'Lateral raises (10–12)', points: 2, category: 'arms' },
  { id: 'ar_4', label: 'Front raises (12–15)', points: 2, category: 'arms' },
  { id: 'ha_1', label: 'Stretch / cooldown (5–10 min)', points: 5, category: 'habits' },
  { id: 'ha_2', label: '8k–12k steps', points: 20, category: 'habits' },
  { id: 'ha_3', label: 'Water (2L 💧)', points: 10, category: 'habits' },
  { id: 'ha_4', label: 'Eat something nourishing 🍓', points: 10, category: 'habits' },
  { id: 'ha_5', label: 'Misc. Self Care 💖', points: 10, category: 'habits' },
];

export const CORE_WORKOUT: Task[] = [
  ...STANDARD_WORKOUT.filter(t => t.category === 'warmup' || t.category === 'cardio' || t.category === 'habits'),
  { id: 'co_1', label: 'Plank (20–40 sec)', points: 4, category: 'toning' },
  { id: 'co_2', label: 'Dead Bugs (10–15 each side)', points: 4, category: 'toning' },
  { id: 'co_3', label: 'Seated Knee Tucks (12–15)', points: 4, category: 'toning' },
  { id: 'co_4', label: 'Heel Taps (15–20 each side)', points: 4, category: 'toning' },
  { id: 'co_5', label: 'Bird Dogs (10–12 each side)', points: 4, category: 'toning' },
];

export const LEG_WORKOUT: Task[] = [
  ...STANDARD_WORKOUT.filter(t => t.category === 'warmup' || t.category === 'cardio' || t.category === 'habits'),
  { id: 'le_1', label: 'Bodyweight Squats (15–20)', points: 4, category: 'toning' },
  { id: 'le_2', label: 'Reverse Lunges (10–15 each leg)', points: 4, category: 'toning' },
  { id: 'le_3', label: 'Glute Bridges (15–20)', points: 4, category: 'toning' },
  { id: 'le_4', label: 'Step-Ups (10–12 each leg)', points: 4, category: 'toning' },
  { id: 'le_5', label: 'Wall Sit (30–60 sec)', points: 4, category: 'toning' },
];

export const ARM_WORKOUT: Task[] = [
  ...STANDARD_WORKOUT.filter(t => t.category === 'warmup' || t.category === 'cardio' || t.category === 'habits'),
  { id: 'aw_1', label: 'Bicep Curls (15–20 reps)', points: 4, category: 'arms' },
  { id: 'aw_2', label: 'Hammer Curls (15–20 reps)', points: 4, category: 'arms' },
  { id: 'aw_3', label: 'Lateral Raises (10–12 reps)', points: 4, category: 'arms' },
  { id: 'aw_4', label: 'Front Raises (12–15 reps)', points: 4, category: 'arms' },
  { id: 'aw_5', label: 'Tricep Kickbacks (15–20 reps)', points: 4, category: 'arms' },
];

export const LOW_ENERGY_WORKOUT: Task[] = [
  { id: 'le_wu_1', label: '5 min slow walk / Light stretching', points: 5, category: 'warmup' },
  { id: 'le_ca_1', label: 'Easy walk (10-20 min total)', points: 10, category: 'cardio' },
  { id: 'le_to_1', label: 'Squats (10–12)', points: 5, category: 'toning' },
  { id: 'le_to_2', label: 'Lunges (8 each leg) - optional', points: 5, category: 'toning' },
  { id: 'le_to_3', label: 'Plank (10–20 sec) - optional', points: 5, category: 'toning' },
  { id: 'le_ar_1', label: 'Bicep curls (10–15, light)', points: 5, category: 'arms' },
  { id: 'le_ar_2', label: 'Lateral raises (8–10, light)', points: 5, category: 'arms' },
  { id: 'le_ha_1', label: 'Stretch (3–5 min)', points: 5, category: 'habits' },
  { id: 'le_ha_2', label: 'Drink water 💧', points: 10, category: 'habits' },
  { id: 'le_ha_3', label: 'Eat something small + nourishing', points: 10, category: 'habits' },
];

export const SHOP_REWARDS = [
  { id: 'overwatch', name: 'One more game', description: 'Force me to stay on Overwatch for one more game!', cost: 100, icon: '🎮' },
  { id: 'selfie', name: 'Silly selfie', description: 'I will send you a silly selfie whenever you want!', cost: 300, icon: '📸', needsScreenshot: true },
  { id: 'silly_video', name: 'Silly video', description: 'Send a silly video!', cost: 400, icon: '🤪', needsScreenshot: true },
  { id: 'nap', name: 'Nap pass', description: 'Take a nap at any point today, no questions asked.', cost: 500, icon: '😴' },
];

export const SHOP_TITLES = [
  { id: 't1', name: 'Consistency Queen', cost: 250 },
  { id: 't2', name: "Duncan's Princess", cost: 250 },
  { id: 't3', name: 'the Goodest Girl', cost: 500 },
  { id: 't4', name: 'Motivation Master', cost: 500 },
  { id: 't5', name: 'Point Collector', cost: 750 },
  { id: 't6', name: 'Chronically Online', cost: 750 },
  { id: 't7', name: 'Aura Farmer', cost: 1000 },
  { id: 't8', name: 'Queen of Everything', cost: 5000 },
];
