import React, { useState } from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { CategoryNav } from '../components/home/CategoryNav';
import { ToolGrid } from '../components/home/ToolGrid';
import { toolRegistry, getToolsByCategory } from '../data/toolRegistry';

export const HomePage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string | undefined>(undefined);

  const displayedTools = activeCategory 
    ? getToolsByCategory(activeCategory)
    : toolRegistry;

  return (
    <div className="home-page">
      <HeroSection />
      <CategoryNav 
        activeCategory={activeCategory} 
        onCategorySelect={(id) => setActiveCategory(id === activeCategory ? undefined : id)} 
      />
      <div className="section-header">
        <h2 className="section-title">
          {activeCategory 
            ? `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Tools` 
            : 'Popular Tools'}
        </h2>
      </div>
      <ToolGrid tools={displayedTools} />

      <style>{`
        .home-page { padding-bottom: 40px; }
        .section-header { margin-bottom: 24px; }
        .section-title { font-size: var(--text-xl); font-weight: 700; color: var(--color-text-primary); }
      `}</style>
    </div>
  );
};
