import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import type { Group } from "three";

const WHATSAPP_NUMBER = "917722099006";

const buildWhatsappLink = (message?: string) => {
  if (!message) {
    return `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}`;
  }

  return `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(message)}`;
};

const links = {
  instagram: "https://www.instagram.com/grow.your.online.presence/",
  whatsapp: buildWhatsappLink(),
  joinInquiry: buildWhatsappLink("Hey! I'm interested in joining NOTION FITNESS. Please share membership details."),
  personalTraining: buildWhatsappLink("Hi! I'd like to book a Personal Training session at NOTION FITNESS."),
  generalInquiry: buildWhatsappLink("Hello NOTION FITNESS! I have a query about your gym programs."),
};

const programs = [
  { title: "Strength Training", description: "Build raw power and muscle mass with expert guidance." },
  { title: "Fat Loss Program", description: "Burn fat quickly with structured metabolic sessions." },
  { title: "Muscle Building", description: "Hypertrophy-focused programming for measurable gains." },
  { title: "Functional Training", description: "Develop real-world strength, agility, and athletic output." },
  { title: "Mobility and Recovery", description: "Improve flexibility, recovery speed, and injury prevention." },
  { title: "Personal Training", description: "One-on-one transformation coaching with certified experts." },
];

const transformations = [
  "https://images.unsplash.com/photo-1599058917765-a780eda07a3e?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1517960413843-0aee8e2b3285?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&w=1400&q=80",
  "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=1400&q=80",
];

const trainers = [
  {
    name: "Aarav Singh",
    role: "Strength and Conditioning",
    certs: "ACE CPT, CSCS",
    image: "https://images.unsplash.com/photo-1567013127542-490d757e6349?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Riya Mehta",
    role: "Fat Loss Specialist",
    certs: "NASM CNC, ISSA PT",
    image: "https://images.unsplash.com/photo-1594736797933-d0d9e66f5f78?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Kabir Patel",
    role: "Functional Coach",
    certs: "CrossFit L2, Kettlebell Pro",
    image: "https://images.unsplash.com/photo-1549476464-37392f717541?auto=format&fit=crop&w=900&q=80",
  },
];

const testimonials = [
  { quote: "NOTION FITNESS completely changed my life in just three months.", name: "Sneha R.", city: "Pune" },
  { quote: "The trainers push you hard, but they also track every detail with care.", name: "Manav K.", city: "Mumbai" },
  { quote: "I lost 11kg and gained confidence. The energy here is unmatched.", name: "Aditi P.", city: "Nashik" },
];

const navSections = [
  { label: "About", id: "about" },
  { label: "Programs", id: "programs" },
  { label: "Membership", id: "membership" },
  { label: "Contact", id: "contact" },
];

