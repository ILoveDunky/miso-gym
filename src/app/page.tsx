"use client";

import React, { useState, useEffect } from 'react';
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
import { STANDARD_WORKOUT, LOW_ENERGY_WORKOUT, CORE_WORKOUT, LEG_WORKOUT, ARM_WORKOUT, SHOP_TITLES } from '@/lib/constants';
import { Flame, Sparkles, Trophy, User, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type CustomTask = {
  id: string;
  label: string;
  category: string;
  points: number;
};

export default function Home() {
  const [hasMounted, setHasMounted] = useState(false);
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isLowEnergy, setIsLowEnergy] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [waterIntake, setWaterIntake] = useState(0);
  const [waterUnit, setWaterUnit] = useState<'L' | 'oz'>('L');
  const [purchasedTitles, setPurchasedTitles] = useState<string[]>([]);
  const [activeTitleId, setActiveTitleId] = useState<string>('');
  
  const [activePlan, setActivePlan] = useState<'full_body'|'core'|'legs'|'arms'|'custom'>('full_body');
  const [customTasks, setCustomTasks] = useState<CustomTask[]>([]);
  
  // Custom workout form state
  const [cwName, setCwName] = useState('');
  const [cwCategory, setCwCategory] = useState('warmup');
  const [cwDuration, setCwDuration] = useState(10);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem('miso_gym_v4');
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
      // Migration from old to new customWorkouts -> customTasks if needed
      setCustomTasks(data.customTasks || (data.customWorkouts ? data.customWorkouts.map((cw: any) => ({
        id: cw.id,
        label: cw.name,
        category: cw.type === 'Cardio' ? 'cardio' : cw.type === 'Warm Up' ? 'warmup' : cw.type === 'Arms' ? 'arms' : cw.type === 'Legs' ? 'toning' : cw.type === 'Core' ? 'toning' : 'habits',
        points: cw.points
      })) : []));
      if (data.activePlan) setActivePlan(data.activePlan);
    }
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted) {
      localStorage.setItem('miso_gym_v4', JSON.stringify({
        points, streak, completedTasks, waterIntake, waterUnit, isLowEnergy, purchasedTitles, activeTitleId, customTasks, activePlan
      }));
    }
  }, [points, streak, completedTasks, waterIntake, waterUnit, isLowEnergy, purchasedTitles, activeTitleId, customTasks, activePlan, hasMounted]);

  const PLAN_MAP: Record<string, any[]> = {
    full_body: STANDARD_WORKOUT,
    core: CORE_WORKOUT,
    legs: LEG_WORKOUT,
    arms: ARM_WORKOUT,
  };

  const activeTasks = activePlan === 'custom' 
    ? customTasks 
    : (isLowEnergy ? LOW_ENERGY_WORKOUT : PLAN_MAP[activePlan] || STANDARD_WORKOUT);
    
  const activeTitle = SHOP_TITLES.find(t => t.id === activeTitleId)?.name || 'Consistency Queen';
  
  const completionPercentage = activeTasks.length > 0 ? (completedTasks.filter(id => activeTasks.some(t => t.id === id)).length / activeTasks.length) * 100 : 0;
  
  const canFinish = activePlan === 'custom' 
    ? (customTasks.length > 0 && completionPercentage > 0)
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
    
    if (newStreak % 7 === 0) bonus += 75;
    else if (newStreak % 3 === 0) bonus += 25;

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

  const createCustomTask = () => {
    if (!cwName.trim()) return toast({title: "Oops!", description: "Please enter a name for your custom exercise.", variant: "destructive"});
    
    const newCw: CustomTask = {
      id: `cw_${Date.now()}`,
      label: cwName.trim(),
      category: cwCategory,
      points: cwDuration, // 1 min = 1 point
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

  if (!hasMounted) return null;

  const categories = ['warmup', 'cardio', 'toning', 'arms', 'habits'];
  const titles: Record<string, string> = {
    warmup: '🟣 Warm Up',
    cardio: '🔥 Cardio',
    toning: '🏋️‍♀️ Toning / Core / Legs',
    arms: '💪 Arms',
    habits: '🌿 Habits'
  };

  return (
    <div className="min-h-screen pb-24">
      <div className="fixed top-0 left-0 right-0 z-[100] bg-background/80 backdrop-blur-md border-b border-white/5 h-1.5">
        <div 
          className="h-full bg-primary transition-all duration-500 ease-out" 
          style={{ width: `${Math.min(completionPercentage, 100)}%` }}
        />
      </div>

      <ThemeBackground theme="dark" />
      {showConfetti && <Confetti />}

      <main className="max-w-md mx-auto px-4 py-8 space-y-6 pt-10">
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

        {/* Plan Selector */}
        <div className="overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide flex gap-2 snap-x">
          {[
            { id: 'full_body', label: 'Full Body' },
            { id: 'core', label: 'Core' },
            { id: 'legs', label: 'Legs' },
            { id: 'arms', label: 'Arms' },
            { id: 'custom', label: 'Custom ✨' },
          ].map((plan) => (
            <button
              key={plan.id}
              onClick={() => setActivePlan(plan.id as any)}
              className={`snap-center shrink-0 px-4 py-2 rounded-2xl font-bold text-sm transition-all shadow-sm ${
                activePlan === plan.id
                  ? 'bg-primary text-primary-foreground border-2 border-primary'
                  : 'bg-card/60 backdrop-blur-md border border-white/5 opacity-70 hover:opacity-100 text-foreground'
              }`}
            >
              {plan.label}
            </button>
          ))}
        </div>

        {activePlan !== 'custom' && (
          <div className="bg-card/40 backdrop-blur-md p-4 rounded-3xl border border-white/5 shadow-inner flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="low-energy" className="text-[10px] font-black uppercase tracking-widest cursor-pointer opacity-70">
                Current Mode
              </Label>
              <p className="text-sm font-bold text-primary">{isLowEnergy ? 'Low Energy' : 'Normal'}</p>
            </div>
            <Switch 
              id="low-energy" 
              checked={isLowEnergy} 
              onCheckedChange={setIsLowEnergy} 
              className="data-[state=checked]:bg-blue-500" 
            />
          </div>
        )}

        {/* Workout Sections */}
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
          {categories.map((cat) => {
            const catTasks = activeTasks.filter(t => t.category === cat);
            if (activePlan !== 'custom' && catTasks.length === 0) return null;
            
            // If in Custom Mode, show all categories (or just those with tasks), but let's show all so they see the structure!
            if (activePlan === 'custom' && catTasks.length === 0) return null; // Wait, let's only render them if they have tasks to avoid clutter.
            
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
                      <Checkbox 
                        id={task.id} 
                        checked={completedTasks.includes(task.id)} 
                        className="w-6 h-6 rounded-lg pointer-events-none"
                      />
                      <div className="flex-1">
                        <p className={`text-sm font-bold leading-tight ${completedTasks.includes(task.id) ? 'line-through text-muted-foreground' : ''}`}>
                          {task.label}
                        </p>
                      </div>
                      <Badge variant="secondary" className="bg-background/50 text-[10px] font-black shrink-0 px-2 py-0.5 border-none text-yellow-500">
                        +{task.points}
                      </Badge>
                      {activePlan === 'custom' && (
                        <button 
                          onClick={(e) => deleteCustomTask(task.id, e)}
                          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-destructive text-destructive-foreground p-1.5 rounded-full shadow-lg opacity-0 group-hover/task:opacity-100 transition-opacity bg-red-500 hover:bg-red-600"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {activePlan === 'custom' && (
          <div className="pt-6 animate-in fade-in slide-in-from-bottom-2">
            <Card className="border-none shadow-xl bg-card/40 backdrop-blur-md overflow-hidden">
               <CardHeader className="py-4 px-5 bg-primary/20 border-b border-primary/20">
                 <CardTitle className="text-sm font-black flex items-center gap-2">
                   <Plus className="w-4 h-4" /> ADD CUSTOM EXERCISE
                 </CardTitle>
               </CardHeader>
               <CardContent className="p-5 space-y-4">
                 <div className="space-y-1">
                   <Label className="text-xs font-bold text-muted-foreground uppercase opacity-80">Exercise Name</Label>
                   <Input 
                     placeholder="e.g. Jumping Jacks" 
                     value={cwName} 
                     onChange={e => setCwName(e.target.value)} 
                     className="bg-background/50 border-white/10 h-10"
                   />
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                     <Label className="text-xs font-bold text-muted-foreground uppercase opacity-80">Category</Label>
                     <select 
                       value={cwCategory} 
                       onChange={e => setCwCategory(e.target.value)}
                       className="w-full h-10 px-3 rounded-md bg-background/50 border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary flex h-10 w-full rounded-md border text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                     >
                       <option value="warmup">Warm Up</option>
                       <option value="cardio">Cardio</option>
                       <option value="toning">Toning / Core / Legs</option>
                       <option value="arms">Arms</option>
                       <option value="habits">Habits</option>
                     </select>
                   </div>
                   <div className="space-y-1">
                     <Label className="text-xs font-bold text-muted-foreground uppercase opacity-80">Time Spent</Label>
                     <select 
                       value={cwDuration} 
                       onChange={e => setCwDuration(Number(e.target.value))}
                       className="w-full h-10 px-3 rounded-md bg-background/50 border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary flex h-10 w-full rounded-md border text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                     >
                       <option value={5}>5 mins (+5)</option>
                       <option value={10}>10 mins (+10)</option>
                       <option value={15}>15 mins (+15)</option>
                       <option value={20}>20 mins (+20)</option>
                       <option value={30}>30 mins (+30)</option>
                       <option value={45}>45 mins (+45)</option>
                       <option value={60}>60 mins (+60)</option>
                     </select>
                   </div>
                 </div>

                 <Button onClick={createCustomTask} className="w-full font-black tracking-widest mt-2 h-12 rounded-xl">
                   ADD TO CUSTOM PLAN
                 </Button>
               </CardContent>
            </Card>
          </div>
        )}

        <WaterTracker 
          current={waterIntake} 
          unit={waterUnit} 
          onChange={setWaterIntake} 
          onUnitToggle={() => {
            if (waterUnit === 'L') {
               setWaterUnit('oz');
               setWaterIntake(Math.round(waterIntake * 33.814));
            } else {
               setWaterUnit('L');
               setWaterIntake(Number((waterIntake / 33.814).toFixed(2)));
            }
          }}
        />

        <PointsShop 
          points={points} 
          onPurchase={handlePurchase} 
          purchasedTitles={purchasedTitles} 
          activeTitle={activeTitleId}
        />

        <div className="pt-6 pb-12 space-y-3">
          <Button 
            onClick={finishDay} 
            disabled={!canFinish}
            className="w-full h-16 rounded-3xl text-xl font-black shadow-2xl transition-all active:scale-95 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-30 disabled:grayscale"
            size="lg"
          >
            Finish Workout 💜
          </Button>
          {!canFinish && (
            <p className="text-[10px] text-center text-muted-foreground font-bold uppercase tracking-widest opacity-60">
              {activePlan === 'custom' 
                ? 'Complete at least 1 custom exercise to finish'
                : `Complete ${Math.ceil(activeTasks.length * 0.5)} tasks to finish (50%)`}
            </p>
          )}
        </div>
      </main>

      {showSuccessModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-500">
          <Card className="max-w-xs w-full text-center p-10 rounded-[3rem] border-2 border-primary/20 shadow-2xl bg-card animate-bounce-once">
            <div className="text-7xl mb-6">👑</div>
            <h2 className="text-3xl font-black mb-3 tracking-tighter uppercase">AMAZING JOB!</h2>
            <p className="text-muted-foreground font-medium mb-8 leading-relaxed">
              You crushed it. One step closer to your goals. Now go rest, princess! I love you! 💜
            </p>
            <Button 
              onClick={() => setShowSuccessModal(false)} 
              className="w-full rounded-2xl h-12 font-black tracking-widest bg-primary text-primary-foreground"
            >
              I LOVE YOU TOO
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
}
