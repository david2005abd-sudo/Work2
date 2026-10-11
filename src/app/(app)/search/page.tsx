import type { Metadata } from 'next';
import { SearchClient } from '@/components/search/search-client';

export const metadata: Metadata = {
  title: 'البحث',
  robots: { index: false, follow: false },
};

export default function SearchPage() {
  return <SearchClient />;
}
