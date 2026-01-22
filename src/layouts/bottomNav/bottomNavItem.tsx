import { NavLink, useMatch } from "react-router-dom";

type Props = {
  to: string;
  icon: React.ReactNode;
  end?: boolean;
};

export default function BottomNavItem({ to, icon, end }: Props) {
  const match = useMatch(end ? to : `${to}/*`);
  const isActive = !!match;

  return (
    <NavLink
      to={to}
      className={`
        flex items-center justify-center
        transition-colors duration-300
        ${isActive ? "text-[#0060EF]" : "text-black hover:text-[#0060EF]"}
      `}
    >
      {icon}
    </NavLink>
  );
}
