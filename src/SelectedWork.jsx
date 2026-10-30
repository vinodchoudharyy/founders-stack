import { useEffect, useRef, useState } from "react";

export const services = [
  {
    number: "01",
    name: "WEBSITE",
    category: "01 / WEBSITE DEVELOPMENT",
    icon: "language",
    iconAccent: "#c5ff30",
    title: "Websites that do more than look good.",
    description:
      "Custom digital experiences for businesses, brands and ideas—from the first landing page to a complete content-managed platform.",
    deliverables: ["Business Websites", "Corporate Websites", "Landing Pages", "Portfolio Websites", "Custom Websites", "CMS Development", "PWA Development"],
    mark: "</>",
    accent: "#9bd23c",
    visual: "project-aurel",
    visualLabel: "Website design and development",
    cardEyebrow: "YOUR NEXT GREAT WEBSITE",
    cardTitle: <>Made for<br />what&apos;s next.</>,
    cardFoot: "FAST · RESPONSIVE · YOURS",
    pattern: "browser",
  },
  {
    number: "02",
    name: "MOBILE APPS",
    category: "02 / MOBILE APP DEVELOPMENT",
    icon: "android",
    iconAccent: "#42adff",
    title: "Powerful apps. Seamless experiences.",
    description:
      "Intuitive mobile experiences for ambitious ideas and modern businesses, from native apps to cross-platform products.",
    deliverables: ["Android Apps", "iOS Apps", "Flutter Development", "Cross-Platform Applications", "Custom Mobile Solutions"],
    mark: "↗",
    accent: "#ff8738",
    visual: "project-northstar",
    visualLabel: "Mobile app development",
    cardEyebrow: "DESIGNED FOR EVERY SCREEN",
    cardTitle: <>Your product.<br />In their hands.</>,
    cardFoot: "ANDROID · IOS · CROSS-PLATFORM",
    pattern: "mobile",
  },
  {
    number: "03",
    name: "FULL-STACK",
    category: "03 / FULL-STACK & SOFTWARE DEVELOPMENT",
    icon: "code",
    iconAccent: "#b46cff",
    title: "Software built around your business.",
    description:
      "Complete software products—from polished frontends to reliable backends—built around the way your business works.",
    deliverables: ["Frontend Development", "Backend Development", "SaaS Platforms", "Web Applications", "Admin Panels", "Dashboards", "Custom Software"],
    mark: "{ }",
    accent: "#8fca45",
    visual: "project-solace",
    visualLabel: "Custom software development",
    cardEyebrow: "BUILT AROUND YOUR BUSINESS",
    cardTitle: <>Your way<br />of working.</>,
    cardFoot: "CONNECTED · CUSTOM · SCALABLE",
    pattern: "software",
  },
  {
    number: "04",
    name: "AI AGENTS",
    category: "04 / AI AGENTS DEVELOPMENT",
    icon: "smart_toy",
    iconAccent: "#36c9ff",
    title: "AI agents, ready to work for you.",
    description:
      "Purpose-built AI agents that handle conversations, qualify leads and support customers across the channels your business uses.",
    deliverables: ["AI Voice Agents", "AI Calling Agents", "AI Sales Agents", "WhatsApp AI Agents", "Customer Support Agents", "Multi-Agent Systems", "AI Assistants", "Lead Qualification Agents"],
    mark: "AI",
    accent: "#ff9b54",
    visual: "project-northstar",
    visualLabel: "AI automation and intelligent systems",
    cardEyebrow: "INTELLIGENCE THAT GETS TO WORK",
    cardTitle: <>A helpful agent.<br />Always on.</>,
    cardFoot: "VOICE · SALES · SUPPORT · LEADS",
    pattern: "automation",
  },
  {
    number: "05",
    name: "AI AUTOMATION",
    category: "05 / AI & BUSINESS AUTOMATION",
    icon: "memory",
    iconAccent: "#a9f849",
    title: "Let better workflows do more.",
    description:
      "Practical AI and automation to reduce repetitive work, streamline business processes and connect the tools your team relies on.",
    deliverables: ["AI Chatbots", "Workflow Automation", "Intelligent Document Processing", "Business Process Automation", "AI Integration", "Custom AI Solutions"],
    mark: "↗",
    accent: "#a6d957",
    visual: "project-aurel",
    visualLabel: "Digital marketing and growth",
    cardEyebrow: "MAKE ROOM FOR BETTER WORK",
    cardTitle: <>Less repetition.<br />More possibility.</>,
    cardFoot: "AI · WORKFLOWS · INTEGRATION",
    pattern: "automation",
  },
  {
    number: "06",
    name: "UI/UX + DESIGN",
    category: "06 / UI/UX & GRAPHIC DESIGN",
    icon: "design_services",
    iconAccent: "#ff5b9b",
    title: "Experiences people remember.",
    description:
      "Thoughtful digital interfaces and visual design that make your products intuitive and your brand recognizable.",
    deliverables: ["Website UI/UX", "Mobile App Design", "Wireframing", "Prototyping", "Brand Identity", "Logo Design", "Creative Graphics", "Design Systems"],
    mark: "F/S",
    accent: "#ff7a1a",
    visual: "project-solace",
    visualLabel: "Branding and user experience design",
    cardEyebrow: "MAKE YOUR FIRST IMPRESSION COUNT",
    cardTitle: <>A feeling<br />all your own.</>,
    cardFoot: "IDENTITY · INTERFACES · DESIGN",
    pattern: "brand",
  },
  {
    number: "07",
    name: "CRM + ERP",
    category: "07 / CRM & ERP DEVELOPMENT",
    icon: "database",
    iconAccent: "#a35cff",
    title: "Bring your business into one system.",
    description:
      "Custom business systems that bring customers, sales, people and operations together in one clear view.",
    deliverables: ["Custom CRM", "Sales Management", "Lead Management", "HRM", "Inventory Systems", "ERP Software", "Business Dashboards", "Customer Management"],
    mark: "↗",
    accent: "#91c846",
    visual: "project-northstar",
    visualLabel: "CRM and ERP development",
    cardEyebrow: "YOUR BUSINESS, CONNECTED",
    cardTitle: <>One system.<br />Your way.</>,
    cardFoot: "CRM · ERP · BUSINESS SYSTEMS",
    pattern: "software",
  },
  {
    number: "08",
    name: "API + DATABASE",
    category: "08 / API & DATABASE DEVELOPMENT",
    icon: "cloud_upload",
    iconAccent: "#63ef70",
    title: "The technology behind great experiences.",
    description:
      "Secure, dependable APIs and database foundations that connect your services and power your digital products.",
    deliverables: ["REST APIs", "Third-Party API Integration", "Payment Gateway Integration", "Database Architecture", "Backend Systems", "API Security"],
    mark: "{ }",
    accent: "#ff9147",
    visual: "project-northstar",
    visualLabel: "API and database development",
    cardEyebrow: "EVERYTHING CONNECTS",
    cardTitle: <>Strong foundations.<br />Room to grow.</>,
    cardFoot: "BACKEND · DATABASES · APIS",
    pattern: "cloud",
  },
  {
    number: "09",
    name: "E-COMMERCE",
    category: "09 / E-COMMERCE & MARKETPLACE DEVELOPMENT",
    icon: "shopping_cart",
    iconAccent: "#ffb72e",
    title: "A better way to buy and sell online.",
    description:
      "Flexible commerce experiences for online stores and multi-vendor marketplaces, designed to make every step easier.",
    deliverables: ["Online Stores", "Multi-Vendor Marketplaces", "Seller Panels", "Product Management", "Order Management", "Payment Integration", "Custom Shopping Platforms"],
    mark: "↗",
    accent: "#9bd23c",
    visual: "project-aurel",
    visualLabel: "E-commerce and marketplace development",
    cardEyebrow: "FROM FIRST CLICK TO CHECKOUT",
    cardTitle: <>Make shopping<br />feel effortless.</>,
    cardFoot: "STORES · MARKETPLACES · CHECKOUT",
    pattern: "browser",
  },
  {
    number: "10",
    name: "DIGITAL GROWTH",
    category: "10 / DIGITAL MARKETING & GROWTH",
    icon: "campaign",
    iconAccent: "#ff5f79",
    title: "Make your brand impossible to ignore.",
    description:
      "Digital strategy and performance marketing that grow your online presence and connect your brand with the right audience.",
    deliverables: ["SEO", "Social Media Marketing", "Google Ads", "Meta Ads", "Performance Marketing", "Lead Generation", "Content Strategy", "Campaign Management"],
    mark: "↗",
    accent: "#ff7a1a",
    visual: "project-aurel",
    visualLabel: "Digital marketing and growth",
    cardEyebrow: "BE FOUND BY THE RIGHT PEOPLE",
    cardTitle: <>Good stories<br />travel further.</>,
    cardFoot: "SEO · CONTENT · CAMPAIGNS",
    pattern: "growth",
  },
  {
    number: "11",
    name: "CLOUD + DEPLOY",
    category: "11 / CLOUD & DEPLOYMENT SOLUTIONS",
    icon: "cloud",
    iconAccent: "#73ed65",
    title: "Go live with confidence. Keep growing.",
    description:
      "Cloud infrastructure, deployment and ongoing technical care to keep your services available, monitored and ready to scale.",
    deliverables: ["AWS", "Cloud Hosting", "Server Configuration", "CI/CD", "Domain & DNS Setup", "Deployment", "Maintenance", "Monitoring & Technical Support"],
    mark: "↗",
    accent: "#91c846",
    visual: "project-northstar",
    visualLabel: "Cloud hosting and deployment solutions",
    cardEyebrow: "READY FOR WHAT'S NEXT",
    cardTitle: <>Built to launch.<br />Ready to scale.</>,
    cardFoot: "AWS · DEPLOYMENT · SUPPORT",
    pattern: "cloud",
  },
];

