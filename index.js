/* ============================
   Hero Background Slider
============================= */
const hero = document.getElementById("hero");
if (hero) {
  const heroImages = [
    "./images/banner-1.webp",
    "./images/banner-2.webp",
    "./images/banner-3.webp",
  ];
  let heroIndex = 0;

  function changeHeroBackground() {
    hero.style.backgroundImage = `url(${heroImages[heroIndex]})`;
    heroIndex = (heroIndex + 1) % heroImages.length;
  }

  changeHeroBackground();
  setInterval(changeHeroBackground, 5000);
}

/* ============================
   Testimonials Slider
============================= */
function initTestimonialSlider() {
  const container = document.querySelector(".testimonial-cards");
  if (!container) return;
  
  const cards = Array.from(document.querySelectorAll(".testimonial-card"));
  const bubblesContainer = document.querySelector(".testimonial-bubbles");
  if (!bubblesContainer) return;

  const visibleCards = window.innerWidth < 768 ? 1 : 2;
  let current = 0;
  let interval;
  const totalSlides = Math.ceil(cards.length / visibleCards);

  // Create bubbles
  bubblesContainer.innerHTML = '';
  for (let i = 0; i < totalSlides; i++) {
    const bubble = document.createElement("button");
    bubble.className = "testimonial-bubble";
    bubble.setAttribute("aria-label", `Go to testimonial set ${i + 1}`);
    bubble.addEventListener("click", () => {
      goToSlide(i);
      resetInterval();
    });
    bubblesContainer.appendChild(bubble);
  }

  const bubbles = document.querySelectorAll(".testimonial-bubble");

  function updateSlider() {
    container.style.transform = `translateX(-${current * 100}%)`;
    bubbles.forEach((b, i) => {
      b.classList.toggle("active", i === current % totalSlides);
    });
  }

  function goToSlide(i) {
    current = i;
    updateSlider();
  }

  function nextSlide() {
    current = (current + 1) % totalSlides;
    updateSlider();
  }

  function resetInterval() {
    clearInterval(interval);
    interval = setInterval(nextSlide, 4000);
  }

  goToSlide(0);
  resetInterval();
}

/* ============================
   Mobile Menu Handler
============================= */
class MobileMenuHandler {
  constructor() {
    this.menuBtn = document.getElementById("menuBtn");
    this.mobileMenu = document.getElementById("mobileMenu");
    this.closeBtn = document.getElementById("closeBtn");
    this.menuLinks = this.mobileMenu?.querySelectorAll("nav a");
    this.isOpen = false;

    this.init();
  }

  init() {
    if (!this.menuBtn || !this.mobileMenu || !this.closeBtn) return;

    this.menuBtn.addEventListener("click", (e) => {
      e.preventDefault();
      this.openMenu();
    });

    this.closeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      this.closeMenu();
    });

    // Close menu when clicking outside
    this.mobileMenu.addEventListener("click", (e) => {
      if (e.target === this.mobileMenu) this.closeMenu();
    });

    // Close menu when clicking on links
    if (this.menuLinks) {
      this.menuLinks.forEach((link) => {
        link.addEventListener("click", () => this.closeMenu());
      });
    }

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isOpen) this.closeMenu();
    });

    // Handle window resize
    window.addEventListener("resize", () => {
      if (window.innerWidth > 768 && this.isOpen) this.closeMenu();
    });
  }

  openMenu() {
    this.isOpen = true;
    document.body.classList.add("scroll-locked");
    this.mobileMenu.classList.add("active");
    setTimeout(() => this.closeBtn.focus(), 100);
  }

  closeMenu() {
    this.isOpen = false;
    document.body.classList.remove("scroll-locked");
    this.mobileMenu.classList.remove("active");
    this.menuBtn.focus();
  }
}

/* ============================
   Smooth Scrolling for anchors
============================= */
class SmoothScroller {
  constructor() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        const targetId = anchor.getAttribute("href");
        if (targetId === "#" || targetId.startsWith("#!")) return;
        
        // Check if it's an internal page link
        if (targetId.startsWith("./") || targetId.startsWith("/") || 
            targetId.startsWith("../") || targetId.includes(".html")) {
          return; // Let the browser handle normal navigation
        }
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });
  }
}

/* ============================
   Active Link Highlighter
============================= */
class ActiveLinkHighlighter {
  constructor() {
    this.currentPage = window.location.pathname.split("/").pop() || "index.html";
    this.init();
  }