function DumbbellModel() {
  const ref = useRef<Group>(null);

  useFrame((state) => {
    if (!ref.current) {
      return;
    }
    ref.current.rotation.y = state.clock.elapsedTime * 0.6;
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 1.2) * 0.12;
  });

  return (
    <group ref={ref}>
      <mesh>
        <cylinderGeometry args={[0.12, 0.12, 3.2, 30]} />
        <meshStandardMaterial color="#99ff9a" metalness={0.85} roughness={0.26} emissive="#1b7f1b" emissiveIntensity={0.45} />
      </mesh>
      {[-1.4, 1.4].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh>
            <cylinderGeometry args={[0.5, 0.5, 0.24, 32]} />
            <meshStandardMaterial color="#1b1b1b" metalness={0.7} roughness={0.2} emissive="#0a0a0a" />
          </mesh>
          <mesh position={[0, 0, 0.2]}>
            <cylinderGeometry args={[0.44, 0.44, 0.1, 32]} />
            <meshStandardMaterial color="#39ff14" emissive="#39ff14" emissiveIntensity={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function HeroScene() {
  return (
    <Canvas camera={{ position: [0, 2.4, 7], fov: 52 }}>
      <color attach="background" args={["#000000"]} />
      <fog attach="fog" args={["#000000", 6, 22]} />
      <ambientLight intensity={0.3} />
      <spotLight position={[0, 6, 2]} angle={0.35} penumbra={0.6} intensity={58} color="#39ff14" />
      <spotLight position={[-5, 3, -4]} angle={0.32} penumbra={0.7} intensity={35} color="#00ff41" />
      <DumbbellModel />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#050505" metalness={0.3} roughness={0.76} />
      </mesh>
      <gridHelper args={[60, 60, "#39ff14", "#0e3b0e"]} position={[0, -1.49, 0]} />
    </Canvas>
  );
}

function StatCounter({ value, label }: { value: number; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.45 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) {
      return;
    }
    let frame = 0;
    const duration = 1100;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      setCount(Math.round(value * progress));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value]);

  return (
    <div ref={ref} className="text-center">
      <p className="heading-font text-4xl text-[#39FF14] md:text-5xl">{count}+</p>
      <p className="mt-1 text-sm text-zinc-300">{label}</p>
    </div>
  );
}

function BeforeAfterSlider() {
  const [value, setValue] = useState(55);

  return (
    <div className="relative mt-10 overflow-hidden border border-[#39FF14]/30 bg-[#060606]">
      <img
        src="https://images.unsplash.com/photo-1534367610401-9f5ed68180aa?auto=format&fit=crop&w=1600&q=80"
        alt="After transformation"
        className="h-[360px] w-full object-cover"
      />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}>
        <img
          src="https://images.unsplash.com/photo-1579758629938-03607ccdbaba?auto=format&fit=crop&w=1600&q=80"
          alt="Before transformation"
          className="h-[360px] w-full object-cover grayscale"
        />
      </div>
      <div className="pointer-events-none absolute inset-y-0" style={{ left: `${value}%` }}>
        <div className="h-full w-[2px] bg-[#39FF14] shadow-[0_0_18px_rgba(57,255,20,0.95)]" />
      </div>
      <input
        aria-label="Before after slider"
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(event) => setValue(Number(event.target.value))}
        className="absolute bottom-4 left-1/2 w-[84%] -translate-x-1/2 accent-[#39FF14]"
      />
    </div>
  );
}

function SectionHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mx-auto max-w-4xl text-center">
      <h2 className="heading-font text-4xl uppercase tracking-[0.1em] text-white md:text-5xl">{title}</h2>
      <p className="mx-auto mt-3 max-w-2xl text-zinc-300">{subtitle}</p>
    </div>
  );
}

