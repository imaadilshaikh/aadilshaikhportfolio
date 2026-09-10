/*
 * Design direction: Unmasking Signal — a tactile suspended portrait uses ink,
 * signal red, and restrained physical motion without changing surrounding content.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

type HangingProfileImageProps = {
  src: string;
  alt: string;
  className?: string;
  timelineControlled?: boolean;
};

export default function HangingProfileImage({ src, alt, className = "", timelineControlled = false }: HangingProfileImageProps) {
  const hangingRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const root = hangingRef.current;
    if (!root || timelineControlled) return;

    let media: gsap.MatchMedia | undefined;
    const ctx = gsap.context(() => {
      media = gsap.matchMedia();
      media.add("(min-width: 701px) and (prefers-reduced-motion: no-preference)", () => {
        const assembly = root.querySelector<HTMLElement>(".hanging-profile__assembly");
        const frame = root.querySelector<HTMLElement>(".hanging-profile__frame");
        if (!assembly || !frame) return;

        const swing = gsap.to(assembly, {
          rotate: 2.5,
          transformOrigin: "top center",
          duration: 2.8,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          paused: true,
        });
        const glow = gsap.to(frame, {
          boxShadow: "0 10px 24px rgba(179, 21, 28, 0.16), 9px 11px 0 rgba(23, 25, 34, 0.82)",
          duration: 2.05,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          paused: true,
        });
        const entrance = gsap.fromTo(
          assembly,
          { y: -800, rotate: -1.2, autoAlpha: 0.2 },
          {
            y: 0,
            rotate: 0,
            autoAlpha: 1,
            duration: 1.55,
            ease: "elastic.out(1, 0.58)",
            scrollTrigger: { trigger: root, start: "top 85%", once: true },
            onComplete: () => {
              swing.play();
              glow.play();
            },
          },
        );

        return () => {
          entrance.kill();
          swing.kill();
          glow.kill();
        };
      });
    }, root);

    return () => {
      media?.revert();
      ctx.revert();
    };
  }, [timelineControlled]);

  return (
    <div className={`hanging-profile ${className}`.trim()} ref={hangingRef}>
      <div className="hanging-profile__assembly">
        <span className="hanging-profile__thread" aria-hidden="true" />
        <span className="hanging-profile__anchor" aria-hidden="true" />
        <div className="hanging-profile__frame">
          <img className="hanging-profile__image" src={src} alt={alt} />
        </div>
      </div>
    </div>
  );
}