function ServicePreview({ service }) {
  return (
    <div
      className={`service-preview service-preview-${service.pattern}`}
      style={{ "--service-accent": service.accent }}
    >
      <div className="preview-window-bar">
        <span>{service.name}</span>
        <span><i></i><i></i><i></i></span>
      </div>
      <div className="preview-layout">
        <div className="preview-copy">
          <small>{service.cardEyebrow}</small>
          <strong>{service.cardTitle}</strong>
          <span>{service.cardFoot}</span>
        </div>
        <div className="preview-graphic" aria-hidden="true">
          <span className="preview-graphic-ring"></span>
          <span className="preview-graphic-shape">{service.mark}</span>
          <span className="preview-orbit-dot"></span>
          <span className="preview-graphic-lines"><i></i><i></i><i></i></span>
        </div>
      </div>
      <div className="preview-status"><span><i></i> DIGITAL SOLUTIONS</span><span>{service.number} / 11</span></div>
    </div>
  );
}

const latitudeRows = [
  { latitude: -62, count: 5 },
  { latitude: -43, count: 7 },
  { latitude: -24, count: 8 },
  { latitude: -5, count: 9 },
  { latitude: 14, count: 9 },
  { latitude: 33, count: 8 },
  { latitude: 52, count: 7 },
  { latitude: 68, count: 5 },
];

