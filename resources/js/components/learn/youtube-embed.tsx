export function YoutubeEmbed({ embedUrl }: { embedUrl: string }) {
    return (
        <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
            <iframe
                src={embedUrl}
                className="size-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Video"
            />
        </div>
    );
}
