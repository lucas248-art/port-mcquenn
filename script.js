/* =====================================================
   LUCAS.DEV — PISTON CUP
===================================================== */


/* =====================================================
   LOADER
===================================================== */

window.addEventListener("load", () => {

  const loader = document.getElementById("loader");

  setTimeout(() => {
    loader.classList.add("hidden");
  }, 700);

});


/* =====================================================
   NAVBAR
===================================================== */

const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {

  if (window.scrollY > 40) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }

});


/* =====================================================
   MOBILE MENU
===================================================== */

const menuBtn = document.getElementById("menuBtn");
const navLinks = document.querySelector(".nav-links");

menuBtn.addEventListener("click", () => {

  menuBtn.classList.toggle("open");

  navLinks.classList.toggle("open");

});


document.querySelectorAll(".nav-links a").forEach(link => {

  link.addEventListener("click", () => {

    menuBtn.classList.remove("open");

    navLinks.classList.remove("open");

  });

});


/* =====================================================
   ACTIVE NAV
===================================================== */

const sections = document.querySelectorAll("section[id]");
const links = document.querySelectorAll(".nav-links a");

const observerNav = new IntersectionObserver(
  entries => {

    entries.forEach(entry => {

      if (entry.isIntersecting) {

        links.forEach(link => {
          link.classList.remove("active");
        });

        const current =
          document.querySelector(
            `.nav-links a[href="#${entry.target.id}"]`
          );

        if (current) {
          current.classList.add("active");
        }

      }

    });

  },
  {
    threshold: .35
  }
);

sections.forEach(section => {
  observerNav.observe(section);
});


/* =====================================================
   REVEAL ANIMATION
===================================================== */

const revealElements =
  document.querySelectorAll(
    ".section-heading, .about-card, .about-text, .project-card, .skill-item, .contact-content"
  );

revealElements.forEach(element => {
  element.classList.add("reveal");
});


const revealObserver = new IntersectionObserver(
  entries => {

    entries.forEach(entry => {

      if (entry.isIntersecting) {

        entry.target.classList.add("show");

        revealObserver.unobserve(entry.target);

      }

    });

  },
  {
    threshold: .12
  }
);

revealElements.forEach(element => {
  revealObserver.observe(element);
});


/* =====================================================
   PROJECT 3D TILT
===================================================== */

const cards =
  document.querySelectorAll(".project-card");

cards.forEach(card => {

  card.addEventListener("mousemove", event => {

    if (window.innerWidth < 800) return;

    const rect =
      card.getBoundingClientRect();

    const x =
      event.clientX - rect.left;

    const y =
      event.clientY - rect.top;

    const centerX =
      rect.width / 2;

    const centerY =
      rect.height / 2;

    const rotateX =
      (y - centerY) / 25;

    const rotateY =
      (centerX - x) / 25;

    card.style.transform =
      `perspective(900px)
       rotateX(${rotateX}deg)
       rotateY(${rotateY}deg)
       translateY(-8px)`;

  });


  card.addEventListener("mouseleave", () => {

    card.style.transform = "";

  });

});


/* =====================================================
   SPEEDOMETER
===================================================== */

const speedNumber =
  document.getElementById("speedNumber");

let currentSpeed = 95;

window.addEventListener("scroll", () => {

  const scroll =
    window.scrollY;

  const target =
    Math.min(
      180,
      95 + Math.floor(scroll / 35)
    );

  currentSpeed +=
    (target - currentSpeed) * .08;

  speedNumber.textContent =
    String(Math.floor(currentSpeed))
      .padStart(3, "0");

});


/* =====================================================
   RACE CANVAS
===================================================== */

const canvas =
  document.getElementById("raceCanvas");

const ctx =
  canvas.getContext("2d");

let width;
let height;
let dpr;

let animationTime = 0;

const stars = [];
const dust = [];
const hills = [];


/* RANDOM */

function random(min, max) {
  return Math.random() * (max - min) + min;
}


/* =====================================================
   RESIZE
===================================================== */

function resizeCanvas() {

  dpr =
    Math.min(
      window.devicePixelRatio || 1,
      2
    );

  width =
    canvas.clientWidth;

  height =
    canvas.clientHeight;

  canvas.width =
    width * dpr;

  canvas.height =
    height * dpr;

  ctx.setTransform(
    dpr,
    0,
    0,
    dpr,
    0,
    0
  );

  createScene();

}

window.addEventListener(
  "resize",
  resizeCanvas
);


/* =====================================================
   CREATE SCENE
===================================================== */

