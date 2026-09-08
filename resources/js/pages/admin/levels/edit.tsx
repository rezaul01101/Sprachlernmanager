import { Form, Head, router } from '@inertiajs/react';
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

type Level = {
    id: number;
    code: string;
    title: string;
    description: string | null;
    sort_order: number;
    is_published: boolean;
};

export default function LevelEdit({ level }: { level: Level }) {
    const onDelete = () => {
        if (
            confirm(
                `Delete level "${level.title}"? This also deletes all of its days.`,
            )
        ) {
            router.delete(levels.destroy.url(level.id));
        }
    };

    return (
        <>
            <Head title={`Edit ${level.title}`} />

            <div className="max-w-xl space-y-6 p-4">
                <Heading title={`Edit ${level.title}`} />

                <Form
                    {...LevelController.update.form(level.id)}
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="code">Code</Label>
                                <Input
                                    id="code"
                                    name="code"
                                    defaultValue={level.code}
                                    required
                                    autoFocus
                                />
                                <InputError message={errors.code} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    defaultValue={level.title}
                                    required
                                />
                                <InputError message={errors.title} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    defaultValue={level.description ?? ''}
                                />
                                <InputError message={errors.description} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="sort_order">Sort order</Label>
                                <Input
                                    id="sort_order"
                                    name="sort_order"
                                    type="number"
                                    min={1}
                                    defaultValue={level.sort_order}
                                    required
                                />
                                <InputError message={errors.sort_order} />
                            </div>

                            <div className="flex items-center gap-3">
                                <Switch
                                    id="is_published"
                                    name="is_published"
                                    defaultChecked={level.is_published}
                                />
                                <Label htmlFor="is_published">Published</Label>
                            </div>

                            <div className="flex items-center gap-3">
                                <Button disabled={processing}>
                                    Save changes
                                </Button>
                                <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={onDelete}
                                >
                                    Delete
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

LevelEdit.layout = (props: { level: Level }) => ({
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Levels', href: levels.index() },
        { title: props.level.code, href: levels.edit(props.level.id) },
    ] satisfies BreadcrumbItem[],
});
