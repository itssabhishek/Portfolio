'use strict';

//Selectors
const chevron = document.querySelectorAll('.chevron-down');
const homeSection = document.getElementById('home');
const aboutSection = document.getElementById('about');
const projectsSection = document.getElementById('projects');
const contactSection = document.getElementById('contact');
const navbar = document.querySelector('.navbar');

//Scroll using chevron
chevron.forEach((el, index) => {

  el.addEventListener('click', function (e) {
    e.preventDefault();
    //Get coordinates of Section
    const aboutSectionCoords = aboutSection.getBoundingClientRect();
    const projectsSectionCoords = projectsSection.getBoundingClientRect();
    const contactSectionCoords = contactSection.getBoundingClientRect();
    const sectionToView = (index === 0 && aboutSectionCoords) || (index === 1 && projectsSectionCoords) || (index === 2 && contactSectionCoords)

    window.scrollTo({
      left: sectionToView.left + window.scrollX, top: sectionToView.top + window.scrollY, behavior: 'smooth',
    });

    /*
    For modern browsers
    section.scrollIntoView({ behavior: 'smooth' });
    */

  });
})


// Page navigation

// Not efficient

// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

// Efficient method

// 1. Add event listener to common parent element
// 2. Determine what element originated the event

document.querySelector('.navbar_links').addEventListener('click', function (e) {
  e.preventDefault();


  // Matching strategy
  if (e.target.classList.contains('navbar_link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({behavior: 'smooth'});
  }
});

// Changing Navigation button's color according to section into view
function changeActiveLink(entries) {
  const [entry] = entries;

  // Highlighting Navlinks
  if (entry.isIntersecting) {
    document.querySelectorAll('.navbar_link').forEach(function (el) {
      el.classList.remove('navbar_link--active')
    });
    document.querySelector(`[href='#${entry.target.id}']`).classList.add('navbar_link--active');
  }
}

const navHeight = navbar.getBoundingClientRect().height;
const sectionObserver = new IntersectionObserver(changeActiveLink, {
  root: null, threshold: 0.8, rootMargin: `-${navHeight}px`
});

[homeSection, aboutSection, projectsSection, contactSection].forEach(section => sectionObserver.observe(section))

// Sticky navigation: Intersection Observer API
const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) navbar.classList.add('sticky'); else navbar.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null, threshold: 0, rootMargin: `-${navHeight}px`,
});

headerObserver.observe(homeSection);

// Lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null, threshold: 0, rootMargin: '500px'
});

imgTargets.forEach(img => imgObserver.observe(img));


async function submitForm(data) {
  const response = fetch('http://localhost:5000/addEntry', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  return response.json();
}