function createScene() {

  stars.length = 0;
  dust.length = 0;
  hills.length = 0;


  /* STARS */

  const starCount =
    width < 700 ? 50 : 100;

  for (let i = 0; i < starCount; i++) {

    stars.push({
      x: random(0, width),
      y: random(0, height * .55),
      size: random(.5, 2),
      phase: random(0, Math.PI * 2),
      speed: random(.01, .035)
    });

  }


  /* DUST */

  for (let i = 0; i < 90; i++) {

    dust.push({
      x: random(0, width),
      y: random(height * .55, height),
      size: random(.5, 2.5),
      speed: random(.2, 1)
    });

  }


  /* HILLS */

  for (let i = 0; i < 5; i++) {

    hills.push({
      y:
        height * .55 +
        i * 35,

      amplitude:
        random(25, 60),

      frequency:
        random(.004, .008),

      offset:
        random(0, 1000)
    });

  }

}


/* =====================================================
   DRAW SKY
===================================================== */

function drawSky() {

  const gradient =
    ctx.createLinearGradient(
      0,
      0,
      0,
      height
    );

  gradient.addColorStop(
    0,
    "#061322"
  );

  gradient.addColorStop(
    .48,
    "#153b51"
  );

  gradient.addColorStop(
    .7,
    "#73514a"
  );

  gradient.addColorStop(
    1,
    "#b9653f"
  );

  ctx.fillStyle = gradient;

  ctx.fillRect(
    0,
    0,
    width,
    height
  );

}


/* =====================================================
   STARS
===================================================== */

function drawStars() {

  stars.forEach(star => {

    const pulse =
      Math.sin(
        animationTime * star.speed * 50 +
        star.phase
      );

    const alpha =
      .45 + pulse * .3;

    ctx.save();

    ctx.globalAlpha =
      Math.max(.1, alpha);

    ctx.fillStyle =
      "#ffd45a";

    ctx.beginPath();

    ctx.arc(
      star.x,
      star.y,
      star.size,
      0,
      Math.PI * 2
    );

    ctx.fill();

    if (star.size > 1.2) {

      ctx.strokeStyle =
        "rgba(255,210,80,.35)";

      ctx.lineWidth = 1;

      ctx.beginPath();

      ctx.moveTo(
        star.x - 6,
        star.y
      );

      ctx.lineTo(
        star.x + 6,
        star.y
      );

      ctx.moveTo(
        star.x,
        star.y - 6
      );

      ctx.lineTo(
        star.x,
        star.y + 6
      );

      ctx.stroke();

    }

    ctx.restore();

  });

}


/* =====================================================
   SUN
===================================================== */

function drawSun() {

  const x =
    width * .76;

  const y =
    height * .24;

  const radius =
    Math.min(width, height) * .07;


  const glow =
    ctx.createRadialGradient(
      x,
      y,
      radius * .2,
      x,
      y,
      radius * 2.5
    );

  glow.addColorStop(
    0,
    "rgba(255,205,74,.65)"
  );

  glow.addColorStop(
    1,
    "rgba(255,205,74,0)"
  );

  ctx.fillStyle = glow;

  ctx.beginPath();

  ctx.arc(
    x,
    y,
    radius * 2.5,
    0,
    Math.PI * 2
  );

  ctx.fill();


  ctx.fillStyle =
    "#f7c747";

  ctx.beginPath();

  ctx.arc(
    x,
    y,
    radius,
    0,
    Math.PI * 2
  );

  ctx.fill();

}


/* =====================================================
   HILLS
===================================================== */

function drawHills() {

  hills.forEach((hill, index) => {

    ctx.beginPath();

    ctx.moveTo(
      0,
      height
    );

    for (
      let x = 0;
      x <= width;
      x += 10
    ) {

      const wave =
        Math.sin(
          x * hill.frequency +
          hill.offset +
          animationTime * (.02 + index * .005)
        ) * hill.amplitude;

      const y =
        hill.y + wave;

      ctx.lineTo(
        x,
        y
      );

    }

    ctx.lineTo(
      width,
      height
    );

    ctx.closePath();

    ctx.fillStyle =
      index === 0
        ? "#102a35"
        : "#0b202b";

    ctx.fill();

  });

}


/* =====================================================
   ROAD
===================================================== */

