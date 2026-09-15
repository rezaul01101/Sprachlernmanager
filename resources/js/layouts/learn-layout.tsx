import type { ReactNode } from 'react';
import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { LearnBottomNav } from '@/layouts/learn/learn-bottom-nav';
import { LearnHeader } from '@/layouts/learn/learn-header';

export default function LearnLayout({ children }: { children: ReactNode }) {
    return (
        <AppShell variant="header">
            <LearnHeader />
            <AppContent variant="header">
                <div className="pb-20 lg:pb-0">{children}</div>
            </AppContent>
            <LearnBottomNav />
        </AppShell>
    );
}
