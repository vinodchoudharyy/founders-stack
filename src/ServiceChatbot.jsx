import { useEffect, useRef, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { services } from "./SelectedWork.jsx";
import { auth } from "./firebase.js";

const estimateRanges = {
  "01": { min: 40000, max: 120000, basis: "project" },
  "02": { min: 100000, max: 350000, basis: "project" },
  "03": { min: 150000, max: 500000, basis: "project" },
  "04": { min: 75000, max: 300000, basis: "project" },
  "05": { min: 40000, max: 200000, basis: "project" },
  "06": { min: 30000, max: 150000, basis: "project" },
  "07": { min: 150000, max: 500000, basis: "project" },
  "08": { min: 40000, max: 200000, basis: "project" },
  "09": { min: 75000, max: 300000, basis: "project" },
  "10": { min: 20000, max: 60000, basis: "monthly" },
  "11": { min: 25000, max: 150000, basis: "setup" },
};

const projectScopes = [
  { value: "starter", label: "Starter · essentials", multiplier: 1 },
  { value: "standard", label: "Standard · several features", multiplier: 1.8 },
  { value: "advanced", label: "Advanced · custom build", multiplier: 3 },
];

const integrationLevels = [
  { value: "none", label: "No external integrations", multiplier: 1 },
  { value: "some", label: "1–2 integrations", multiplier: 1.15 },
  { value: "many", label: "3+ integrations", multiplier: 1.3 },
];

const timelines = [
  { value: "flexible", label: "Flexible · 2+ months", multiplier: 1 },
  { value: "standard", label: "Standard · 4–8 weeks", multiplier: 1 },
  { value: "urgent", label: "Urgent · under 4 weeks", multiplier: 1.15 },
];

const formatINR = (amount) => `₹${Math.round(amount).toLocaleString("en-IN")}`;
const serviceLabel = (service) => service.category.slice(5);
const makeChoices = (options, prefix) =>
  options.map((option) => ({ label: option.label, value: `${prefix}:${option.value}` }));

const makeWelcomeMessage = (name = "") => ({
  id: 1,
  role: "assistant",
  text: `${name ? `Hi ${name}! ` : "Hi! "}I can explain our services, answer common project questions, or build an indicative budget for one or more services.`,
  choices: [
    { label: "Explore services", value: "explore" },
    { label: "Build a project estimate", value: "estimate" },
    { label: "Common questions", value: "faq" },
  ],
});

function findService(message) {
  const text = message.toLowerCase();
  const aliases = [
    ["website", "web development", "landing page", "cms", "pwa"],
    ["mobile app", "mobile apps", "android", "ios", "flutter", "app development"],
    ["full-stack", "full stack", "custom software", "saas", "web application", "software"],
    ["ai agent", "ai agents", "voice agent", "calling agent", "chatbot"],
    ["automation", "workflow", "business process", "ai integration"],
    ["ui/ux", "ui ux", "graphic design", "branding", "logo", "wireframe"],
    ["crm", "erp", "inventory", "sales management", "hrm"],
    ["api", "database", "rest api", "payment integration"],
    ["e-commerce", "ecommerce", "marketplace", "online store", "shopping"],
    ["digital marketing", "seo", "social media", "meta ads", "google ads"],
    ["cloud", "deployment", "devops", "hosting", "aws", "ci/cd"],
  ];

  let bestIndex = -1;
  let bestLength = 0;
  aliases.forEach((terms, index) => {
    terms.forEach((term) => {
      if (text.includes(term) && term.length > bestLength) {
        bestIndex = index;
        bestLength = term.length;
      }
    });
  });
  return bestIndex < 0 ? null : services[bestIndex];
}

function getOption(options, text, synonyms = {}) {
  const normalized = text.toLowerCase();
  return options.find((option) =>
    normalized.includes(option.value) ||
    normalized.includes(option.label.toLowerCase().split(" · ")[0]) ||
    (synonyms[option.value] ?? []).some((word) => normalized.includes(word)),
  );
}

function ServiceChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [flow, setFlow] = useState({ step: "idle", selectedServices: [] });
  const [lastEstimate, setLastEstimate] = useState(null);
  const [userName, setUserName] = useState("");
  const [messages, setMessages] = useState([makeWelcomeMessage()]);
  const messageEndRef = useRef(null);
  const inputRef = useRef(null);
  const messageId = useRef(1);

  useEffect(() => {
    if (!auth) return undefined;
    return onAuthStateChanged(auth, (user) => {
      const name = user?.displayName?.trim() || user?.email?.split("@")[0] || "";
      setUserName(name);
      setMessages((current) =>
        current.map((message) =>
          message.id === 1 ? makeWelcomeMessage(name) : message,
        ),
      );
    });
  }, []);

  useEffect(() => {
    if (isOpen) messageEndRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  }, [isOpen, messages]);

  const addMessage = (role, text, choices = []) => {
    messageId.current += 1;
    setMessages((current) =>
      [...current, { id: messageId.current, role, text, choices }].slice(-100),
    );
  };

  const serviceChoices = (excluded = []) =>
    services
      .filter((service) => !excluded.some((selected) => selected.number === service.number))
      .map((service) => ({
        label: `${service.number} · ${service.name}`,
        value: `service:${service.number}`,
      }));

  const askForService = (step, excluded = []) => {
    setFlow((current) => ({ ...current, step }));
    addMessage(
      "assistant",
      step === "estimate-service"
        ? "Which service should we include in your estimate? You can add more than one."
        : step === "add-service"
          ? "Choose another service to add, or finish the estimate."
          : "Which service would you like to know about?",
      [
        ...serviceChoices(excluded),
        ...(step === "add-service" ? [{ label: "Finish estimate", value: "finish-estimate" }] : []),
      ],
    );
  };

  const askForScope = (selectedServices) => {
    setFlow({ step: "scope", selectedServices });
    addMessage(
      "assistant",
      `What scope should I use for ${selectedServices.map((service) => service.name).join(" + ")}?`,
      makeChoices(projectScopes, "scope"),
    );
  };

  const askForIntegrations = (estimate) => {
    setFlow({ ...estimate, step: "integrations" });
    addMessage(
      "assistant",
      "How many third-party integrations or external systems are involved?",
      makeChoices(integrationLevels, "integrations"),
    );
  };

  const askForTimeline = (estimate) => {
    setFlow({ ...estimate, step: "timeline" });
    addMessage("assistant", "What timeline are you aiming for?", makeChoices(timelines, "timeline"));
  };

  const showServiceAnswer = (service) => {
    setFlow({ step: "service", selectedServices: [] });
    addMessage(
      "assistant",
      `${serviceLabel(service)}\n${service.description}\n\nTypical deliverables: ${service.deliverables.join(", ")}.`,
      [
        { label: "Estimate this service", value: `estimate:${service.number}` },
        { label: "Ask about another service", value: "explore" },
        { label: "How do you work?", value: "faq:process" },
      ],
    );
  };

  const calculateEstimate = (estimate) => {
    const scope = projectScopes.find((option) => option.value === estimate.scope);
    const integrations = integrationLevels.find((option) => option.value === estimate.integrations);
    const timeline = timelines.find((option) => option.value === estimate.timeline);
    if (!scope || !integrations || !timeline || estimate.selectedServices.length === 0) {
      addMessage("assistant", "I couldn't complete that estimate. Please start again or contact us for help.", [
        { label: "Start estimate", value: "estimate" },
        { label: "Contact us", value: "contact" },
      ]);
      return;
    }

    const min = estimate.selectedServices.reduce(
      (total, service) => total + estimateRanges[service.number].min,
      0,
    ) * scope.multiplier * integrations.multiplier * timeline.multiplier;
    const max = estimate.selectedServices.reduce(
      (total, service) => total + estimateRanges[service.number].max,
      0,
    ) * scope.multiplier * integrations.multiplier * timeline.multiplier;
    const basis = estimate.selectedServices.some((service) => estimateRanges[service.number].basis === "monthly")
      ? "planning range; digital marketing portion is monthly"
      : estimate.selectedServices.some((service) => estimateRanges[service.number].basis === "setup")
        ? "setup planning range; cloud usage is additional"
        : "project planning range";
    const summary = {
      min: formatINR(min),
      max: formatINR(max),
      services: estimate.selectedServices,
      scope,
      integrations,
      timeline,
      basis,
    };
    setLastEstimate(summary);
    setFlow({ step: "idle", selectedServices: [] });

    const serviceNames = estimate.selectedServices.map(serviceLabel).join(" + ");
    addMessage(
      "assistant",
      `Indicative ${basis} for ${serviceNames}:\n${summary.min}–${summary.max}\n\nScope: ${scope.label}\nIntegrations: ${integrations.label}\nTimeline: ${timeline.label}\n\nThese are editable sample ranges for early planning, not a quotation. Final pricing depends on confirmed requirements. Taxes, ad spend, hosting and third-party subscriptions may be additional.`,
      [
        { label: "Add another service", value: "add-service" },
        { label: "Refine this estimate", value: "estimate" },
        { label: "Prepare a project enquiry", value: "contact" },
      ],
    );
  };

  const goToContact = () => {
    const form = document.querySelector("#project-form");
    const contact = document.querySelector("#contact");
    if (!form || !contact) {
      addMessage("assistant", "The contact form isn't available right now. Please email vinodbusiness01@gmail.com.");
      return;
    }

    if (lastEstimate) {
      const serviceField = form.elements.namedItem("service");
      const budgetField = form.elements.namedItem("budget");
      const descriptionField = form.elements.namedItem("description");
      if (serviceField instanceof HTMLSelectElement) {
        const preferredOption = lastEstimate.services.length === 1
          ? Array.from(serviceField.options).find((option) =>
              option.text.toLowerCase().includes(serviceLabel(lastEstimate.services[0]).toLowerCase()),
            )
          : Array.from(serviceField.options).find((option) => option.text.includes("Multiple services"));
        if (preferredOption) serviceField.value = preferredOption.value || preferredOption.text;
        serviceField.dispatchEvent(new Event("change", { bubbles: true }));
      }
      if (budgetField instanceof HTMLInputElement) {
        budgetField.value = `${lastEstimate.min} – ${lastEstimate.max} INR (indicative only)`;
        budgetField.dispatchEvent(new Event("input", { bubbles: true }));
      }
      if (descriptionField instanceof HTMLTextAreaElement) {
        const summary = [
          `Services: ${lastEstimate.services.map(serviceLabel).join(", ")}`,
          `Scope: ${lastEstimate.scope.label}`,
          `Integrations: ${lastEstimate.integrations.label}`,
          `Timeline: ${lastEstimate.timeline.label}`,
          `Indicative estimate: ${lastEstimate.min}–${lastEstimate.max} INR (${lastEstimate.basis}; not a quote)`,
        ].join("\n");
        descriptionField.value = `${summary}\n\n`;
        descriptionField.dispatchEvent(new Event("input", { bubbles: true }));
      }
    }

    contact.scrollIntoView({ behavior: "smooth", block: "start" });
    setIsOpen(false);
  };

  const answerCommonQuestion = (question) => {
    const normalized = question.toLowerCase();
    if (/timeline|how long|how soon|delivery/.test(normalized)) {
      return "Timelines depend on the agreed scope, feedback and integrations. The estimate guide uses flexible (2+ months), standard (4–8 weeks) and urgent (under 4 weeks) planning bands; these are not delivery commitments.";
    }
    if (/process|how do you work|steps|start a project/.test(normalized)) {
      return "We start by understanding your goals and requirements, agree the scope and approach, then design/build, test and prepare the solution for launch. Use the contact form to discuss your project.";
    }
    if (/maintenance|support|after launch/.test(normalized)) {
      return "Maintenance and ongoing support can be discussed and included in a project agreement or arranged separately, based on the solution.";
    }
    if (/payment|ownership|source code|rights/.test(normalized)) {
      return "Those terms depend on the project agreement. Share your requirements through the contact form so the team can confirm them for your project.";
    }
    if (/price|budget|cost|estimate|quote/.test(normalized)) {
      return "I can prepare an indicative INR range from the selected services, project scope, integrations and timeline. It is for early planning only, not a quote.";
    }
    if (/startup|small business|business/.test(normalized)) {
      return "Yes. FounderStack works with startups, entrepreneurs, small businesses and established organizations; solutions are scoped to your goals and requirements.";
    }
    return null;
  };

  const handleChoice = (choice) => {
    addMessage("user", choice.label);
    if (choice.value === "explore") {
      askForService("service");
      return;
    }
    if (choice.value === "estimate") {
      setLastEstimate(null);
      askForService("estimate-service");
      return;
    }
    if (choice.value === "faq") {
      addMessage("assistant", "Choose a common question, or type your question below.", [
        { label: "How long does a project take?", value: "faq:timeline" },
        { label: "Do you provide support?", value: "faq:maintenance" },
        { label: "How do we get started?", value: "faq:process" },
        { label: "How much does it cost?", value: "faq:price" },
      ]);
      return;
    }
    if (choice.value.startsWith("faq:")) {
      addMessage("assistant", answerCommonQuestion(choice.value.slice(4)) ?? "Tell me a little more and I’ll try to help.");
      return;
    }
    if (choice.value === "add-service") {
      askForService("add-service", lastEstimate?.services ?? []);
      return;
    }
    if (choice.value === "finish-estimate") {
      if (flow.selectedServices.length > 0) {
        calculateEstimate(flow);
      } else if (lastEstimate) {
        addMessage(
          "assistant",
          `Current estimate: ${lastEstimate.min}–${lastEstimate.max} INR for ${lastEstimate.services.map(serviceLabel).join(" + ")}. This remains an indicative planning range, not a quotation.`,
          [
            { label: "Add another service", value: "add-service" },
            { label: "Prepare a project enquiry", value: "contact" },
          ],
        );
      }
      return;
    }
    if (choice.value === "contact") {
      addMessage("assistant", "I can add this estimate to the project enquiry form for you.", [
        { label: "Prepare enquiry", value: "contact-link" },
        { label: "Keep chatting", value: "explore" },
      ]);
      return;
    }
    if (choice.value === "contact-link") {
      goToContact();
      return;
    }
    if (choice.value.startsWith("service:")) {
      const service = services.find((item) => item.number === choice.value.slice(8));
      if (!service) return;
      if (flow.step === "estimate-service") {
        askForScope([service]);
      } else if (flow.step === "add-service" && lastEstimate) {
        const estimate = {
          scope: lastEstimate.scope.value,
          integrations: lastEstimate.integrations.value,
          timeline: lastEstimate.timeline.value,
          selectedServices: [...lastEstimate.services, service],
        };
        calculateEstimate(estimate);
      } else {
        showServiceAnswer(service);
      }
      return;
    }
    if (choice.value.startsWith("estimate:")) {
      const service = services.find((item) => item.number === choice.value.slice(9));
      if (service) {
        setLastEstimate(null);
        askForScope([service]);
      }
      return;
    }
    if (choice.value.startsWith("scope:") && flow.step === "scope") {
      askForIntegrations({ ...flow, scope: choice.value.slice(6) });
      return;
    }
    if (choice.value.startsWith("integrations:") && flow.step === "integrations") {
      askForTimeline({ ...flow, integrations: choice.value.slice(13) });
      return;
    }
    if (choice.value.startsWith("timeline:") && flow.step === "timeline") {
      const estimate = { ...flow, timeline: choice.value.slice(9) };
      setFlow(estimate);
      addMessage("assistant", "Would you like to include another service in this estimate, or calculate it now?", [
        { label: "Add another service", value: "add-service" },
        { label: "Calculate estimate", value: "finish-estimate" },
      ]);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const text = input.trim();
    if (!text) return;
    setInput("");
    addMessage("user", text);

    if (flow.step === "scope") {
      const scope = getOption(projectScopes, text, {
        starter: ["small", "basic", "simple"],
        standard: ["medium", "moderate"],
        advanced: ["large", "complex", "custom"],
      });
      if (scope) askForIntegrations({ ...flow, scope: scope.value });
      else addMessage("assistant", "Choose starter, standard or advanced to describe the project scope.", makeChoices(projectScopes, "scope"));
      return;
    }
    if (flow.step === "integrations") {
      const integrations = getOption(integrationLevels, text, {
        none: ["no integration", "none"],
        some: ["one", "two", "few"],
        many: ["several", "multiple", "lots"],
      });
      if (integrations) askForTimeline({ ...flow, integrations: integrations.value });
      else addMessage("assistant", "Choose no integrations, 1–2, or 3+ integrations.", makeChoices(integrationLevels, "integrations"));
      return;
    }
    if (flow.step === "timeline") {
      const timeline = getOption(timelines, text, {
        flexible: ["not urgent", "flexible"],
        standard: ["normal", "regular"],
        urgent: ["asap", "rush", "urgent", "quick"],
      });
      if (timeline) {
        const estimate = { ...flow, timeline: timeline.value };
        setFlow(estimate);
        addMessage("assistant", "Would you like to include another service in this estimate, or calculate it now?", [
          { label: "Add another service", value: "add-service" },
          { label: "Calculate estimate", value: "finish-estimate" },
        ]);
      } else addMessage("assistant", "Choose flexible, standard, or urgent so I can finish the estimate.", makeChoices(timelines, "timeline"));
      return;
    }

    const normalized = text.toLowerCase();
    const service = findService(text);
    if (flow.step === "estimate-service" || flow.step === "add-service") {
      if (service && !flow.selectedServices.some((item) => item.number === service.number)) {
        if (flow.step === "estimate-service") askForScope([service]);
        else if (lastEstimate) {
          calculateEstimate({
            scope: lastEstimate.scope.value,
            integrations: lastEstimate.integrations.value,
            timeline: lastEstimate.timeline.value,
            selectedServices: [...lastEstimate.services, service],
          });
        }
        return;
      }
      addMessage("assistant", "Choose a service by name or tap one of the service options.", [
        ...serviceChoices(flow.step === "add-service" ? (lastEstimate?.services ?? []) : []),
        ...(flow.step === "add-service" ? [{ label: "Finish estimate", value: "finish-estimate" }] : []),
      ]);
      return;
    }
    if (/all services|what services|services do you offer|your services/.test(normalized)) {
      addMessage("assistant", `We offer ${services.map(serviceLabel).join(", ")}. Choose one to learn more or get an estimate.`, serviceChoices());
      return;
    }
    if (/budget|estimate|cost|price|pricing|quote/.test(normalized)) {
      setLastEstimate(null);
      if (service) askForScope([service]);
      else askForService("estimate-service");
      return;
    }
    if (service) {
      showServiceAnswer(service);
      return;
    }
    const answer = answerCommonQuestion(text);
    if (answer) {
      addMessage("assistant", answer, [
        { label: "Explore services", value: "explore" },
        { label: "Build a project estimate", value: "estimate" },
      ]);
      return;
    }
    addMessage("assistant", "I can help with service details, project process, support, timelines and indicative INR estimates. Try a service name or choose an option below.", [
      { label: "Explore services", value: "explore" },
      { label: "Build a project estimate", value: "estimate" },
      { label: "Common questions", value: "faq" },
    ]);
  };

  const resetChat = () => {
    messageId.current = 1;
    setMessages([makeWelcomeMessage(userName)]);
    setFlow({ step: "idle", selectedServices: [] });
    setLastEstimate(null);
  };

  return (
    <div className={`service-chat${isOpen ? " is-open" : ""}`}>
      {isOpen && (
        <section className="service-chat-panel" aria-label="FounderStack service assistant">
          <header className="service-chat-header">
            <span className="service-chat-avatar" aria-hidden="true">F</span>
            <div><strong>FounderStack Assistant</strong><small>Services &amp; project planner</small></div>
            <button type="button" className="service-chat-reset" aria-label="Start a new chat" onClick={resetChat}>Reset</button>
            <button type="button" className="service-chat-close" aria-label="Close chat" onClick={() => setIsOpen(false)}>×</button>
          </header>
          <div className="service-chat-messages" aria-live="polite">
            {messages.map((message) => (
              <div className={`service-chat-message service-chat-${message.role}`} key={message.id}>
                <p>{message.text}</p>
                {message.choices.length > 0 && (
                  <div className="service-chat-choices">
                    {message.choices.map((choice) => (
                      <button type="button" key={choice.value} onClick={() => handleChoice(choice)}>
                        {choice.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={messageEndRef} />
          </div>
          <form className="service-chat-input" onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              aria-label="Ask about services or budget"
              placeholder="Ask a question or describe your project..."
              value={input}
              maxLength={300}
              onChange={(event) => setInput(event.target.value)}
            />
            <button type="submit" aria-label="Send message" disabled={!input.trim()}>→</button>
          </form>
          <p className="service-chat-disclaimer">Guided answers · Sample INR planning ranges · Not a quote</p>
        </section>
      )}
      <button
        type="button"
        className="service-chat-launcher"
        aria-label={isOpen ? "Close service assistant" : "Open service assistant"}
        aria-expanded={isOpen}
        onClick={() => {
          setIsOpen((open) => !open);
          if (!isOpen) window.setTimeout(() => inputRef.current?.focus(), 0);
        }}
      >
        <span className="material-symbols-outlined" aria-hidden="true">{isOpen ? "close" : "chat"}</span>
        {!isOpen && <span>Ask about services</span>}
      </button>
    </div>
  );
}

export default ServiceChatbot;
