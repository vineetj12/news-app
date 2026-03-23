import { categories, type Category } from "@/constants";
import { Monitor, Dumbbell, Briefcase, Heart, FlaskConical, LayoutGrid } from "lucide-react";

const icons: Record<Category, React.ElementType> = {
  All: LayoutGrid,
  Technology: Monitor,
  Sports: Dumbbell,
  Business: Briefcase,
  Health: Heart,
  Science: FlaskConical,
};

interface CategoryMenuProps {
  active: Category;
  onSelect: (c: Category) => void;
}

const CategoryMenu = ({ active, onSelect }: CategoryMenuProps) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      {categories.map((cat) => {
        const Icon = icons[cat];
        const isActive = active === cat;
        return (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all ${
              isActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-card text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <Icon className="h-4 w-4" />
            {cat}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryMenu;
