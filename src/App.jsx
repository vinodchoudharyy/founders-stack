import { useCallback, useEffect, useMemo, useState } from "react";
import parse, { domToReact } from "html-react-parser";
import pageTemplate from "../page-content.html?raw";
import ImmersiveUniverse from "./ImmersiveUniverse.jsx";
import SelectedWork from "./SelectedWork.jsx";
import AccountPage from "./AccountPage.jsx";
import ServiceChatbot from "./ServiceChatbot.jsx";

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountRoute, setAccountRoute] = useState(
    () => window.location.hash === "#account" || window.location.hash.includes("access_token="),
  );
  const [scrollProgress, setScrollProgress] = useState(0);
  const [formMessage, setFormMessage] = useState("");
  const [formStatus, setFormStatus] = useState("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const reducedMotion = useMemo(
    () => window.matchMedia("(prefers-reduced-motion: reduce)"),
    [],
  );

  useEffect(() => {
    const syncAccountRoute = () =>
      setAccountRoute(
        window.location.hash === "#account" ||
          window.location.hash.includes("access_token="),
      );
    window.addEventListener("hashchange", syncAccountRoute);
    window.addEventListener("popstate", syncAccountRoute);
    return () => {
      window.removeEventListener("hashchange", syncAccountRoute);
      window.removeEventListener("popstate", syncAccountRoute);
    };
  }, []);

  const submitProjectEnquiry = useCallback(async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    setIsSubmitting(true);
    setFormStatus("sending");
    setFormMessage("Sending your project enquiry...");

    try {
      const response = await fetch("https://formspree.io/f/mjyybnnd", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });

      if (!response.ok) {
        setFormStatus("error");
        setFormMessage(
          `We couldn't send your enquiry (Formspree returned ${response.status}). Please try again or email us directly.`,
        );
        return;
      }

      form.reset();
      setFormStatus("success");
      setFormMessage("Thanks for reaching out. Your enquiry has been sent successfully.");
    } catch {
      setFormStatus("error");
      setFormMessage(
        "We couldn't connect to send your enquiry. Please check your connection and try again, or email us directly.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  useEffect(() => {
    const updateProgress = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(total > 0 ? Math.min(window.scrollY / total, 1) : 0);
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  useEffect(() => {
    if (reducedMotion.matches || !("IntersectionObserver" in window)) return;

    const targets = document.querySelectorAll(
      [
        ".intro-content",
        ".intro-rule",
        ".section-heading",
        ".stack-card",
        ".project-visual",
        ".why-grid article",
        ".process-grid article",
        ".solutions-grid article",
        ".solutions-note",
        ".solutions-section > .button",
        ".founder-art",
        ".founder-copy > *",
        ".faq-list details",
        ".contact-copy > *",
        ".contact-form",
        ".site-footer > *",
      ].join(", "),
    );
    document.body.classList.add("motion-ready");

    const observer = new IntersectionObserver(
      (entries, activeObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          activeObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -35px 0px" },
    );

    targets.forEach((target, index) => {
      target.classList.add("motion-reveal");
      if (target.matches(".founder-art, .contact-copy > *")) {
        target.classList.add("motion-from-left");
      }
      if (
        target.matches(
          ".stack-card, .why-grid article, .process-grid article, .solutions-grid article, .faq-list details",
        )
      ) {
        target.style.transitionDelay = `${(index % 3) * 90}ms`;
      }
      observer.observe(target);
    });

    return () => {
      observer.disconnect();
      document.body.classList.remove("motion-ready");
    };
  }, [reducedMotion]);

  const options = useMemo(
    () => ({
      replace(domNode) {
        if (domNode.type !== "tag") return undefined;
        const classes = domNode.attribs?.class?.split(/\s+/) ?? [];

        if (domNode.name === "button" && classes.includes("menu-toggle")) {
          return (
            <button
              type="button"
              className="menu-toggle"
              aria-expanded={menuOpen}
              aria-controls="primary-nav"
              onClick={() => setMenuOpen((open) => !open)}
            >
              {domToReact(domNode.children, options)}
            </button>
          );
        }

        if (domNode.name === "nav" && domNode.attribs?.id === "primary-nav") {
          return (
            <nav
              id="primary-nav"
              className={`primary-nav${menuOpen ? " is-open" : ""}`}
              aria-label="Main navigation"
              onClick={(event) => {
                if (event.target.closest("a")) setMenuOpen(false);
              }}
            >
              {domToReact(domNode.children, options)}
            </nav>
          );
        }

        if (domNode.name === "form" && domNode.attribs?.id === "project-form") {
          return (
            <form
              id="project-form"
              className={domNode.attribs.class}
              action="https://formspree.io/f/mjyybnnd"
              method="POST"
              onSubmit={submitProjectEnquiry}
            >
              {domToReact(domNode.children, options)}
            </form>
          );
        }

        if (domNode.name === "p" && classes.includes("form-note")) {
          return (
            <p
              className={`form-note form-note-${formStatus}`}
              id="form-note"
              aria-live="polite"
              role={formStatus === "error" ? "alert" : "status"}
            >
              {formMessage || domToReact(domNode.children, options)}
            </p>
          );
        }

        if (domNode.name === "button" && classes.includes("form-submit")) {
          return (
            <button
              className={domNode.attribs.class}
              type="submit"
              disabled={isSubmitting}
              aria-describedby="form-note"
            >
              {isSubmitting ? "Sending enquiry..." : domToReact(domNode.children, options)}
            </button>
          );
        }

        if (domNode.name === "div" && classes.includes("hero-art")) {
          return <ImmersiveUniverse />;
        }

        if (domNode.name === "div" && classes.includes("selected-work-mount")) {
          return <SelectedWork />;
        }

        if (domNode.name === "div" && classes.includes("scroll-progress")) {
          return (
            <div
              className="scroll-progress"
              aria-hidden="true"
              style={{ transform: `scaleX(${scrollProgress})` }}
            />
          );
        }

        return undefined;
      },
    }),
    [formMessage, formStatus, isSubmitting, menuOpen, scrollProgress, submitProjectEnquiry],
  );

  return accountRoute ? (
    <AccountPage />
  ) : (
    <>
      {parse(pageTemplate, options)}
      <ServiceChatbot />
    </>
  );
}

export default App;
