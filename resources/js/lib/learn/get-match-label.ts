export function getMatchLabel(percent: number): string {
    if (percent >= 90) return 'Ausgezeichnet getroffen';
    if (percent >= 75) return 'Sehr gut getroffen';
    return 'Übung macht den Meister';
}
