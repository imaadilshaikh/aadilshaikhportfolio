/**
 * Design direction: Unmasking Signal — editorial red-and-ink hero where the
 * cursor exposes the identity portrait beneath the masked overlay while the
 * Spider-Man artwork remains the clear resting state.
 */
import { ArrowDownRight, MousePointer2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { PORTFOLIO_ASSETS } from "@/assets/portfolioAssets";

const IDENTITY_LAYER = PORTFOLIO_ASSETS.hero.identity;
const MASK_LAYER = PORTFOLIO_ASSETS.hero.mask;
const WEB_DECORATION = PORTFOLIO_ASSETS.decorations.web;

export default function FaceRevealHero() {
  const heroRef = useRef<HTMLElement | null>(null);
  const maskRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const mask = maskRef.current;
    if (!hero || !mask) return;

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let isTracking = false;
    let isInViewport = true;
    let target = { x: window.innerWidth * 0.55, y: window.innerHeight * 0.5 };
    let current = { ...target };

    const paint = () => {
      frame = 0;
      if (!isTracking) return;
      current.x += (target.x - current.x) * 0.14;
      current.y += (target.y - current.y) * 0.14;
      mask.style.setProperty("--spot-x", `${current.x}px`);
      mask.style.setProperty("--spot-y", `${current.y}px`);
      if (Math.abs(target.x - current.x) > 0.25 || Math.abs(target.y - current.y) > 0.25) {
        frame = requestAnimationFrame(paint);
      }
    };

    const requestPaint = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };

    const pointerMove = (event: PointerEvent) => {
      if (!finePointer.matches || reducedMotion.matches) return;
      const bounds = hero.getBoundingClientRect();
      hero.classList.add("is-revealing-identity");
      target = {
        x: Math.max(0, Math.min(bounds.width, event.clientX - bounds.left)),
        y: Math.max(0, Math.min(bounds.height, event.clientY - bounds.top)),
      };
      requestPaint();
    };

    const pointerLeave = () => hero.classList.remove("is-revealing-identity");

    const setRevealPoint = (event: PointerEvent) => {
      const bounds = hero.getBoundingClientRect();
      mask.style.setProperty("--spot-x", `${Math.max(0, Math.min(bounds.width, event.clientX - bounds.left))}px`);
      mask.style.setProperty("--spot-y", `${Math.max(0, Math.min(bounds.height, event.clientY - bounds.top))}px`);
    };

    const mobileRevealStart = (event: PointerEvent) => {
      if (finePointer.matches || reducedMotion.matches || event.pointerType === "mouse") return;
      if ((event.target as HTMLElement).closest("a, button")) return;
      setRevealPoint(event);
      hero.classList.add("is-revealing-identity");
    };

    const mobileRevealMove = (event: PointerEvent) => {
      if (finePointer.matches || reducedMotion.matches || event.pointerType === "mouse") return;
      if (!hero.classList.contains("is-revealing-identity")) return;
      setRevealPoint(event);
    };

    const mobileRevealEnd = () => hero.classList.remove("is-revealing-identity");

    const recenter = () => {
      const bounds = hero.getBoundingClientRect();
      target = { x: bounds.width * 0.56, y: bounds.height * 0.5 };
      current = { ...target };
      mask.style.setProperty("--spot-x", `${current.x}px`);
      mask.style.setProperty("--spot-y", `${current.y}px`);
    };

    const stopTracking = () => {
      if (!isTracking) return;
      isTracking = false;
      cancelAnimationFrame(frame);
      frame = 0;
      hero.classList.remove("is-revealing-identity");
      hero.removeEventListener("pointermove", pointerMove);
      hero.removeEventListener("pointerleave", pointerLeave);
    };

    const startTracking = () => {
      if (isTracking || !isInViewport || !finePointer.matches || reducedMotion.matches || document.hidden) return;
      isTracking = true;
      recenter();
      hero.addEventListener("pointermove", pointerMove, { passive: true });
      hero.addEventListener("pointerleave", pointerLeave);
    };

    const handleInputChange = () => {
      stopTracking();
      recenter();
      startTracking();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) stopTracking();
      else startTracking();
    };

    const observer = typeof IntersectionObserver === "undefined"
      ? null
      : new IntersectionObserver(([entry]) => {
          isInViewport = entry.isIntersecting;
          if (isInViewport) startTracking();
          else stopTracking();
        }, { threshold: 0.05 });

    recenter();
    startTracking();
    observer?.observe(hero);
    hero.addEventListener("pointerdown", mobileRevealStart, { passive: true });
    hero.addEventListener("pointermove", mobileRevealMove, { passive: true });
    hero.addEventListener("pointerup", mobileRevealEnd, { passive: true });
    hero.addEventListener("pointercancel", mobileRevealEnd, { passive: true });
    window.addEventListener("resize", recenter, { passive: true });
    finePointer.addEventListener("change", handleInputChange);
    reducedMotion.addEventListener("change", handleInputChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      stopTracking();
      hero.removeEventListener("pointerdown", mobileRevealStart);
      hero.removeEventListener("pointermove", mobileRevealMove);
      hero.removeEventListener("pointerup", mobileRevealEnd);
      hero.removeEventListener("pointercancel", mobileRevealEnd);
      window.removeEventListener("resize", recenter);
      finePointer.removeEventListener("change", handleInputChange);
      reducedMotion.removeEventListener("change", handleInputChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      observer?.disconnect();
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className="reveal-hero"
      aria-label="Portrait reveal demonstration"
    >
      <div className="hero-grain" aria-hidden="true" />
      <img
        src={IDENTITY_LAYER}
        alt="Aadil Shaikh in a Spider-Man suit portrait"
        className="hero-layer hero-identity"
      />
      <img
        ref={maskRef}
        src={MASK_LAYER}
        alt=""
        className="hero-layer hero-mask"
        aria-hidden="true"
      />

      <div className="web-frame" aria-hidden="true">
        <img src={WEB_DECORATION} className="web web-top" alt="" />
        <img src={WEB_DECORATION} className="web web-bottom" alt="" />
      </div>

      <div className="hero-scrim" aria-hidden="true" />

      <div className="hero-copy" style={{ paddingBottom: 80 }}>
        <p className="hero-eyebrow">
          <span className="signal-dot" /> Innovation should be experienced, not explained
        </p>
        <h1>
          <span>Aadil</span>
          <span>Shaikh.</span>
        </h1>
        <div className="hero-actions">
          <a className="primary-action" href="#projects" style={{ borderRadius: 5, fontSize: 10 }}>
            Explore projects <ArrowDownRight aria-hidden="true" size={18} strokeWidth={2.5} />
          </a>
          <a className="secondary-action" href="#contact" style={{ borderRadius: 6, fontSize: 10 }}>
            Let&apos;s talk <span aria-hidden="true">01</span>
          </a>
        </div>
      </div>

      <div className="reveal-guide" aria-label="Touch and hold to reveal identity" aria-live="polite">
        <MousePointer2 aria-hidden="true" size={15} strokeWidth={2.1} />
        <span>Move to reveal identity</span>
      </div>

      <div className="hero-index" aria-hidden="true">
        <span>01</span>
        <i />
        <span>Hero experiment</span>
      </div>
    </section>
  );
}
