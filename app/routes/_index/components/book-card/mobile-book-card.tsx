import { ShoppingCart } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import type { BookCardProps } from "~/routes/_index/types";
import { renderStars } from "~/utils/rating";

export function MBookCard({ book }: BookCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow p-0">
      <CardContent className="p-0 h-full">
        <div className="flex h-36">
          <div className="w-1/3 h-full overflow-hidden">
            <img
              src={book.photoPath}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 p-2 sm:p-3 flex flex-col justify-between">
            <div>
              <h4 className="font-medium text-sm text-sky-600 mb-1 line-clamp-2">
                {book.title}
              </h4>
              <p className="text-xs text-gray-600 mb-2">{book.authorName}</p>
              <div className="flex items-center gap-1 mb-2">
                {renderStars(book.totalRatingValue, book.totalRatingCount)}
                <span className="text-xs text-gray-500">
                  ({book.totalRatingCount})
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="bg-orange-400 text-white px-2 py-1 rounded text-xs font-semibold">
                $ {book.unitPrice}
              </span>
              <Button
                size="sm"
                className="bg-orange-400 hover:bg-orange-500 text-white p-1.5"
              >
                <ShoppingCart className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
