import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import AdminLoginGate from '../components/sections/admin/AdminLoginGate';
import { getAdminToken } from '@/lib/api/admin-auth';
import { resolveAdminLoginPageSession } from '@/lib/api/admin-guard';
import {
  adminLoginReasonMessage,
  type AdminLoginReason,
} from '@/lib/api/admin-messages';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Admin | Waterstone',
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams: Promise<{ reason?: string }>;
};

export default async function AdminLoginPage({ searchParams }: PageProps) {
  await cookies();
  await resolveAdminLoginPageSession();

  const token = await getAdminToken();
  const { reason } = await searchParams;
  const notice = adminLoginReasonMessage(reason as AdminLoginReason | undefined);

  return <AdminLoginGate notice={notice} hasToken={Boolean(token)} />;
}
