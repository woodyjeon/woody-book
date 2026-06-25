import { Link } from "react-router-dom";

const PROMOS = [
  { emoji: "📚", title: "이번 주 신간", desc: "새로 등록된 책을 가장 먼저 만나보세요", bg: "bg-violet-100", to: "/ranking" },
  { emoji: "✍️", title: "첫 리뷰 작성 이벤트", desc: "리뷰를 남기면 특별 배지를 드려요", bg: "bg-amber-100", to: "/recommend" },
  { emoji: "🎯", title: "나만의 추천 받기", desc: "취향에 맞는 책을 찾아보세요", bg: "bg-sky-100", to: "/recommend" },
  { emoji: "🔥", title: "인기 장르 모아보기", desc: "지금 가장 많이 읽는 장르는?", bg: "bg-rose-100", to: "/ranking" },
  { emoji: "💜", title: "베스트셀러 모아보기", desc: "평점 높은 책을 확인해보세요", bg: "bg-emerald-100", to: "/bestseller" },
];

export function PromoMarquee() {
  const items = [...PROMOS, ...PROMOS];

  return (
    <section className="mb-12 overflow-hidden">
      <div className="flex w-max gap-5 animate-marquee hover:[animation-play-state:paused]">
        {items.map((promo, i) => (
          <Link
            key={i}
            to={promo.to}
            className={`flex w-64 flex-none items-center gap-3 rounded-3xl ${promo.bg} p-5 shadow-sm transition hover:shadow-md`}
          >
            <span className="text-3xl">{promo.emoji}</span>
            <div>
              <p className="font-bold text-stone-800">{promo.title}</p>
              <p className="text-xs text-stone-600">{promo.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
