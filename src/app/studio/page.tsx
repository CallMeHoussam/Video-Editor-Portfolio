import React from 'react';
import type { Metadata } from 'next';
import { StudioDashboard } from '@/components/StudioDashboard';
import { StudioLogin } from '@/components/StudioLogin';
import { checkIsAdminServerSide } from '@/lib/auth';
import { getPortfolioData } from '@/lib/cms-store';

export const metadata: Metadata = {
  title: 'Evoless Studio CMS — Portfolio Management',
  description: 'Manage video projects, folders, and Best One highlights for Evoless portfolio.',
  robots: {
    index: false,
    follow: false
  }
};

export const dynamic = 'force-dynamic';

export default async function StudioPage() {
  const isAdmin = await checkIsAdminServerSide();

  if (!isAdmin) {
    return <StudioLogin />;
  }

  const data = getPortfolioData();
  return <StudioDashboard initialData={data} />;
}
