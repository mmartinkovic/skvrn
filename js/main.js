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

// Audio vizualizér
function initVisualizer(audioElement) {
    const canvas = document.getElementById('audio-visualizer');
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 128; // Menšia hodnota pre hladšie prechody

    const source = audioContext.createMediaElementSource(audioElement);
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function draw() {
        requestAnimationFrame(draw);
        analyser.getByteFrequencyData(dataArray);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Gradient pozadie
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, 'rgba(111, 66, 193, 0.1)');
        gradient.addColorStop(1, 'rgba(188, 19, 254, 0.05)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / bufferLength) * 1.5;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            const barHeight = (dataArray[i] / 255) * canvas.height * 1.5;
            
            // Gradient pre každý stĺpec
            const barGradient = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
            barGradient.addColorStop(0, 'rgba(188, 19, 254, 0.4)');
            barGradient.addColorStop(1, 'rgba(111, 66, 193, 0.4)');
            
            ctx.fillStyle = barGradient;
            
            // Zaoblené stĺpce
            const roundedHeight = Math.max(5, barHeight); // Minimálna výška
            ctx.beginPath();
            ctx.roundRect(x, canvas.height - roundedHeight, barWidth, roundedHeight, [5, 5, 0, 0]);
            ctx.fill();
            
            // Priesvitný odraz
            if (barHeight > 20) {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
                ctx.beginPath();
                ctx.roundRect(x, canvas.height - roundedHeight, barWidth, roundedHeight * 0.2, [5, 5, 0, 0]);
                ctx.fill();
            }
            
            x += barWidth + 1;
        }

        // Horný gradient overlay
        const topGradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.3);
        topGradient.addColorStop(0, 'rgba(29, 9, 53, 0.6)');
        topGradient.addColorStop(1, 'transparent');
        ctx.fillStyle = topGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height * 0.3);
    }

    draw();
}

