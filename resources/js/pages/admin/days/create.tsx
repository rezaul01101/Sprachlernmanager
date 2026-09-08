import { Form, Head } from '@inertiajs/react';
import DayController from '@/actions/App/Http/Controllers/Admin/DayController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { dashboard } from '@/routes';
import levels from '@/routes/admin/levels';
import days from '@/routes/admin/levels/days';
import type { BreadcrumbItem } from '@/types/navigation';

type Level = {
    id: number;
    code: string;
};

export default function DayCreate({ level }: { level: Level }) {
    return (
        <>
            <Head title={`${level.code} — New day`} />

            <div className="max-w-xl space-y-6 p-4">
                <Heading
                    title="New day"
                    description={`Add a day to ${level.code}.`}
                />

                <Form
                    {...DayController.store.form(level.id)}
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="day_number">Day number</Label>
                                <Input
                                    id="day_number"
                                    name="day_number"
                                    type="number"
                                    min={1}
                                    required
                                    autoFocus
                                />
                                <InputError message={errors.day_number} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="focus_text">Focus</Label>
                                <Textarea
                                    id="focus_text"
                                    name="focus_text"
                                    required
                                />
                                <InputError message={errors.focus_text} />
                            </div>

                            <div className="flex items-center gap-3">
                                <Switch id="is_published" name="is_published" />
                                <Label htmlFor="is_published">Published</Label>
                            </div>

                            <Button disabled={processing}>Create day</Button>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

DayCreate.layout = (props: { level: Level }) => ({
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Levels', href: levels.index() },
        { title: props.level.code, href: days.index(props.level.id) },
        { title: 'New day', href: days.create(props.level.id) },
    ] satisfies BreadcrumbItem[],
});
