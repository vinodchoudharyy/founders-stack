import { useEffect, useRef, useState } from "react";
import {
  AdditiveBlending,
  BackSide,
  BufferAttribute,
  BufferGeometry,
  Color,
  Group,
  IcosahedronGeometry,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  SphereGeometry,
  TorusGeometry,
  WebGLRenderer,
} from "three";

const chapters = [
  {
    kicker: "CHAPTER 01 / THE SPARK",
    title: "Every big thing starts small.",
    description: "Bring us the idea. We’ll help you find the part worth building.",
    accent: "#9bd23c",
    cta: "Explore our approach",
    href: "#approach",
  },
  {
    kicker: "CHAPTER 02 / THE BUILD",
    title: "Turn possibility into a product.",
    description: "Design, engineering and strategy come together in one connected stack.",
    accent: "#ff8738",
    cta: "See what we build",
    href: "#expertise",
  },
  {
    kicker: "CHAPTER 03 / WHAT'S NEXT",
    title: "Make room for what comes after.",
    description: "Launch with a strong foundation, then keep growing with intention.",
    accent: "#9bd23c",
    cta: "Plan your next move",
    href: "#contact",
  },
];

function createParticleField(count, radius, random = Math.random) {
  const positions = new Float32Array(count * 3);
  for (let index = 0; index < count; index += 1) {
    const vertical = random() * 2 - 1;
    const angle = random() * Math.PI * 2;
    const horizontal = Math.sqrt(1 - vertical * vertical);
    const distance = radius * (0.96 + random() * 0.08);
    positions[index * 3] = Math.cos(angle) * horizontal * distance;
    positions[index * 3 + 1] = vertical * distance;
    positions[index * 3 + 2] = Math.sin(angle) * horizontal * distance;
  }
  return positions;
}

