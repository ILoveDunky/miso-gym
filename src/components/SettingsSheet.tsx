"use client";

import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Settings2, Crown, Check, Smartphone, Info } from 'lucide-react';
import { SHOP_TITLES } from '@/lib/constants';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SettingsSheetProps {
  purchasedTitles: string[];
  activeTitleId: string;
  onEquipTitle: (id: string) => void;
}

export function SettingsSheet({ purchasedTitles, activeTitleId, onEquipTitle }: SettingsSheetProps) {
  const [showInstallInfo, setShowInstallInfo] = React.useState(false);

  const ownedTitles = SHOP_TITLES.filter(t => purchasedTitles.includes(t.id));

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/20">
          <Settings2 className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-background border-l border-primary/20">
        <SheetHeader>
          <SheetTitle className="text-xl font-bold">Settings 💜</SheetTitle>
          <SheetDescription>Customize your gym experience</SheetDescription>
        </SheetHeader>

        <div className="py-6 space-y-8">
          {/* Titles Section */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Crown className="w-4 h-4" />
              Your Titles
            </h3>
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-2">
                {ownedTitles.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic p-4 text-center bg-muted/20 rounded-xl">
                    No titles purchased yet! Check the shop.
                  </p>
                ) : (
                  ownedTitles.map((title) => (
                    <button
                      key={title.id}
                      onClick={() => onEquipTitle(title.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                        activeTitleId === title.id 
                          ? 'bg-primary/20 border-primary ring-1 ring-primary' 
                          : 'bg-muted/30 border-transparent hover:bg-muted/50'
                      }`}
                    >
                      <span className="text-sm font-medium">{title.name}</span>
                      {activeTitleId === title.id && <Check className="w-4 h-4 text-primary" />}
                    </button>
                  ))
                )}
              </div>
            </ScrollArea>
          </section>

          <Separator className="bg-primary/10" />

          {/* App Installation Section */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              App Shortcut
            </h3>
            <Button 
              onClick={() => setShowInstallInfo(!showInstallInfo)} 
              variant="secondary" 
              className="w-full justify-start gap-2 h-12 rounded-xl"
            >
              <Smartphone className="w-4 h-4" />
              How to Install
            </Button>
            
            {showInstallInfo && (
              <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 space-y-3 animate-in fade-in slide-in-from-top-2">
                <div className="flex gap-2 text-xs">
                  <Badge variant="outline" className="shrink-0 h-fit">Android</Badge>
                  <p>Tap <span className="font-bold">Three Dots</span> and select <span className="font-bold">"Add to Home Screen"</span></p>
                </div>
              </div>
            )}
          </section>

          <div className="flex items-center gap-2 p-4 bg-muted/20 rounded-2xl">
             <Info className="w-4 h-4 text-primary" />
             <p className="text-[10px] text-muted-foreground leading-tight">
               Progress resets only when you click "Finish Workout".
             </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
