document.documentElement.classList.add("js-ready");

const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".site-nav");

menuButton.addEventListener("click", () => {
  const isExpanded = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isExpanded));
  menuButton.setAttribute("aria-label", isExpanded ? "Open navigation" : "Close navigation");
  navigation.classList.toggle("is-open", !isExpanded);
});

navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
    navigation.classList.remove("is-open");
  }
});

document.querySelector("#year").textContent = new Date().getFullYear();

const sectionLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
const observedSections = sectionLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const sectionObserver = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    for (const link of sectionLinks) {
      const active = link.hash === `#${entry.target.id}`;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    }
  }
}, { rootMargin: "-35% 0px -55% 0px" });

observedSections.forEach((section) => sectionObserver.observe(section));

const skillDialog = document.querySelector("#skill-dialog");
const skillDialogCategory = document.querySelector("#skill-dialog-category");
const skillDialogTitle = document.querySelector("#skill-dialog-title");
const skillDialogSummary = document.querySelector("#skill-dialog-summary");
const skillDialogTags = document.querySelector("#skill-dialog-tags");
const skillDialogPractice = document.querySelector("#skill-dialog-practice");
const skillDialogPracticeSection = skillDialogPractice.closest(".skill-dialog-practice");

const skillDetails = {
  testing: {
    category: "TEST ENGINEERING",
    title: "Testing & validation",
    summary: "Structured verification for software that must behave predictably in real operating conditions.",
    tags: ["Functional", "Integration", "HIL", "Manual", "Automation", "Regression", "Smoke"],
    practice: "Create and review test cases and procedures, execute against requirements, manage defects, and keep test evidence traceable through reports."
  },
  railway: {
    category: "RAILWAY SYSTEMS",
    title: "Railway systems",
    summary: "Functional and hardware-software integration testing across railway programs and train functions.",
    tags: ["APM", "Vande Bharat", "AVENTRA", "MVS", "CLM", "JRU", "PAI", "NI TestStand", "Control Build", "GeneTS"],
    practice: "Set up and convert test racks, flash software, validate train functions, debug issues, and prepare FITS/FITR deliverables."
  },
  automotive: {
    category: "AUTOMOTIVE VALIDATION",
    title: "Automotive HIL",
    summary: "Hardware-in-the-loop validation for electric powertrain, motor, inverter, and high-voltage ECU systems.",
    tags: ["dSPACE", "NI VeriStand", "NI LabVIEW", "Vector CANoe", "EV motor", "Inverter", "Fault handling"],
    practice: "Build functional scenarios for power modes, torque application, system functions, and fault response, then manage findings through regression."
  },
  automation: {
    category: "TEST AUTOMATION",
    title: "Automation & scripting",
    summary: "Test automation and scripting to make system checks repeatable and easier to execute.",
    tags: ["C#", "Python", "CAPL", "Visual Studio", "NI TestStand", "Jenkins"],
    practice: "Develop C# test scripts, use CAPL for communication-focused testing, and support automated regression workflows."
  },
  networks: {
    category: "EMBEDDED SYSTEMS",
    title: "Embedded & networks",
    summary: "Validation across software, electronics, and the communication paths connecting embedded systems.",
    tags: ["CAN", "LIN", "MOST", "Ethernet", "Embedded C", "Hardware-software integration"],
    practice: "Exercise communication and system behavior on HIL benches, test racks, and academic embedded projects."
  },
  quality: {
    category: "REQUIREMENTS & QUALITY",
    title: "Requirements & quality",
    summary: "Maintain a clear line from requirement intent through test design, results, and reviewable evidence.",
    tags: ["IBM DOORS/RM", "JIRA", "Confluence", "Polarion", "RTM", "ASPICE", "ISO 26262"],
    practice: "Track defects and execution results, support requirements traceability, and prepare evidence for stakeholder reviews and audits."
  }
};