  init() {
    // Highlight nav links
    const navLinks = document.querySelectorAll(".nav-links a, .mobile-menu nav a");
    
    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (!href) return;
      
      const linkPage = href.split("/").pop();
      
      // Skip highlighting for contact page
      if (linkPage === "contact.html") return;
      
      // Special handling for index.html which might be just "/"
      if ((this.currentPage === "index.html" || this.currentPage === "") && 
          (linkPage === "index.html" || href === "/" || href === "./" || href === "")) {
        link.classList.add("active");
      } 
      // Match other pages
      else if (linkPage === this.currentPage) {
        link.classList.add("active");
      }
      
      // Special case for blog link which points to gallery.html
      if (this.currentPage === "gallery.html" && link.textContent.trim().toLowerCase() === "blog") {
        link.classList.add("active");
      }
    });
  }
}

/* ============================
   Intersection Observer for gallery animations
============================= */
class AnimationObserver {
  constructor() {
    this.options = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };
    this.init();
  }

  init() {
    if (!("IntersectionObserver" in window)) return;

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    }, this.options);

    document.querySelectorAll(".gallery-item").forEach((item) => {
      item.style.opacity = "0";
      item.style.transform = "translateY(30px)";
      item.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      this.observer.observe(item);
    });
  }
}

/* ============================
   Lazy load fallback for images
============================= */
class ImageLoader {
  constructor() {
    document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
      img.addEventListener("error", (e) => {
        e.target.src =
          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI4MCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5Ij5JbWFnZSBub3QgZm91bmQ8L3RleHQ+PC9zdmc+";
      });
    });
  }
}

/* ============================
   Dropdown Handler - FIXED VERSION
============================= */
class DropdownHandler {
  constructor() {
    this.dropdowns = document.querySelectorAll(".dropdown");
    this.mobileDropdowns = document.querySelectorAll(".mobile-dropdown");
    this.initDesktopDropdowns();
    this.initMobileDropdowns();
    this.initClickOutside();
  }

  initDesktopDropdowns() {
    this.dropdowns.forEach((dropdown) => {
      const toggle = dropdown.querySelector(".dropdown-toggle");
      if (!toggle) return;
      
      toggle.addEventListener("click", (e) => {
        e.stopPropagation();
        this.dropdowns.forEach((other) => {
          if (other !== dropdown) other.classList.remove("active");
        });
        dropdown.classList.toggle("active");
      });
    });
  }

  initMobileDropdowns() {
    this.mobileDropdowns.forEach((dropdown) => {
      const toggle = dropdown.querySelector(".mobile-dropdown-toggle");
      if (!toggle) return;
      
      toggle.addEventListener("click", (e) => {
        e.stopPropagation();
        this.mobileDropdowns.forEach((other) => {
          if (other !== dropdown) other.classList.remove("active");
        });
        dropdown.classList.toggle("active");
      });
    });
  }

  initClickOutside() {
    document.addEventListener("click", (e) => {
      // Close desktop dropdowns when clicking outside
      if (!e.target.closest(".dropdown")) {
        this.dropdowns.forEach((dropdown) => dropdown.classList.remove("active"));
      }
      
      // Close mobile dropdowns when clicking outside
      if (!e.target.closest(".mobile-dropdown")) {
        this.mobileDropdowns.forEach((dropdown) => dropdown.classList.remove("active"));
      }
    });

    // Close mobile dropdowns when a link is clicked
    document.querySelectorAll(".mobile-dropdown-menu a").forEach((link) => {
      link.addEventListener("click", () => {
        this.mobileDropdowns.forEach((dropdown) =>
          dropdown.classList.remove("active")
        );
      });
    });
  }
}

/* ============================
   Map Initialization
============================= */
function initMap() {
  const mapWrapper = document.getElementById("mapWrapper");
  if (!mapWrapper) return;
  
  const location = { lat: 19.217, lng: 73.088 };
  const map = new google.maps.Map(mapWrapper, {
    center: location,
    zoom: 15,
  });
  new google.maps.Marker({
    position: location,
    map: map,
    title: "Shankara Ayurveda",
  });
}

function loadGoogleMapsApi() {
  if (!document.getElementById("mapWrapper")) return;
  
  const script = document.createElement("script");
  script.src =
    "https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap";
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
}

/* ============================
   Contact Form
============================= */
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;
  
  const status = document.getElementById("formStatus");
  
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const data = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      message: form.message.value.trim(),
      time: new Date().toISOString(),
    };
    const allContacts = JSON.parse(localStorage.getItem("contacts") || "[]");
    allContacts.push(data);
    localStorage.setItem("contacts", JSON.stringify(allContacts));
    status.textContent = "Message saved locally!";
    status.style.color = "green";
    form.reset();
  });
}

