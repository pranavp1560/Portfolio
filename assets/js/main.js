// Premium HUD Command Center Portfolio Interaction Controller

document.addEventListener("DOMContentLoaded", () => {
  initTypeWriter();
  initTiltCards();
  initHUDConsoleTerminal();
  initScrollSpy();
  initMobileMenuToggle();
});

// 1. MOBILE MENU TOGGLING
function initMobileMenuToggle() {
  const hamburger = document.getElementById("hud-hamburger");
  const sidebar = document.getElementById("hud-sidebar");
  
  if (hamburger && sidebar) {
    hamburger.addEventListener("click", (e) => {
      e.stopPropagation();
      sidebar.classList.toggle("show");
      hamburger.textContent = sidebar.classList.contains("show") ? "✕" : "☰";
    });

    // Close menu when clicking nav links
    const links = sidebar.querySelectorAll(".hud-nav-links a");
    links.forEach(link => {
      link.addEventListener("click", () => {
        sidebar.classList.remove("show");
        hamburger.textContent = "☰";
      });
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!sidebar.contains(e.target) && e.target !== hamburger) {
        sidebar.classList.remove("show");
        hamburger.textContent = "☰";
      }
    });
  }
}

// 2. HERO TYPING INSCRIPTION
function initTypeWriter() {
  const target = document.querySelector(".hero h2");
  if (!target) return;

  const titles = [
    "Data Scientist...",
    "Machine Learning Engineer...",
    "Full-Stack Web Architect..."
  ];
  
  let titleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let textBuffer = "";

  // Structure output
  target.innerHTML = `I am <span class="typed-text" style="color: var(--accent-cyan);"></span><span class="cursor" style="animation: blink 1s infinite;">|</span>`;
  const textElem = target.querySelector(".typed-text");

  function type() {
    const fullText = titles[titleIdx];
    
    if (isDeleting) {
      textBuffer = fullText.substring(0, charIdx - 1);
      charIdx--;
    } else {
      textBuffer = fullText.substring(0, charIdx + 1);
      charIdx++;
    }

    textElem.textContent = textBuffer;

    let delay = 100;
    if (isDeleting) delay /= 2.5;

    if (!isDeleting && charIdx === fullText.length) {
      delay = 2200; // Pause at end of text
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      titleIdx = (titleIdx + 1) % titles.length;
      delay = 600; // Pause before next line
    }

    setTimeout(type, delay);
  }

  setTimeout(type, 800);
}

// 3. 3D PERSPECTIVE CARD TILT
function initTiltCards() {
  if (typeof VanillaTilt !== "undefined") {
    VanillaTilt.init(document.querySelectorAll(".tilt-card"), {
      max: 10,
      speed: 400,
      glare: true,
      "max-glare": 0.15,
      scale: 1.02,
      perspective: 1000,
      reset: true,
      easing: "cubic-bezier(.03,.98,.52,.99)"
    });
  }
}

// 4. LIVE DIAGNOSTIC ML TERMINAL CONSOLE LOGGER
function initHUDConsoleTerminal() {
  const consoleContainer = document.getElementById("hud-console-lines");
  if (!consoleContainer) return;

  const logs = [
    // Boot Sequence
    ">> BOOTING CORE KERNEL PROTOCOLS...",
    ">> loading environment parameters: Python v3.10",
    ">> importing datasets: csv_phishing_db // loaded",
    ">> parsing database connections: MongoDB: ACTIVE",
    ">> status: system online // CPU: 32C // GPU: CUDA_OK",
    ">> scanning neural weights... 100% loaded",
    ">> training binary classifier (Random Forest)...",
    ">> [EPOCH 01/05] Loss: 0.385 | Acc: 90.1%",
    ">> [EPOCH 02/05] Loss: 0.220 | Acc: 94.6%",
    ">> [EPOCH 03/05] Loss: 0.114 | Acc: 97.2%",
    ">> [EPOCH 04/05] Loss: 0.076 | Acc: 98.4%",
    ">> [EPOCH 05/05] Loss: 0.041 | Acc: 98.7%",
    ">> Model compilation: COMPLETED // accuracy: 98.7%",
    ">> Flask Endpoint active at rendering node port: 5000",
    ">> routing web connections for Roomify Mess App... OK",
    ">> system diagnostic readout: HEALTHY // await inputs",
    
    // Looping scans
    "[CHECK] MongoDB listener connection OK",
    "[SCAN] Incoming request from Render App...",
    "[PREDICT] Class: SAFE // confidence: 99.42%",
    "[CHECK] GitHub pipeline webhook connected",
    "[MONITOR] Memory usage stable at 14.2 GB",
    "[SCAN] URL scanning module... 0 threats detected",
    "[PREDICT] Sentiment score parsed: 9.8/10",
    "[LOG] Tokenizer weights synchronized",
    "[STATUS] Port 80 listener open for user interactions"
  ];

  let currentLogIdx = 0;
  const maxLinesInView = 7;

  function appendLog() {
    if (currentLogIdx < logs.length) {
      const lineDiv = document.createElement("div");
      lineDiv.className = "hud-console-line";
      lineDiv.textContent = logs[currentLogIdx];
      consoleContainer.appendChild(lineDiv);
      currentLogIdx++;
    } else {
      // Loop the continuous scanning logs (the last 9 logs)
      const loopStartIdx = 16;
      const loopEndIdx = logs.length - 1;
      const targetIdx = loopStartIdx + Math.floor(Math.random() * (loopEndIdx - loopStartIdx + 1));
      
      const lineDiv = document.createElement("div");
      lineDiv.className = "hud-console-line";
      lineDiv.textContent = logs[targetIdx];
      consoleContainer.appendChild(lineDiv);
    }

    // Keep console scrolled to bottom or purge oldest lines to prevent overflow
    const lines = consoleContainer.querySelectorAll(".hud-console-line");
    if (lines.length > maxLinesInView) {
      lines[0].remove();
    }

    // Dynamic delay for typing effect feel
    const randomDelay = 800 + Math.random() * 1500;
    setTimeout(appendLog, randomDelay);
  }

  // Print first few lines immediately
  for (let i = 0; i < 4; i++) {
    const lineDiv = document.createElement("div");
    lineDiv.className = "hud-console-line";
    lineDiv.textContent = logs[i];
    consoleContainer.appendChild(lineDiv);
    currentLogIdx++;
  }

  setTimeout(appendLog, 1500);
}

// 5. SCROLL SPY ACTIVE STATE
function initScrollSpy() {
  const sections = document.querySelectorAll("section[id]");
  const sidebarLinks = document.querySelectorAll(".hud-nav-links a");
  
  if (sections.length === 0 || sidebarLinks.length === 0) return;

  window.addEventListener("scroll", () => {
    let scrollY = window.pageYOffset;
    
    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 200; // offset for triggers
      const sectionId = section.getAttribute("id");
      const navAnchor = document.querySelector(`.hud-nav-links a[href*="${sectionId}"]`);
      
      if (navAnchor) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          sidebarLinks.forEach(a => a.classList.remove("active"));
          navAnchor.classList.add("active");
        }
      }
    });
  });
}