function showDetails(details) {
  skillDialogCategory.textContent = details.category;
  skillDialogTitle.textContent = details.title;
  skillDialogSummary.textContent = details.summary;
  skillDialogPractice.textContent = details.practice || "";
  skillDialogPracticeSection.hidden = !details.practice;
  skillDialogTags.replaceChildren(...details.tags.map((label) => {
    const tag = document.createElement("span");
    tag.textContent = label;
    return tag;
  }));
  skillDialogTags.hidden = details.tags.length === 0;
  skillDialog.showModal();
}

document.querySelectorAll(".skill-card").forEach((button) => {
  button.addEventListener("click", () => showDetails(skillDetails[button.dataset.skill]));
});

function addDetailsButton(container, details, parent = container) {
  const button = document.createElement("button");
  button.className = "entry-detail-button";
  button.type = "button";
  button.textContent = "Details";
  button.setAttribute("aria-label", `View details for ${details.title}`);
  button.setAttribute("aria-haspopup", "dialog");
  button.setAttribute("aria-controls", "skill-dialog");
  button.addEventListener("click", () => showDetails(details));
  parent.append(button);
}

document.querySelectorAll(".project-card").forEach((card) => {
  const title = card.querySelector("h3")?.textContent.trim();
  if (!title) return;
  const category = card.querySelector(".project-type")?.textContent.trim() || "PROJECT";
  const summary = [...card.querySelectorAll(":scope > p")]
    .find((paragraph) => !paragraph.classList.contains("project-type"))?.textContent.trim() || "";
  const tags = [...card.querySelectorAll(".tag-row span")].map((tag) => tag.textContent.trim());
  addDetailsButton(card, { category, title, summary, tags, practice: "" });
});

document.querySelectorAll(".experience-item").forEach((item) => {
  const title = item.querySelector("h3")?.textContent.trim();
  const details = item.querySelector(".experience-detail");
  if (!title || !details) return;
  const description = details.querySelector("p:not(.company):not(.client-line)")?.textContent.trim() || "";
  const client = details.querySelector(".client-line")?.textContent.trim() || "";
  const programs = details.querySelector(".programs")?.textContent.replace(/^PROGRAMS\s*/, "").trim() || "";
  const date = item.querySelector(".experience-date")?.textContent.trim() || "";
  addDetailsButton(item, {
    category: item.querySelector(".company")?.textContent.trim() || "PROFESSIONAL EXPERIENCE",
    title,
    summary: [client, description].filter(Boolean).join(" "),
    tags: [...item.querySelectorAll(".tag-row span")].map((tag) => tag.textContent.trim()),
    practice: [date, programs].filter(Boolean).join(" · ")
  }, details);
});

document.querySelectorAll(".education-item").forEach((item) => {
  const title = item.querySelector("h3")?.textContent.trim();
  if (!title) return;
  addDetailsButton(item, {
    category: "EDUCATION",
    title,
    summary: item.querySelector("p")?.textContent.trim() || "",
    tags: [],
    practice: item.querySelector(":scope > .mono")?.textContent.trim() || ""
  });
});

skillDialog.addEventListener("click", (event) => {
  const bounds = skillDialog.getBoundingClientRect();
  const clickedInside = event.clientX >= bounds.left && event.clientX <= bounds.right && event.clientY >= bounds.top && event.clientY <= bounds.bottom;
  if (!clickedInside) skillDialog.close();
});

skillDialog.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    event.preventDefault();
    skillDialog.close();
  }
});

const revealElements = document.querySelectorAll(".section-heading, .about-content, .experience-item, .project-card, .skill-card, .education-item, .certifications");
revealElements.forEach((element) => element.classList.add("reveal"));
document.documentElement.classList.add("reveal-ready");

const revealObserver = new IntersectionObserver((entries, observer) => {
  for (const entry of entries) {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  }
}, { threshold: 0.12 });

revealElements.forEach((element) => revealObserver.observe(element));