function drawRoad() {

  const horizon =
    height * .67;

  const roadTop =
    width * .08;

  const roadBottom =
    width * .82;


  ctx.beginPath();

  ctx.moveTo(
    width / 2 - roadTop,
    horizon
  );

  ctx.lineTo(
    width / 2 + roadTop,
    horizon
  );

  ctx.lineTo(
    width / 2 + roadBottom,
    height
  );

  ctx.lineTo(
    width / 2 - roadBottom,
    height
  );

  ctx.closePath();

  ctx.fillStyle =
    "#171d20";

  ctx.fill();


  /* ROAD STRIPES */

  ctx.save();

  ctx.strokeStyle =
    "#f2bd35";

  ctx.lineWidth = 5;

  ctx.setLineDash([
    45,
    35
  ]);

  ctx.lineDashOffset =
    -animationTime * 80;

  ctx.beginPath();

  ctx.moveTo(
    width / 2,
    horizon
  );

  ctx.lineTo(
    width / 2,
    height
  );

  ctx.stroke();

  ctx.restore();


  /* EDGE */

  ctx.strokeStyle =
    "rgba(255,255,255,.15)";

  ctx.lineWidth = 2;

  ctx.beginPath();

  ctx.moveTo(
    width / 2 - roadTop,
    horizon
  );

  ctx.lineTo(
    width / 2 - roadBottom,
    height
  );

  ctx.moveTo(
    width / 2 + roadTop,
    horizon
  );

  ctx.lineTo(
    width / 2 + roadBottom,
    height
  );

  ctx.stroke();

}


/* =====================================================
   DESERT LIGHTS
===================================================== */

function drawLights() {

  const horizon =
    height * .66;

  for (let i = 0; i < 25; i++) {

    const x =
      (i / 25) * width +
      Math.sin(i * 4) * 15;

    const y =
      horizon +
      Math.abs(
        Math.sin(i * 1.9)
      ) * 55;

    ctx.fillStyle =
      i % 3 === 0
        ? "#ffd85b"
        : "#e89d35";

    ctx.fillRect(
      x,
      y,
      3,
      3
    );

  }

}


/* =====================================================
   DUST
===================================================== */

function drawDust() {

  dust.forEach(particle => {

    particle.x -=
      particle.speed;

    if (particle.x < -10) {
      particle.x = width + 10;
    }

    ctx.globalAlpha = .18;

    ctx.fillStyle =
      "#f4c46b";

    ctx.beginPath();

    ctx.arc(
      particle.x,
      particle.y,
      particle.size,
      0,
      Math.PI * 2
    );

    ctx.fill();

  });

  ctx.globalAlpha = 1;

}


/* =====================================================
   CYPRESS / DESERT TREE
===================================================== */

function drawTree() {

  const baseX =
    width * .13;

  const baseY =
    height * .82;

  const treeHeight =
    Math.min(
      height * .5,
      470
    );

  ctx.save();

  ctx.fillStyle =
    "#071216";

  ctx.beginPath();

  ctx.moveTo(
    baseX,
    baseY
  );

  ctx.lineTo(
    baseX - 45,
    baseY
  );

  ctx.lineTo(
    baseX - 15,
    baseY - treeHeight * .45
  );

  ctx.lineTo(
    baseX - 5,
    baseY - treeHeight
  );

  ctx.lineTo(
    baseX + 10,
    baseY - treeHeight * .55
  );

  ctx.lineTo(
    baseX + 55,
    baseY
  );

  ctx.closePath();

  ctx.fill();


  /* branches */

  ctx.strokeStyle =
    "rgba(246,189,47,.22)";

  ctx.lineWidth = 3;

  for (let i = 0; i < 12; i++) {

    const y =
      baseY -
      40 -
      i * 25;

    ctx.beginPath();

    ctx.moveTo(
      baseX,
      y
    );

    ctx.lineTo(
      baseX -
      random(15, 60),
      y -
      random(10, 35)
    );

    ctx.stroke();

  }

  ctx.restore();

}


/* =====================================================
   ANIMATED CAR
===================================================== */

