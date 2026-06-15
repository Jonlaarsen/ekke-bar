"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 240;
const FRAME_DIR = "/beerfall";
const SCROLL_DISTANCE = "+=400%";

function frameSrc(index: number) {
  return `${FRAME_DIR}/frame_${String(index).padStart(4, "0")}.webp`;
}

function drawFrame(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  width: number,
  height: number,
) {
  const fw = img.naturalWidth;
  const fh = img.naturalHeight;
  const isMobile = width < 768; // or matchMedia in render()
  let scale = Math.max(width / fw, height / fh);
  if (isMobile) scale *= 1; // tune: 0.7–0.9
  const dw = fw * scale;
  const dh = fh * scale;
  const dx = (width - dw) / 2;
  const dy = height - dh;

  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(img, dx, dy, dw, dh);
}

export default function HeroVideo() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let lenis: Lenis | null = null;
    let tickerRaf: ((time: number) => void) | null = null;
    let frames: HTMLImageElement[] = [];
    let cancelled = false;

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { clientWidth, clientHeight } = canvas;
      canvas.width = clientWidth * dpr;
      canvas.height = clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const render = (frameIndex: number) => {
      const i = Math.min(FRAME_COUNT - 1, Math.max(0, Math.round(frameIndex)));
      const img = frames[i];
      if (!img?.complete) return;
      drawFrame(ctx, img, canvas.clientWidth, canvas.clientHeight);
    };

    const initScroll = () => {
      if (cancelled) return;
      setReady(true);
      resizeCanvas();
      render(0);

      if (reducedMotion) return;

      lenis = new Lenis({
        lerp: 0.12,
        smoothWheel: true,
      });
      document.documentElement.classList.add("lenis");

      tickerRaf = (time: number) => {
        lenis?.raf(time * 1000);
      };
      gsap.ticker.add(tickerRaf);
      gsap.ticker.lagSmoothing(0);
      lenis.on("scroll", ScrollTrigger.update);

      const scrubState = { frame: 0 };

      gsap.to(scrubState, {
        frame: FRAME_COUNT - 1,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: SCROLL_DISTANCE,
          scrub: true,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
        onUpdate: () => render(scrubState.frame),
      });
    };

    const loadFrame = (index: number) =>
      new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.decoding = "async";
        img.src = frameSrc(index);
        img.onload = () => resolve(img);
        img.onerror = () =>
          reject(new Error(`Failed to load ${frameSrc(index)}`));
      });

    const preloadFrames = async () => {
      const batchSize = 24;
      const loaded: HTMLImageElement[] = new Array(FRAME_COUNT);

      for (let start = 0; start < FRAME_COUNT; start += batchSize) {
        if (cancelled) return;
        const end = Math.min(start + batchSize, FRAME_COUNT);
        const batch = await Promise.all(
          Array.from({ length: end - start }, (_, j) => loadFrame(start + j)),
        );
        batch.forEach((img, j) => {
          loaded[start + j] = img;
        });
      }

      frames = loaded;
      initScroll();
    };

    preloadFrames().catch(console.error);

    const onResize = () => {
      resizeCanvas();
      const st = ScrollTrigger.getAll().find((t) => t.trigger === section);
      const progress = st?.progress ?? 0;
      render(progress * (FRAME_COUNT - 1));
    };

    window.addEventListener("resize", onResize);

    return () => {
      cancelled = true;
      window.removeEventListener("resize", onResize);
      document.documentElement.classList.remove("lenis");
      lenis?.destroy();
      if (tickerRaf) gsap.ticker.remove(tickerRaf);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-black">
      <div
        className={`relative h-svh w-full overflow-hidden transition-opacity duration-700 ${
          ready ? "opacity-100" : "opacity-0"
        }`}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          aria-label="Beer pouring animation controlled by scroll"
          onContextMenu={(e) => e.preventDefault()}
        />

        <div className="pointer-events-none absolute inset-0 " aria-hidden />
        <img
          src="/ekke_img/sparkle.png"
          className="w-100 h-auto absolute top-20 left-10 rotate-y-180"
          alt=""
        />
        <img
          src="/ekke_img/sparkle.png"
          className="w-90 h-auto absolute bottom-30 right-10"
          alt=""
        />
        <div className="absolute bottom-10 left-10 text-xl uppercase tracking-[0.3em] ">
          EKKE -
        </div>
        <div className="absolute bottom-10 right-10 text-xl tracking-[0.3em]">
          - BAR
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center gap-3 pb-10">
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-white/70">
            Scroll
          </p>
          <span
            className="hero-scroll-line block h-10 w-px bg-white/50"
            aria-hidden
          />
        </div>
      </div>
    </section>
  );
}
