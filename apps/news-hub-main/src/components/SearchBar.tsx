import { Search } from "lucide-react";

interface SearchBarProps {
  query: string;
  onSearch: (q: string) => void;
}

const SearchBar = ({ query, onSearch }: SearchBarProps) => {
  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        placeholder="Search news..."
        value={query}
        onChange={(e) => onSearch(e.target.value)}
        className="w-full rounded-full border bg-secondary/50 py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
};

export default SearchBar;