function drawCar() {

  const roadY =
    height * .78;

  const center =
    width / 2;

  const scale =
    Math.max(
      .6,
      Math.min(
        1.25,
        width / 1100
      )
    );

  const carX =
    center +
    Math.sin(
      animationTime * 1.5
    ) * 8;

  const carY =
    roadY -
    20 +
    Math.sin(
      animationTime * 4
    ) * 2;


  ctx.save();

  ctx.translate(
    carX,
    carY
  );

  ctx.scale(
    scale,
    scale
  );


  /* shadow */

  ctx.fillStyle =
    "rgba(0,0,0,.45)";

  ctx.beginPath();

  ctx.ellipse(
    0,
    18,
    95,
    13,
    0,
    0,
    Math.PI * 2
  );

  ctx.fill();


  /* body */

  ctx.fillStyle =
    "#d9362c";

  ctx.beginPath();

  ctx.roundRect(
    -75,
    -25,
    150,
    43,
    15
  );

  ctx.fill();


  /* roof */

  ctx.fillStyle =
    "#e84a35";

  ctx.beginPath();

  ctx.moveTo(
    -35,
    -25
  );

  ctx.quadraticCurveTo(
    -15,
    -65,
    30,
    -55
  );

  ctx.quadraticCurveTo(
    55,
    -50,
    65,
    -22
  );

  ctx.closePath();

  ctx.fill();


  /* windows */

  ctx.fillStyle =
    "#102633";

  ctx.beginPath();

  ctx.moveTo(
    -20,
    -28
  );

  ctx.lineTo(
    -8,
    -48
  );

  ctx.lineTo(
    17,
    -45
  );

  ctx.lineTo(
    25,
    -27
  );

  ctx.closePath();

  ctx.fill();


  /* yellow lightning */

  ctx.fillStyle =
    "#f6c332";

  ctx.beginPath();

  ctx.moveTo(
    -72,
    -3
  );

  ctx.lineTo(
    -20,
    2
  );

  ctx.lineTo(
    -40,
    12
  );

  ctx.lineTo(
    25,
    4
  );

  ctx.lineTo(
    5,
    -7
  );

  ctx.closePath();

  ctx.fill();


  /* wheels */

  drawWheel(-48, 17);
  drawWheel(48, 17);


  /* headlights */

  ctx.fillStyle =
    "#ffe7a0";

  ctx.beginPath();

  ctx.arc(
    74,
    -4,
    5,
    0,
    Math.PI * 2
  );

  ctx.fill();


  ctx.restore();

}


function drawWheel(x, y) {

  ctx.fillStyle =
    "#080b0c";

  ctx.beginPath();

  ctx.arc(
    x,
    y,
    16,
    0,
    Math.PI * 2
  );

  ctx.fill();

  ctx.strokeStyle =
    "#5b6265";

  ctx.lineWidth = 3;

  ctx.stroke();

  ctx.fillStyle =
    "#d0d0d0";

  ctx.beginPath();

  ctx.arc(
    x,
    y,
    5,
    0,
    Math.PI * 2
  );

  ctx.fill();

}


/* =====================================================
   PAINT / DUST STREAKS
===================================================== */

function drawSpeedStreaks() {

  ctx.save();

  ctx.globalAlpha = .12;

  for (let i = 0; i < 20; i++) {

    const y =
      height * .35 +
      i * 18;

    const length =
      50 +
      Math.sin(
        animationTime * 2 + i
      ) * 40;

    ctx.strokeStyle =
      i % 2
        ? "#f6bd2f"
        : "#ffffff";

    ctx.lineWidth = 1;

    ctx.beginPath();

    ctx.moveTo(
      width * .55,
      y
    );

    ctx.lineTo(
      width * .55 - length,
      y
    );

    ctx.stroke();

  }

  ctx.restore();

}


/* =====================================================
   ANIMATION LOOP
===================================================== */

function animate() {

  animationTime += .016;

  ctx.clearRect(
    0,
    0,
    width,
    height
  );

  drawSky();

  drawStars();

  drawSun();

  drawSpeedStreaks();

  drawHills();

  drawLights();

  drawRoad();

  drawTree();

  drawDust();

  drawCar();

  requestAnimationFrame(
    animate
  );

}


/* =====================================================
   START
===================================================== */

resizeCanvas();

animate();


/* =====================================================
   MOUSE PARALLAX
===================================================== */

let mouseX = 0;
let mouseY = 0;

window.addEventListener(
  "mousemove",
  event => {

    mouseX =
      (event.clientX / window.innerWidth - .5);

    mouseY =
      (event.clientY / window.innerHeight - .5);

    const canvas =
      document.getElementById("raceCanvas");

    canvas.style.transform =
      `translate(
        ${mouseX * -8}px,
        ${mouseY * -5}px
      ) scale(1.015)`;

  }
);


/* =====================================================
   SMOOTH BUTTON FEEDBACK
===================================================== */

document
  .querySelectorAll(".btn, .project-button")
  .forEach(button => {

    button.addEventListener(
      "mouseenter",
      () => {

        button.style.setProperty(
          "--hover-x",
          "1"
        );

      }
    );

  });
