import { Head } from '@inertiajs/react';
import GrammarController from '@/actions/App/Http/Controllers/Admin/GrammarController';
import Heading from '@/components/heading';
import { dashboard } from '@/routes';
import grammars from '@/routes/admin/grammars';
import type { BreadcrumbItem } from '@/types/navigation';
import GrammarForm from './form';

export default function GrammarCreate() {
    return (
        <>
            <Head title="New grammar" />

            <div className="max-w-3xl space-y-6 p-4">
                <Heading
                    title="New grammar"
                    description="Add a grammar topic with a formatted explanation."
                />

                <GrammarForm
                    action={GrammarController.store.form()}
                    submitLabel="Create grammar"
                />
            </div>
        </>
    );
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'Grammar', href: grammars.index() },
    { title: 'New', href: grammars.create() },
];

GrammarCreate.layout = {
    breadcrumbs,
};
