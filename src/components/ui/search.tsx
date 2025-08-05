"use client"

import * as React from "react"
import { Search, X, Filter } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./button"
import { Input } from "./input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover"
import { Badge } from "./badge"

export interface SearchFilter {
  id: string
  label: string
  value: string
  category?: string
}

export interface SearchProps {
  placeholder?: string
  value?: string
  onSearch?: (query: string, filters: SearchFilter[]) => void
  filters?: SearchFilter[]
  availableFilters?: SearchFilter[]
  className?: string
}

export function SearchComponent({
  placeholder = "Search...",
  value = "",
  onSearch,
  filters = [],
  availableFilters = [],
  className,
}: SearchProps) {
  const [query, setQuery] = React.useState(value)
  const [selectedFilters, setSelectedFilters] = React.useState<SearchFilter[]>(filters)
  const [isFilterOpen, setIsFilterOpen] = React.useState(false)

  const handleSearch = React.useCallback(() => {
    onSearch?.(query, selectedFilters)
  }, [query, selectedFilters, onSearch])

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const addFilter = (filter: SearchFilter) => {
    if (!selectedFilters.find(f => f.id === filter.id)) {
      setSelectedFilters(prev => [...prev, filter])
    }
    setIsFilterOpen(false)
  }

  const removeFilter = (filterId: string) => {
    setSelectedFilters(prev => prev.filter(f => f.id !== filterId))
  }

  const clearFilters = () => {
    setSelectedFilters([])
  }

  React.useEffect(() => {
    handleSearch()
  }, [selectedFilters, handleSearch])

  const groupedFilters = availableFilters.reduce((acc, filter) => {
    const category = filter.category || "Other"
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(filter)
    return acc
  }, {} as Record<string, SearchFilter[]>)

  return (
    <div className={cn("w-full space-y-2", className)}>
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10 pr-10"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button onClick={handleSearch} size="sm">
          Search
        </Button>
        {availableFilters.length > 0 && (
          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {selectedFilters.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {selectedFilters.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Filters</h4>
                  {selectedFilters.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                    >
                      Clear all
                    </Button>
                  )}
                </div>
                {Object.entries(groupedFilters).map(([category, categoryFilters]) => (
                  <div key={category} className="space-y-2">
                    <h5 className="text-sm font-medium text-muted-foreground">
                      {category}
                    </h5>
                    <div className="space-y-1">
                      {categoryFilters.map((filter) => (
                        <button
                          key={filter.id}
                          onClick={() => addFilter(filter)}
                          disabled={selectedFilters.some(f => f.id === filter.id)}
                          className="w-full text-left px-2 py-1 text-sm rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {filter.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
      
      {selectedFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedFilters.map((filter) => (
            <Badge
              key={filter.id}
              variant="secondary"
              className="cursor-pointer"
              onClick={() => removeFilter(filter.id)}
            >
              {filter.label}
              <X className="h-3 w-3 ml-1" />
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}

