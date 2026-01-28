import LogoIcon from "../../assets/layouts/header/logo.svg";

export default function Headers() {

  return (
    <>
      <header className="fixed top-0 z-50 w-full h-[5%] bg-white flex items-center relative">
        <img
          src={LogoIcon}
          alt="back"
          className="absolute left-4 top-2"
        />
      </header>
    </>
  );
}