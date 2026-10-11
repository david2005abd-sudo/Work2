export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:z-[100] focus:rounded-md focus:bg-[color:var(--accent)] focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white ltr:focus:left-3 rtl:focus:right-3"
    >
      تجاوز إلى المحتوى الرئيسي
    </a>
  );
}
