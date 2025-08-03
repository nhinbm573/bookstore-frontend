import { Star } from "lucide-react";

export const renderStars = (
  totalRatingValue: number,
  totalRatingCount: number,
) => {
  const stars = [];
  const rawRating =
    totalRatingCount > 0 ? totalRatingValue / totalRatingCount : 0;
  const rating = Math.round(rawRating * 2) / 2;

  if (rating === 0) {
    for (let i = 0; i < 5; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }
    return stars;
  }

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 === 0.5;

  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <Star
        key={`full-${i}`}
        className="w-4 h-4 fill-orange-400 text-orange-400"
      />,
    );
  }

  if (hasHalfStar) {
    stars.push(
      <div key="half" className="relative w-4 h-4">
        <Star className="w-4 h-4 text-gray-300" />
        <div className="absolute top-0 left-0 w-1/2 h-full overflow-hidden">
          <Star className="w-4 h-4 fill-orange-400 text-orange-400" />
        </div>
      </div>,
    );
  }

  const remainingStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  for (let i = 0; i < remainingStars; i++) {
    stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
  }

  return stars;
};
