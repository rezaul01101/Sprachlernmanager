import { Head } from '@inertiajs/react';
import { VideoPlaceholderCard } from '@/components/learn/video-placeholder-card';
import { VIDEOS } from '@/data/learn/videos';

export default function LearnVideos() {
    return (
        <>
            <Head title="Videos" />

            <div className="mx-auto max-w-2xl space-y-5 p-4">
                <p className="text-muted-foreground text-sm">
                    Kurzvideos zum Üben
                </p>

                {VIDEOS.map((video) => (
                    <div key={video.title} className="space-y-2">
                        <VideoPlaceholderCard label={video.title} />
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                                {video.title}
                            </span>
                            <span className="text-muted-foreground font-mono text-xs">
                                {video.duration_label}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
