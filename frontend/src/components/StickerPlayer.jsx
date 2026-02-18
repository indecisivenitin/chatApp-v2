import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import { loadTgs } from "../utils/loadTgs";

const StickerPlayer = ({ src, size = 120 }) => {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    let mounted = true;

    loadTgs(src).then((data) => {
      if (mounted) setAnimationData(data);
    });

    return () => {
      mounted = false;
    };
  }, [src]);

  if (!animationData) return null;

  return (
    <Lottie
      animationData={animationData}
      loop
      autoplay
      style={{ width: size, height: size }}
    />
  );
};

export default StickerPlayer;
