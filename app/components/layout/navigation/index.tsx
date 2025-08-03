import { useScreenSize } from "hooks/use-screen-size";
import { Search } from "lucide-react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { DropdownMenuContent } from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import { useBooksStore } from "~/features/books/store";
import { useCategories } from "~/features/categories/api";
import { useCategoriesStore } from "~/features/categories/store";

interface NavigationProps {
  onClose?: () => void;
}

export function Navigation({ onClose }: NavigationProps) {
  const { isMobile } = useScreenSize();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { data: categories } = useCategories();
  const [search, setSearch] = useState("");

  const activeCategory = useCategoriesStore((state) => state.activeCategory);
  const onCategoryClick = useCategoriesStore((state) => state.onChangeCategory);

  const onChangeSearchKeyword = useBooksStore(
    (state) => state.onChangeSearchKeyword,
  );

  const handleKeyPressSearch = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onChangeSearchKeyword(search);
      onClose?.();
    }
  };

  return (
    <DropdownMenuContent
      className="bg-sky-300 shadow-lg rounded-none p-0 border-none"
      align="start"
      sideOffset={12}
      style={{ width: "100vw" }}
    >
      {isMobile && (
        <div className="p-4 border-b border-sky-400">
          <div className="relative">
            <Input
              placeholder="Search..."
              className="bg-white pr-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyPressSearch}
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>
      )}

      <div className="p-4">
        <h3 className="text-white font-bold text-lg mb-4">BROWSE</h3>

        <div className="space-y-3 md:grid md:grid-cols-4">
          <button
            onClick={() => {
              onCategoryClick(
                "All Categories",
                navigate,
                searchParams.toString(),
              );
              onClose?.();
            }}
            className={`block w-full border-b border-sky-400/30 last:border-b-0 text-left transition-colors py-2 px-3 rounded md:inline md:w-auto md:border-0 md:last:border-0 ${
              activeCategory === "All Categories"
                ? "bg-white/20 text-white font-semibold"
                : "text-white hover:text-sky-100 hover:bg-white/10"
            }`}
          >
            All Categories
          </button>
          {categories &&
            categories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  onCategoryClick(
                    category.name,
                    navigate,
                    searchParams.toString(),
                  );
                  onClose?.();
                }}
                className={`block w-full border-b border-sky-400/30 last:border-b-0 text-left transition-colors py-2 px-3 rounded md:inline md:w-auto md:border-0 md:last:border-0 ${
                  activeCategory === category.name
                    ? "bg-white/20 text-white font-semibold"
                    : "text-white hover:text-sky-100 hover:bg-white/10"
                }`}
              >
                {category.name}
              </button>
            ))}
        </div>
      </div>

      {isMobile && (
        <div className="p-4 border-t border-sky-400">
          <h3 className="text-white font-bold text-lg mb-4">GUEST USER</h3>
          <button className="block w-full text-left text-white hover:text-sky-100 transition-colors py-2">
            Sign in
          </button>
        </div>
      )}
    </DropdownMenuContent>
  );
}
