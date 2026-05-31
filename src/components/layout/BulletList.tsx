type BulletListProps = {
  items: string[];
};

export function BulletList({ items }: BulletListProps) {
  return (
    <ul className="space-y-2 text-xs leading-relaxed text-nexvo-muted">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span className="text-nexvo-purple-500">•</span>
          {item}
        </li>
      ))}
    </ul>
  );
}
