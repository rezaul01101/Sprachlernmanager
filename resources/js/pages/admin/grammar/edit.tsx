import { Head, router } from '@inertiajs/react';
import GrammarController from '@/actions/App/Http/Controllers/Admin/GrammarController';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';
import grammars from '@/routes/admin/grammars';
import type { BreadcrumbItem } from '@/types/navigation';
import GrammarForm from './form';

type Grammar = {
    id: number;
    title: string;
    description: string | null;
    image_url: string | null;
};

export default function GrammarEdit({ grammar }: { grammar: Grammar }) {
    const onDelete = () => {
        if (confirm(`Delete grammar "${grammar.title}"?`)) {
            router.delete(grammars.destroy.url(grammar.id));
        }
    };

    return (
        <>
            <Head title={`Edit ${grammar.title}`} />

            <div className="max-w-3xl space-y-6 p-4">
                <Heading title={`Edit ${grammar.title}`} />

                <GrammarForm
                    action={GrammarController.update.form(grammar.id)}
                    grammar={grammar}
                    submitLabel="Save changes"
                >
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={onDelete}
                    >
                        Delete
                    </Button>
                </GrammarForm>
            </div>
        </>
    );
}

GrammarEdit.layout = (props: { grammar: Grammar }) => ({
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Grammar', href: grammars.index() },
        { title: props.grammar.title, href: grammars.edit(props.grammar.id) },
    ] satisfies BreadcrumbItem[],
});
