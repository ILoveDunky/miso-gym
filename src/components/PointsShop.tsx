"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SHOP_REWARDS, SHOP_TITLES } from '@/lib/constants';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Coins, Crown, Gift, Check } from 'lucide-react';

interface PointsShopProps {
  points: number;
  onPurchase: (cost: number, id: string, type: 'reward' | 'title') => void;
  purchasedTitles: string[];
  activeTitle: string;
}

export const PointsShop: React.FC<PointsShopProps> = ({ points, onPurchase, purchasedTitles, activeTitle }) => {
  const [showScreenshotAlert, setShowScreenshotAlert] = useState(false);

  const handlePurchase = (item: any, type: 'reward' | 'title') => {
    if (points >= item.cost) {
      onPurchase(item.cost, item.id, type);
      if (item.needsScreenshot) {
        setShowScreenshotAlert(true);
      }
    }
  };

  return (
    <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm overflow-hidden">
      <CardHeader className="bg-primary/10 border-b border-primary/20">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <Coins className="text-yellow-500 w-6 h-6" />
            Miso's Point Shop
          </CardTitle>
          <div className="bg-background px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1.5 shadow-sm">
            <span className="text-yellow-600">🪙</span> {points}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="rewards" className="w-full">
          <TabsList className="w-full h-12 rounded-none bg-transparent border-b">
            <TabsTrigger value="rewards" className="flex-1 rounded-none data-[state=active]:bg-primary/5 data-[state=active]:border-b-2 data-[state=active]:border-primary">
              <Gift className="w-4 h-4 mr-2" />
              Rewards
            </TabsTrigger>
            <TabsTrigger value="titles" className="flex-1 rounded-none data-[state=active]:bg-primary/5 data-[state=active]:border-b-2 data-[state=active]:border-primary">
              <Crown className="w-4 h-4 mr-2" />
              Titles
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="rewards" className="p-4 space-y-4">
            {SHOP_REWARDS.map(reward => (
              <div key={reward.id} className="flex items-center justify-between p-3 rounded-2xl bg-muted/30 border">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{reward.icon}</div>
                  <div>
                    <h4 className="font-semibold text-sm">{reward.name}</h4>
                    <p className="text-xs text-muted-foreground">{reward.description}</p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  disabled={points < reward.cost}
                  onClick={() => handlePurchase(reward, 'reward')}
                  className="rounded-full shrink-0 h-8 px-4 font-bold"
                >
                  🪙 {reward.cost}
                </Button>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="titles" className="p-4 grid grid-cols-1 gap-3">
            {SHOP_TITLES.map(title => {
              const isOwned = purchasedTitles.includes(title.id);
              const isActive = activeTitle === title.id;
              
              return (
                <div key={title.id} className="flex items-center justify-between p-3 rounded-2xl bg-muted/30 border group">
                  <div className="flex items-center gap-3">
                    <Crown className={`w-5 h-5 ${isOwned ? 'text-yellow-500' : 'text-muted-foreground'}`} />
                    <span className="font-medium text-sm">{title.name}</span>
                  </div>
                  {isOwned ? (
                    <Button 
                      variant={isActive ? "secondary" : "outline"} 
                      size="sm" 
                      onClick={() => onPurchase(0, title.id, 'title')}
                      className="rounded-full h-8 px-4"
                    >
                      {isActive ? <Check className="w-4 h-4 mr-1" /> : null}
                      {isActive ? 'Equipped' : 'Equip'}
                    </Button>
                  ) : (
                    <Button 
                      size="sm" 
                      disabled={points < title.cost}
                      onClick={() => handlePurchase(title, 'title')}
                      className="rounded-full shrink-0 h-8 px-4 font-bold"
                    >
                      🪙 {title.cost}
                    </Button>
                  )}
                </div>
              );
            })}
          </TabsContent>
        </Tabs>
      </CardContent>

      <AlertDialog open={showScreenshotAlert} onOpenChange={setShowScreenshotAlert}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>📸 Screenshot Time!</AlertDialogTitle>
            <AlertDialogDescription>
              Screenshot this and text it to me to claim your silly selfie! I'm waiting! 💜
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction className="rounded-full">Got it!</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};
