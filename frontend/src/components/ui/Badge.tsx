interface Props {
  label: string;
  variant?: "green" | "yellow" | "red" | "grey" | "blue" | "live";
}

export const Badge = ({ label, variant = "grey" }: Props) => (
  <span className={`badge badge--${variant}`}>{label}</span>
);