const getServiceSlug = (service) =>
  service.category
    .slice(4)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const getServiceIndexFromHash = () => {
  const match = window.location.hash.match(/^#service\/(.+)$/);
  if (!match) return null;
  const index = services.findIndex((service) => getServiceSlug(service) === match[1]);
  return index < 0 ? null : index;
};

function ServiceDetailPage({ service, index, onBack, onNavigate, onContact }) {
  const workflow = [
    {
      number: "01",
      title: "Discover",
      description: `We learn about your goals, audience and requirements for ${service.category.slice(4).toLowerCase()}.`,
    },
    {
      number: "02",
      title: "Plan",
      description: `We shape the scope, experience and technical approach around ${service.deliverables.slice(0, 2).join(" and ")}.`,
    },
    {
      number: "03",
      title: "Build",
      description: `We design, develop and connect the agreed solution, sharing progress so you can give feedback along the way.`,
    },
    {
      number: "04",
      title: "Launch & improve",
      description: "We test the finished work, help you launch, and can continue to support and improve it as your needs grow.",
    },
  ];

  return (
    <div className="service-detail-page" role="main" style={{ "--service-accent": service.accent }}>
      <header className="service-detail-header">
        <button type="button" className="service-detail-back" onClick={onBack}>
          <span aria-hidden="true">←</span> All services
        </button>
        <a className="service-detail-wordmark" href="#home">FOUNDERSTACK <i>/</i> TECHNOLOGIES</a>
        <span className="service-detail-count">{service.number} / 11</span>
      </header>

      <section className="service-detail-hero">
        <div className="service-detail-hero-copy">
          <p className="eyebrow"><span className="work-index">{service.number}</span> {service.category.slice(4)}</p>
          <h1>{service.title}</h1>
          <p>{service.description}</p>
          <button type="button" className="service-detail-cta" onClick={onContact}>
            Discuss your project <span aria-hidden="true">↗</span>
          </button>
        </div>
        <div className={`service-detail-visual service-preview-${service.pattern}`}>
          <ServicePreview service={service} />
        </div>
      </section>

      <section className="service-detail-section" aria-labelledby="service-capabilities-title">
        <div className="service-detail-section-heading">
          <p className="eyebrow">WHAT WE DO</p>
          <h2 id="service-capabilities-title">One service.<br /><span>Everything you need.</span></h2>
          <p>Choose the pieces you need now, and grow into the rest when you're ready.</p>
        </div>
        <div className="service-detail-capabilities">
          {service.deliverables.map((deliverable, itemIndex) => (
            <article key={deliverable}>
              <span>{String(itemIndex + 1).padStart(2, "0")}</span>
              <h3>{deliverable}</h3>
              <i aria-hidden="true">↗</i>
            </article>
          ))}
        </div>
      </section>

      <section className="service-detail-section service-detail-process" aria-labelledby="service-process-title">
        <div className="service-detail-section-heading">
          <p className="eyebrow">HOW IT WORKS</p>
          <h2 id="service-process-title">From first conversation<br /><span>to launch day.</span></h2>
        </div>
        <div className="service-detail-steps">
          {workflow.map((step) => (
            <article key={step.number}>
              <span>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="service-detail-footer">
        <div>
          <p className="eyebrow">HAVE A PROJECT IN MIND?</p>
          <h2>Let's make it<br /><span>work for you.</span></h2>
        </div>
        <button type="button" className="service-detail-cta" onClick={onContact}>
          Start a project <span aria-hidden="true">↗</span>
        </button>
        <nav aria-label="Browse other services">
          <button type="button" onClick={() => onNavigate((index + services.length - 1) % services.length)}>← Previous service</button>
          <button type="button" onClick={() => onNavigate((index + 1) % services.length)}>Next service →</button>
        </nav>
      </footer>
    </div>
  );
}

function SelectedWork() {
  const [detailIndex, setDetailIndex] = useState(getServiceIndexFromHash);
  const [serviceStart, setServiceStart] = useState(0);
  const detailService = detailIndex === null ? null : services[detailIndex];
  const reducedMotion = useRef(
    window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const syncServiceRoute = () => setDetailIndex(getServiceIndexFromHash());
    window.addEventListener("popstate", syncServiceRoute);
    window.addEventListener("hashchange", syncServiceRoute);
    return () => {
      window.removeEventListener("popstate", syncServiceRoute);
      window.removeEventListener("hashchange", syncServiceRoute);
    };
  }, []);

  useEffect(() => {
    if (!detailService) return undefined;
    const previousOverflow = document.body.style.overflow;
    const previousTitle = document.title;
    document.body.style.overflow = "hidden";
    document.title = `${detailService.category.slice(4)} | FounderStack Technologies`;
    document.querySelector(".service-detail-page")?.scrollTo({ top: 0, behavior: "instant" });
    return () => {
      document.body.style.overflow = previousOverflow;
      document.title = previousTitle;
    };
  }, [detailService]);

  const openService = (index) => {
    const service = services[index];
    window.history.pushState({ founderStackService: true }, "", `#service/${getServiceSlug(service)}`);
    setDetailIndex(index);
  };

  const navigateService = (index) => {
    const service = services[index];
    window.history.replaceState({ founderStackService: true }, "", `#service/${getServiceSlug(service)}`);
    setDetailIndex(index);
  };

  const closeService = () => {
    if (window.history.state?.founderStackService) {
      window.history.back();
      return;
    }
    window.history.replaceState(null, "", "#work");
    setDetailIndex(null);
    window.setTimeout(() => {
      document.querySelector("#work")?.scrollIntoView({
        behavior: reducedMotion.current ? "instant" : "smooth",
      });
    }, 0);
  };

  const goToContact = () => {
    window.history.replaceState(null, "", "#contact");
    setDetailIndex(null);
    window.setTimeout(() => {
      document.querySelector("#contact")?.scrollIntoView({
        behavior: reducedMotion.current ? "instant" : "smooth",
      });
    }, 0);
  };

  const visibleServices = Array.from(
    { length: Math.min(9, services.length) },
    (_, index) => services[(serviceStart + index) % services.length],
  );

  if (detailService) {
    return (
      <ServiceDetailPage
        service={detailService}
        index={detailIndex}
        onBack={closeService}
        onNavigate={navigateService}
        onContact={goToContact}
      />
    );
  }

  return (
    <section className="selected-work fs-services" id="work" aria-labelledby="work-heading">
      <div className="fs-wrapper">
        <div className="fs-layout">
          <div className="fs-intro">
            <div className="fs-heading">
              <div className="fs-tag"><span className="fs-dot" aria-hidden="true"></span> OUR SERVICES</div>
              <h2 id="work-heading">Build. Scale.<br /><span>Grow.</span></h2>
              <p>From idea to impact, we craft digital solutions that drive real business growth.</p>
              <a className="fs-intro-link" href="#service-grid">Explore all services <span aria-hidden="true">→</span></a>
            </div>
            <div className="fs-stats" aria-label="FounderStack at a glance">
              <div><span className="material-symbols-outlined" aria-hidden="true">bolt</span><strong>11</strong><small>Core services</small></div>
              <div><span className="material-symbols-outlined" aria-hidden="true">rocket_launch</span><strong>End-to-end</strong><small>Digital solutions</small></div>
              <div><span className="material-symbols-outlined" aria-hidden="true">hub</span><strong>One team</strong><small>From idea to launch</small></div>
            </div>
          </div>
          <div className="fs-grid" id="service-grid">
            {visibleServices.map((service) => {
              const serviceIndex = services.indexOf(service);
              const extraCount = service.deliverables.length - 2;
              return (
                <article className="fs-card" key={service.number} style={{ "--service-accent": service.accent, "--icon-accent": service.iconAccent }}>
                  <span className="fs-number">{service.number}</span>
                  <span className="fs-icon">
                    <span className="material-symbols-outlined">{service.icon}</span>
                  </span>
                  <h3>{service.category.slice(5)}</h3>
                  <ul className="fs-deliverables">
                    {service.deliverables.slice(0, 2).map((deliverable) => <li key={deliverable}>{deliverable}</li>)}
                  </ul>
                  {extraCount > 0 && <span className="fs-more">+{extraCount} more</span>}
                  <button
                    type="button"
                    className="fs-explore"
                    aria-label={`Explore ${service.category.slice(5)}`}
                    onClick={() => openService(serviceIndex)}
                  >
                    Explore <span aria-hidden="true">→</span>
                  </button>
                </article>
              );
            })}
          </div>
          <div className="fs-bottom-bar">
            <p><span className="fs-bottom-spark" aria-hidden="true">✦</span> Let&apos;s turn your ideas into something extraordinary.</p>
            <div className="fs-bottom-controls">
              <button type="button" aria-label="Previous services" onClick={() => setServiceStart((current) => (current + services.length - 1) % services.length)}>←</button>
              <span>{String(serviceStart + 1).padStart(2, "0")} <i>/ {String(services.length).padStart(2, "0")}</i></span>
              <button type="button" aria-label="Next services" onClick={() => setServiceStart((current) => (current + 1) % services.length)}>→</button>
              <button type="button" className="fs-view-all" onClick={() => {
                setServiceStart(0);
                document.querySelector("#service-grid")?.scrollIntoView({
                  behavior: reducedMotion.current ? "instant" : "smooth",
                  block: "center",
                });
              }}>
                View all services <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SelectedWork;
