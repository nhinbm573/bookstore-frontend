import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import type { BookCardProps } from "~/routes/_index/types";
import { ShoppingCart } from "lucide-react";
import { renderStars } from "~/utils/rating";

export function DBookCard({ book }: BookCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow py-0">
      <CardContent className="p-0">
        <div className="relative">
          <div className="h-48 overflow-hidden">
            <img
              src={book.photoPath}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute bottom-2 left-2 bg-orange-400 text-white px-2 py-1 rounded text-sm font-semibold">
            $ {book.unitPrice.toFixed(2)}
          </div>
          <Button
            size="sm"
            className="absolute bottom-2 right-2 bg-orange-400 hover:bg-orange-500 text-white p-2"
          >
            <ShoppingCart className="w-4 h-4" />
          </Button>
        </div>
        <div className="p-3">
          <h4 className="font-medium text-sm text-sky-600 mb-1 truncate">
            {book.title}
          </h4>
          <p className="text-xs text-gray-600 mb-2">{book.authorName}</p>
          <div className="flex items-center gap-1">
            {renderStars(book.totalRatingValue, book.totalRatingCount)}
            <span className="text-xs text-gray-500 ml-1">
              ({book.totalRatingCount})
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
