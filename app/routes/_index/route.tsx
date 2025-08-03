import { useNavigate, useSearchParams } from "react-router";
import type { Route } from ".react-router/types/app/routes/_index/+types/route";
import { PaginationControl } from "~/components/common/pagination-control";
import { useBooks } from "~/features/books/api";
import { BookGrid } from "~/routes/_index/components/book-grid";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "BookStore | Homepage" },
    { name: "description", content: "Welcome to BookStore!" },
  ];
}

export default function Home() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const currentPage = Number(searchParams.get("page")) || 1;
  const itemsPerPage = Number(searchParams.get("limit")) || 10;

  const { data: books, isLoading } = useBooks({
    page: currentPage,
    limit: itemsPerPage,
  });

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    params.set("limit", itemsPerPage.toString());
    navigate(`?${params.toString()}`);
  };

  const handleItemsPerPageChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    params.set("limit", value);
    navigate(`?${params.toString()}`);
  };

  if (isLoading || !books) {
    return (
      <div className="flex items-center justify-center h-40 text-gray-500 text-lg font-medium">
        Loading books...
      </div>
    );
  }

  if (currentPage > books.pagination.totalPages) {
    return (
      <div className="flex items-center justify-center h-40 text-gray-500 text-lg font-medium">
        Not found the result!
      </div>
    );
  }

  return (
    <>
      <BookGrid books={books.data} />
      <PaginationControl
        pagination={books.pagination}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />
    </>
  );
}
