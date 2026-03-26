import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const SearchBar = ({ value, onChange, suggestions, onSuggestionClick, placeholder = "Search by title, city or neighborhood" }) => (
  <div className="relative">
    <div className="glass-panel flex items-center gap-3 rounded-[28px] px-5 py-4 shadow-soft">
      <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
      />
    </div>
    {suggestions?.length ? (
      <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => onSuggestionClick(suggestion)}
            className="block w-full px-5 py-3 text-left text-sm transition hover:bg-brand-50 dark:hover:bg-slate-800"
          >
            {suggestion}
          </button>
        ))}
      </div>
    ) : null}
  </div>
);

export default SearchBar;
