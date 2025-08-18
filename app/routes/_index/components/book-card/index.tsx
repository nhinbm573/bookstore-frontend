import { useScreenSize } from "hooks/use-screen-size";
import { DBookCard } from "~/routes/_index/components/book-card/deskop-book-card";
import { MBookCard } from "~/routes/_index/components/book-card/mobile-book-card";
import type { BookCardProps } from "~/routes/_index/types";

export function BookCard({ book }: BookCardProps) {
  const { isDesktop } = useScreenSize();
  return isDesktop ? <DBookCard book={book} /> : <MBookCard book={book} />;
}
