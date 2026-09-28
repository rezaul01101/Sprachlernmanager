import { Head, Link, usePage } from '@inertiajs/react';
import {
    Award,
    BookMarked,
    BookOpen,
    Check,
    Headphones,
    Mic,
    Video,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { dashboard, home, login, register } from '@/routes';

const SKILLS = [
    { icon: BookMarked, title: 'Vocabulary', done: true },
    { icon: Headphones, title: 'Listening', done: true },
    { icon: BookOpen, title: 'Reading', done: false },
    { icon: Mic, title: 'Speaking', done: false },
];

const FEATURES = [
    {
        icon: BookMarked,
        title: 'Vocabulary',
        description: 'Learn new words and review them with purpose.',
    },
    {
        icon: Headphones,
        title: 'Listening',
        description:
            'Audio and video exercises to build your listening comprehension.',
    },
    {
        icon: BookOpen,
        title: 'Reading',
        description: 'Short texts matched to your level.',
    },
    {
        icon: Mic,
        title: 'Speaking',
        description: 'Practise repeating phrases and dialogues.',
    },
    {
        icon: Video,
        title: 'Videos',
        description: 'Short videos to see German in action.',
    },
    {
        icon: Award,
        title: 'Rewards',
        description: 'Keep your streak going and earn a badge for every level.',
    },
];

const STEPS = [
    {
        title: 'Choose your level',
        description: 'Start at A1 or jump straight in at your own level.',
    },
    {
        title: 'Practise daily',
        description:
            'Short lessons covering vocabulary, listening, reading and speaking.',
    },
    {
        title: 'Lock in your progress',
        description:
            'Keep your streak, earn badges, and reach your goal level by level.',
    },
];

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1'];

export default function Welcome() {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Welcome" />

            <div className="bg-background text-foreground min-h-screen">
                <header className="border-b">
                    <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
                        <Link href={home()} className="flex items-center">
                            <AppLogo />
                        </Link>

                        <nav className="flex items-center gap-2">
                            {auth.user ? (
                                <Button asChild size="sm">
                                    <Link href={dashboard()}>
                                        Go to dashboard
                                    </Link>
                                </Button>
                            ) : (
                                <>
                                    <Button asChild variant="ghost" size="sm">
                                        <Link href={login()}>Log in</Link>
                                    </Button>
                                    <Button asChild size="sm">
                                        <Link href={register()}>Sign up</Link>
                                    </Button>
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                <main>
                    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
                        <div className="grid items-center gap-12 lg:grid-cols-2">
                            <div className="space-y-6">
                                <span className="bg-muted text-muted-foreground inline-flex items-center rounded-full px-3 py-1 text-xs font-medium">
                                    🚉 Your station for learning German
                                </span>
                                <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl">
                                    Next stop:{' '}
                                    <span className="text-primary">
                                        German.
                                    </span>
                                </h1>
                                <p className="text-muted-foreground max-w-xl text-lg text-pretty">
                                    Short, daily lessons for vocabulary,
                                    listening, reading and speaking — step by
                                    step from A1 to C1.
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    {auth.user ? (
                                        <Button asChild size="lg">
                                            <Link href={dashboard()}>
                                                Continue to your lessons
                                            </Link>
                                        </Button>
                                    ) : (
                                        <>
                                            <Button asChild size="lg">
                                                <Link href={register()}>
                                                    Sign up for free
                                                </Link>
                                            </Button>
                                            <Button
                                                asChild
                                                variant="outline"
                                                size="lg"
                                            >
                                                <Link href={login()}>
                                                    I already have an account
                                                </Link>
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="mx-auto w-full max-w-sm">
                                <div className="bg-card space-y-4 rounded-2xl border p-5 shadow-lg">
                                    <div className="flex items-center justify-between">
                                        <div className="bg-foreground text-background inline-flex rounded-full px-3 py-1 text-xs font-semibold">
                                            🔥 5 days
                                        </div>
                                        <div className="bg-muted text-primary rounded-full px-2.5 py-1 font-mono text-xs font-bold">
                                            A1 · Day 3
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        {SKILLS.map((skill) => (
                                            <div
                                                key={skill.title}
                                                className="bg-background flex items-center gap-4 rounded-xl border p-3"
                                            >
                                                <div className="bg-muted flex size-9 shrink-0 items-center justify-center rounded-lg">
                                                    <skill.icon className="text-primary size-4" />
                                                </div>
                                                <div className="min-w-0 flex-1 text-sm font-semibold">
                                                    {skill.title}
                                                </div>
                                                <div
                                                    className={cn(
                                                        'flex size-5 shrink-0 items-center justify-center rounded-full border-2',
                                                        skill.done
                                                            ? 'border-emerald-600 bg-emerald-600'
                                                            : 'border-muted-foreground/30',
                                                    )}
                                                >
                                                    {skill.done && (
                                                        <Check className="size-3 text-white" />
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="border-t">
                        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
                            <div className="mb-10 text-center">
                                <h2 className="text-3xl font-bold tracking-tight">
                                    How it works
                                </h2>
                            </div>
                            <div className="grid gap-8 sm:grid-cols-3">
                                {STEPS.map((step, index) => (
                                    <div
                                        key={step.title}
                                        className="space-y-3 text-center sm:text-left"
                                    >
                                        <div className="border-primary/30 text-primary mx-auto flex size-10 items-center justify-center rounded-full border-2 font-mono font-bold sm:mx-0">
                                            {index + 1}
                                        </div>
                                        <h3 className="font-semibold">
                                            {step.title}
                                        </h3>
                                        <p className="text-muted-foreground text-sm">
                                            {step.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="bg-muted/40 border-t">
                        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
                            <div className="mb-10 text-center">
                                <h2 className="text-3xl font-bold tracking-tight">
                                    Everything you need to learn
                                </h2>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {FEATURES.map((feature) => (
                                    <div
                                        key={feature.title}
                                        className="bg-card space-y-3 rounded-xl border p-5"
                                    >
                                        <div className="bg-muted flex size-10 items-center justify-center rounded-lg">
                                            <feature.icon className="text-primary size-5" />
                                        </div>
                                        <h3 className="font-semibold">
                                            {feature.title}
                                        </h3>
                                        <p className="text-muted-foreground text-sm">
                                            {feature.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="border-t">
                        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
                            <div className="mb-10 text-center">
                                <h2 className="text-3xl font-bold tracking-tight">
                                    Your route map
                                </h2>
                                <p className="text-muted-foreground mt-2">
                                    Five stops from your first words to
                                    confident conversation.
                                </p>
                            </div>
                            <div className="flex items-center justify-between gap-1 overflow-x-auto pb-2 sm:gap-2">
                                {LEVELS.map((level, index) => (
                                    <div
                                        key={level}
                                        className="flex flex-1 items-center"
                                    >
                                        <div
                                            className={cn(
                                                'flex size-12 shrink-0 items-center justify-center rounded-full border-2 font-mono text-sm font-bold',
                                                index === 0
                                                    ? 'border-primary bg-primary text-primary-foreground'
                                                    : 'border-muted-foreground/30 bg-background text-muted-foreground',
                                            )}
                                        >
                                            {level}
                                        </div>
                                        {index < LEVELS.length - 1 && (
                                            <div className="bg-border mx-1 h-0.5 flex-1" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="border-t">
                        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6">
                            <h2 className="text-3xl font-bold tracking-tight">
                                Ready for your first lesson?
                            </h2>
                            <p className="text-muted-foreground mx-auto mt-2 max-w-xl">
                                Hop on board now — sign up for free and start
                                with Day 1 right away.
                            </p>
                            <div className="mt-6 flex flex-wrap justify-center gap-3">
                                {auth.user ? (
                                    <Button asChild size="lg">
                                        <Link href={dashboard()}>
                                            Go to dashboard
                                        </Link>
                                    </Button>
                                ) : (
                                    <>
                                        <Button asChild size="lg">
                                            <Link href={register()}>
                                                Sign up for free
                                            </Link>
                                        </Button>
                                        <Button
                                            asChild
                                            variant="outline"
                                            size="lg"
                                        >
                                            <Link href={login()}>Log in</Link>
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </section>
                </main>

                <footer className="border-t">
                    <div className="text-muted-foreground mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-8 text-sm sm:flex-row sm:px-6">
                        <span>
                            &copy; {new Date().getFullYear()} Sprachbahnhof
                        </span>
                        <div className="flex gap-4">
                            <Link
                                href={login()}
                                className="hover:text-foreground"
                            >
                                Log in
                            </Link>
                            <Link
                                href={register()}
                                className="hover:text-foreground"
                            >
                                Sign up
                            </Link>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
