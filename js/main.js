// Inicializácia tooltipov
const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
})

// Typing efekt
const typingPhrases = ["SKVRN", "MUSICIAN", "S K V R N", "ELECTRONIC ARTIST"];
let currentPhrase = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeWriter() {
    const typingElement = document.getElementById('typing');
    const currentText = typingPhrases[currentPhrase];
    
    if (isDeleting) {
        typingElement.textContent = currentText.substring(0, charIndex-1);
        charIndex--;
        typingSpeed = 50;
    } else {
        typingElement.textContent = currentText.substring(0, charIndex+1);
        charIndex++;
        typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentText.length) {
        typingSpeed = 1500;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        currentPhrase = (currentPhrase + 1) % typingPhrases.length;
        typingSpeed = 500;
    }

    setTimeout(typeWriter, typingSpeed);
}

// Spustenie typing efektu po načítaní stránky
window.addEventListener('load', () => {
    typeWriter();
});

// Smooth scrolling pre anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
        }
    });
});

$(document).ready(function(){
    // Initialize Instagram Carousel
    $(".instagram-carousel").owlCarousel({
        loop: true,
        margin: 10,
        nav: false,
        dots: false,
        autoplay: true,
        autoplayTimeout: 3000,
        autoplayHoverPause: true,
        responsive: {
            0: {
                items: 2
            },
            600: {
                items: 3
            },
            1000: {
                items: 5
            }
        }
    });
});

class AudioNavbar {
    constructor() {
      this.nav = document.getElementById('mainNav');
      this.canvas = this.nav.querySelector('.navbar-visualizer');
      this.ctx = this.canvas.getContext('2d');
      this.audioBars = Array.from(document.querySelectorAll('.audio-bar'));
      this.links = document.querySelectorAll('.mega-link');
      
      this.init();
    }
    
    init() {
      // Nastavenie canvasu
      this.resizeCanvas();
      window.addEventListener('resize', () => this.resizeCanvas());
      
      // Audio analýza (simulácia)
      this.simulateAudio();
      
      // Interaktívne efekty
      this.setupLinkInteractions();
    }
    
    resizeCanvas() {
      this.canvas.width = this.nav.offsetWidth;
      this.canvas.height = this.nav.offsetHeight;
    }
    
    simulateAudio() {
      // Simulácia audio reakcie
      this.audioBars.forEach((bar, i) => {
        bar.style.setProperty('--i', i);
        bar.style.animationDuration = `${Math.random() * 0.5 + 1}s`;
      });
      
      // Vizualizér
      this.drawVisualizer();
    }
    
    drawVisualizer() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      // Vytvorenie gradientu
      const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, 0);
      gradient.addColorStop(0, '#6f42c1');
      gradient.addColorStop(1, '#bc13fe');
      
      // Kreslenie vĺn
      this.ctx.beginPath();
      for(let x = 0; x < this.canvas.width; x++) {
        const y = Math.sin(x * 0.02 + Date.now() * 0.005) * 10 + this.canvas.height/2;
        if(x === 0) this.ctx.moveTo(x, y);
        else this.ctx.lineTo(x, y);
      }
      
      this.ctx.strokeStyle = gradient;
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
      
      requestAnimationFrame(() => this.drawVisualizer());
    }
    
    setupLinkInteractions() {
      this.links.forEach(link => {
        link.addEventListener('mouseenter', () => {
          const bg = link.querySelector('a').getAttribute('data-bg');
          this.nav.style.background = bg;
          
          // Aktivácia dodatočného obsahu
          if(link.querySelector('.mega-content')) {
            this.showMegaContent(link);
          }
        });
      });
    }
  }
  
  // Inicializácia po načítaní DOM
  document.addEventListener('DOMContentLoaded', () => {
    new AudioNavbar();
  });

  class EnhancedNavbar {
    constructor() {
      this.nav = document.getElementById('mainNav');
      this.audioBars = Array.from(document.querySelectorAll('.audio-bar'));
      
      this.init();
    }
    
    init() {
      // Nastavenie audio barov
      this.setupAudioBars();
      
      // Scroll efekt
      this.setupScrollEffect();
    }
    
    setupAudioBars() {
      this.audioBars.forEach((bar, i) => {
        bar.style.setProperty('--i', i);
        bar.style.animationDuration = `${Math.random() * 0.5 + 1}s`;
      });
    }
    
    setupScrollEffect() {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
          this.nav.classList.add('scrolled');
        } else {
          this.nav.classList.remove('scrolled');
        }
      });
    }
  }
  
  // Inicializácia
  document.addEventListener('DOMContentLoaded', () => {
    new EnhancedNavbar();
  });