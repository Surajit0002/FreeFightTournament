import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

interface TournamentFiltersProps {
  selectedMode: string;
  onModeChange: (mode: string) => void;
}

export default function TournamentFilters({ 
  selectedMode, 
  onModeChange 
}: TournamentFiltersProps) {
  return (
    <div className="flex items-center gap-2 bg-background/60 border border-primary/30 backdrop-blur-md p-2 rounded-lg">
      <Button
        variant="ghost"
        size="sm"
        className={`${selectedMode === "" ? "bg-primary/20 text-primary" : "text-muted-foreground"}`}
        onClick={() => onModeChange("")}
      >
        All
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        className={`${selectedMode === "Solo" ? "bg-accent/20 text-accent" : "text-muted-foreground"}`}
        onClick={() => onModeChange("Solo")}
      >
        Solo
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        className={`${selectedMode === "Duo" ? "bg-secondary/20 text-secondary" : "text-muted-foreground"}`}
        onClick={() => onModeChange("Duo")}
      >
        Duo
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        className={`${selectedMode === "Squad" ? "bg-primary/20 text-primary" : "text-muted-foreground"}`}
        onClick={() => onModeChange("Squad")}
      >
        Squad
      </Button>
      
      <div className="h-6 border-r border-primary/30 ml-1"></div>
      
      <Button variant="ghost" size="sm" className="gap-1">
        <Filter size={14} />
        <span className="hidden md:inline">More Filters</span>
      </Button>
    </div>
  );
}
