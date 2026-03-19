"use client";

import React from 'react';

interface ThemeBackgroundProps {
  theme?: 'dark';
}

export const ThemeBackground: React.FC<ThemeBackgroundProps> = ({ theme = 'dark' }) => {
  return (
    <div className="fixed inset-0 z-[-1] animated-bg bg-gradient-to-br from-slate-950 via-purple-950/20 to-black" />
  );
};
