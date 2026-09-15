/**
 * Accepts watch/share/shorts/embed YouTube URLs and returns a playable
 * `youtube.com/embed/...` URL, or null if the input isn't a YouTube link.
 */
export function getYoutubeEmbedUrl(
    input: string | null | undefined,
): string | null {
    const trimmed = input?.trim();
    if (!trimmed) {
        return null;
    }

    try {
        const url = new URL(trimmed);
        const host = url.hostname.replace(/^www\./, '');

        if (host === 'youtu.be') {
            const id = url.pathname.slice(1);
            return id ? `https://www.youtube.com/embed/${id}` : null;
        }

        if (host === 'youtube.com' || host === 'm.youtube.com') {
            if (url.pathname === '/watch') {
                const id = url.searchParams.get('v');
                return id ? `https://www.youtube.com/embed/${id}` : null;
            }

            const shortsMatch = url.pathname.match(/^\/shorts\/([\w-]+)/);
            if (shortsMatch) {
                return `https://www.youtube.com/embed/${shortsMatch[1]}`;
            }

            const embedMatch = url.pathname.match(/^\/embed\/([\w-]+)/);
            if (embedMatch) {
                return `https://www.youtube.com/embed/${embedMatch[1]}`;
            }
        }
    } catch {
        return null;
    }

    return null;
}
