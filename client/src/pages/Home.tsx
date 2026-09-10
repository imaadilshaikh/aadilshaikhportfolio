/*
 * Design direction: Unmasking Signal — the completed cursor-driven hero remains
 * untouched; the page below continues its editorial red, ink, web, and paper system.
 */
import FaceRevealHero from "@/components/FaceRevealHero";
import HangingProfileImage from "@/components/HangingProfileImage";
import { Spinner } from "@/components/ui/spinner";
import { PORTFOLIO_ASSETS } from "@/assets/portfolioAssets";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Menu, X } from "lucide-react";
import { type FormEvent, useLayoutEffect, useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

const marqueeLabels = [
  "Frontend Development",
  "UI/UX Design",
  "GSAP Animations",
  "React Native",
  "Full Stack Engineer",
];

const stack = ["React", "Node.js", "Express", "FastAPI", "MongoDB", "Docker", "Next.js"];

// TODO: Replace with your real n8n webhook URL — "nope-1" looks like a placeholder
// subdomain, so as written every submission will fail and show the error message.
const N8N_CONTACT_WEBHOOK = "https://nope-1.app.n8n.cloud/webhook/form-submit";

const skills = [
  ["React / Next.js", "Frontend", "Advanced"],
  ["JavaScript / TS", "Languages", "Advanced"],
  ["Node.js & Express", "Backend", "Advanced"],
  ["PostgreSQL & Mongo", "Backend", "Proficient"],
  ["Docker & DevTools", "DevTools", "Proficient"],
  ["Python / AI & ML", "Languages", "Proficient"],
  ["GSAP Animations", "Frontend", "Advanced"],
  ["Tailwind CSS", "Frontend", "Advanced"],
  ["Git & GitHub", "Tools", "Advanced"],
  ["Data Structures", "Languages", "Advanced"],
];

const projects = [
  {
    number: "01",
    title: "Multi-Tenant SaaS Platform",
    description:
      "Engineered a containerized multi-tenant SaaS application featuring strict data isolation, dynamic tenancy resolution, and role-based access control.",
    tools: ["React", "Node.js", "PostgreSQL", "Docker"],
  },
  {
    number: "02",
    title: "Full-Stack Payment Gateway",
    description:
      "Built a robust payment gateway system simulating real-time transaction state management, secure webhooks, and multi-method processing workflows.",
    tools: ["Node.js", "Express", "MongoDB", "REST APIs"],
  },
  {
    number: "03",
    title: "AI-Voice Agent Platform",
    description:
      "Developed a voice-first AI platform that processes spoken requests, delivers context-aware responses, and creates a responsive conversational experience.",
    tools: ["React", "FastAPI", "AI / ML"],
  },
  {
    number: "04",
    title: "Productivity Suite Extension",
    description:
      "Created a focused Chrome extension with JavaScript and Chrome APIs to make personal task management and everyday workflows easier to run.",
    tools: ["JavaScript", "Chrome APIs", "Tailwind"],
  },
];

function Marquee({ tone }: { tone: "signal" | "ink" }) {
  return (
    <div className={`marquee-strip marquee-strip--${tone}`} aria-label="Core specialities">
      <div className="marquee-track">
        {[...marqueeLabels, ...marqueeLabels].map((label, index) => (
          <span className="marquee-item" key={`${tone}-${label}-${index}`}>
            {label}
            <img
              src={index % 2 === 0 ? PORTFOLIO_ASSETS.decorations.spiderMark : PORTFOLIO_ASSETS.decorations.web}
              alt=""
              aria-hidden="true"
            />
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const pageRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const handleContactSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const payload = new URLSearchParams({
        name,
        email,
        message,
        subject: `Portfolio contact from ${name}`,
        source: "aadil-shaikh-portfolio",
        submittedAt: new Date().toISOString(),
      });
      const response = await fetch(N8N_CONTACT_WEBHOOK, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: payload,
      });

      if (!response.ok) throw new Error("Webhook submission failed");

      form.reset();
      setSubmitStatus("success");
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const page = pageRef.current;
    if (!page || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cleanups: Array<() => void> = [];
    const ctx = gsap.context(() => {
      const media = gsap.matchMedia();
      const query = gsap.utils.selector(page);
      const titleEase = "power4.out";
      const revealEase = "power4.out";
      cleanups.push(() => media.revert());

      const header = headerRef.current;
      if (header) {
        const syncHeaderSurface = () => {
          header.classList.toggle("site-header--solid", window.scrollY > window.innerHeight * 0.78);
        };
        syncHeaderSurface();
        window.addEventListener("scroll", syncHeaderSurface, { passive: true });
        cleanups.push(() => window.removeEventListener("scroll", syncHeaderSurface));

        const navLinks = Array.from(header.querySelectorAll<HTMLAnchorElement>('nav a[href^="#"]'));
        const navSections = navLinks
          .map((link) => ({ link, id: link.getAttribute("href")?.slice(1) ?? "" }))
          .map(({ link, id }) => ({ link, id, section: id ? document.getElementById(id) : null }))
          .filter((entry): entry is { link: HTMLAnchorElement; id: string; section: HTMLElement } => Boolean(entry.section));
        const setActiveLink = (id: string) => {
          navLinks.forEach((link) => {
            const active = link.getAttribute("href") === `#${id}`;
            link.classList.toggle("is-active", active);
            if (active) link.setAttribute("aria-current", "page");
            else link.removeAttribute("aria-current");
          });
        };
        const onNavClick = (event: MouseEvent) => {
          const link = event.currentTarget as HTMLAnchorElement;
          const id = link.getAttribute("href")?.slice(1);
          const target = id ? document.getElementById(id) : null;
          if (!id || !target) return;
          event.preventDefault();
          setActiveLink(id);
          target.scrollIntoView({ behavior: "smooth", block: "start" });
          window.history.replaceState(null, "", `#${id}`);
        };
        navLinks.forEach((link) => link.addEventListener("click", onNavClick));
        if (window.IntersectionObserver) {
          const sectionObserver = new IntersectionObserver(
            (entries) => {
              const leadingEntry = entries
                .filter((entry) => entry.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
              if (leadingEntry) setActiveLink(leadingEntry.target.id);
            },
            { rootMargin: "-18% 0px -62% 0px", threshold: [0.12, 0.32, 0.55] },
          );
          navSections.forEach(({ section }) => sectionObserver.observe(section));
          cleanups.push(() => sectionObserver.disconnect());
        }
        cleanups.push(() => navLinks.forEach((link) => link.removeEventListener("click", onNavClick)));
      }

      const heroTimeline = gsap.timeline({ defaults: { ease: titleEase } });
      heroTimeline
        .from(query(".site-header"), { y: -14, autoAlpha: 0, duration: 0.58 })
        .from(query(".web-frame"), { autoAlpha: 0, duration: 0.5 }, "-=0.2")
        .from(query(".hero-copy"), { x: -18, autoAlpha: 0, duration: 0.66 }, "-=0.28")
        .from(query(".reveal-guide, .hero-index"), { y: 8, autoAlpha: 0, duration: 0.42, stagger: 0.08 }, "-=0.34")
        .from(query(".marquee-stage"), { clipPath: "inset(0 50% 0 50%)", duration: 0.9, ease: "expo.out" }, "-=0.08");

      media.add("(max-width: 700px) and (prefers-reduced-motion: no-preference)", () => {
        const mobileReveals: gsap.core.Tween[] = [];
        const addMobileReveal = (selector: string, trigger: string, vars: gsap.TweenVars) => {
          const targets = query(selector);
          const section = query(trigger)[0];
          if (!targets.length || !section) return;
          mobileReveals.push(gsap.fromTo(targets, { autoAlpha: 0, y: 18 }, {
            autoAlpha: 1,
            y: 0,
            duration: 0.46,
            stagger: 0.065,
            ease: "power3.out",
            immediateRender: false,
            scrollTrigger: { trigger: section, start: "top 88%", once: true },
            ...vars,
          }));
        };

        addMobileReveal(".profile-suspension, .about-section .section-kicker, .about-section h2, .about-copy", ".about-section", { stagger: 0.08 });
        addMobileReveal(".skills-heading-block, .skill-row", ".skills-section", { stagger: 0.045 });
        addMobileReveal(".projects-heading-block, .project-card", ".projects-section", { stagger: 0.06 });
        addMobileReveal(".contact-heading-block, .contact-form", ".contact-section", { stagger: 0.08 });

        mobileReveals.push(
          gsap.to(query(".web-top"), { rotate: -16, scale: 1.06, duration: 2.1, ease: "sine.inOut", repeat: -1, yoyo: true }),
          gsap.to(query(".web-bottom"), { rotate: 174, scale: 0.94, duration: 2.35, ease: "sine.inOut", repeat: -1, yoyo: true }),
          gsap.to(query(".profile-suspension .hanging-profile__assembly"), { rotate: 0.85, transformOrigin: "50% 0%", duration: 2.35, ease: "sine.inOut", repeat: -1, yoyo: true }),
          ...query(".tech-pills li").map((pill, index) => gsap.to(pill, {
            y: [-3.8, 3.2, -4.2, 3.6, -3.4, 3.9, -3.7][index] ?? -3.5,
            duration: [1.8, 2.04, 1.72, 1.92, 1.86, 2.08, 1.98][index] ?? 1.9,
            delay: [0, 0.16, 0.3, 0.08, 0.24, 0.38, 0.12][index] ?? 0,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          })),
          gsap.to(query(".hanging-figure"), { rotate: 1, transformOrigin: "50% 0%", duration: 1.7, ease: "sine.inOut", repeat: -1, yoyo: true }),
          gsap.to(query(".standing-figure"), { y: -2, duration: 2.4, ease: "sine.inOut", repeat: -1, yoyo: true }),
          gsap.to(query(".contact-hanging-figure"), { rotate: 1.15, transformOrigin: "50% 0%", duration: 1.9, ease: "sine.inOut", repeat: -1, yoyo: true }),
        );

        return () => mobileReveals.forEach((tween) => tween.kill());
      });

      media.add("(min-width: 701px)", () => {
      const sectionReveal = (section: string, targets: string, options?: gsap.TweenVars) => {
        const sectionElement = query(section)[0];
        const revealTargets = query(targets);
        if (!sectionElement || !revealTargets.length) return;

        gsap.from(revealTargets, {
          y: 20,
          rotateX: 6,
          transformOrigin: "50% 100%",
          autoAlpha: 0,
          duration: 0.7,
          stagger: 0.11,
          ease: revealEase,
          scrollTrigger: { trigger: sectionElement, start: "top 77%", once: true },
          ...options,
        });
      };

      const aboutSection = query(".about-section")[0];
      if (aboutSection) {
        const aboutWebCorners = query(".about-web-corner");
        const aboutWebThreads = query(".about-web-thread");
        const aboutLeftWeb = query(".about-web-corner--left .about-web-art");
        const aboutRightWeb = query(".about-web-corner--right .about-web-art");
        const aboutEyebrow = query(".about-section .section-kicker");
        const aboutHeading = query(".about-section h2");
        const aboutProfile = query(".profile-suspension .hanging-profile__assembly");
        const aboutFrame = query(".profile-suspension .hanging-profile__frame");
        const aboutParagraphs = query(".about-copy > p");
        const aboutStackLabel = query(".stack-block > span");
        const aboutPills = query(".tech-pills li");
        let aboutEntranceComplete = false;
        let playAboutAmbient = () => {};

        media.add("(min-width: 701px)", () => {
          const ambientTweens = [
            gsap.to(aboutLeftWeb, { rotate: "+=360", transformOrigin: "50% 12%", duration: 11.5, ease: "none", repeat: -1, paused: true }),
            gsap.to(aboutRightWeb, { rotate: "-=360", transformOrigin: "50% 12%", duration: 13, ease: "none", repeat: -1, paused: true }),
            gsap.to(aboutProfile, { rotate: 1.6, transformOrigin: "top center", duration: 2.55, ease: "sine.inOut", repeat: -1, yoyo: true, paused: true }),
            gsap.to(aboutFrame, { boxShadow: "0 9px 21px rgba(179, 21, 28, 0.13), 9px 11px 0 rgba(23, 25, 34, 0.8)", duration: 1.5, ease: "sine.inOut", repeat: -1, yoyo: true, paused: true }),
            ...aboutPills.map((pill, index) => {
              const floatSettings = [
                { y: -6.5, duration: 1.85, delay: 0 },
                { y: 5.2, duration: 2.1, delay: 0.2 },
                { y: -5.8, duration: 1.75, delay: 0.38 },
                { y: 6.2, duration: 2, delay: 0.1 },
                { y: -5, duration: 1.9, delay: 0.28 },
                { y: 5.5, duration: 2.15, delay: 0.44 },
                { y: -5.9, duration: 2.05, delay: 0.16 },
              ][index];
              return gsap.to(pill, {
                y: floatSettings?.y ?? -5.4,
                duration: floatSettings?.duration ?? 2,
                delay: floatSettings?.delay ?? 0,
                ease: "sine.inOut",
                repeat: -1,
                yoyo: true,
                paused: true,
              });
            }),
          ];

          playAboutAmbient = () => ambientTweens.forEach((tween) => tween.play());
          if (aboutEntranceComplete) playAboutAmbient();
          return () => {
            ambientTweens.forEach((tween) => tween.kill());
            playAboutAmbient = () => {};
          };
        });

        const aboutTimeline = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: { trigger: aboutSection, start: "top 73%", once: true },
          onComplete: () => {
            aboutEntranceComplete = true;
            playAboutAmbient();
          },
        });
        aboutTimeline
          .from(aboutWebCorners, { y: -142, autoAlpha: 0, duration: 0.96, stagger: 0.12, ease: "elastic.out(0.82, 0.7)" })
          .from(aboutWebThreads, { scaleY: 0, transformOrigin: "top center", duration: 0.5, stagger: 0.08, ease: "power3.out" }, "<0.1")
          .from(aboutEyebrow, { x: -26, autoAlpha: 0, clipPath: "inset(0 100% 0 0)", duration: 0.48 }, "-=0.54")
          .from(aboutHeading, { y: 68, rotateX: -14, autoAlpha: 0, clipPath: "inset(0 0 100% 0)", transformOrigin: "50% 100%", duration: 0.76 }, "-=0.18")
          .from(aboutProfile, { y: -800, rotate: -0.8, autoAlpha: 0.2, transformOrigin: "top center", duration: 1.35, ease: "elastic.out(0.84, 0.64)" }, "-=0.62")
          .from(aboutParagraphs, { y: 40, rotationX: -45, autoAlpha: 0, transformOrigin: "50% 100%", duration: 0.72, stagger: 0.15, ease: "back.out(1.25)" }, "-=0.78")
          .from(aboutStackLabel, { x: -14, autoAlpha: 0, duration: 0.42 }, "-=0.42")
          .from(aboutPills, { scale: 0.5, y: 20, autoAlpha: 0, transformOrigin: "50% 50%", duration: 0.56, stagger: 0.1, ease: "back.out(1.15)" }, "-=0.18");
      }

      sectionReveal(".skills-section", ".skills-heading-block .section-kicker, .skills-heading-block h2, .skills-list", { stagger: 0.14 });
      const skillsList = query(".skills-list")[0];
      const skillRows = query(".skill-row");
      if (skillsList && skillRows.length) {
        gsap.from(skillRows, {
          x: -14,
          autoAlpha: 0,
          duration: 0.58,
          stagger: 0.07,
          ease: revealEase,
          scrollTrigger: { trigger: skillsList, start: "top 78%", once: true },
        });
      }
      sectionReveal(".projects-section", ".projects-heading-block .section-kicker, .projects-heading-block h2", { stagger: 0.13 });
      const projectsList = query(".projects-list")[0];
      const projectCards = query(".project-card");
      if (projectsList && projectCards.length) {
        gsap.from(projectCards, {
          y: 20,
          rotateX: 5,
          transformOrigin: "50% 100%",
          autoAlpha: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: revealEase,
          scrollTrigger: { trigger: projectsList, start: "top 78%", once: true },
        });
      }
      sectionReveal(".contact-section", ".contact-heading-block .section-kicker, .contact-heading-block h2, .contact-heading-block > p, .contact-form > *", { stagger: 0.1 });
      });

      media.add("(min-width: 701px)", () => {
        const heroSection = query(".reveal-hero")[0];
        const skillsSection = query(".skills-section")[0];
        const projectsSection = query(".projects-section")[0];
        const contactSection = query(".contact-section")[0];
        const desktopTweens: gsap.core.Tween[] = [];

        if (heroSection) {
          desktopTweens.push(gsap.to(query(".hero-copy"), {
            yPercent: -3,
            ease: "none",
            scrollTrigger: { trigger: heroSection, start: "top top", end: "bottom top", scrub: 0.65, invalidateOnRefresh: true },
          }));
        }
        if (skillsSection) {
          desktopTweens.push(gsap.to(query(".skills-web"), {
            yPercent: -4,
            xPercent: 2,
            ease: "none",
            scrollTrigger: { trigger: skillsSection, start: "top bottom", end: "bottom top", scrub: 0.7, invalidateOnRefresh: true },
          }));
        }
        if (projectsSection) {
          desktopTweens.push(gsap.to(query(".projects-web"), {
            yPercent: -5,
            xPercent: -2,
            ease: "none",
            scrollTrigger: { trigger: projectsSection, start: "top bottom", end: "bottom top", scrub: 0.7, invalidateOnRefresh: true },
          }));
        }
        if (contactSection) {
          desktopTweens.push(gsap.to(query(".contact-web"), {
            yPercent: -4,
            ease: "none",
            scrollTrigger: { trigger: contactSection, start: "top bottom", end: "bottom top", scrub: 0.7, invalidateOnRefresh: true },
          }));
        }

        desktopTweens.push(
          gsap.to(query(".web-top"), { y: 10, rotate: -16, scale: 1.09, transformOrigin: "50% 50%", duration: 1.7, ease: "sine.inOut", repeat: -1, yoyo: true }),
          gsap.to(query(".web-bottom"), { y: -11, rotate: 176, scale: 0.91, transformOrigin: "50% 50%", duration: 1.95, ease: "sine.inOut", repeat: -1, yoyo: true }),
          gsap.to(query(".skills-web"), { rotate: "+=360", transformOrigin: "50% 50%", duration: 85, ease: "none", repeat: -1 }),
          gsap.to(query(".projects-web"), { rotate: "-=360", transformOrigin: "50% 50%", duration: 92, ease: "none", repeat: -1 }),
          gsap.to(query(".contact-web"), { rotate: "+=360", transformOrigin: "50% 50%", duration: 100, ease: "none", repeat: -1 }),
          gsap.fromTo(query(".hanging-figure"), { rotate: -1.1, transformOrigin: "50% 0%" }, { rotate: 1.1, transformOrigin: "50% 0%", duration: 1.55, ease: "sine.inOut", repeat: -1, yoyo: true, repeatDelay: 0.05 }),
          gsap.to(query(".standing-figure"), { y: -3, duration: 2.35, ease: "sine.inOut", repeat: -1, yoyo: true }),
          gsap.fromTo(query(".contact-hanging-figure"), { rotate: -1.25, transformOrigin: "50% 0%" }, { rotate: 1.25, transformOrigin: "50% 0%", duration: 1.75, ease: "sine.inOut", repeat: -1, yoyo: true, repeatDelay: 0.06 }),
        );

        return () => desktopTweens.forEach((tween) => tween.kill());
      });

      const addHoverMotion = (selector: string, enter: gsap.TweenVars, leave: gsap.TweenVars) => {
        query(selector).forEach((element) => {
          const onEnter = () => gsap.to(element, { overwrite: "auto", duration: 0.24, ease: "power4.out", ...enter });
          const onLeave = () => gsap.to(element, { overwrite: "auto", duration: 0.34, ease: "power3.out", ...leave });
          element.addEventListener("pointerenter", onEnter);
          element.addEventListener("pointerleave", onLeave);
          cleanups.push(() => {
            element.removeEventListener("pointerenter", onEnter);
            element.removeEventListener("pointerleave", onLeave);
          });
        });
      };

      if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        addHoverMotion(".project-card", { y: -3, rotateX: 0.65, transformPerspective: 1000 }, { y: 0, rotateX: 0, transformPerspective: 1000 });
        addHoverMotion(".project-tools li", { y: -1 }, { y: 0 });

        const marqueeStage = query(".marquee-stage")[0];
        const marqueeTracks = query(".marquee-track") as HTMLElement[];
        if (marqueeStage && marqueeTracks.length) {
          const playback = { rate: 1 };
          const setMarqueeRate = () => {
            marqueeTracks.forEach((track) => {
              track.getAnimations().forEach((animation) => {
                animation.playbackRate = playback.rate;
              });
            });
          };
          const enterMarquee = () => {
            gsap.to(playback, { rate: 0.38, duration: 0.42, ease: "power2.out", overwrite: true, onUpdate: setMarqueeRate });
          };
          const leaveMarquee = () => {
            gsap.to(playback, { rate: 1, duration: 0.32, ease: "power3.out", overwrite: true, onUpdate: setMarqueeRate });
          };
          const handleMarqueePointerOut = (event: Event) => {
            const nextTarget = (event as PointerEvent).relatedTarget;
            if (!(nextTarget instanceof Node) || !marqueeStage.contains(nextTarget)) leaveMarquee();
          };

          setMarqueeRate();
          marqueeStage.addEventListener("pointerenter", enterMarquee);
          marqueeStage.addEventListener("pointerleave", leaveMarquee);
          marqueeStage.addEventListener("pointerout", handleMarqueePointerOut);
          cleanups.push(() => {
            marqueeStage.removeEventListener("pointerenter", enterMarquee);
            marqueeStage.removeEventListener("pointerleave", leaveMarquee);
            marqueeStage.removeEventListener("pointerout", handleMarqueePointerOut);
            gsap.killTweensOf(playback);
            playback.rate = 1;
            setMarqueeRate();
          });
        }
      }

      let refreshFrame = 0;
      const scheduleRefresh = () => {
        if (refreshFrame) window.cancelAnimationFrame(refreshFrame);
        refreshFrame = window.requestAnimationFrame(() => {
          refreshFrame = 0;
          ScrollTrigger.refresh();
        });
      };
      const unloadedImages = Array.from(page.querySelectorAll<HTMLImageElement>("img")).filter((image) => !image.complete);
      unloadedImages.forEach((image) => {
        image.addEventListener("load", scheduleRefresh, { once: true, passive: true });
        image.addEventListener("error", scheduleRefresh, { once: true, passive: true });
      });
      scheduleRefresh();
      cleanups.push(() => {
        if (refreshFrame) window.cancelAnimationFrame(refreshFrame);
        unloadedImages.forEach((image) => {
          image.removeEventListener("load", scheduleRefresh);
          image.removeEventListener("error", scheduleRefresh);
        });
      });
    }, page);

    return () => {
      cleanups.forEach((cleanup) => cleanup());
      ctx.revert();
    };
  }, []);

  return (
    <div className="portfolio-shell" ref={pageRef}>
      <header className={`site-header${isMobileNavOpen ? " site-header--menu-open" : ""}`} ref={headerRef}>
        <a className="brand-lockup" href="#top" aria-label="Aadil Shakh home">
          <span className="brand-sigil" aria-hidden="true" style={{ fontSize: 50 }}>A</span>
          <span style={{ fontSize: 50 }}>ADIL</span>
        </a>
        <button
          className="mobile-nav-toggle"
          type="button"
          aria-label={isMobileNavOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-controls="primary-navigation"
          aria-expanded={isMobileNavOpen}
          onClick={() => setIsMobileNavOpen((open) => !open)}
        >
          {isMobileNavOpen ? <X aria-hidden="true" size={22} strokeWidth={2.2} /> : <Menu aria-hidden="true" size={24} strokeWidth={2.2} />}
        </button>
        <nav id="primary-navigation" aria-label="Primary navigation">
          <a href="#about" onClick={() => setIsMobileNavOpen(false)} style={{ fontSize: 15, opacity: 0.8 }}>About</a>
          <a href="#skills" onClick={() => setIsMobileNavOpen(false)} style={{ fontSize: 15, opacity: 0.8 }}>Skills</a>
          <a href="#projects" onClick={() => setIsMobileNavOpen(false)} style={{ fontSize: 15, opacity: 0.8 }}>Projects</a>
          <a href="#contact" onClick={() => setIsMobileNavOpen(false)} style={{ fontSize: 15, opacity: 0.8 }}>Contact</a>
        </nav>
      </header>

      <main id="top">
        {/* Spider-Man resting state and cursor reveal are retained beneath the restored identity overlays. */}
        <FaceRevealHero />

        <section className="marquee-stage" aria-label="Core development capabilities">
          <Marquee tone="signal" />
          <Marquee tone="ink" />
        </section>

        <section className="about-section" id="about" aria-labelledby="about-heading">
          <div className="about-web-corner about-web-corner--left" aria-hidden="true">
            <span className="about-web-thread" />
            <img className="about-web-art" src={PORTFOLIO_ASSETS.decorations.web} alt="" />
          </div>
          <div className="about-web-corner about-web-corner--right" aria-hidden="true">
            <span className="about-web-thread" />
            <img className="about-web-art" src={PORTFOLIO_ASSETS.decorations.web} alt="" />
          </div>
          <div className="about-content">
            <div className="section-intro">
              <p className="section-kicker" style={{ marginLeft: 10 }}>Behind the Mask</p>
              <h2 id="about-heading" style={{ fontSize: 90, fontWeight: 100, width: 479, maxWidth: "100%" }}>Aadil<br />Shakh.</h2>
            </div>
            <div className="about-copy">
              <p style={{ marginTop: -50, marginBottom: 10 }}>
                I&apos;m a full-stack engineer and AI/ML undergrad at Jamia Hamdard University, passionate about bridging scalable web infrastructure with data-driven insights.
              </p>
              <p>
                From engineering robust SaaS platforms at Technical Hub to mastering algorithms with the AlgoUniversity Tech Fellowship, I turn complex logic into seamless, high-performance digital experiences.
              </p>
              <div className="stack-block">
                <span>Primary Tech Stack</span>
                <ul className="tech-pills" aria-label="Primary tech stack">
                  {stack.map((item) => <li key={item} style={{ fontSize: 15, fontWeight: 600 }}>{item}</li>)}
                </ul>
              </div>
            </div>
          </div>
          <HangingProfileImage
            className="profile-suspension"
            src={PORTFOLIO_ASSETS.portraits.about}
            alt="Aadil Shaikh wearing headphones in the rain"
            timelineControlled
          />
        </section>

        <section className="skills-section" id="skills" aria-labelledby="skills-heading" style={{ paddingTop: 178 }}>
          <img className="skills-web" src={PORTFOLIO_ASSETS.decorations.web} alt="" aria-hidden="true" />
          <div className="skills-heading-block">
            <p className="section-kicker skills-kicker--tuned" style={{ marginLeft: 300, marginTop: -80 }}>Arsenal &amp; Expertise</p>
            <h2 id="skills-heading" style={{ paddingBottom: 120 }}>Technical Skills.</h2>
          </div>
          <img className="hanging-figure" src={PORTFOLIO_ASSETS.decorations.spiderHanging} alt="" aria-hidden="true" style={{ marginTop: -150, paddingLeft: 10 }} />
          <div className="skills-list" style={{ marginTop: -76 }}>
            {skills.map(([name, type, level], index) => (
              <article className="skill-row" key={name}>
                <span className="skill-no">{String(index + 1).padStart(2, "0")}</span>
                <h3>{name}</h3>
                <p style={{ fontSize: "10px" }}>{type}</p>
                <span style={{ fontSize: "10px", borderRadius: "10px" }}>{level}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="projects-section" id="projects" aria-labelledby="projects-heading">
          <img className="projects-web" src={PORTFOLIO_ASSETS.decorations.web} alt="" aria-hidden="true" />
          <img className="projects-standing-figure" src={PORTFOLIO_ASSETS.decorations.spiderStanding} alt="" aria-hidden="true" style={{ marginLeft: 64 }} />
          <div className="projects-heading-block">
            <p className="section-kicker projects-kicker--tuned" style={{ marginLeft: 320 }}>Featured Works</p>
            <h2 id="projects-heading">Projects.</h2>
          </div>
          <div className="projects-list">
            {projects.map((project) => (
              <article className="project-card" key={project.number}>
                <span className="project-number">{project.number}</span>
                <div className="project-body">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <ul className="project-tools" aria-label={`${project.title} technologies`}>
                    {project.tools.map((tool) => (
                      <li key={tool} style={{ fontSize: "10px" }}>{tool}</li>
                    ))}
                  </ul>
                </div>
                <span className="project-arrow" aria-hidden="true">↗</span>
              </article>
            ))}
          </div>
        </section>

        <section className="contact-section" id="contact" aria-labelledby="contact-heading">
          <img className="contact-web" src={PORTFOLIO_ASSETS.decorations.web} alt="" aria-hidden="true" />
          <img className="contact-hanging-figure" src={PORTFOLIO_ASSETS.decorations.spiderHanging} alt="" aria-hidden="true" style={{ marginBottom: 150 }} />
          <div className="contact-heading-block">
            <p className="section-kicker">Get In Touch</p>
            <h2 id="contact-heading">Contact.</h2>
            <p>Have a product challenge in mind? I&apos;d be glad to discuss the interface and systems behind it.</p>
          </div>
          <form className="contact-form" onSubmit={handleContactSubmit}>
            <div className="contact-form__row">
              <label>
                <span>Your Name</span>
                <input type="text" name="name" placeholder="Peter Parker" autoComplete="name" required />
              </label>
              <label>
                <span>Your Email</span>
                <input type="email" name="email" placeholder="peter@stark.com" autoComplete="email" required />
              </label>
            </div>
            <label>
              <span>Message</span>
              <textarea name="message" placeholder="Let&apos;s build something amazing together..." rows={4} required />
            </label>
            <button type="submit" disabled={isSubmitting} aria-busy={isSubmitting}>
              <span className="contact-form__button-content">
                {isSubmitting ? (
                  <>
                    <Spinner className="contact-form__spinner" aria-hidden="true" />
                    <span>Sending Message...</span>
                  </>
                ) : (
                  <>Send Message <span aria-hidden="true">↗</span></>
                )}
              </span>
            </button>
            {submitStatus === "success" && (
              <p className="contact-form__feedback contact-form__feedback--success" role="status">
                Message received. I&apos;ll get back to you soon.
              </p>
            )}
            {submitStatus === "error" && (
              <p className="contact-form__feedback contact-form__feedback--error" role="alert">
                Message could not be sent. Please try again shortly.
              </p>
            )}
          </form>
        </section>
      </main>
    </div>
  );
}
