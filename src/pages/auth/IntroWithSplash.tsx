import { useEffect, useState } from "react";
import Intro from "./intro";
import SplashScreen from "./SplashScreen";

const SPLASH_MIN_MS = 1200;

export default function IntroWithSplash() {
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowIntro(true), SPLASH_MIN_MS);
    return () => clearTimeout(t);
  }, []);

  if (showIntro) return <Intro />;
  return <SplashScreen />;
}