function AppContent() {
  const [activeReview, setActiveReview] = useState(0);
  const [showTop, setShowTop] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [webglSupported, setWebglSupported] = useState(true);
  const [activeSection, setActiveSection] = useState("home");
  const [scrollProgress, setScrollProgress] = useState(0);
  const externalLinkProps = { target: "_blank", rel: "noopener noreferrer" };

  const floatingParticles = useMemo(
    () =>
      Array.from({ length: 28 }, (_, index) => ({
        id: index,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        duration: 5 + Math.random() * 7,
        delay: Math.random() * 3,
        size: 3 + Math.random() * 4,
      })),
    [],
  );

  useEffect(() => {
    document.title = "NOTION FITNESS | Best Gym | Build Your Best Version";
    const setMeta = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name='${name}']`);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", name);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    };

    setMeta(
      "description",
      "Join NOTION FITNESS - The ultimate transformation gym. Expert trainers, premium equipment, proven results. WhatsApp: +91 7722099006",
    );
    setMeta(
      "keywords",
      "Notion Fitness, best gym near me, personal training, fitness transformation, gym membership, strength training",
    );
  }, []);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    const webgl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    setWebglSupported(Boolean(webgl));
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setShowTop(window.scrollY > 300);
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;
      setScrollProgress(progress);
    };
    const timer = window.setInterval(() => {
      setActiveReview((prev) => (prev + 1) % testimonials.length);
    }, 4200);

    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const sectionIds = ["home", ...navSections.map((section) => section.id), "gallery", "trainers", "testimonials"];
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target?.id) {
          setActiveSection(visible.target.id);
        }
      },
      { rootMargin: "-35% 0px -45% 0px", threshold: [0.15, 0.35, 0.6] },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const schema = {
    "@context": "https://schema.org",
    "@type": "GymOrHealthClub",
    name: "NOTION FITNESS",
    description: "Transformation-focused gym with strength, fat loss, and personal training programs.",
    telephone: "+91 7722099006",
    sameAs: [links.instagram, links.whatsapp],
    image: transformations[0],
  };

  return (
    <div className="relative overflow-x-hidden bg-black text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <a href="#about" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-[#39FF14] focus:px-4 focus:py-2 focus:text-black">
        Skip to content
      </a>

      <div className="fixed left-0 top-0 z-50 h-[2px] bg-[#39FF14] shadow-[0_0_12px_rgba(57,255,20,0.8)]" style={{ width: `${scrollProgress}%` }} />

      <div className="pointer-events-none fixed inset-0 z-20 scanline-overlay" />

      <div className="pointer-events-none fixed inset-0 z-10">
        {floatingParticles.map((particle) => (
          <span
            key={particle.id}
            className="absolute rounded-full bg-[#39FF14]/60 blur-[2px]"
            style={{
              left: particle.left,
              top: particle.top,
              width: particle.size,
              height: particle.size,
              animation: `float ${particle.duration}s ease-in-out ${particle.delay}s infinite`,
            }}
          />
        ))}
      </div>

      <header id="home" className="relative min-h-screen">
        <nav className="fixed top-0 z-30 w-full border-b border-[#39FF14]/20 bg-black/70 px-6 py-4 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between">
            <a href="#home" className="display-font text-3xl text-[#39FF14]">
              NOTION FITNESS
            </a>
            <div className="hidden items-center gap-6 text-sm md:flex">
              {navSections.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`nav-link ${activeSection === item.id ? "nav-link-active" : ""}`}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </nav>

        <div className="absolute inset-0">
          <img
            src="/images/notion-fitness-hero.jpg"
            alt="NOTION FITNESS gym interior"
            className="h-full w-full object-cover opacity-45"
          />
        </div>

        {webglSupported ? (
          <div className="absolute inset-0 mix-blend-screen">
            <Suspense fallback={null}>
              <HeroScene />
            </Suspense>
          </div>
        ) : (
          <div className="absolute inset-0 grid-bg bg-[#040404]/70" />
        )}

        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/65 to-black" />

        <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="accent-font text-lg uppercase tracking-[0.24em] text-[#39FF14]"
          >
            Notion Fitness
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            data-text="BUILD YOUR BEST VERSION"
            className="glitch-text mt-4 display-font text-6xl leading-[0.9] md:text-8xl"
          >
            BUILD YOUR
            <br />
            BEST VERSION
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.9 }}
            className="mt-6 max-w-2xl text-zinc-200"
          >
            NOTION FITNESS. Strength. Discipline. Transformation. Where champions are built.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            <a {...externalLinkProps} href={links.joinInquiry} className="neon-btn px-6 py-3">
              START YOUR JOURNEY
            </a>
            <a {...externalLinkProps} href={links.generalInquiry} className="neon-btn-outline px-6 py-3 font-medium">
              WHATSAPP US
            </a>
            <a {...externalLinkProps} href={links.instagram} className="neon-btn-outline border-[#39FF14]/45 bg-black/50 px-6 py-3 font-medium">
              FOLLOW ON INSTAGRAM
            </a>
          </motion.div>
          <div className="absolute bottom-7 left-1/2 -translate-x-1/2 text-center text-[#39FF14]">
            <p className="text-xs tracking-[0.3em]">SCROLL TO EXPLORE</p>
            <p className="animate-bounce text-2xl">^</p>
          </div>
        </div>
      </header>

      <main>
        <section id="about" className="section-glow grid-bg border-y border-[#39FF14]/20 px-6 py-20 md:py-28">
          <SectionHeading
            title="Transformation Hub"
            subtitle="We empower every individual to unlock physical and mental potential through elite coaching and a high-energy community."
          />
          <div className="mx-auto mt-12 grid max-w-6xl gap-10 md:grid-cols-3">
            {[
              {
                title: "Our Mission",
                text: "To help members become their strongest, most disciplined version through training that is measurable and sustainable.",
              },
              {
                title: "Our Vision",
                text: "To deliver the most transformative gym experience in the region through innovation, expertise, and accountability.",
              },
              {
                title: "Why Notion Fitness",
                text: "State-of-the-art equipment, certified trainers, custom plans, active community support, and real outcomes.",
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: index * 0.14, duration: 0.7 }}
              >
                <h3 className="heading-font text-3xl uppercase text-[#39FF14]">{item.title}</h3>
                <p className="mt-3 text-zinc-300">{item.text}</p>
              </motion.div>
            ))}
          </div>
          <div className="mx-auto mt-16 grid max-w-5xl grid-cols-2 gap-7 md:grid-cols-4">
            <StatCounter value={500} label="Active Members" />
            <StatCounter value={50} label="Transformations" />
            <StatCounter value={5} label="Years Of Excellence" />
            <StatCounter value={10} label="Certified Trainers" />
          </div>
        </section>

        <section id="programs" className="px-6 py-20 md:py-28">
          <SectionHeading title="Programs" subtitle="Select your path and start training with precision, intensity, and expert supervision." />
          <div className="mx-auto mt-12 grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
            {programs.map((program, index) => (
              <motion.article
                key={program.title}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ rotateX: 4, rotateY: -4, y: -6 }}
                transition={{ duration: 0.55, delay: index * 0.06 }}
                viewport={{ once: true, amount: 0.22 }}
                className="group border border-[#39FF14]/35 bg-[#0b0b0b]/90 p-6 transition hover:border-[#39FF14] hover:shadow-[0_0_25px_rgba(57,255,20,0.25)]"
              >
                <h3 className="heading-font text-3xl uppercase text-white">{program.title}</h3>
                <p className="mt-3 text-zinc-300">{program.description}</p>
                  <a
                    {...externalLinkProps}
                  href={program.title === "Personal Training" ? links.personalTraining : links.joinInquiry}
                  className="mt-6 inline-block border border-[#39FF14] px-4 py-2 text-sm tracking-wide text-[#39FF14] transition group-hover:bg-[#39FF14]/10"
                >
                  {program.title === "Personal Training" ? "BOOK SESSION" : "ENROLL NOW"}
                </a>
              </motion.article>
            ))}
          </div>
        </section>

        <section id="gallery" className="border-y border-[#39FF14]/20 bg-[#050505] px-6 py-20 md:py-28">
          <SectionHeading
            title="Transformation Gallery"
            subtitle="Swipe through member journeys and compare before and after progress with the interactive slider."
          />
          <div className="mx-auto mt-8 flex max-w-6xl items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setGalleryIndex((prev) => (prev - 1 + transformations.length) % transformations.length)}
              className="neon-btn-outline h-10 w-10"
              aria-label="Previous transformation"
            >
              {"<"}
            </button>
            <button
              type="button"
              onClick={() => setGalleryIndex((prev) => (prev + 1) % transformations.length)}
              className="neon-btn-outline h-10 w-10"
              aria-label="Next transformation"
            >
              {">"}
            </button>
          </div>
          <div className="mx-auto mt-4 max-w-6xl overflow-x-auto">
            <div className="flex min-w-max gap-5 pb-4">
              {transformations.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setGalleryIndex(index)}
                  className={`relative h-72 w-64 shrink-0 overflow-hidden border transition ${
                    galleryIndex === index
                      ? "h-80 border-[#39FF14] shadow-[0_0_24px_rgba(57,255,20,0.3)]"
                      : "border-[#39FF14]/20"
                  }`}
                >
                  <img src={image} alt={`Transformation ${index + 1}`} className="h-full w-full object-cover" />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/70 to-[#39FF14]/10" />
                </button>
              ))}
            </div>
          </div>
          <BeforeAfterSlider />
          <div className="mt-10 text-center">
            <a {...externalLinkProps} href={links.instagram} className="inline-block border border-[#39FF14] px-6 py-3 text-[#39FF14] transition hover:bg-[#39FF14]/10">
              SEE MORE TRANSFORMATIONS ON INSTAGRAM
            </a>
          </div>
        </section>

        <section id="trainers" className="px-6 py-20 md:py-28">
          <SectionHeading title="Coaching Team" subtitle="Certified professionals focused on strength, performance, and sustainable progress." />
          <div className="mx-auto mt-12 grid max-w-6xl gap-8 md:grid-cols-3">
            {trainers.map((trainer, index) => (
              <motion.article
                key={trainer.name}
                initial={{ opacity: 0, rotateY: 16 }}
                whileInView={{ opacity: 1, rotateY: 0 }}
                whileHover={{ y: -8, rotateY: -6 }}
                transition={{ delay: index * 0.1, duration: 0.55 }}
                viewport={{ once: true, amount: 0.22 }}
                className="border border-[#39FF14]/30 bg-[#080808] p-4"
              >
                <img src={trainer.image} alt={trainer.name} className="h-72 w-full object-cover saturate-50" />
                <div className="mt-4 border border-[#39FF14]/25 p-4">
                  <h3 className="heading-font text-3xl text-[#39FF14]">{trainer.name}</h3>
                  <p className="mt-1 text-zinc-200">{trainer.role}</p>
                  <p className="text-sm text-zinc-400">{trainer.certs}</p>
                  <a {...externalLinkProps} href={links.personalTraining} className="mt-4 inline-block border border-[#39FF14] px-4 py-2 text-sm text-[#39FF14] transition hover:bg-[#39FF14]/10">
                    BOOK A SESSION
                  </a>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section id="membership" className="grid-bg border-y border-[#39FF14]/20 bg-[#050505] px-6 py-20 md:py-28">
          <SectionHeading title="Membership Plans" subtitle="Choose the plan that matches your goals. Every plan is powered by accountability." />
          <div className="mx-auto mt-12 grid max-w-6xl gap-6 lg:grid-cols-3">
            {[
              {
                name: "Starter Plan",
                price: "₹ 1,999/month",
                perks: ["Gym Access", "Basic Equipment", "Locker Facility"],
              },
              {
                name: "Pro Plan",
                price: "₹ 3,499/month",
                perks: ["Everything In Starter", "Diet Plan", "Group Classes", "Progress Tracking"],
                featured: true,
              },
              {
                name: "Elite Plan",
                price: "₹ 5,999/month",
                perks: ["Everything In Pro", "Personal Trainer", "Supplement Guidance", "Priority Support", "24/7 WhatsApp Access"],
              },
            ].map((plan) => (
              <motion.article
                key={plan.name}
                whileHover={{ y: -8 }}
                className={`border p-7 backdrop-blur ${
                  plan.featured
                    ? "border-[#39FF14] bg-[#39FF14]/10 shadow-[0_0_35px_rgba(57,255,20,0.24)]"
                    : "border-[#39FF14]/30 bg-black/35"
                }`}
              >
                {plan.featured && (
                  <p className="mb-3 inline-block border border-[#39FF14] px-3 py-1 text-xs tracking-[0.2em] text-[#39FF14]">MOST POPULAR</p>
                )}
                <h3 className="heading-font text-4xl uppercase">{plan.name}</h3>
                <p className="mt-2 text-2xl text-[#39FF14]">{plan.price}</p>
                <ul className="mt-4 space-y-2 text-zinc-200">
                  {plan.perks.map((perk) => (
                    <li key={perk}>- {perk}</li>
                  ))}
                </ul>
                <a {...externalLinkProps} href={links.joinInquiry} className="mt-6 inline-block border border-[#39FF14] px-5 py-2 text-[#39FF14] transition hover:bg-[#39FF14]/10">
                  JOIN NOW ON WHATSAPP
                </a>
              </motion.article>
            ))}
          </div>
        </section>

        <section id="testimonials" className="px-6 py-20 md:py-28">
          <SectionHeading title="Member Stories" subtitle="Real voices from members who committed to consistency and transformed." />
           <div className="mx-auto mt-10 max-w-3xl border border-[#39FF14]/35 bg-[#070707] p-8 text-center">
            <div className="mb-5 flex justify-center gap-1 text-[#39FF14]">
              {Array.from({ length: 5 }).map((_, index) => (
                <span key={index}>*</span>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonials[activeReview].name}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45 }}
              >
                <p className="text-xl text-zinc-100">"{testimonials[activeReview].quote}"</p>
                <p className="mt-4 text-sm uppercase tracking-[0.12em] text-zinc-400">
                  {testimonials[activeReview].name} | {testimonials[activeReview].city}
                </p>
              </motion.div>
            </AnimatePresence>
             <div className="mt-6 flex justify-center gap-2">
               {testimonials.map((item, index) => (
                 <button
                   key={item.name}
                   type="button"
                   onClick={() => setActiveReview(index)}
                   className={`h-2.5 w-8 border border-[#39FF14] transition ${
                     activeReview === index ? "bg-[#39FF14]" : "bg-transparent"
                   }`}
                   aria-label={`Show testimonial ${index + 1}`}
                 />
               ))}
             </div>
          </div>
        </section>

        <section id="contact" className="grid-bg border-y border-[#39FF14]/20 bg-[#020202] px-6 py-20 md:py-28">
          <div className="mx-auto max-w-6xl text-center">
            <h2 data-text="READY TO TRANSFORM" className="glitch-text display-font text-6xl leading-[0.9] text-white md:text-8xl">
              READY TO
              <br />
              TRANSFORM
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-zinc-300">
              Stop waiting. Start today. Your best version is one message away.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
               <a {...externalLinkProps} href={links.joinInquiry} className="neon-btn px-6 py-3">
                JOIN NOW
              </a>
               <a {...externalLinkProps} href={links.generalInquiry} className="neon-btn-outline px-6 py-3">
                WHATSAPP INQUIRY
              </a>
               <a {...externalLinkProps} href={links.instagram} className="neon-btn-outline px-6 py-3">
                INSTAGRAM
              </a>
            </div>
          </div>

          <div className="mx-auto mt-14 grid max-w-6xl gap-8 md:grid-cols-2">
            <div className="space-y-2 text-zinc-200">
              <p>WhatsApp: +91 7722099006</p>
              <p>Instagram: @grow.your.online.presence</p>
              <p>Location: Add Gym Address</p>
              <p>Timings: Mon-Sat, 6:00 AM - 10:00 PM</p>
              <p>Email: hello@notionfitness.in</p>
            </div>
            <iframe
              title="Gym location"
              src="https://www.google.com/maps?q=Pune%20Maharashtra&output=embed"
              className="h-72 w-full border border-[#39FF14]/30"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </section>
      </main>

      <footer className="px-6 py-12">
        <div className="mx-auto grid max-w-6xl gap-8 border border-[#39FF14]/25 p-6 md:grid-cols-4">
          <div>
            <p className="display-font text-4xl text-[#39FF14]">NOTION FITNESS</p>
            <p className="mt-2 text-zinc-300">BUILD. GRIND. EVOLVE.</p>
          </div>
          <div>
            <p className="mb-2 font-semibold text-[#39FF14]">Quick Links</p>
            <a href="#home" className="block text-sm text-zinc-300">
              Home
            </a>
            <a href="#about" className="block text-sm text-zinc-300">
              About
            </a>
            <a href="#programs" className="block text-sm text-zinc-300">
              Programs
            </a>
            <a href="#membership" className="block text-sm text-zinc-300">
              Membership
            </a>
          </div>
          <div>
            <p className="mb-2 font-semibold text-[#39FF14]">Programs</p>
            <p className="text-sm text-zinc-300">Strength</p>
            <p className="text-sm text-zinc-300">Fat Loss</p>
            <p className="text-sm text-zinc-300">Muscle</p>
            <p className="text-sm text-zinc-300">Personal Training</p>
          </div>
          <div>
            <p className="mb-2 font-semibold text-[#39FF14]">Contact</p>
            <a {...externalLinkProps} href={links.generalInquiry} className="block text-sm text-zinc-300">
              +91 7722099006
            </a>
            <a {...externalLinkProps} href={links.instagram} className="block text-sm text-zinc-300">
              Instagram
            </a>
            <p className="text-sm text-zinc-300">Pune, Maharashtra</p>
          </div>
        </div>
        <p className="mt-6 text-center text-sm text-zinc-500">© {new Date().getFullYear()} NOTION FITNESS. All Rights Reserved.</p>
      </footer>

      <a
        {...externalLinkProps}
        href={links.instagram}
        className="fixed bottom-28 right-5 z-40 flex h-12 w-12 items-center justify-center border border-[#39FF14] bg-black/75 text-[#39FF14] backdrop-blur transition hover:bg-[#39FF14]/10"
        aria-label="Instagram"
      >
        <FaInstagram className="text-xl" />
      </a>
      <a
        {...externalLinkProps}
        href={links.joinInquiry}
        className="fixed bottom-12 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#39FF14] text-black shadow-[0_0_24px_rgba(57,255,20,0.6)]"
        aria-label="WhatsApp"
      >
        <span className="animate-pulse-ring absolute inset-0 rounded-full border border-[#39FF14]" />
        <FaWhatsapp className="relative z-10 text-2xl" />
      </a>
      {showTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-12 left-5 z-40 flex h-11 w-11 items-center justify-center border border-[#39FF14] bg-black/80 text-[#39FF14]"
          aria-label="Scroll to top"
        >
          ^
        </button>
      )}

      <div className="fixed bottom-0 left-0 z-30 flex w-full justify-around border-t border-[#39FF14]/25 bg-black/95 py-2 text-xs md:hidden">
        {[
          { label: "Home", id: "home" },
          { label: "Programs", id: "programs" },
          { label: "Plans", id: "membership" },
          { label: "Contact", id: "contact" },
        ].map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`${activeSection === item.id ? "text-[#39FF14]" : "text-zinc-200"}`}
          >
            {item.label}
          </a>
        ))}
      </div>
    </div>
  );
}

function LoadingScreen() {
  const letters = "NOTION FITNESS".split("");

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.55 } }}
    >
      <div className="display-font text-5xl text-[#39FF14] md:text-7xl">
        {letters.map((letter, index) => (
          <motion.span
            key={`${letter}-${index}`}
            className="inline-block animate-flicker"
            initial={{ y: -42, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.05, duration: 0.4 }}
          >
            {letter === " " ? "\u00A0" : letter}
          </motion.span>
        ))}
      </div>
      <div className="mt-8 h-1 w-64 overflow-hidden border border-[#39FF14]/35">
        <motion.div
          className="h-full bg-[#39FF14]"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 2.2, ease: "easeInOut" }}
        />
      </div>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-4 text-sm tracking-[0.3em] text-[#39FF14]">
        LOADING EXPERIENCE
      </motion.p>
    </motion.div>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 2500);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>{loading ? <LoadingScreen /> : null}</AnimatePresence>
      {!loading && <AppContent />}
    </>
  );
}
