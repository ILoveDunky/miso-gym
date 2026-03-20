"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { ThemeBackground } from '@/components/ThemeBackground';
import { Confetti } from '@/components/Confetti';
import { WaterTracker } from '@/components/WaterTracker';
import { PointsShop } from '@/components/PointsShop';
import { SettingsSheet } from '@/components/SettingsSheet';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { STANDARD_WORKOUT, LOW_ENERGY_WORKOUT, CORE_WORKOUT, LEG_WORKOUT, ARM_WORKOUT, SHOP_TITLES, CHALLENGES } from '@/lib/constants';
import { 
  Flame, Sparkles, Trophy, User, Plus, Trash2, Award, Calendar as CalendarIcon, 
  Star, Lock, ChevronLeft, ChevronRight, Heart, Droplets, CheckCircle2, MoreHorizontal,
  Smile, Frown, Meh, HeartIcon, Zap
} from 'lucide-react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter 
} from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';

type CustomTask = {
  id: string;
  label: string;
  category: string;
  points: number;
  planId: string;
};

type CustomPlan = {
  id: string;
  name: string;
};

type DailyLog = {
  date: string;
  points: number;
  water: number;
  streak: number;
  isLowEnergy: boolean;
  tasksCompletedCount: number;
  tasksTotalCount: number;
  activePlan: string;
  mood?: string;
  note?: string;
  steps?: number;
  stepGoalHit?: boolean;
  customTasks?: { label: string, points: number }[];
};

