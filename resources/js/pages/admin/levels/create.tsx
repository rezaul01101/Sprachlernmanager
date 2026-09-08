import { Form, Head } from '@inertiajs/react';
import LevelController from '@/actions/App/Http/Controllers/Admin/LevelController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { dashboard } from '@/routes';
import levels from '@/routes/admin/levels';
import type { BreadcrumbItem } from '@/types/navigation';

export default function LevelCreate() {
    return (
        <>
            <Head title="New level" />

            <div className="max-w-xl space-y-6 p-4">
                <Heading
                    title="New level"
                    description="Add a CEFR level for learners to progress through."
                />

                <Form {...LevelController.store.form()} className="space-y-6">
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="code">Code</Label>
                                <Input
                                    id="code"
                                    name="code"
                                    placeholder="A1"
                                    required
                                    autoFocus
                                />
                                <InputError message={errors.code} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="title">Title</Label>
                                <Input id="title" name="title" required />
                                <InputError message={errors.title} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" name="description" />
                                <InputError message={errors.description} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="sort_order">Sort order</Label>
                                <Input
                                    id="sort_order"
                                    name="sort_order"
                                    type="number"
                                    min={1}
                                    required
                                />
                                <InputError message={errors.sort_order} />
                            </div>

                            <div className="flex items-center gap-3">
                                <Switch id="is_published" name="is_published" />
                                <Label htmlFor="is_published">Published</Label>
                            </div>

                            <Button disabled={processing}>Create level</Button>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'Levels', href: levels.index() },
    { title: 'New', href: levels.create() },
];

LevelCreate.layout = {
    breadcrumbs,
};
