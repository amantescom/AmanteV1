import React from 'react';
import { Category } from '../types';

interface CategoryFilterProps {
  selected: Category | 'Todos';
  onSelect: (cat: Category | 'Todos') => void;
}

const CATEGORIES: (Category | 'Todos')[] = ['Todos', 'Homem', 'Mulher', 'Casal', 'Gay', 'Trans'];

const CategoryFilter: React.FC<CategoryFilterProps> = ({ selected, onSelect }) => {
  return (
    <div className="flex overflow-x-auto py-3 px-4 space-x-3 no-scrollbar bg-black/20 backdrop-blur-sm border-b border-rose-900/30 sticky top-[60px] z-30">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
            selected === cat
              ? 'bg-rose-600 border-rose-500 text-white shadow-[0_0_10px_rgba(255,15,79,0.5)]'
              : 'bg-rose-950/40 border-rose-800/50 text-rose-400 hover:text-rose-200 hover:border-rose-500/50'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;