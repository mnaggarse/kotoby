import type { Book } from "../types";

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  const percentage = Math.floor((book.read / book.pages) * 100);

  return (
    <div className="w-full flex gap-4 p-2 border-overlay border-2 border-b-4 rounded-xl">
      <img
        className="w-40 overflow-hidden rounded-xl"
        src="https://tailwindcss.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fbook-promo.27d91093.png&w=128&q=75"
      />

      <div className="flex flex-col w-full">
        <h2 className="text-lg font-ibm-medium">{book.title}</h2>
        <p className="text-sm text-gray-500">
          Page {book.read} of {book.pages}
        </p>

        <div className="flex gap-2 justify-between items-center mt-auto">
          <div className="w-full h-3.5 rounded-full bg-lightgray overflow-hidden">
            <div
              className="h-full bg-primary rounded-full"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>

          <p className="text-sm font-ibm-medium">{percentage}%</p>
        </div>
      </div>
    </div>
  );
}
