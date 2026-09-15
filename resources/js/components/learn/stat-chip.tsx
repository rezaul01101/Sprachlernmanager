export function StatChip({
    label,
    value,
}: {
    label: string;
    value: string | number;
}) {
    return (
        <div className="bg-card flex-1 rounded-xl border p-3 text-center">
            <div className="text-xl font-bold">{value}</div>
            <div className="text-muted-foreground text-xs">{label}</div>
        </div>
    );
}
