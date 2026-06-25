interface StarRatingInputProps {
  value: number;
  onChange: (value: number) => void;
}

export function StarRatingInput({ value, onChange }: StarRatingInputProps) {
  return (
    <div className="flex gap-0.5 text-lg">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          aria-label={`${n}점`}
          className={n <= value ? "text-violet-600" : "text-stone-300"}
        >
          ★
        </button>
      ))}
    </div>
  );
}
