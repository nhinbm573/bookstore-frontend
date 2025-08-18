import { useNavigate, useSearchParams } from "react-router";
import { useAuthStore } from "~/features/auth/store";
import { useCategories } from "~/features/categories/api";
import { useCategoriesStore } from "~/features/categories/store";
import { AuthenticUserSection } from "./authentic-user-section";
import { GuestUserSection } from "./guest-user-section";

export function Sidebar() {
  const { data: categories, isLoading } = useCategories();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const activeCategory = useCategoriesStore((state) => state.activeCategory);
  const onCategoryClick = useCategoriesStore((state) => state.onChangeCategory);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isLoading) {
    return (
      <aside className="w-48 bg-white h-full border-r border-gray-200 flex-shrink-0">
        <div className="p-4 text-gray-500">Loading categories...</div>
      </aside>
    );
  }

  return (
    <aside
      className="w-48 bg-white h-full border-r border-gray-200 flex-shrink-0"
      data-slot="sidebar"
    >
      <div className="p-4">
        <div className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-3">Categories</h3>
          <div className="space-y-1" data-slot="sidebar-categories">
            <div
              key="all"
              onClick={() =>
                onCategoryClick(
                  "All Categories",
                  navigate,
                  searchParams.toString(),
                )
              }
              className={`px-3 py-2 rounded text-sm cursor-pointer ${
                activeCategory === "All Categories"
                  ? "bg-sky-300 text-white"
                  : "text-sky-500 hover:bg-gray-50"
              }`}
            >
              All Categories
            </div>
            {categories &&
              categories.map((category) => (
                <div
                  key={category.id}
                  className={`px-3 py-2 rounded text-sm cursor-pointer ${
                    activeCategory === category.name
                      ? "bg-sky-300 text-white"
                      : "text-sky-500 hover:bg-gray-50"
                  }`}
                  onClick={() =>
                    onCategoryClick(
                      category.name,
                      navigate,
                      searchParams.toString(),
                    )
                  }
                >
                  {category.name}
                </div>
              ))}
          </div>
        </div>

        {isAuthenticated ? <AuthenticUserSection /> : <GuestUserSection />}

        <div data-slot="sidebar-cart">
          <h3 className="font-semibold text-gray-800 mb-3">Cart ({13})</h3>
        </div>
      </div>
    </aside>
  );
}
