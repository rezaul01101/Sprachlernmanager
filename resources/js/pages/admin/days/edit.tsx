import { Form, Head, router } from '@inertiajs/react';
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

type Day = {
    id: number;
    day_number: number;
    focus_text: string;
    is_published: boolean;
};

export default function DayEdit({ level, day }: { level: Level; day: Day }) {
    const onDelete = () => {
        if (confirm(`Delete day ${day.day_number}?`)) {
            router.delete(days.destroy.url([level.id, day.id]));
        }
    };

    return (
        <>
            <Head title={`${level.code} — Day ${day.day_number}`} />

            <div className="max-w-xl space-y-6 p-4">
                <Heading
                    title={`Edit day ${day.day_number}`}
                    description={level.code}
                />

                <Form
                    {...DayController.update.form([level.id, day.id])}
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
                                    defaultValue={day.day_number}
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
                                    defaultValue={day.focus_text}
                                    required
                                />
                                <InputError message={errors.focus_text} />
                            </div>

                            <div className="flex items-center gap-3">
                                <Switch
                                    id="is_published"
                                    name="is_published"
                                    defaultChecked={day.is_published}
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

DayEdit.layout = (props: { level: Level; day: Day }) => ({
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Levels', href: levels.index() },
        { title: props.level.code, href: days.index(props.level.id) },
        {
            title: `Day ${props.day.day_number}`,
            href: days.edit([props.level.id, props.day.id]),
        },
    ] satisfies BreadcrumbItem[],
});
