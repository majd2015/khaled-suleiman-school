"use client";
import { useDeferredValue, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Bookmark, Search, ArrowDown, BookOpen } from "lucide-react";
import type { ArticleSummary } from "@/lib/articles";
import { searchArticles } from "@/lib/article-utils";
import ArticleCard from "./ArticleCard";
import { useSaved } from "./BookmarkButton";
export default function ArticleLibrary({
  articles,
  categories,
}: {
  articles: ArticleSummary[];
  categories: { id: string; label: string }[];
}) {
  const params = useSearchParams(),
    router = useRouter();
  const category = categories.some((c) => c.id === params.get("category"))
    ? params.get("category")!
    : "all";
  const savedOnly = params.get("saved") === "1";
  const [query, setQuery] = useState("");
  const deferred = useDeferredValue(query);
  const [limit, setLimit] = useState(12);
  const saved = useSaved();
  const results = searchArticles(articles, deferred, category).filter(
    (a) => !savedOnly || saved.includes(a.slug),
  );
  useEffect(() => {
    setLimit(12);
  }, [category, savedOnly, deferred]);
  function update(key: string, value: string | null) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.replace("/articles" + (next.size ? "?" + next : ""), {
      scroll: false,
    });
  }
  return (
    <div className="library-body">
      <div className="library-toolbar">
        <label className="search-box">
          <Search size={21} />
          <span className="sr-only">ابحث في المقالات</span>
          <input
            type="search"
            placeholder="أي سؤال يشغل بالك اليوم؟"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <button
          className="filter-button"
          type="button"
          aria-pressed={savedOnly}
          onClick={() => update("saved", savedOnly ? null : "1")}
        >
          <Bookmark size={17} /> محفوظاتي <span>{saved.length}</span>
        </button>
      </div>
      <div className="category-filters" aria-label="تصنيفات المقالات">
        <button
          type="button"
          className="filter-button"
          aria-pressed={category === "all"}
          onClick={() => update("category", null)}
        >
          كل الآفاق
        </button>
        {categories.map((c) => (
          <button
            type="button"
            key={c.id}
            className="filter-button"
            aria-pressed={category === c.id}
            onClick={() => update("category", c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>
      <div className="results-heading">
        <h2>
          {savedOnly
            ? "على رفّ قراءتك"
            : category === "all"
              ? "لكل فضول، حكاية."
              : categories.find((c) => c.id === category)?.label}
        </h2>
        <p aria-live="polite" role="status">
          {results.length} مقالًا{query && " · نتائج البحث"}
        </p>
      </div>
      {results.length ? (
        <>
          <div className="article-grid">
            {results.slice(0, limit).map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
          {limit < results.length && (
            <div className="load-more">
              <button
                className="btn ghost"
                onClick={() => setLimit((n) => n + 12)}
                type="button"
              >
                اكتشف المزيد <ArrowDown size={18} />
              </button>
              <p>
                تظهر {Math.min(limit, results.length)} من {results.length} مقالة
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="empty-state card">
          <BookOpen size={36} />
          <h3>
            {savedOnly ? "رفّك ينتظر أول فكرة." : "لم نجد مقالًا بهذه الكلمات."}
          </h3>
          <p>
            {savedOnly
              ? "اضغط رمز الحفظ بجوار أي مقال لتعود إليه لاحقًا على هذا المتصفح."
              : "جرّب كلمات أقصر أو اختر مجالًا آخر."}
          </p>
          <button
            className="btn ghost"
            onClick={() => {
              setQuery("");
              router.replace("/articles", { scroll: false });
            }}
          >
            عرض كل المقالات
          </button>
        </div>
      )}
      <p className="library-note">
        مقالات معرفية وتربوية أُعدّت بمساعدة الذكاء الاصطناعي، مع مصادر وأنشطة
        للتعلّم. المحفوظات تبقى في هذا المتصفح.
      </p>
    </div>
  );
}
