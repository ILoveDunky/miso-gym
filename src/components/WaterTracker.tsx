"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Droplets, RotateCcw } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface WaterTrackerProps {
  current: number;
  unit: 'L' | 'oz';
  onChange: (value: number) => void;
  onUnitToggle: () => void;
}

export const WaterTracker: React.FC<WaterTrackerProps> = ({ current, unit, onChange, onUnitToggle }) => {
  const goal = unit === 'L' ? 2 : 64;
  const progress = Math.min(100, (current / goal) * 100);

  const quickAdd = unit === 'L' ? [0.25, 0.5, 1.0] : [8, 16, 32];

  const handleAdjust = (amt: number) => {
    onChange(Math.max(0, Number((current + amt).toFixed(2))));
  };

  return (
    <Card className="overflow-hidden border-none shadow-lg bg-card/40 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-lg flex items-center gap-2 font-bold">
          <Droplets className="text-blue-400 w-5 h-5" />
          Hydration Station
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onUnitToggle} className="text-[10px] font-bold h-7 uppercase tracking-wider text-muted-foreground hover:text-primary">
          Switch to {unit === 'L' ? 'Ounces' : 'Liters'}
        </Button>
      </CardHeader>
      <CardContent className="space-y-6 pt-2">
        <div className="flex flex-col items-center justify-center space-y-1">
          <div className="flex items-baseline gap-1">
            <span className="text-5xl font-black text-blue-400 tabular-nums">
              {unit === 'L' ? current.toFixed(2) : Math.round(current)}
            </span>
            <span className="text-lg font-bold text-muted-foreground">{unit}</span>
          </div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Goal: {goal} {unit}</p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => handleAdjust(unit === 'L' ? -0.1 : -4)} className="rounded-xl h-10 w-10 shrink-0 border-primary/20">
              <Minus className="w-4 h-4" />
            </Button>
            <div className="flex-1 space-y-1.5">
              <Progress value={progress} className="h-3 bg-blue-900/20" />
            </div>
            <Button variant="outline" size="icon" onClick={() => handleAdjust(unit === 'L' ? 0.1 : 4)} className="rounded-xl h-10 w-10 shrink-0 border-primary/20">
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {quickAdd.map((val) => (
              <Button
                key={val}
                variant="secondary"
                size="sm"
                onClick={() => handleAdjust(val)}
                className="text-[11px] font-bold rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-400/20 h-9"
              >
                +{val}{unit}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
