import { Form } from '@inertiajs/react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import RichTextEditor from '@/components/rich-text-editor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type GrammarFields = { title: string; description: string; image: File };

type Props = {
    action: { action: string; method: 'post' };
    grammar?: {
        title: string;
        description: string | null;
        image_url?: string | null;
    };
    submitLabel: string;
    children?: React.ReactNode;
};

export default function GrammarForm({
    action,
    grammar,
    submitLabel,
    children,
}: Props) {
    const [description, setDescription] = useState(grammar?.description ?? '');
    const [removeImage, setRemoveImage] = useState(false);

    return (
        <Form<GrammarFields> {...action} className="space-y-6">
            {({ processing, errors }) => (
                <>
                    <div className="grid gap-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            name="title"
                            defaultValue={grammar?.title}
                            required
                            autoFocus
                        />
                        <InputError message={errors.title} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <RichTextEditor
                            id="description"
                            value={description}
                            onChange={setDescription}
                            invalid={!!errors.description}
                        />
                        <input
                            type="hidden"
                            name="description"
                            value={description}
                        />
                        <InputError message={errors.description} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="image">Picture</Label>
                        {grammar?.image_url && !removeImage && (
                            <img
                                src={grammar.image_url}
                                alt=""
                                className="h-32 w-32 rounded-lg border object-cover"
                            />
                        )}
                        <Input
                            id="image"
                            name="image"
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                        />
                        <p className="text-muted-foreground text-xs">
                            JPG, PNG or WebP, up to 2 MB.
                        </p>
                        {grammar?.image_url && (
                            <label className="flex items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    name="remove_image"
                                    value="1"
                                    checked={removeImage}
                                    onChange={(e) =>
                                        setRemoveImage(e.target.checked)
                                    }
                                />
                                Remove current picture
                            </label>
                        )}
                        <InputError message={errors.image} />
                    </div>

                    <div className="flex items-center gap-3">
                        <Button disabled={processing}>{submitLabel}</Button>
                        {children}
                    </div>
                </>
            )}
        </Form>
    );
}
