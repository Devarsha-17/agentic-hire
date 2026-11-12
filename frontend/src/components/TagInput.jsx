import { useState, useRef } from 'react';
import { X } from 'lucide-react';

/**
 * Pill-style tag input for comma-separated skill tags.
 * Props: tags (string[]), onChange (fn)
 */
export default function TagInput({ tags = [], onChange, placeholder = 'Type and press Enter…' }) {
  const [inputVal, setInputVal] = useState('');
  const inputRef = useRef(null);

  const addTag = (raw) => {
    const value = raw.trim().replace(/,/g, '');
    if (value && !tags.includes(value)) {
      onChange([...tags, value]);
    }
    setInputVal('');
  };

  const removeTag = (tag) => onChange(tags.filter((t) => t !== tag));

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputVal);
    } else if (e.key === 'Backspace' && !inputVal && tags.length) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div
      className="flex flex-wrap gap-2 w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5
                 focus-within:border-brand-500/60 focus-within:bg-white/8 transition-all duration-200
                 min-h-[48px] cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      {tags.map((tag) => (
        <span
          key={tag}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium
                     bg-brand-500/20 text-brand-400 border border-brand-500/30"
        >
          {tag}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); removeTag(tag); }}
            className="text-brand-400/60 hover:text-brand-300 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        value={inputVal}
        onChange={(e) => setInputVal(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => inputVal && addTag(inputVal)}
        placeholder={tags.length === 0 ? placeholder : ''}
        className="flex-1 min-w-[140px] bg-transparent text-sm text-slate-200
                   placeholder-slate-500 focus:outline-none"
      />
    </div>
  );
}
