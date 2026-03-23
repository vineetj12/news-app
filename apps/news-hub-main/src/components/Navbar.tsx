import { useState } from "react";
import { Link } from "react-router-dom";
import { Newspaper, Moon, Sun, Menu, X, User, History } from "lucide-react";
import SearchBar from "./SearchBar";

interface NavbarProps {
  darkMode: boolean;
  onToggleDark: () => void;
  searchQuery: string;
  onSearch: (q: string) => void;
}

const Navbar = ({ darkMode, onToggleDark, searchQuery, onSearch }: NavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <Newspaper className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold font-serif text-foreground">NewsFlow</span>
        </Link>

        {/* Search - desktop */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <SearchBar query={searchQuery} onSearch={onSearch} />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Link
            to="/history"
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Reading history"
          >
            <History className="h-5 w-5" />
          </Link>
          <Link
            to="/profile"
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Profile"
          >
            <User className="h-5 w-5" />
          </Link>
          <button
            onClick={onToggleDark}
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden rounded-full p-2 text-muted-foreground hover:bg-secondary"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile search */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t px-4 py-3 bg-card animate-fade-in">
          <SearchBar query={searchQuery} onSearch={onSearch} />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
