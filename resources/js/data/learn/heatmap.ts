export const HEATMAP_DAY_INITIALS = ['M', 'D', 'M', 'D', 'F', 'S', 'S'];

const INTENSITIES: (0 | 1 | 2 | 3 | 4)[] = [
    2, 3, 0, 4, 1, 0, 0, 3, 3, 2, 4, 2, 1, 0, 1, 2, 3, 3, 4, 2, 0, 4, 3, 2, 1,
    3, 0, 0,
];

export const HEATMAP_CELLS: { intensity: 0 | 1 | 2 | 3 | 4 }[] =
    INTENSITIES.map((intensity) => ({ intensity }));