// Upravený audio prehrávač
// Upravený audio prehrávač
const audioPlayer = {
    init() {
        this.audio = new Audio();
        this.isPlaying = false;
        this.currentTrack = null;
        this.tracks = [
            { id: 1, title: "Test - Gitara", file: "gitara-preview.wav" }
        ];
        
        this.setupElements();
        this.setupEventListeners();
        this.setupVolumeControls();
        
        // Spustenie vizualizéra a typing efektu po načítaní stránky
        window.addEventListener('load', () => {
            typeWriter(); // Spustenie typing efektu
            initVisualizer(this.audio); // Inicializácia vizualizéra
            
            // Načíta prvú skladbu, ale nezačne prehrávať
            if (this.tracks.length > 0) {
                this.playTrack(this.tracks[0].id, false);
            }
        });
    },
    
    playTrack(trackId, shouldPlay = true) {
        const track = this.tracks.find(t => t.id === trackId);
        if (!track) return;
        
        this.currentTrack = track;
        this.audio.src = `assets/audio/${track.file}`;
        this.nowPlaying.textContent = track.title;
        
        // Reset progress
        this.progressBar.style.width = '0%';
        
        if (shouldPlay) {
            this.audio.play().then(() => {
                this.isPlaying = true;
                this.playBtn.innerHTML = '<i class="bi bi-pause-fill"></i>';
            }).catch(error => {
                console.log("Playback error:", error);
            });
        }
        
        // Aktualizácia tlačidiel na stránke
        document.querySelectorAll('.play-btn').forEach(btn => {
            btn.innerHTML = '<i class="bi bi-play-fill me-2"></i>Počúvať teraz';
            if (parseInt(btn.getAttribute('data-track')) === trackId) {
                btn.innerHTML = this.isPlaying 
                    ? '<i class="bi bi-pause-fill me-2"></i>Pauza' 
                    : '<i class="bi bi-play-fill me-2"></i>Počúvať teraz';
            }
        });
    },
    
    togglePlay() {
        if (this.isPlaying) {
            this.audio.pause();
            this.playBtn.innerHTML = '<i class="bi bi-play-fill"></i>';
        } else {
            if (this.currentTrack) {
                this.audio.play().then(() => {
                    this.isPlaying = true;
                    this.playBtn.innerHTML = '<i class="bi bi-pause-fill"></i>';
                }).catch(error => {
                    console.log("Playback error:", error);
                });
            } else if (this.tracks.length > 0) {
                this.playTrack(this.tracks[0].id);
            }
        }
        this.isPlaying = !this.isPlaying;
    },

    setupVolumeControls() {
        this.volumeBtn = document.getElementById('volume-btn');
        this.volumeSlider = document.getElementById('volume-slider');
        
        // Nastavenie hlasitosti
        this.audio.volume = 0.3; // Predvolená hodnota
        this.volumeSlider.value = 0.3;
        
        // Ovládanie hlasitosti
        this.volumeSlider.addEventListener('input', () => {
            this.audio.volume = this.volumeSlider.value;
            this.updateVolumeIcon();
        });
        
        // Tlačidlo mute/unmute
        this.volumeBtn.addEventListener('click', () => {
            if (this.audio.volume > 0) {
                this.lastVolume = this.audio.volume;
                this.audio.volume = 0;
                this.volumeSlider.value = 0;
            } else {
                this.audio.volume = this.lastVolume || 0.3;
                this.volumeSlider.value = this.audio.volume;
            }
            this.updateVolumeIcon();
        });
    },
    
    updateVolumeIcon() {
        const volume = this.audio.volume;
        let iconClass;
        
        if (volume === 0) {
            iconClass = 'bi bi-volume-mute';
        } else if (volume < 0.5) {
            iconClass = 'bi bi-volume-down';
        } else {
            iconClass = 'bi bi-volume-up';
        }
        
        this.volumeBtn.innerHTML = `<i class="${iconClass}"></i>`;
    },
    
    playFirstTrackOnLoad() {
        // Počkáme na načítanie celej stránky
        window.addEventListener('load', () => {
            // Malé oneskorenie pre lepší UX (0.5s)
            setTimeout(() => {
                if (this.tracks.length > 0) {
                    this.playTrack(this.tracks[0].id);
                    this.audio.play();
                    this.isPlaying = true;
                    this.playBtn.innerHTML = '<i class="bi bi-pause-fill"></i>';
                }
            }, 500);
        });
    },
    
    setupElements() {
        this.playBtn = document.getElementById('nav-play-btn');
        this.progressBar = document.getElementById('progress-bar');
        this.nowPlaying = document.getElementById('now-playing');
    },
    
    setupEventListeners() {
        // Play/Pause button
        this.playBtn.addEventListener('click', () => this.togglePlay());
        
        // Track progress
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        
        // Play buttons na stránke
        document.querySelectorAll('.play-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const trackId = parseInt(e.currentTarget.getAttribute('data-track'));
                this.playTrack(trackId);
            });
        });
    },
    
    togglePlay() {
        if (this.isPlaying) {
            this.audio.pause();
            this.playBtn.innerHTML = '<i class="bi bi-play-fill"></i>';
        } else {
            if (this.currentTrack) {
                this.audio.play();
                this.playBtn.innerHTML = '<i class="bi bi-pause-fill"></i>';
            }
        }
        this.isPlaying = !this.isPlaying;
    },
    
    playTrack(trackId) {
        const track = this.tracks.find(t => t.id === trackId);
        if (!track) return;
        
        this.currentTrack = track;
        this.audio.src = `assets/audio/${track.file}`;
        this.nowPlaying.textContent = track.title;
        
        // Reset progress
        this.progressBar.style.width = '0%';
        
        // Ak už hráme, len zmeň skladbu
        if (this.isPlaying) {
            this.audio.play();
        }
        
        // Aktualizácia tlačidiel na stránke
        document.querySelectorAll('.play-btn').forEach(btn => {
            btn.innerHTML = '<i class="bi bi-play-fill me-2"></i>Počúvať teraz';
            if (parseInt(btn.getAttribute('data-track')) === trackId) {
                btn.innerHTML = '<i class="bi bi-pause-fill me-2"></i>Pauza';
            }
        });
    },
    
    updateProgress() {
        if (this.audio.duration) {
            const progress = (this.audio.currentTime / this.audio.duration) * 100;
            this.progressBar.style.width = `${progress}%`;
        }
    }
};

// Spustenie audio prehrávača
audioPlayer.init();

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