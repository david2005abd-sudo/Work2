const features = [
  {
    title: "محادثة متعددة النماذج",
    description: "واجهة موحدة للتحاور مع نماذج LLM متعددة مع بث الردود تدريجيًا.",
  },
  {
    title: "إدارة كاملة للمحادثات",
    description: "إنشاء، تعديل، أرشفة، تثبيت، حذف، وبحث في كل محادثاتك.",
  },
  {
    title: "أمان متعدد الطبقات",
    description: "RLS على مستوى قاعدة البيانات، تحقق Zod، وحماية Middleware.",
  },
];

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-16">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
        <span className="mb-6 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-4 py-1.5 text-sm text-indigo-300">
          النسخة الأولى — قيد التطوير
        </span>

        <h1 className="bg-gradient-to-b from-white to-indigo-300 bg-clip-text text-6xl font-extrabold tracking-tight text-transparent sm:text-7xl">
          نادوس AI
        </h1>
        <p dir="ltr" className="mt-2 text-lg font-medium tracking-widest text-indigo-400">
          NADOS AI
        </p>

        <p className="mt-8 max-w-xl text-lg leading-relaxed text-zinc-400">
          منصة ذكاء اصطناعي <strong className="text-zinc-200">عربية أولًا</strong>، مجانية في
          نسختها الأساسية: محادثة مع نماذج LLM متعددة عبر واجهة موحدة، بث الردود، مكتبة شخصية،
          ولوحة تحكم متكاملة.
        </p>

        <div className="mt-14 grid w-full gap-4 sm:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-right backdrop-blur"
            >
              <h2 className="mb-2 font-bold text-zinc-100">{f.title}</h2>
              <p className="text-sm leading-relaxed text-zinc-400">{f.description}</p>
            </div>
          ))}
        </div>

        <footer className="mt-16 flex items-center gap-4 text-sm text-zinc-500">
          <a
            href="https://github.com/david2005abd-sudo/Work2"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-indigo-300"
          >
            GitHub
          </a>
          <span aria-hidden="true">•</span>
          <span>يعمل على Cloudflare Workers</span>
        </footer>
      </div>
    </main>
  );
}
