interface OrnamentalDividerProps {
  text?: string;
}

export function OrnamentalDivider({ text }: OrnamentalDividerProps) {
  if (text) {
    return (
      <div className="ornamental-divider my-4">
        <span className="text-gold-400/70 text-sm font-medium whitespace-nowrap">{text}</span>
      </div>
    );
  }
  return <div className="ornamental-divider my-4" />;
}
