interface IconProps {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}

export function CheckIcon({
  width = 24,
  height = 24,
  color = "currentColor",
  className = "",
}: IconProps) {
  return (
    <svg
      width={width}
      height={height}
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke={color}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}