export default function Home() {
  const [hasMounted, setHasMounted] = useState(false);
  
  const [appMode, setAppMode] = useState<'workouts' | 'challenges' | 'calendar'>('workouts');
  const [challengeTab, setChallengeTab] = useState<'daily' | 'weekly' | 'achievements'>('daily');

  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isLowEnergy, setIsLowEnergy] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [waterIntake, setWaterIntake] = useState(0);
  const [waterUnit, setWaterUnit] = useState<'L' | 'oz'>('L');
  const [purchasedTitles, setPurchasedTitles] = useState<string[]>([]);
  const [activeTitleId, setActiveTitleId] = useState<string>('');
  
  const [activePlan, setActivePlan] = useState<string>('full_body');
  const [customPlans, setCustomPlans] = useState<CustomPlan[]>([]);
  const [customTasks, setCustomTasks] = useState<CustomTask[]>([]);
  
  // Calendar State
  const [history, setHistory] = useState<Record<string, DailyLog>>({});
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());
  const [selectedLogDate, setSelectedLogDate] = useState<string | null>(null);
  
  // Custom workout form state
  const [newPlanName, setNewPlanName] = useState('');
  const [isCreatingPlan, setIsCreatingPlan] = useState(false);
  const [cwName, setCwName] = useState('');
  const [cwCategory, setCwCategory] = useState('warmup');
  const [cwDuration, setCwDuration] = useState(10);

  // Challenges State
  const [completedDaily, setCompletedDaily] = useState<string[]>([]);
  const [completedWeekly, setCompletedWeekly] = useState<string[]>([]);
  const [completedAchievements, setCompletedAchievements] = useState<string[]>([]);
  const [lastActiveDate, setLastActiveDate] = useState<string>('');
  const [lastActiveWeekStr, setLastActiveWeekStr] = useState<string>('');

  // Historical Stats for Challenges
  const [totalWorkoutsLogged, setTotalWorkoutsLogged] = useState(0);
  const [lowEnergyDaysLogged, setLowEnergyDaysLogged] = useState(0);
  const [partialWorkoutsLogged, setPartialWorkoutsLogged] = useState(0);
  const [stepGoalsHit, setStepGoalsHit] = useState(0);
  const [waterGoalsHit, setWaterGoalsHit] = useState(0);
  const [coreSessionsLogged, setCoreSessionsLogged] = useState(0);
  const [legSessionsLogged, setLegSessionsLogged] = useState(0);
  const [armSessionsLogged, setArmSessionsLogged] = useState(0);

  // Weekly Stats
  const [weeklyActiveDays, setWeeklyActiveDays] = useState<string[]>([]);
  const [weeklyCardioSessions, setWeeklyCardioSessions] = useState(0);
  const [weeklyPlansDone, setWeeklyPlansDone] = useState<string[]>([]);
  const [weeklyWaterGoalsHit, setWeeklyWaterGoalsHit] = useState(0);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { toast } = useToast();

  const getWeekStr = (d: Date) => {
    const date = new Date(d);
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    const week1 = new Date(date.getFullYear(), 0, 4);
    const w = 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
    return `${date.getFullYear()}-W${w}`;
  };

  useEffect(() => {
    const saved = localStorage.getItem('miso_gym_v6');
    const todayStr = new Date().toDateString();
    const thisWeekStr = getWeekStr(new Date());

    if (saved) {
      const data = JSON.parse(saved);
      setPoints(data.points || 0);
      setStreak(data.streak || 0);
      setCompletedTasks(data.completedTasks || []);
      setWaterIntake(data.waterIntake || 0);
      setWaterUnit(data.waterUnit || 'L');
      setIsLowEnergy(data.isLowEnergy || false);
      setPurchasedTitles(data.purchasedTitles || []);
      setActiveTitleId(data.activeTitleId || '');
      setCustomPlans(data.customPlans || []);
      setCustomTasks(data.customTasks || []);
      setHistory(data.history || {});

      if (data.activePlan) setActivePlan(data.activePlan);
      
      setCompletedAchievements(data.completedAchievements || []);
      setCompletedDaily(data.lastActiveDate === todayStr ? (data.completedDaily || []) : []);
      setCompletedWeekly(data.lastActiveWeekStr === thisWeekStr ? (data.completedWeekly || []) : []);
      
      setTotalWorkoutsLogged(data.totalWorkoutsLogged || 0);
      setLowEnergyDaysLogged(data.lowEnergyDaysLogged || 0);
      setPartialWorkoutsLogged(data.partialWorkoutsLogged || 0);
      setStepGoalsHit(data.stepGoalsHit || 0);
      setWaterGoalsHit(data.waterGoalsHit || 0);
      setCoreSessionsLogged(data.coreSessionsLogged || 0);
      setLegSessionsLogged(data.legSessionsLogged || 0);
      setArmSessionsLogged(data.armSessionsLogged || 0);

      setWeeklyActiveDays(data.lastActiveWeekStr === thisWeekStr ? (data.weeklyActiveDays || []) : []);
      setWeeklyCardioSessions(data.lastActiveWeekStr === thisWeekStr ? (data.weeklyCardioSessions || 0) : 0);
      setWeeklyPlansDone(data.lastActiveWeekStr === thisWeekStr ? (data.weeklyPlansDone || []) : []);
      setWeeklyWaterGoalsHit(data.lastActiveWeekStr === thisWeekStr ? (data.weeklyWaterGoalsHit || 0) : 0);

      setLastActiveDate(todayStr);
      setLastActiveWeekStr(thisWeekStr);
    } else {
      setLastActiveDate(todayStr);
      setLastActiveWeekStr(thisWeekStr);
    }
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted) {
      localStorage.setItem('miso_gym_v6', JSON.stringify({
        points, streak, completedTasks, waterIntake, waterUnit, isLowEnergy, 
        purchasedTitles, activeTitleId, customPlans, customTasks, activePlan,
        completedAchievements, completedDaily, completedWeekly, lastActiveDate, lastActiveWeekStr,
        totalWorkoutsLogged, lowEnergyDaysLogged, partialWorkoutsLogged, 
        stepGoalsHit, waterGoalsHit, coreSessionsLogged, legSessionsLogged, armSessionsLogged,
        weeklyActiveDays, weeklyCardioSessions, weeklyPlansDone, weeklyWaterGoalsHit,
        history
      }));
    }
  }, [points, streak, completedTasks, waterIntake, waterUnit, isLowEnergy, purchasedTitles, activeTitleId, customPlans, customTasks, activePlan, completedAchievements, completedDaily, completedWeekly, lastActiveDate, lastActiveWeekStr, totalWorkoutsLogged, lowEnergyDaysLogged, partialWorkoutsLogged, stepGoalsHit, waterGoalsHit, coreSessionsLogged, legSessionsLogged, armSessionsLogged, weeklyActiveDays, weeklyCardioSessions, weeklyPlansDone, weeklyWaterGoalsHit, history, hasMounted]);

  const PLAN_MAP: Record<string, any[]> = {
    full_body: STANDARD_WORKOUT,
    core: CORE_WORKOUT,
    legs: LEG_WORKOUT,
    arms: ARM_WORKOUT,
  };

  const isCustomPlan = customPlans.some(p => p.id === activePlan);
  
  const activeTasks = isCustomPlan 
    ? customTasks.filter(t => t.planId === activePlan)
    : (isLowEnergy ? LOW_ENERGY_WORKOUT : PLAN_MAP[activePlan] || STANDARD_WORKOUT);
    
  const activeTitle = SHOP_TITLES.find(t => t.id === activeTitleId)?.name || 'Consistency Queen';
  
  const completionPercentage = activeTasks.length > 0 ? (completedTasks.filter(id => activeTasks.some(t => t.id === id)).length / activeTasks.length) * 100 : 0;
  
  const canFinish = isCustomPlan 
    ? (activeTasks.length > 0 && completionPercentage > 0)
    : completionPercentage >= 50;

  const toggleTask = (id: string, taskPoints: number) => {
    const isAdding = !completedTasks.includes(id);
    const isCustom = id.startsWith('cw_');
    
    let actualPointsAdded = taskPoints;

    if (isCustom) {
      const currentCompletedCustom = completedTasks.filter(t => t.startsWith('cw_'));
      const currentRawCustom = currentCompletedCustom.reduce((sum, tid) => sum + (customTasks.find(w => w.id === tid)?.points || 0), 0);
      const currentAllowed = Math.min(currentRawCustom, 120);

      const newCompletedCustom = isAdding ? [...currentCompletedCustom, id] : currentCompletedCustom.filter(t => t !== id);
      const newRawCustom = newCompletedCustom.reduce((sum, tid) => sum + (customTasks.find(w => w.id === tid)?.points || 0), 0);
      const newAllowed = Math.min(newRawCustom, 120);

      actualPointsAdded = newAllowed - currentAllowed;
    } else {
      actualPointsAdded = isAdding ? taskPoints : -taskPoints;
    }

    setCompletedTasks(prev => isAdding ? [...prev, id] : prev.filter(t => t !== id));
    setPoints(p => Math.max(0, p + actualPointsAdded));

    if (actualPointsAdded !== 0) {
      toast({
        title: isAdding ? "Done! ✨" : "Unchecked",
        description: isAdding ? `+${actualPointsAdded} points added.` : `${actualPointsAdded} points removed.`,
        duration: 1500,
      });
    } else if (isCustom && isAdding) {
      toast({
        title: "Capped out! 🛑",
        description: "You've reached the 120 point maximum for custom workouts today.",
        duration: 2500,
      });
    }
  };

  const finishDay = () => {
    let bonus = isLowEnergy ? 15 : 30;
    const newStreak = streak + 1;
    const todayStr = new Date().toDateString();
    
    if (newStreak % 7 === 0) bonus += 75;
    else if (newStreak % 3 === 0) bonus += 25;

    // Snapshot log for history
    const finalPointsForToday = points + bonus;
    const newLog: DailyLog = {
      date: todayStr,
      points: finalPointsForToday,
      water: waterIntake,
      streak: newStreak,
      isLowEnergy,
      tasksCompletedCount: completedTasks.length,
      tasksTotalCount: activeTasks.length,
      activePlan: isCustomPlan ? (customPlans.find(p => p.id === activePlan)?.name || 'Custom') : activePlan,
      customTasks: isCustomPlan ? customTasks.filter(t => t.planId === activePlan && completedTasks.includes(t.id)).map(t => ({ label: t.label, points: t.points })) : []
    };

    setHistory(prev => ({ ...prev, [todayStr]: newLog }));

    // Challenge Stats Updates
    setTotalWorkoutsLogged(prev => prev + 1);
    if (isLowEnergy) setLowEnergyDaysLogged(prev => prev + 1);
    if (completionPercentage < 100) setPartialWorkoutsLogged(prev => prev + 1);
    
    const stepTask = activeTasks.find(t => t.label.includes('8k') || t.label.includes('steps'));
    if (stepTask && completedTasks.includes(stepTask.id)) setStepGoalsHit(prev => prev + 1);
    
    const waterGoalMet = waterUnit === 'L' ? waterIntake >= 2 : waterIntake >= 67;
    if (waterGoalMet) {
      setWaterGoalsHit(prev => prev + 1);
      setWeeklyWaterGoalsHit(prev => prev + 1);
    }

    if (activePlan === 'core') setCoreSessionsLogged(prev => prev + 1);
    if (activePlan === 'legs') setLegSessionsLogged(prev => prev + 1);
    if (activePlan === 'arms') setArmSessionsLogged(prev => prev + 1);

    if (!weeklyActiveDays.includes(todayStr)) {
      setWeeklyActiveDays(prev => [...prev, todayStr]);
    }

    const hasCardio = completedTasks.some(tid => {
        const t = activeTasks.find(at => at.id === tid);
        return t?.category === 'cardio';
    });
    if (hasCardio) setWeeklyCardioSessions(prev => prev + 1);

    if (!weeklyPlansDone.includes(activePlan)) {
      setWeeklyPlansDone(prev => [...prev, activePlan]);
    }

    setPoints(p => p + bonus);
    setStreak(newStreak);
    setCompletedTasks([]);
    setWaterIntake(0);
    setShowConfetti(true);
    setShowSuccessModal(true);
    setTimeout(() => setShowConfetti(false), 5000);
  };

  const handlePurchase = (cost: number, id: string, type: 'reward' | 'title') => {
    if (type === 'title') {
      if (purchasedTitles.includes(id)) {
        setActiveTitleId(id);
      } else {
        setPoints(p => p - cost);
        setPurchasedTitles(prev => [...prev, id]);
        setActiveTitleId(id);
      }
    } else {
      setPoints(p => p - cost);
    }
  };

  const isChallengeEligible = (id: string, type: 'daily' | 'weekly' | 'achievements') => {
    const waterGoalMet = waterUnit === 'L' ? waterIntake >= 2 : waterIntake >= 67;
    const hasCardio = completedTasks.some(tid => activeTasks.find(at => at.id === tid)?.category === 'cardio');
    const hasStretch = completedTasks.some(tid => {
        const t = activeTasks.find(at => at.id === tid);
        return t?.label.toLowerCase().includes('stretch') || (t?.category === 'habits' && t?.points === 5);
    });
    const hasFuel = completedTasks.some(tid => activeTasks.find(at => at.id === tid)?.label.toLowerCase().includes('nourishing'));
    const stepTask = activeTasks.find(t => t.label.includes('8k') || t.label.includes('steps'));
    const hasSteps = stepTask && completedTasks.includes(stepTask.id);

    if (type === 'daily') {
      switch (id) {
        case 'd_show_up': return completedTasks.length > 0;
        case 'd_move': {
            const totalDuration = completedTasks.reduce((sum, tid) => {
                const t = activeTasks.find(at => at.id === tid);
                return sum + (t?.points || 0);
            }, 0);
            return totalDuration >= 10;
        }
        case 'd_cardio': return hasCardio;
        case 'd_hydrate': return waterGoalMet;
        case 'd_stretch': return hasStretch;
        case 'd_fuel': return hasFuel;
        case 'd_step': return hasSteps;
        case 'd_low': return isLowEnergy && completedTasks.length > 0;
        case 'd_all': return completionPercentage === 100;
        default: return false;
      }
    }

    if (type === 'weekly') {
      switch (id) {
        case 'w_3day': return weeklyActiveDays.length >= 3;
        case 'w_half': return weeklyActiveDays.length >= 4;
        case 'w_warrior': return weeklyActiveDays.length >= 5;
        case 'w_cardiolover': return weeklyCardioSessions >= 3;
        case 'w_balanced': return weeklyPlansDone.includes('core') && weeklyPlansDone.includes('legs') && weeklyPlansDone.includes('arms');
        case 'w_hydrate': return weeklyWaterGoalsHit >= 4;
        default: return false;
      }
    }

    if (type === 'achievements') {
      switch (id) {
        case 'a_getin': return totalWorkoutsLogged >= 5;
        case 'a_routine': return totalWorkoutsLogged >= 10;
        case 'a_streak3': return streak >= 3;
        case 'a_streak7': return streak >= 7;
        case 'a_streak14': return streak >= 14;
        case 'a_streak30': return streak >= 30;
        case 'a_nevergive': return lowEnergyDaysLogged >= 5;
        case 'a_try': return partialWorkoutsLogged >= 20;
        case 'a_step10': return stepGoalsHit >= 10;
        case 'a_water10': return waterGoalsHit >= 10;
        case 'a_core10': return coreSessionsLogged >= 10;
        case 'a_leg10': return legSessionsLogged >= 10;
        case 'a_arm10': return armSessionsLogged >= 10;
        case 'a_100': return totalWorkoutsLogged >= 100;
        case 'a_king': return totalWorkoutsLogged >= 60;
        case 'a_life': return totalWorkoutsLogged >= 90;
        default: return false;
      }
    }
    return false;
  };

  const createPlan = () => {
    if (!newPlanName.trim()) return;
    if (customPlans.length >= 5) {
      toast({ title: "Limit Reached", description: "You can only have 5 custom plans.", variant: "destructive" });
      return;
    }
    const newPlan = { id: `plan_${Date.now()}`, name: newPlanName.trim() };
    setCustomPlans([...customPlans, newPlan]);
    setActivePlan(newPlan.id);
    setNewPlanName('');
    setIsCreatingPlan(false);
  };

  const createCustomTask = () => {
    if (!cwName.trim()) return toast({title: "Oops!", description: "Please enter a name for your custom exercise.", variant: "destructive"});
    if (!isCustomPlan) return;
    
    const newCw: CustomTask = {
      id: `cw_${Date.now()}`,
      label: cwName.trim(),
      category: cwCategory,
      points: cwDuration,
      planId: activePlan,
    };
    
    setCustomTasks(prev => [...prev, newCw]);
    setCwName('');
    toast({ title: "Saved! ✨", description: `Added ${newCw.label} to your custom plan.`});
  };

  const deleteCustomTask = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCustomTasks(prev => prev.filter(w => w.id !== id));
    if (completedTasks.includes(id)) {
      toggleTask(id, customTasks.find(w => w.id === id)?.points || 0);
    }
  };

  const deleteCustomPlan = (id: string) => {
    setCustomPlans(prev => prev.filter(p => p.id !== id));
    setCustomTasks(prev => prev.filter(t => t.planId !== id));
    setActivePlan('full_body');
  };

  const claimChallenge = (id: string, pointsVal: number, type: 'daily' | 'weekly' | 'achievements') => {
    if (!isChallengeEligible(id, type)) {
      toast({ title: "Locked! 🔒", description: "You haven't met the requirements for this challenge yet.", variant: "destructive" });
      return;
    }
    setPoints(p => p + pointsVal);
    toast({ title: "Claimed! 🏆", description: `+${pointsVal} points awarded!`, duration: 2000 });
    if (type === 'daily') setCompletedDaily(p => [...p, id]);
    else if (type === 'weekly') setCompletedWeekly(p => [...p, id]);
    else setCompletedAchievements(p => [...p, id]);
  };

  const updateHistoryLog = (date: string, updates: Partial<DailyLog>) => {
    setHistory(prev => ({
      ...prev,
      [date]: { ...prev[date], ...updates }
    }));
  };

  if (!hasMounted) return null;

  const categories = ['warmup', 'cardio', 'toning', 'arms', 'habits'];
  const titles: Record<string, string> = {
    warmup: '🟣 Warm Up',
    cardio: '🔥 Cardio',
    toning: '🏋️‍♀️ Toning / Core / Legs',
    arms: '💪 Arms',
    habits: '🌿 Habits'
  };

  // Calendar Helpers
  const generateCalendarDays = () => {
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(new Date(year, month, d));
    }
    return days;
  };

  return (
    <div className="min-h-screen pb-24">
      <div className="fixed top-0 left-0 right-0 z-[100] bg-background/80 backdrop-blur-md border-b border-white/5 h-1.5">
        <div 
          className="h-full bg-primary transition-all duration-500 ease-out" 
          style={{ width: `${appMode === 'workouts' ? Math.min(completionPercentage, 100) : 0}%` }}
        />
      </div>

      <ThemeBackground theme="dark" />
      {showConfetti && <Confetti />}

      <main className="max-w-md mx-auto px-4 py-8 space-y-6 pt-10">
        
        {/* App Mode Toggle */}
        <div className="flex bg-card/60 backdrop-blur-md border border-white/5 shadow-inner p-1 rounded-full mb-2">
          {['workouts', 'challenges', 'calendar'].map((mode) => (
            <button 
              key={mode}
              className={`flex-1 py-2.5 rounded-full text-[10px] font-black uppercase tracking-tighter transition-all ${appMode === mode ? 'bg-primary text-primary-foreground shadow-lg' : 'opacity-60 hover:opacity-100'}`}
              onClick={() => setAppMode(mode as any)}
            >
              {mode === 'workouts' ? '🏋️‍♀️ Workouts' : mode === 'challenges' ? '🏆 Challenges' : '📅 Calendar'}
            </button>
          ))}
        </div>

        <Card className="border-none shadow-2xl bg-card/40 backdrop-blur-xl overflow-hidden">
          <div className="bg-primary/5 p-5 flex items-center justify-between border-b border-primary/10">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center border-2 border-primary/20 bg-muted/50 shadow-lg">
                  <User className="w-8 h-8 text-muted-foreground" />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground p-1 rounded-full shadow-lg">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
              </div>
              <div>
                <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{activeTitle}</h2>
                <h1 className="text-2xl font-black tracking-tight">Miso 💜</h1>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <SettingsSheet 
                purchasedTitles={purchasedTitles} 
                activeTitleId={activeTitleId} 
                onEquipTitle={setActiveTitleId} 
              />
              <div className="text-xl font-black flex items-center gap-1.5 text-yellow-400">
                <span className="text-lg">🪙</span> {points}
              </div>
            </div>
          </div>
          <CardContent className="p-4 bg-muted/5 flex items-center justify-center gap-4">
             <Badge variant="secondary" className="bg-orange-500/10 text-orange-400 border-orange-500/20 px-3 py-1 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span className="font-bold">{streak} DAY STREAK</span>
             </Badge>
             <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 px-3 py-1 flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5" />
                <span className="font-bold">{completedTasks.length} DONE</span>
             </Badge>
          </CardContent>
        </Card>

        {appMode === 'workouts' && (
          <>
            <div className="overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide flex gap-2 snap-x">
              {[
                { id: 'full_body', label: 'Full Body' },
                { id: 'core', label: 'Core' },
                { id: 'legs', label: 'Legs' },
                { id: 'arms', label: 'Arms' },
                ...customPlans.map(cp => ({ id: cp.id, label: `${cp.name} ✨` }))
              ].map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => { setActivePlan(plan.id); setIsCreatingPlan(false); }}
                  className={`snap-center shrink-0 px-4 py-2 rounded-2xl font-bold text-sm transition-all shadow-sm ${
                    activePlan === plan.id && !isCreatingPlan
                      ? 'bg-primary text-primary-foreground border-2 border-primary'
                      : 'bg-card/60 backdrop-blur-md border border-white/5 opacity-70 hover:opacity-100 text-foreground'
                  }`}
                >
                  {plan.label}
                </button>
              ))}
              {customPlans.length < 5 && (
                <button
                  onClick={() => setIsCreatingPlan(true)}
                  className={`snap-center shrink-0 px-4 py-2 rounded-2xl font-bold text-sm transition-all shadow-sm flex items-center gap-1 ${
                    isCreatingPlan ? 'bg-primary text-primary-foreground border-2 border-primary' : 'bg-card/30 backdrop-blur-md border border-white/10 border-dashed opacity-70 hover:opacity-100'
                  }`}
                >
                  <Plus className="w-4 h-4" /> New Plan
                </button>
              )}
            </div>

            {isCreatingPlan && (
              <Card className="border-none shadow-xl bg-card/40 backdrop-blur-md overflow-hidden animate-in fade-in slide-in-from-top-2">
                 <CardContent className="p-5 space-y-3">
                   <Label className="text-xs font-bold text-muted-foreground uppercase opacity-80">Plan Name</Label>
                   <div className="flex gap-2">
                     <Input 
                       placeholder="e.g. Booty Builder" 
                       value={newPlanName} 
                       onChange={e => setNewPlanName(e.target.value)} 
                       className="bg-background/50 border-white/10 h-10"
                     />
                     <Button onClick={createPlan} className="font-bold h-10 px-6 shrink-0">
                       Create
                     </Button>
                   </div>
                 </CardContent>
              </Card>
            )}

            {!isCustomPlan && !isCreatingPlan && (
              <div className="bg-card/40 backdrop-blur-md p-4 rounded-3xl border border-white/5 shadow-inner flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="low-energy" className="text-[10px] font-black uppercase tracking-widest cursor-pointer opacity-70">
                    Current Mode
                  </Label>
                  <p className="text-sm font-bold text-primary">{isLowEnergy ? 'Low Energy' : 'Normal'}</p>
                </div>
                <Switch id="low-energy" checked={isLowEnergy} onCheckedChange={setIsLowEnergy} className="data-[state=checked]:bg-blue-500" />
              </div>
            )}

            {!isCreatingPlan && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                {isCustomPlan && (
                  <div className="flex items-center justify-end px-1">
                    <button onClick={() => deleteCustomPlan(activePlan)} className="text-xs font-bold text-destructive/80 hover:text-destructive flex items-center gap-1">
                      <Trash2 className="w-3 h-3" /> Delete Plan
                    </button>
                  </div>
                )}
                {categories.map((cat) => {
                  const catTasks = activeTasks.filter(t => t.category === cat);
                  if (catTasks.length === 0) return null;
                  return (
                    <Card key={cat} className="border-none shadow-xl bg-card/40 backdrop-blur-md overflow-hidden relative group">
                      <CardHeader className="py-4 px-5 bg-primary/5 border-b border-white/5">
                        <CardTitle className="text-sm font-black uppercase tracking-[0.15em]">{titles[cat]}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-2 space-y-1">
                        {catTasks.map(task => (
                          <div 
                            key={task.id} 
                            onClick={() => toggleTask(task.id, task.points)}
                            className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-300 relative group/task ${completedTasks.includes(task.id) ? 'bg-primary/5 opacity-50' : 'bg-white/5 hover:bg-white/10'}`}
                          >
                            <Checkbox checked={completedTasks.includes(task.id)} className="w-6 h-6 rounded-lg pointer-events-none" />
                            <div className="flex-1 text-sm font-bold leading-tight">{task.label}</div>
                            <Badge variant="secondary" className="bg-background/50 text-[10px] font-black text-yellow-500">+{task.points}</Badge>
                            {isCustomPlan && (
                              <button onClick={(e) => deleteCustomTask(task.id, e)} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-red-500 text-white p-1.5 rounded-full shadow-lg opacity-0 group-hover/task:opacity-100 transition-opacity"><Trash2 className="w-3 h-3" /></button>
                            )}
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}

            {isCustomPlan && !isCreatingPlan && (
              <div className="pt-6">
                <Card className="border-none shadow-xl bg-card/40 backdrop-blur-md overflow-hidden">
                   <CardHeader className="py-4 px-5 bg-primary/20 border-b border-primary/20">
                     <CardTitle className="text-sm font-black flex items-center gap-2"><Plus className="w-4 h-4" /> ADD TO THIS PLAN</CardTitle>
                   </CardHeader>
                   <CardContent className="p-5 space-y-4">
                     <div className="space-y-1">
                       <Label className="text-xs font-bold text-muted-foreground uppercase opacity-80">Exercise Name</Label>
                       <Input placeholder="e.g. Jumping Jacks" value={cwName} onChange={e => setCwName(e.target.value)} className="bg-background/50 border-white/10 h-10" />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-1">
                         <Label className="text-xs font-bold text-muted-foreground uppercase opacity-80">Category</Label>
                         <select value={cwCategory} onChange={e => setCwCategory(e.target.value)} className="w-full h-10 px-3 rounded-md bg-background/50 border border-white/10 text-sm">
                           <option value="warmup">Warm Up</option><option value="cardio">Cardio</option><option value="toning">Toning / Core / Legs</option><option value="arms">Arms</option><option value="habits">Habits</option>
                         </select>
                       </div>
                       <div className="space-y-1">
                         <Label className="text-xs font-bold text-muted-foreground uppercase opacity-80">Time Spent</Label>
                         <select value={cwDuration} onChange={e => setCwDuration(Number(e.target.value))} className="w-full h-10 px-3 rounded-md bg-background/50 border border-white/10 text-sm">
                           <option value={5}>5 mins (+5)</option><option value={10}>10 mins (+10)</option><option value={15}>15 mins (+15)</option><option value={20}>20 mins (+20)</option><option value={30}>30 mins (+30)</option><option value={45}>45 mins (+45)</option><option value={60}>60 mins (+60)</option>
                         </select>
                       </div>
                     </div>
                     <Button onClick={createCustomTask} className="w-full font-black tracking-widest mt-2 h-12 rounded-xl">ADD EXERCISE</Button>
                   </CardContent>
                </Card>
              </div>
            )}

            <WaterTracker current={waterIntake} unit={waterUnit} onChange={setWaterIntake} onUnitToggle={() => {
              if (waterUnit === 'L') { setWaterUnit('oz'); setWaterIntake(Math.round(waterIntake * 33.814)); }
              else { setWaterUnit('L'); setWaterIntake(Number((waterIntake / 33.814).toFixed(2))); }
            }} />

            <PointsShop points={points} onPurchase={handlePurchase} purchasedTitles={purchasedTitles} activeTitle={activeTitleId} />

            <div className="pt-6 pb-12 space-y-3">
              <Button onClick={finishDay} disabled={!canFinish} className="w-full h-16 rounded-3xl text-xl font-black bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-30">
                Finish Workout 💜
              </Button>
              {!canFinish && <p className="text-[10px] text-center text-muted-foreground font-bold uppercase tracking-widest opacity-60">Complete 50% tasks to finish</p>}
            </div>
          </>
        )}

        {appMode === 'challenges' && (
          <div className="animate-in fade-in slide-in-from-right-4 space-y-6">
            <div className="flex justify-center gap-1.5 p-1 bg-card/40 rounded-full border border-white/5 backdrop-blur-md mx-6">
              {['daily', 'weekly', 'achievements'].map(t => (
                <button key={t} onClick={() => setChallengeTab(t as any)} className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-bold py-2 rounded-full transition-all ${challengeTab === t ? 'bg-[#FFB020] text-black' : 'text-muted-foreground'}`}>
                  {t === 'daily' ? <Star className="w-3.5 h-3.5" /> : t === 'weekly' ? <CalendarIcon className="w-3.5 h-3.5" /> : <Award className="w-3.5 h-3.5" />}
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
            <div className="space-y-4">
              {challengeTab === 'daily' && CHALLENGES.daily.map(c => {
                const eligible = isChallengeEligible(c.id, 'daily');
                const claimed = completedDaily.includes(c.id);
                return (
                  <Card key={c.id} className={`border-none ${claimed ? 'bg-primary/5 opacity-60' : eligible ? 'bg-card/70 border-2 border-[#FFB020]/50 shadow-lg' : 'bg-card/40 opacity-70'} backdrop-blur-md transition-all`}>
                    <div className={`absolute top-0 left-0 w-1 h-full ${eligible ? 'bg-[#FFB020]' : 'bg-muted/30'}`}></div>
                    <div className="flex items-center justify-between p-4">
                      <div className="pl-2">
                        <div className="flex items-center gap-1.5"><h3 className={`font-black text-sm ${claimed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>{c.name}</h3>{!eligible && !claimed && <Lock className="w-3 h-3 text-muted-foreground/50" />}</div>
                        <p className="text-xs text-muted-foreground font-medium">{c.description}</p>
                      </div>
                      {claimed ? <Badge variant="secondary" className="bg-primary/20 text-primary font-bold">Claimed</Badge> : <Button onClick={() => claimChallenge(c.id, c.points, 'daily')} disabled={!eligible} className={`h-8 px-3 rounded-full font-black text-xs transition-all ${eligible ? 'bg-[#FFB020] text-black' : 'bg-muted/10 opacity-50'}`}>{eligible ? 'Claim!' : 'Locked'} +{c.points}</Button>}
                    </div>
                  </Card>
                );
              })}
              {challengeTab === 'weekly' && CHALLENGES.weekly.map(c => {
                const eligible = isChallengeEligible(c.id, 'weekly');
                const claimed = completedWeekly.includes(c.id);
                return (
                  <Card key={c.id} className={`border-none ${claimed ? 'bg-primary/5 opacity-60' : eligible ? 'bg-card/70 border-2 border-blue-500/50 shadow-lg' : 'bg-card/40 opacity-70'} backdrop-blur-md transition-all`}>
                    <div className={`absolute top-0 left-0 w-1 h-full ${eligible ? 'bg-blue-500' : 'bg-muted/30'}`}></div>
                    <div className="flex items-center justify-between p-4 pl-6">
                      <div><div className="flex items-center gap-1.5"><h3 className={`font-black text-sm ${claimed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>{c.name}</h3>{!eligible && !claimed && <Lock className="w-3 h-3 text-muted-foreground/50" />}</div><p className="text-xs text-muted-foreground font-medium">{c.description}</p></div>
                      {claimed ? <Badge variant="secondary" className="bg-primary/20 text-primary font-bold">Claimed</Badge> : <Button onClick={() => claimChallenge(c.id, c.points, 'weekly')} disabled={!eligible} className={`h-8 px-3 rounded-full font-black text-xs transition-all ${eligible ? 'bg-blue-500 text-white' : 'bg-muted/10 opacity-50'}`}>{eligible ? 'Claim!' : 'Locked'} +{c.points}</Button>}
                    </div>
                  </Card>
                );
              })}
              {challengeTab === 'achievements' && CHALLENGES.achievements.map((cat, i) => (
                <div key={i} className="pt-2"><h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-3 px-2">{cat.category}</h2>
                  <div className="space-y-3">{cat.group.map(c => {
                    const eligible = isChallengeEligible(c.id, 'achievements');
                    const claimed = completedAchievements.includes(c.id);
                    return (<Card key={c.id} className={`border-none ${claimed ? 'bg-primary/10' : eligible ? 'bg-card/80 border-2 border-primary/30' : 'bg-card/30 opacity-70'} backdrop-blur-md transition-all relative overflow-hidden`}><div className="flex items-center justify-between p-4 relative z-10"><div><div className="flex items-center gap-1.5"><h3 className={`font-black text-sm flex items-center gap-1.5 ${claimed || eligible ? 'text-primary' : 'text-foreground'}`}>{(claimed || eligible) && <Trophy className="w-3.5 h-3.5" />} {c.name}</h3>{!eligible && !claimed && <Lock className="w-3 h-3 text-muted-foreground/50" />}</div><p className="text-xs text-muted-foreground font-medium mt-0.5">{c.description}</p></div>{claimed ? <Badge className="bg-primary/20 border border-primary text-primary font-bold ml-4">COMPLETED</Badge> : <Button onClick={() => claimChallenge(c.id, c.points, 'achievements')} disabled={!eligible} className={`h-8 px-3 ml-4 shrink-0 rounded-full font-black text-xs transition-all ${eligible ? 'bg-primary text-primary-foreground' : 'bg-white/5 opacity-50'}`}>{eligible ? 'Claim!' : 'Locked'} +{c.points}</Button>}</div></Card>
                    );})}</div></div>
              ))}
            </div>
          </div>
        )}

        {appMode === 'calendar' && (
          <div className="animate-in fade-in slide-in-from-left-4 space-y-6">
            <div className="bg-card/40 backdrop-blur-md p-6 rounded-[2rem] border border-white/5 shadow-2xl space-y-6">
              <div className="flex items-center justify-between">
                 <Button variant="ghost" size="icon" onClick={() => setCurrentCalendarDate(new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() - 1, 1))}>
                   <ChevronLeft className="w-5 h-5" />
                 </Button>
                 <h2 className="text-xl font-black tracking-tighter uppercase whitespace-pre">
                   {currentCalendarDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                 </h2>
                 <Button variant="ghost" size="icon" onClick={() => setCurrentCalendarDate(new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() + 1, 1))}>
                   <ChevronRight className="w-5 h-5" />
                 </Button>
              </div>

              <div className="grid grid-cols-7 gap-2">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                  <div key={i} className="text-[10px] font-black text-center text-muted-foreground opacity-50 pb-2">{day}</div>
                ))}
                {generateCalendarDays().map((date, i) => {
                  if (!date) return <div key={i} className="aspect-square"></div>;
                  const dateStr = date.toDateString();
                  const log = history[dateStr];
                  const isToday = dateStr === new Date().toDateString();
                  
                  // Streak check: Is this day part of the current streak?
                  // Simple heuristic: If it's a logged day within the last 'streak' days of today.
                  const diffDays = Math.floor((new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
                  const isPartOfStreak = log && diffDays < streak;

                  // Color coding
                  let bgColor = 'bg-white/[0.03]';
                  if (log) {
                    const completion = (log.tasksCompletedCount / log.tasksTotalCount) || 0;
                    if (completion >= 0.8 || log.points > 100) bgColor = 'bg-primary/40 border border-primary/30';
                    else bgColor = 'bg-pink-500/20 border border-pink-500/10';
                  }

                  return (
                    <div key={i} className="relative group">
                      <button 
                        onClick={() => setSelectedLogDate(dateStr)}
                        className={`relative w-full aspect-square rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all hover:scale-105 active:scale-95 ${bgColor} ${isToday ? ' ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}`}
                      >
                        <span className={`text-[10px] font-black ${log ? 'text-foreground' : 'text-muted-foreground/40'}`}>
                          {date.getDate()}
                        </span>
                        {log && (
                          <div className="flex flex-col items-center pointer-events-none">
                             <div className="flex gap-[1px]">
                               {[...Array(Math.min(3, Math.ceil(log.points / 40)))].map((_, idx) => (
                                 <HeartIcon key={idx} className="w-1.5 h-1.5 fill-current text-primary" />
                               ))}
                             </div>
                             <div className="flex gap-1 items-center">
                                {log.water > 0 && <Droplets className="w-1.5 h-1.5 text-blue-400" />}
                                {log.tasksCompletedCount > 0 && <CheckCircle2 className="w-1.5 h-1.5 text-green-400" />}
                             </div>
                          </div>
                        )}
                        {isPartOfStreak && (
                          <div className="absolute -top-1 -right-1">
                             <Flame className="w-3 h-3 text-orange-500 fill-orange-500 animate-pulse" />
                          </div>
                        )}
                      </button>
                      
                      {/* Weekly Summary Trigger (Only on Saturdays or end of grid) */}
                      {(i % 7 === 6 || i === generateCalendarDays().length - 1) && date && (
                        <button 
                          onClick={() => {
                            const startOfWeek = new Date(date);
                            startOfWeek.setDate(date.getDate() - (i % 7));
                            const weekLogs = Object.values(history).filter(l => {
                              const d = new Date(l.date);
                              return d >= startOfWeek && d <= date;
                            });
                            const totalWeeklyPoints = weekLogs.reduce((s, l) => s + l.points, 0);
                            const totalWeeklyWater = weekLogs.reduce((s, l) => s + l.water, 0);
                            toast({
                              title: "Weekly Summary! 📈",
                              description: `Week Total: ${totalWeeklyPoints}🪙 | Water: ${totalWeeklyWater.toFixed(1)}${waterUnit}. Great work!`,
                              duration: 5000,
                            });
                          }}
                          className="absolute -right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-white/10 rounded-full"
                        >
                          <MoreHorizontal className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <Card className="bg-primary/5 border-none shadow-xl rounded-[2rem] overflow-hidden">
               <CardContent className="p-6">
                 <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                       <Flame className="w-6 h-6 text-orange-500 fill-orange-500" />
                       <div className="leading-tight">
                          <p className="text-2xl font-black">{streak}</p>
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Active Streak</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-2xl font-black text-primary">
                         {Object.values(history).filter(l => {
                           const d = new Date(l.date);
                           const now = new Date();
                           return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
                         }).reduce((sum, l) => sum + l.points, 0)}
                       </p>
                       <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Month Points</p>
                    </div>
                 </div>
                 <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {Object.values(history).slice(-7).reverse().map((log, i) => (
                       <Badge key={i} className="flex flex-col h-14 w-10 shrink-0 bg-card/60 rounded-xl justify-center items-center gap-1 border-white/5">
                          <p className="text-[8px] opacity-60">{new Date(log.date).toLocaleDateString('en-US', { weekday: 'short' })}</p>
                          <Zap className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                          <p className="text-[9px] font-black">+{log.points}</p>
                       </Badge>
                    ))}
                 </div>
               </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Selected Day Dialog */}
      <Dialog open={!!selectedLogDate} onOpenChange={(open) => !open && setSelectedLogDate(null)}>
        <DialogContent className="max-w-xs sm:max-w-md bg-card/95 backdrop-blur-2xl border-white/5 rounded-[2.5rem]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black tracking-tighter uppercase text-center mt-2">
              {selectedLogDate}
            </DialogTitle>
            <DialogDescription className="text-center font-bold text-primary/80">
              {history[selectedLogDate || ""] ? "Review your progress 💜" : "No activity logged for this day."}
            </DialogDescription>
          </DialogHeader>

          {selectedLogDate && (history[selectedLogDate] || true) ? (
            <div className="space-y-6 pt-4">
              <div className="grid grid-cols-2 gap-3">
                 <div className="bg-white/5 p-4 rounded-3xl text-center">
                    <p className="text-xs font-black text-muted-foreground uppercase mb-1">Workout</p>
                    <p className="text-lg font-black text-primary leading-tight truncate">
                      {history[selectedLogDate]?.activePlan || "Rest Day"}
                    </p>
                    <p className="text-[10px] font-bold opacity-60">
                      {history[selectedLogDate] ? `${history[selectedLogDate].tasksCompletedCount}/${history[selectedLogDate].tasksTotalCount} Done` : "Relax & Recharge 💜"}
                    </p>
                 </div>
                 <div className="bg-white/5 p-4 rounded-3xl text-center">
                    <p className="text-xs font-black text-muted-foreground uppercase mb-1">Earned</p>
                    <p className="text-xl font-black text-yellow-400">🪙 {history[selectedLogDate]?.points || 0}</p>
                    <p className="text-[10px] font-bold opacity-60">
                      {history[selectedLogDate] ? "Success! ✨" : "0 Today"}
                    </p>
                 </div>
                 <div className="bg-white/5 p-4 rounded-3xl text-center">
                    <p className="text-xs font-black text-muted-foreground uppercase mb-1">Water</p>
                    <p className="text-lg font-black text-blue-400">{history[selectedLogDate]?.water || 0}{waterUnit}</p>
                    <div className="flex gap-1 justify-center mt-1">
                       {[...Array(Math.min(5, Math.ceil((history[selectedLogDate]?.water || 0) / (waterUnit === 'L' ? 0.4 : 15))))].map((_, i) => (
                         <Droplets key={i} className="w-2.5 h-2.5 text-blue-500 fill-current" />
                       ))}
                    </div>
                 </div>
                 <div className="bg-white/5 p-4 rounded-3xl text-center">
                    <p className="text-xs font-black text-muted-foreground uppercase mb-1">Energy</p>
                    <Badge variant={history[selectedLogDate]?.isLowEnergy ? "outline" : "secondary"} className={history[selectedLogDate]?.isLowEnergy ? "text-blue-400 border-blue-400/20" : "bg-primary/20 text-primary"}>
                      {history[selectedLogDate]?.isLowEnergy ? "Low Energy" : "Normal"}
                    </Badge>
                 </div>
              </div>

              <div className="space-y-3">
                 <div className="flex items-center justify-between px-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Daily Mood</Label>
                    {history[selectedLogDate]?.mood && <span className="text-xs font-bold text-primary animate-pulse">Saved! ✨</span>}
                 </div>
                 <div className="flex justify-between px-2">
                   {['😞', '😐', '🙂', '😄', '😍'].map((m) => (
                     <button 
                       key={m} 
                       onClick={() => {
                         if (!history[selectedLogDate]) {
                           updateHistoryLog(selectedLogDate, { date: selectedLogDate, points: 0, water: 0, streak: 0, isLowEnergy: false, tasksCompletedCount: 0, tasksTotalCount: 0, activePlan: 'Rest Day', mood: m });
                         } else {
                           updateHistoryLog(selectedLogDate, { mood: m });
                         }
                       }}
                       className={`text-2xl p-2 rounded-2xl transition-all ${history[selectedLogDate]?.mood === m ? 'bg-primary/20 scale-125' : 'grayscale opacity-40 hover:grayscale-0 hover:opacity-100'}`}
                     >
                       {m}
                     </button>
                   ))}
                 </div>
              </div>

              <div className="space-y-3">
                 <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground pl-2">Miso's Notes 💜</Label>
                 <Textarea 
                    placeholder="Write a little note to yourself..."
                    value={history[selectedLogDate]?.note || ""}
                    onChange={(e) => {
                      if (!history[selectedLogDate]) {
                        updateHistoryLog(selectedLogDate, { date: selectedLogDate, points: 0, water: 0, streak: 0, isLowEnergy: false, tasksCompletedCount: 0, tasksTotalCount: 0, activePlan: 'Rest Day', note: e.target.value });
                      } else {
                        updateHistoryLog(selectedLogDate, { note: e.target.value });
                      }
                    }}
                    className="bg-white/5 border-none rounded-2xl h-24 placeholder:italic focus-visible:ring-primary/30"
                 />
              </div>

              {history[selectedLogDate]?.customTasks && history[selectedLogDate].customTasks!.length > 0 && (
                <div className="space-y-2">
                   <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground pl-2">Custom Highlights</Label>
                   <div className="space-y-1">
                     {history[selectedLogDate].customTasks!.map((t, idx) => (
                       <div key={idx} className="bg-white/5 py-2 px-3 rounded-xl flex justify-between items-center text-xs">
                         <span className="font-bold">{t.label}</span>
                         <span className="text-primary font-black">+{t.points}</span>
                       </div>
                     ))}
                   </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-12 flex flex-col items-center gap-4 text-center">
               <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-3xl opacity-20">📅</div>
               <p className="text-sm font-bold text-muted-foreground tracking-tight">
                 Nothing was logged for this date.<br/>Keep showing up to fill your calendar!
               </p>
               <Button onClick={() => setSelectedLogDate(null)} variant="secondary" className="mt-4 rounded-xl font-black">
                 CLOSE
               </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {showSuccessModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-500">
          <Card className="max-w-xs w-full text-center p-10 rounded-[3rem] border-2 border-primary/20 shadow-2xl bg-card animate-bounce-once">
            <div className="text-7xl mb-6">👑</div>
            <h2 className="text-3xl font-black mb-3 tracking-tighter uppercase">AMAZING JOB!</h2>
            <p className="text-muted-foreground font-medium mb-8 leading-relaxed">
              You crushed it. One step closer to your goals. Now go rest, princess! I love you! 💜
            </p>
            <Button onClick={() => setShowSuccessModal(false)} className="w-full rounded-2xl h-12 font-black tracking-widest bg-primary text-primary-foreground">
              I LOVE YOU TOO
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
}
