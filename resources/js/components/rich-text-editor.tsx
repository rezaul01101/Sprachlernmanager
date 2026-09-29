import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
    Bold,
    Heading2,
    Heading3,
    Italic,
    List,
    ListOrdered,
    Quote,
    Redo2,
    Strikethrough,
    Underline as UnderlineIcon,
    Undo2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { cn } from '@/lib/utils';

type Props = {
    value: string;
    onChange: (html: string) => void;
    id?: string;
    invalid?: boolean;
};

export const richTextClasses =
    '[&_h2]:mt-4 [&_h2]:mb-2 [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:mt-3 [&_h3]:mb-1 [&_h3]:text-lg [&_h3]:font-semibold [&_p]:my-2 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_blockquote]:border-l-4 [&_blockquote]:pl-4 [&_blockquote]:italic';

export default function RichTextEditor({
    value,
    onChange,
    id,
    invalid,
}: Props) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [2, 3] },
                // Sanitiser on the server has no link/code/rule allowlist.
                link: false,
                code: false,
                codeBlock: false,
                horizontalRule: false,
            }),
        ],
        content: value,
        immediatelyRender: false,
        editorProps: {
            attributes: {
                ...(id ? { id } : {}),
                class: cn(
                    'min-h-40 px-3 py-2 text-sm outline-none',
                    richTextClasses,
                ),
            },
        },
        onUpdate: ({ editor }) =>
            onChange(editor.isEmpty ? '' : editor.getHTML()),
    });

    if (!editor) return null;

    const buttons: {
        label: string;
        icon: LucideIcon;
        active: boolean;
        run: () => void;
    }[] = [
        {
            label: 'Bold',
            icon: Bold,
            active: editor.isActive('bold'),
            run: () => editor.chain().focus().toggleBold().run(),
        },
        {
            label: 'Italic',
            icon: Italic,
            active: editor.isActive('italic'),
            run: () => editor.chain().focus().toggleItalic().run(),
        },
        {
            label: 'Underline',
            icon: UnderlineIcon,
            active: editor.isActive('underline'),
            run: () => editor.chain().focus().toggleUnderline().run(),
        },
        {
            label: 'Strikethrough',
            icon: Strikethrough,
            active: editor.isActive('strike'),
            run: () => editor.chain().focus().toggleStrike().run(),
        },
        {
            label: 'Heading 2',
            icon: Heading2,
            active: editor.isActive('heading', { level: 2 }),
            run: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
        },
        {
            label: 'Heading 3',
            icon: Heading3,
            active: editor.isActive('heading', { level: 3 }),
            run: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
        },
        {
            label: 'Bullet list',
            icon: List,
            active: editor.isActive('bulletList'),
            run: () => editor.chain().focus().toggleBulletList().run(),
        },
        {
            label: 'Numbered list',
            icon: ListOrdered,
            active: editor.isActive('orderedList'),
            run: () => editor.chain().focus().toggleOrderedList().run(),
        },
        {
            label: 'Quote',
            icon: Quote,
            active: editor.isActive('blockquote'),
            run: () => editor.chain().focus().toggleBlockquote().run(),
        },
    ];

    return (
        <div
            className={cn(
                'border-input focus-within:border-ring focus-within:ring-ring/50 rounded-md border shadow-xs focus-within:ring-[3px]',
                invalid && 'border-destructive',
            )}
        >
            <div className="flex flex-wrap items-center gap-1 border-b p-1">
                {buttons.map(({ label, icon: Icon, active, run }) => (
                    <Toggle
                        key={label}
                        size="sm"
                        type="button"
                        aria-label={label}
                        title={label}
                        pressed={active}
                        onPressedChange={run}
                    >
                        <Icon className="size-4" />
                    </Toggle>
                ))}
                <div className="ml-auto flex items-center gap-1">
                    <Toggle
                        size="sm"
                        type="button"
                        aria-label="Undo"
                        title="Undo"
                        pressed={false}
                        disabled={!editor.can().undo()}
                        onPressedChange={() =>
                            editor.chain().focus().undo().run()
                        }
                    >
                        <Undo2 className="size-4" />
                    </Toggle>
                    <Toggle
                        size="sm"
                        type="button"
                        aria-label="Redo"
                        title="Redo"
                        pressed={false}
                        disabled={!editor.can().redo()}
                        onPressedChange={() =>
                            editor.chain().focus().redo().run()
                        }
                    >
                        <Redo2 className="size-4" />
                    </Toggle>
                </div>
            </div>
            <EditorContent editor={editor} />
        </div>
    );
}
