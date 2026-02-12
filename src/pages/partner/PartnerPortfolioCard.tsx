export type PortfolioItemData = {
  title: string;
  linkLabel: string;
  description: string;
};

const cardStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  alignSelf: "stretch",
  borderRadius: "8px",
};

const titleBarStyle: React.CSSProperties = {
  display: "flex",
  height: "64px",
  padding: "18px 20px",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  alignSelf: "stretch",
  background: "var(--gray-gray_900, #121212)",
};

const linkBoxStyle: React.CSSProperties = {
  display: "flex",
  height: "28px",
  padding: "4px 10px",
  justifyContent: "center",
  alignItems: "center",
  gap: "10px",
  borderRadius: "4px",
  background: "var(--blue-primary-blue, #0060EF)",
};

type Props = PortfolioItemData;

export default function PartnerPortfolioCard({
  title,
  linkLabel,
  description,
}: Props) {
  return (
    <div className="w-full overflow-hidden" style={cardStyle}>
      <div className="flex items-center text-white" style={titleBarStyle}>
        <span className="text-sm font-medium">{title}</span>
        <a
          href="#"
          className="shrink-0 text-sm font-medium text-white"
          style={linkBoxStyle}
        >
          {linkLabel}
        </a>
      </div>
      <div className="w-full bg-zinc-100 px-4 py-3">
        <p className="text-sm text-zinc-700">{description}</p>
      </div>
    </div>
  );
}
