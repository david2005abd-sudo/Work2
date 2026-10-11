# Nados AI — منصة ذكاء اصطناعي عربية أولًا

منصة ذكاء اصطناعي عربية أولًا، مجانية في نسختها الأساسية: محادثة مع نماذج LLM متعددة عبر واجهة موحدة، بث الردود (Streaming)، إدارة كاملة للمحادثات، مكتبة شخصية، ولوحة إدارة متكاملة.

> وثيقة التخطيط الكاملة (5 مراحل) في [`nadosai.txt`](./nadosai.txt).

## التقنيات

- **Next.js 15** (App Router, RSC) + **React 19** + **TypeScript**
- **Tailwind CSS 4**
- **Supabase** (قاعدة بيانات + مصادقة + RLS)
- **Cloudflare Workers** للنشر (عبر [OpenNext](https://opennext.js.org/cloudflare))

## التشغيل محليًا

```bash
npm install
npm run dev
```

افتح [http://localhost:3000](http://localhost:3000).

## النشر على Cloudflare

```bash
npm run deploy
```

يتطلب `CLOUDFLARE_API_TOKEN` و `CLOUDFLARE_ACCOUNT_ID` (متوفرة في `.env`).

## بنية المشروع

```
src/app/          صفحات App Router
supabase/         إعدادات Supabase CLI
nadosai.txt       وثيقة التخطيط الشاملة
```
