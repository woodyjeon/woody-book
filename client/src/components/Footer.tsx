export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-stone-200 bg-white px-6 py-8">
      <div className="mx-auto max-w-5xl text-sm text-stone-500">
        <p className="flex items-center gap-2 text-base font-bold text-violet-700">woody-book</p>
        <p className="mt-2">책을 읽고, 별점을 남기고, 나만의 서재를 완성하는 도서 리뷰 플랫폼</p>
        <p className="mt-4 text-xs text-stone-400">© 2026 woody-book. All rights reserved.</p>
      </div>
      <img
        src="/wj_logo.svg"
        alt=""
        className="pointer-events-none absolute bottom-2 right-16 w-20 opacity-10 sm:w-24"
      />
    </footer>
  );
}
