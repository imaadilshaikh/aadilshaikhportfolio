import favicon from "./IMAGES/cropped_circle_image.png";
import heroMask from "./IMAGES/image-1-fYP2o7gg.png";
import facePortrait from "./IMAGES/portrait_wolf_cut_1600x893.png";
import spiderMark from "./IMAGES/spydy-DLbFrGCQ.png";
import aboutPortrait from "./IMAGES/IMG_20260519_150007_987.webp";
import webDecoration from "./IMAGES/web1-770H2sSx.png";
import spiderHanging from "./IMAGES/spydy_hang-Cac1gK30.png";
import spiderStanding from "./IMAGES/spydy_stand-BwBM-zCr.png";

export const PORTFOLIO_ASSETS = {
  favicon,
  hero: {
    identity: facePortrait,
    mask: heroMask,
  },
  portraits: {
    about: aboutPortrait,
  },
  decorations: {
    web: webDecoration,
    spiderMark,
    spiderHanging,
    spiderStanding,
  },
} as const;

