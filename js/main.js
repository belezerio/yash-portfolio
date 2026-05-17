// Initialization
gsap.registerPlugin(ScrollTrigger);

// Custom Cursor
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');
const cursor = document.querySelector('.cursor');

window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    // Add slight delay for outline
    cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
    }, { duration: 500, fill: "forwards" });
});

// Magnetic hover effects
const hoverElements = document.querySelectorAll('a, .btn, input, textarea');
hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
        cursor.classList.remove('cursor-hover');
    });
});

// Smooth Scrolling with Lenis
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Integrate Lenis with GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time)=>{
  lenis.raf(time * 1000)
});
gsap.ticker.lagSmoothing(0, 0);

// Loading Animation
const tl = gsap.timeline();

tl.to('.loader-char', {
    y: 0,
    opacity: 1,
    duration: 0.8,
    stagger: 0.1,
    ease: "power4.out"
})
.to('.loader-bar', {
    width: "100%",
    duration: 1.5,
    ease: "power2.inOut"
})
.to('.loader', {
    yPercent: -100,
    duration: 1,
    ease: "power4.inOut",
    delay: 0.2
})
.from('.hero-title .word', {
    y: 100,
    opacity: 0,
    duration: 1,
    stagger: 0.1,
    ease: "power4.out",
}, "-=0.5")
.from('.hero-role', {
    opacity: 0,
    y: 20,
    duration: 0.8
}, "-=0.5")
.to('.hero-cta', {
    opacity: 1,
    y: 0,
    duration: 0.8
}, "-=0.5")
.to('.scroll-indicator', {
    opacity: 1,
    duration: 1
}, "-=0.5");


// Typewriter Effect
const roles = ["Full Stack Developer", "AI Engineer", "Software Engineer"];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typeWriterElement = document.getElementById('typewriter');

function type() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
        typeWriterElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typeWriterElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentRole.length) {
        typeSpeed = 2000; // Pause at end
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typeSpeed = 500; // Pause before new word
    }

    setTimeout(type, typeSpeed);
}
setTimeout(type, 3500); // Start after loader


// Background WebGL Scene (Three.js)
const canvas = document.getElementById('webgl-canvas');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x050505, 0.002);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Particles
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 1500;
const posArray = new Float32Array(particlesCount * 3);
const colorsArray = new Float32Array(particlesCount * 3);

const color1 = new THREE.Color(0x00f0ff);
const color2 = new THREE.Color(0x8a2be2);

for(let i = 0; i < particlesCount * 3; i+=3) {
    // Spread particles over a large volume
    posArray[i] = (Math.random() - 0.5) * 20;
    posArray[i+1] = (Math.random() - 0.5) * 20;
    posArray[i+2] = (Math.random() - 0.5) * 20;
    
    const mixedColor = color1.clone().lerp(color2, Math.random());
    colorsArray[i] = mixedColor.r;
    colorsArray[i+1] = mixedColor.g;
    colorsArray[i+2] = mixedColor.b;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.05,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Floating Geometry
const icosahedronGeo = new THREE.IcosahedronGeometry(1, 0);
const icosahedronMat = new THREE.MeshBasicMaterial({ 
    color: 0x00f0ff, 
    wireframe: true,
    transparent: true,
    opacity: 0.15
});
const icosahedron = new THREE.Mesh(icosahedronGeo, icosahedronMat);
icosahedron.position.set(3, 1, -5);
scene.add(icosahedron);

const torusGeo = new THREE.TorusGeometry(1.5, 0.4, 16, 100);
const torusMat = new THREE.MeshBasicMaterial({ 
    color: 0x8a2be2, 
    wireframe: true,
    transparent: true,
    opacity: 0.1
});
const torus = new THREE.Mesh(torusGeo, torusMat);
torus.position.set(-4, -2, -6);
scene.add(torus);

camera.position.z = 5;

// Mouse Interaction for WebGL
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;
const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX);
    mouseY = (event.clientY - windowHalfY);
});

// Scroll interaction for WebGL
let scrollY = window.scrollY;
window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
});

// Animation Loop
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    targetX = mouseX * 0.001;
    targetY = mouseY * 0.001;

    // Smooth camera movement
    camera.position.x += 0.05 * (targetX - camera.position.x);
    camera.position.y += 0.05 * (-targetY - camera.position.y);
    camera.lookAt(scene.position);

    // Rotate particles
    particlesMesh.rotation.y = elapsedTime * 0.05;
    particlesMesh.rotation.x = elapsedTime * 0.02;

    // Rotate geometries
    icosahedron.rotation.x += 0.01;
    icosahedron.rotation.y += 0.01;
    icosahedron.position.y = Math.sin(elapsedTime) * 0.5 + 1;

    torus.rotation.x -= 0.005;
    torus.rotation.y -= 0.01;
    torus.position.y = Math.sin(elapsedTime * 0.8) * 0.5 - 2;
    
    // Parallax effect based on scroll
    particlesMesh.position.y = -scrollY * 0.002;

    renderer.render(scene, camera);
}
animate();

