import BottomNavItem from "./bottomNav/bottomNavItem";
import HomeIcon from "./bottomNav/icons/HomeIcon";
import AlarmIcon from "./bottomNav/icons/AlarmIcon";
import ProjectIcon from "./bottomNav/icons/ProjectIcon";
import ChatIcon from "./bottomNav/icons/ChatIcon";
import MyIcon from "./bottomNav/icons/MyIcon";

export default function BottomNavLayout() {
  return (
    <>
      <footer
        className="
          fixed bottom-0 left-0 z-50
          w-full h-[8%]
          px-[32px] py-[15px]
          flex justify-between items-center
          bg-white
          shadow-[0_-4px_10px_rgba(0,0,0,0.1)]
        "
      >
        <BottomNavItem to="/" end icon={<HomeIcon className="w-6 h-6" />} />
        <BottomNavItem to="/notice" icon={<AlarmIcon className="w-6 h-6" />} />
        <BottomNavItem to="/project" icon={<ProjectIcon className="w-6 h-6" />} />
        <BottomNavItem to="/chat" icon={<ChatIcon className="w-6 h-6" />} />
        <BottomNavItem to="/my" icon={<MyIcon className="w-6 h-6" />} />
      </footer>
    </>
  );
}