function createSeededRandom(seed) {
  let value = seed;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

function ImmersiveUniverse() {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const [chapterIndex, setChapterIndex] = useState(0);
  const [sceneUnavailable, setSceneUnavailable] = useState(false);
  const [reducedMotion] = useState(() =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const chapter = chapters[chapterIndex];

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    let renderer;
    let frame = 0;
    let observer;
    let resizeObserver;
    let isVisible = true;
    const animationStart = performance.now();
    const scene = new Scene();
    const camera = new PerspectiveCamera(38, 1, 0.1, 100);
    const world = new Group();
    const disposables = [];

    camera.position.set(0, 0, 8.2);
    scene.add(world);

    const register = (geometry, material) => {
      disposables.push(geometry, material);
    };

    try {
      renderer = new WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1));
      renderer.setClearColor(0x000000, 0);
      mount.appendChild(renderer.domElement);
      renderer.domElement.setAttribute("aria-hidden", "true");
      const handleContextLoss = (event) => {
        event.preventDefault();
        window.cancelAnimationFrame(frame);
        frame = 0;
        setSceneUnavailable(true);
      };
      renderer.domElement.addEventListener("webglcontextlost", handleContextLoss);
      disposables.push({
        dispose: () =>
          renderer.domElement.removeEventListener("webglcontextlost", handleContextLoss),
      });

      const atmosphereGeometry = new SphereGeometry(1.12, 48, 48);
      const atmosphereMaterial = new MeshBasicMaterial({
        color: chapters[chapterIndex].accent,
        transparent: true,
        opacity: 0.045,
        side: BackSide,
        blending: AdditiveBlending,
        depthWrite: false,
      });
      const atmosphere = new Mesh(atmosphereGeometry, atmosphereMaterial);
      world.add(atmosphere);
      register(atmosphereGeometry, atmosphereMaterial);

      const coreGeometry = new IcosahedronGeometry(0.84, 2);
      const coreMaterial = new MeshBasicMaterial({
        color: chapters[chapterIndex].accent,
        wireframe: true,
        transparent: true,
        opacity: 0.56,
        blending: AdditiveBlending,
      });
      const core = new Mesh(coreGeometry, coreMaterial);
      world.add(core);
      register(coreGeometry, coreMaterial);

      const detailGeometry = new IcosahedronGeometry(0.76, 1);
      const detailMaterial = new MeshBasicMaterial({
        color: 0xe9f2d4,
        wireframe: true,
        transparent: true,
        opacity: 0.18,
      });
      const detail = new Mesh(detailGeometry, detailMaterial);
      detail.rotation.set(0.3, 0.15, 0.1);
      world.add(detail);
      register(detailGeometry, detailMaterial);

      const random = createSeededRandom(92026);
      const particleGeometry = new BufferGeometry();
      particleGeometry.setAttribute(
        "position",
        new BufferAttribute(createParticleField(1250, 0.82, random), 3),
      );
      const particleMaterial = new PointsMaterial({
        color: 0xe9f2d4,
        size: 0.018,
        transparent: true,
        opacity: 0.78,
        sizeAttenuation: true,
        blending: AdditiveBlending,
        depthWrite: false,
      });
      world.add(new Points(particleGeometry, particleMaterial));
      register(particleGeometry, particleMaterial);

      const starGeometry = new BufferGeometry();
      starGeometry.setAttribute(
        "position",
        new BufferAttribute(createParticleField(900, 3.5, random), 3),
      );
      const starMaterial = new PointsMaterial({
        color: 0xd4dcc8,
        size: 0.011,
        transparent: true,
        opacity: 0.46,
        sizeAttenuation: true,
        depthWrite: false,
      });
      scene.add(new Points(starGeometry, starMaterial));
      register(starGeometry, starMaterial);

      const rings = [];
      for (let index = 0; index < 3; index += 1) {
        const geometry = new TorusGeometry(
          1.48 + index * 0.27,
          0.002 + index * 0.0005,
          6,
          180,
        );
        const material = new MeshBasicMaterial({
          color: chapters[chapterIndex].accent,
          transparent: true,
          opacity: 0.3 - index * 0.065,
          blending: AdditiveBlending,
          depthWrite: false,
        });
        const ring = new Mesh(geometry, material);
        ring.rotation.set(
          Math.PI * (0.33 + index * 0.12),
          Math.PI * (0.12 + index * 0.16),
          index * 0.48,
        );
        world.add(ring);
        rings.push(ring);
        register(geometry, material);
      }

      sceneRef.current = { atmosphereMaterial, coreMaterial, rings };

      const resize = () => {
        const { width, height } = mount.getBoundingClientRect();
        if (!width || !height) return;
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };
      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(mount);
      resize();

      const render = () => {
        if (reducedMotion || !isVisible) {
          renderer.render(scene, camera);
          return;
        }
        const elapsed = (performance.now() - animationStart) / 1000;
        world.rotation.y += (pointerRef.current.x * 0.18 - world.rotation.y) * 0.018;
        world.rotation.x += (-pointerRef.current.y * 0.12 - world.rotation.x) * 0.018;
        core.rotation.y = elapsed * 0.075;
        core.rotation.x = Math.sin(elapsed * 0.16) * 0.08;
        detail.rotation.y = -elapsed * 0.035;
        detail.rotation.z = Math.sin(elapsed * 0.1) * 0.07;
        atmosphere.scale.setScalar(1 + Math.sin(elapsed * 0.65) * 0.025);
        rings.forEach((ring, index) => {
          ring.rotation.z += (index % 2 === 0 ? 1 : -1) * 0.00065;
        });
        renderer.render(scene, camera);
        frame = window.requestAnimationFrame(render);
      };
      render();

      observer = new IntersectionObserver(([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !reducedMotion && !frame) {
          frame = window.requestAnimationFrame(render);
        }
        if (!isVisible && frame) {
          window.cancelAnimationFrame(frame);
          frame = 0;
        }
      });
      observer.observe(mount);
    } catch (error) {
      console.error("FounderStack 3D scene could not be initialized.", error);
      setSceneUnavailable(true);
    }

    return () => {
      observer?.disconnect();
      resizeObserver?.disconnect();
      window.cancelAnimationFrame(frame);
      sceneRef.current = null;
      disposables.forEach((resource) => resource.dispose());
      renderer?.dispose();
      renderer?.domElement.remove();
    };
  }, [reducedMotion]);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    const color = new Color(chapter.accent);
    scene.atmosphereMaterial.color.copy(color);
    scene.coreMaterial.color.copy(color);
    scene.rings.forEach((ring) => ring.material.color.copy(color));
  }, [chapter.accent]);

  const updatePointer = (event) => {
    if (event.pointerType === "touch" || reducedMotion) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerRef.current = {
      x: (event.clientX - bounds.left) / bounds.width - 0.5,
      y: (event.clientY - bounds.top) / bounds.height - 0.5,
    };
  };

  return (
    <div
      className={`hero-art universe${sceneUnavailable ? " scene-fallback" : ""}`}
      role="group"
      aria-label="Interactive three-dimensional digital universe"
      onPointerMove={updatePointer}
      onPointerLeave={() => {
        pointerRef.current = { x: 0, y: 0 };
      }}
    >
      <div className="universe-glow" aria-hidden="true" />
      <div className="universe-halo halo-a" aria-hidden="true" />
      <div className="universe-halo halo-b" aria-hidden="true" />
      <div ref={mountRef} className="universe-canvas" />
      {sceneUnavailable && (
        <div className="universe-fallback-core" aria-hidden="true">FS</div>
      )}
      <div className="universe-crosshair crosshair-a" aria-hidden="true">+</div>
      <div className="universe-crosshair crosshair-b" aria-hidden="true">+</div>
      <div className="universe-label universe-label-top" aria-hidden="true">
        FOUNDERSTACK / DIGITAL UNIVERSE
      </div>
      <div className="universe-label universe-label-bottom" aria-hidden="true">
        {chapter.kicker}
      </div>
      <div className="universe-control" aria-label="Explore our story">
        <div className="universe-control-top">
          <span>AN IDEA, IN MOTION</span>
          <span>0{chapterIndex + 1} / 03</span>
        </div>
        <div className="chapter-tabs" role="group" aria-label="Choose a chapter">
          {chapters.map((item, index) => (
            <button
              className={index === chapterIndex ? "chapter-tab is-active" : "chapter-tab"}
              key={item.kicker}
              type="button"
              aria-pressed={index === chapterIndex}
              onClick={() => setChapterIndex(index)}
            >
              <span>0{index + 1}</span>
              {["The spark", "The build", "What's next"][index]}
            </button>
          ))}
        </div>
        <div className="chapter-story" aria-live="polite" key={chapterIndex}>
          <span className="chapter-kicker">{chapter.kicker}</span>
          <strong>{chapter.title}</strong>
          <p>{chapter.description}</p>
          <a href={chapter.href}>{chapter.cta} <span aria-hidden="true">↗</span></a>
        </div>
      </div>
    </div>
  );
}

export default ImmersiveUniverse;