// Resize handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Scroll Animations (GSAP)
// Section Headers
gsap.utils.toArray('.section-header').forEach(header => {
    gsap.from(header, {
        scrollTrigger: {
            trigger: header,
            start: "top 80%",
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    });
});

// About section cards
gsap.from('.about-left', {
    scrollTrigger: {
        trigger: '.about',
        start: "top 70%",
    },
    x: -50,
    opacity: 0,
    duration: 1,
    ease: "power3.out"
});

gsap.from('.about-right', {
    scrollTrigger: {
        trigger: '.about',
        start: "top 70%",
    },
    x: 50,
    opacity: 0,
    duration: 1,
    ease: "power3.out"
});

// Counter Animation
const stats = document.querySelectorAll('.stat-num');
stats.forEach(stat => {
    const target = parseInt(stat.getAttribute('data-val'));
    ScrollTrigger.create({
        trigger: stat,
        start: "top 80%",
        onEnter: () => {
            gsap.to(stat, {
                innerText: target,
                duration: 2,
                snap: { innerText: 1 },
                ease: "power1.inOut"
            });
        },
        once: true
    });
});

// Projects Animation
gsap.utils.toArray('.project-card').forEach((card, i) => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: "top 85%",
        },
        y: 100,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    });
});

// Skills Animation
gsap.from('.skill-category', {
    scrollTrigger: {
        trigger: '.skills',
        start: "top 70%",
    },
    y: 50,
    opacity: 0,
    stagger: 0.2,
    duration: 1,
    ease: "power3.out"
});

// Timeline Animation
gsap.from('.timeline-item', {
    scrollTrigger: {
        trigger: '.timeline',
        start: "top 70%",
    },
    y: 50,
    opacity: 0,
    stagger: 0.3,
    duration: 1,
    ease: "power3.out"
});

gsap.from('.timeline-line', {
    scrollTrigger: {
        trigger: '.timeline',
        start: "top 70%",
    },
    height: 0,
    duration: 1.5,
    ease: "power3.inOut"
});

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Skills 3D Canvas (Interactive floating icons simulation)
const skillsCanvas = document.getElementById('skills-canvas');
if (skillsCanvas) {
    const scene2 = new THREE.Scene();
    const camera2 = new THREE.PerspectiveCamera(50, skillsCanvas.clientWidth / skillsCanvas.clientHeight, 0.1, 100);
    const renderer2 = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer2.setSize(skillsCanvas.clientWidth, skillsCanvas.clientHeight);
    skillsCanvas.appendChild(renderer2.domElement);

    const group = new THREE.Group();
    scene2.add(group);

    const geo = new THREE.IcosahedronGeometry(0.8, 1);
    const mat1 = new THREE.MeshBasicMaterial({ color: 0x00f0ff, wireframe: true });
    const mat2 = new THREE.MeshBasicMaterial({ color: 0x8a2be2, wireframe: true });
    const mat3 = new THREE.MeshBasicMaterial({ color: 0x00ffcc, wireframe: true });
    
    const materials = [mat1, mat2, mat3];

    for(let i=0; i<8; i++) {
        const mesh = new THREE.Mesh(geo, materials[i % 3]);
        mesh.position.set(
            (Math.random() - 0.5) * 5,
            (Math.random() - 0.5) * 5,
            (Math.random() - 0.5) * 5
        );
        mesh.userData = {
            rotSpeedX: (Math.random() - 0.5) * 0.02,
            rotSpeedY: (Math.random() - 0.5) * 0.02
        };
        group.add(mesh);
    }

    camera2.position.z = 8;

    function animateSkills() {
        requestAnimationFrame(animateSkills);
        group.rotation.y += 0.005;
        group.rotation.x += 0.002;
        
        group.children.forEach(child => {
            child.rotation.x += child.userData.rotSpeedX;
            child.rotation.y += child.userData.rotSpeedY;
        });

        renderer2.render(scene2, camera2);
    }
    animateSkills();

    window.addEventListener('resize', () => {
        if(skillsCanvas.clientWidth) {
            camera2.aspect = skillsCanvas.clientWidth / skillsCanvas.clientHeight;
            camera2.updateProjectionMatrix();
            renderer2.setSize(skillsCanvas.clientWidth, skillsCanvas.clientHeight);
        }
    });
}
