import { useScreenSize } from "hooks/use-screen-size";
import { Badge, BookOpen, Menu, ShoppingCart, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { Navigation } from "~/components/layout/navigation";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useBooksStore } from "~/features/books/store";
import { useCategories } from "~/features/categories/api";
import { useCategoriesStore } from "~/features/categories/store";
import { useAuthStore } from "~/features/auth/store";
import { ProfileDropdown } from "./sections/profile-dropdown";

export function Header() {
  const { isDesktop, isTablet, isMobile } = useScreenSize();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);
  const { data: categories } = useCategories();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const activeCategory = useCategoriesStore((state) => state.activeCategory);
  const onCategoryClick = useCategoriesStore((state) => state.onChangeCategory);

  const onChangeSearchKeyword = useBooksStore(
    (state) => state.onChangeSearchKeyword,
  );

  const handleKeyPressSearch = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onChangeSearchKeyword(search);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="bg-sky-300 px-4 lg:px-6 py-3">
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 cursor-pointer"
          data-slot="header-logo"
        >
          <BookOpen className="w-8 h-8 text-white" />
          <span className="text-white text-xl font-bold italic">
            In Betweener
          </span>
        </Link>

        {!isMobile && (
          <div className="flex items-center gap-4" data-slot="header-center">
            {!isTablet && categories && (
              <Select
                value={activeCategory ?? "All Categories"}
                onValueChange={(value) =>
                  onCategoryClick(value, navigate, searchParams.toString())
                }
              >
                <SelectTrigger className="w-36 bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Categories">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {mounted && (
              <div className="flex" data-slot="header-search-bar">
                <Input
                  placeholder="Search..."
                  className="rounded-r-none border-r-0 bg-white w-80"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={handleKeyPressSearch}
                />
                <Button
                  className="rounded-l-none bg-sky-400 hover:bg-sky-500 text-white px-6"
                  onClick={() => onChangeSearchKeyword(search)}
                >
                  Go
                </Button>
              </div>
            )}
          </div>
        )}

        <div
          className="flex items-center gap-2 lg:gap-4"
          data-slot="header-right"
        >
          <div className="relative" data-slot="header-cart">
            <ShoppingCart className="w-6 h-6 text-white" />
            <Badge className="absolute -top-2 -right-2 bg-orange-400 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[20px] h-5 flex items-center justify-center">
              13
            </Badge>
          </div>
          {!isDesktop && (
            <>
              <div className="w-px h-6 bg-white/30"></div>
              <DropdownMenu
                open={isDropdownOpen}
                onOpenChange={setIsDropdownOpen}
              >
                <DropdownMenuTrigger asChild>
                  <Menu className="w-5 h-5 text-white cursor-pointer" />
                </DropdownMenuTrigger>
                <Navigation onClose={() => setIsDropdownOpen(false)} />
              </DropdownMenu>
            </>
          )}
          {mounted && isTablet && <div className="w-px h-6 bg-white/30"></div>}
          {!isMobile &&
            (isAuthenticated ? (
              <DropdownMenu
                open={isProfileOpen}
                onOpenChange={setIsProfileOpen}
              >
                <DropdownMenuTrigger asChild>
                  <User className="w-5 h-5 text-white cursor-pointer" />
                </DropdownMenuTrigger>
                <ProfileDropdown />
              </DropdownMenu>
            ) : (
              <Button
                variant="ghost"
                className="text-white hover:bg-sky-400 px-2 lg:px-4"
                data-slot="header-sign-in"
                onClick={() => navigate("/signin")}
              >
                SIGN IN
              </Button>
            ))}
        </div>
      </div>
    </header>
  );
}
