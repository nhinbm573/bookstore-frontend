import type { OverallBook } from "~/features/books/types";
import { BookCard } from "~/routes/_index/components/book-card";

interface BookGridProps {
  books: OverallBook[];
}

export function BookGrid({ books }: BookGridProps) {
  if (!books || books.length === 0)
    return (
      <div
        className="flex items-center justify-center h-40 text-gray-500 text-lg font-medium"
        data-slot="no-books"
      >
        No books available
      </div>
    );

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8"
      data-slot="book-grid"
    >
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}
