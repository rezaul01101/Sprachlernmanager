export function getMatchLabel(percent: number): string {
    if (percent >= 90) return 'Excellent match';
    if (percent >= 75) return 'Very good match';
    return 'Practice makes perfect';
}
