export function Spinner({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center py-4 ${className}`}>
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-stone-200 border-t-violet-600" />
    </div>
  );
}