/* ============================
   Typewriter Animation
============================ */
function initTypewriterAnimation() {
    const animeSection = document.querySelector('.anime');
    if (!animeSection) return;
    
    // Get all h2 elements in the anime section
    const textElements = Array.from(animeSection.querySelectorAll('h2'));
    const card = animeSection.querySelector('.a-card');
    
    // Store original texts
    const originalTexts = textElements.map(el => el.textContent);
    
    // Clear all text initially
    textElements.forEach(el => {
        el.textContent = '';
    });
    
    // Animation state
    let currentText = 0;
    let currentChar = 0;
    let isInView = false;
    let animationId;
    
    // Check if element is in viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.bottom >= 0
        );
    }
    
    // Start animation when section comes into view
    function checkScroll() {
        if (isInView) return;
        
        if (isElementInViewport(animeSection)) {
            isInView = true;
            // Add cursor to first element
            textElements[currentText].classList.add('typewriter');
            animateText();
        }
    }
    
    // The typewriter animation function
    function animateText() {
        if (currentText < textElements.length) {
            if (currentChar < originalTexts[currentText].length) {
                textElements[currentText].textContent += originalTexts[currentText].charAt(currentChar);
                currentChar++;
                animationId = setTimeout(animateText, 40); // Adjust speed here
            } else {
                // Remove cursor from current text
                textElements[currentText].classList.remove('typewriter');
                
                // Move to next text
                currentText++;
                currentChar = 0;
                
                if (currentText < textElements.length) {
                    // Add cursor to next text
                    textElements[currentText].classList.add('typewriter');
                    animationId = setTimeout(animateText, 200); // Delay between texts
                } else {
                    // All text animated, now show the card
                    card.classList.add('fly-in');
                }
            }
        }
    }
    
    // Set up scroll listener
    window.addEventListener('scroll', checkScroll);
    // Initial check
    checkScroll();
    
    // Restart animation if needed (for demo purposes)
    window.restartAnimation = function() {
        // Reset animation state
        currentText = 0;
        currentChar = 0;
        isInView = false;
        
        // Clear any existing timeouts
        clearTimeout(animationId);
        
        // Clear all text and remove cursors
        textElements.forEach(el => {
            el.textContent = '';
            el.classList.remove('typewriter');
        });
        
        // Reset card
        card.classList.remove('fly-in');
        
        // Check if in view to restart
        checkScroll();
    };
}

/* ============================
   FAQ Functionality
============================= */
function initFAQ() {
  const faqQuestions = document.querySelectorAll(".faq-question");

  faqQuestions.forEach((question) => {
    question.addEventListener("click", function () {
      toggleFAQ(this);
    });

    question.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleFAQ(this);
      }
    });
  });

  function toggleFAQ(question) {
    const isActive = question.classList.contains("active");
    const answer = question.nextElementSibling;

    faqQuestions.forEach((otherQuestion) => {
      if (otherQuestion !== question) {
        otherQuestion.classList.remove("active");
        otherQuestion.setAttribute("aria-expanded", "false");
        const otherAnswer = otherQuestion.nextElementSibling;
        otherAnswer.classList.remove("active");
      }
    });

    if (!isActive) {
      question.classList.add("active");
      question.setAttribute("aria-expanded", "true");
      answer.classList.add("active");
    } else {
      question.classList.remove("active");
      question.setAttribute("aria-expanded", "false");
      answer.classList.remove("active");
    }
  }

  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate");
      }
    });
  }, observerOptions);

  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item, index) => {
    item.style.transitionDelay = `${index * 0.1}s`;
    observer.observe(item);
  });

  const footer = document.querySelector(".footer");
  if (footer) {
    observer.observe(footer);
  }

  const footerLinks = document.querySelectorAll(
    ".footer-links a, .footer-cta-button"
  );
  footerLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
    });
  });

  footerLinks.forEach((link) => {
    link.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        this.click();
      }
    });
  });

  const images = document.querySelectorAll("img[data-src]");
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove("lazy");
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach((img) => imageObserver.observe(img));

  const interactiveElements = document.querySelectorAll(
    ".faq-question, .footer-cta-button, .footer-links a"
  );
  interactiveElements.forEach((element) => {
    element.addEventListener(
      "touchstart",
      function () {
        this.style.transform = "scale(0.98)";
      },
      { passive: true }
    );

    element.addEventListener(
      "touchend",
      function () {
        this.style.transform = "";
      },
      { passive: true }
    );
  });
}

/* ============================
   Initialization on DOM ready
============================= */
document.addEventListener("DOMContentLoaded", () => {
  new MobileMenuHandler();
  new SmoothScroller();
  new ActiveLinkHighlighter();
  initTypewriterAnimation();
  new AnimationObserver();
  new ImageLoader();
  new DropdownHandler();
  
  initTestimonialSlider();
  initContactForm();
  initFAQ(); // Initialize FAQ functionality
  loadGoogleMapsApi();

  // Preload critical images after load
  window.addEventListener("load", () => {
    ["url1", "url2"].forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  });
});