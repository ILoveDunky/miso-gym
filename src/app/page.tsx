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

type CustomWorkout = {
  id: string;
  name: string;
  description: string;
  type: string;
  duration: number;
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
  const [customWorkouts, setCustomWorkouts] = useState<CustomWorkout[]>([]);
  
  // Custom workout form state
  const [cwName, setCwName] = useState('');
  const [cwDesc, setCwDesc] = useState('');
  const [cwType, setCwType] = useState('Cardio');
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
      setCustomWorkouts(data.customWorkouts || []);
      if (data.activePlan) setActivePlan(data.activePlan);
    }
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (hasMounted) {
      localStorage.setItem('miso_gym_v4', JSON.stringify({
        points, streak, completedTasks, waterIntake, waterUnit, isLowEnergy, purchasedTitles, activeTitleId, customWorkouts, activePlan
      }));
    }
  }, [points, streak, completedTasks, waterIntake, waterUnit, isLowEnergy, purchasedTitles, activeTitleId, customWorkouts, activePlan, hasMounted]);

  const PLAN_MAP: Record<string, any[]> = {
    full_body: STANDARD_WORKOUT,
    core: CORE_WORKOUT,
    legs: LEG_WORKOUT,
    arms: ARM_WORKOUT,
  };

  const activeTasks = activePlan === 'custom' 
    ? [] 
    : (isLowEnergy ? LOW_ENERGY_WORKOUT : PLAN_MAP[activePlan] || STANDARD_WORKOUT);
    
  const activeTitle = SHOP_TITLES.find(t => t.id === activeTitleId)?.name || 'Consistency Queen';
  
  const completionPercentage = activePlan === 'custom' 
    ? (completedTasks.filter(t => t.startsWith('cw_')).length > 0 ? 100 : 0) // rough estimation for custom
    : (completedTasks.length / activeTasks.length) * 100;
  
  const canFinish = activePlan === 'custom' 
    ? completedTasks.some(t => t.startsWith('cw_'))
    : completionPercentage >= 50;

  const toggleTask = (id: string, taskPoints: number) => {
    const isAdding = !completedTasks.includes(id);
    const isCustom = id.startsWith('cw_');
    
    let actualPointsAdded = taskPoints;

    if (isCustom) {
      const currentCompletedCustom = completedTasks.filter(t => t.startsWith('cw_'));
      const currentRawCustom = currentCompletedCustom.reduce((sum, tid) => sum + (customWorkouts.find(w => w.id === tid)?.points || 0), 0);
      const currentAllowed = Math.min(currentRawCustom, 120);

      const newCompletedCustom = isAdding ? [...currentCompletedCustom, id] : currentCompletedCustom.filter(t => t !== id);
      const newRawCustom = newCompletedCustom.reduce((sum, tid) => sum + (customWorkouts.find(w => w.id === tid)?.points || 0), 0);
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

  const createCustomWorkout = () => {
    if (!cwName.trim()) return toast({title: "Oops!", description: "Please enter a name for your custom workout.", variant: "destructive"});
    const pointsMap: Record<number, number> = { 10: 10, 20: 20, 30: 30, 45: 45 };
    const newCw: CustomWorkout = {
      id: `cw_${Date.now()}`,
      name: cwName.trim(),
      description: cwDesc.trim(),
      type: cwType,
      duration: cwDuration,
      points: pointsMap[cwDuration] || 10,
    };
    setCustomWorkouts(prev => [...prev, newCw]);
    setCwName('');
    setCwDesc('');
    toast({ title: "Saved! ✨", description: `Added ${newCw.name} to your custom workouts.`});
  };

  const deleteCustomWorkout = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCustomWorkouts(prev => prev.filter(w => w.id !== id));
    if (completedTasks.includes(id)) {
      toggleTask(id, customWorkouts.find(w => w.id === id)?.points || 0);
    }
  };

  if (!hasMounted) return null;

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
        {activePlan !== 'custom' ? (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
            {['warmup', 'cardio', 'toning', 'arms', 'habits'].map((cat) => {
              const catTasks = activeTasks.filter(t => t.category === cat);
              if (catTasks.length === 0) return null;
              
              const titles: Record<string, string> = {
                warmup: '🟣 Warm Up',
                cardio: '🔥 Cardio',
                toning: '🏋️‍♀️ Toning / Core / Legs',
                arms: '💪 Arms',
                habits: '🌿 Habits'
              };
              
              return (
                <Card key={cat} className="border-none shadow-xl bg-card/40 backdrop-blur-md overflow-hidden">
                  <CardHeader className="py-4 px-5 bg-primary/5 border-b border-white/5">
                    <CardTitle className="text-sm font-black uppercase tracking-[0.15em]">{titles[cat]}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-2 space-y-1">
                    {catTasks.map(task => (
                      <div 
                        key={task.id} 
                        onClick={() => toggleTask(task.id, task.points)}
                        className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-300 ${completedTasks.includes(task.id) ? 'bg-primary/5 opacity-50' : 'bg-white/5 hover:bg-white/10'}`}
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
                        <Badge variant="secondary" className="bg-background/50 text-[10px] font-black shrink-0 px-2 py-0.5 border-none">
                          +{task.points}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            {/* Custom Builder */}
            <Card className="border-none shadow-xl bg-card/40 backdrop-blur-md overflow-hidden">
               <CardHeader className="py-4 px-5 bg-primary/20 border-b border-primary/20">
                 <CardTitle className="text-sm font-black flex items-center gap-2">
                   <Plus className="w-4 h-4" /> CREATE CUSTOM WORKOUT
                 </CardTitle>
               </CardHeader>
               <CardContent className="p-5 space-y-4">
                 <div className="space-y-1">
                   <Label className="text-xs font-bold text-muted-foreground uppercase opacity-80">Name</Label>
                   <Input 
                     placeholder="e.g. Zumba Dance Class" 
                     value={cwName} 
                     onChange={e => setCwName(e.target.value)} 
                     className="bg-background/50 border-white/10 h-10"
                   />
                 </div>
                 <div className="space-y-1">
                   <Label className="text-xs font-bold text-muted-foreground uppercase opacity-80">Description</Label>
                   <Input 
                     placeholder="Short focus/goal..." 
                     value={cwDesc} 
                     onChange={e => setCwDesc(e.target.value)} 
                     className="bg-background/50 border-white/10 h-10"
                   />
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                     <Label className="text-xs font-bold text-muted-foreground uppercase opacity-80">Type</Label>
                     <select 
                       value={cwType} 
                       onChange={e => setCwType(e.target.value)}
                       className="w-full h-10 px-3 rounded-md bg-background/50 border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary flex h-10 w-full rounded-md border text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                     >
                       <option>Cardio</option>
                       <option>Core</option>
                       <option>Legs</option>
                       <option>Arms</option>
                       <option>Full Body</option>
                       <option>Custom</option>
                     </select>
                   </div>
                   <div className="space-y-1">
                     <Label className="text-xs font-bold text-muted-foreground uppercase opacity-80">Duration</Label>
                     <select 
                       value={cwDuration} 
                       onChange={e => setCwDuration(Number(e.target.value))}
                       className="w-full h-10 px-3 rounded-md bg-background/50 border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-primary flex h-10 w-full rounded-md border text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                     >
                       <option value={10}>10 min (+10)</option>
                       <option value={20}>20 min (+20)</option>
                       <option value={30}>30 min (+30)</option>
                       <option value={45}>45+ min (+45)</option>
                     </select>
                   </div>
                 </div>

                 <Button onClick={createCustomWorkout} className="w-full font-black tracking-widest mt-2 h-12 rounded-xl">
                   SAVE WORKOUT
                 </Button>
               </CardContent>
            </Card>

            {/* Saved Custom Workouts */}
            <div className="space-y-3">
              <h3 className="text-xs font-black tracking-[0.2em] text-muted-foreground pl-2 uppercase">Your Saved Workouts</h3>
              {customWorkouts.length === 0 && (
                <div className="text-center p-8 bg-card/20 rounded-3xl border border-white/5 border-dashed">
                  <p className="text-sm font-bold text-muted-foreground opacity-50">No custom workouts saved yet.</p>
                </div>
              )}
              {customWorkouts.map(cw => (
                <div key={cw.id} className="relative group">
                  <Card 
                    className={`border-none shadow-md backdrop-blur-md overflow-hidden cursor-pointer transition-all duration-300 ${
                      completedTasks.includes(cw.id) ? 'bg-primary/10 opacity-60' : 'bg-card/40 hover:bg-card/60'
                    }`}
                    onClick={() => toggleTask(cw.id, cw.points)}
                  >
                    <CardContent className="p-4 flex items-center gap-4">
                      <Checkbox 
                        checked={completedTasks.includes(cw.id)} 
                        className="w-6 h-6 rounded-lg pointer-events-none"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="secondary" className="text-[9px] px-1.5 py-0 uppercase bg-white/5 border-white/10">{cw.type}</Badge>
                          <Badge variant="secondary" className="bg-primary/20 text-primary text-[9px] font-black border-none px-1.5 py-0">{cw.duration}m</Badge>
                        </div>
                        <h4 className={`text-base font-black leading-tight ${completedTasks.includes(cw.id) ? 'line-through text-muted-foreground' : ''}`}>{cw.name}</h4>
                        {cw.description && (
                          <p className="text-xs text-muted-foreground mt-0.5">{cw.description}</p>
                        )}
                      </div>
                      <Badge variant="secondary" className="bg-background/50 text-xs font-black shrink-0 px-3 py-1 border-none text-yellow-400">
                        +{cw.points}
                      </Badge>
                    </CardContent>
                  </Card>
                  {/* Delete Button */}
                  <button 
                    onClick={(e) => deleteCustomWorkout(cw.id, e)}
                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground p-2 rounded-full shadow-lg opacity-0 lg:opacity-100 lg:scale-100 transition-opacity translate-y-2 group-hover:translate-y-0 opacity-100 bg-red-500 hover:bg-red-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
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
                ? 'Complete at least 1 custom workout to finish'
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
              You crushed it. One step closer to your goals. Now go rest, princess! 💜
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
