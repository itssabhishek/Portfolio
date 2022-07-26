'use strict';

//Selectors
const chevron = document.querySelectorAll('.chevron-down');
const homeSection = document.getElementById('home');
const aboutSection = document.getElementById('about');
const projectsSection = document.getElementById('projects');
const contactSection = document.getElementById('contact');
const navbar = document.querySelector('.navbar');

//Scroll using chevron
chevron.forEach((el,index)=>{

  el.addEventListener('click', function (e) {
    e.preventDefault();
    //Get coordinates of Section
    const aboutSectionCoords = aboutSection.getBoundingClientRect();
    const projectsSectionCoords = projectsSection.getBoundingClientRect();
    const contactSectionCoords = contactSection.getBoundingClientRect();
    const sectionToView = (index === 0 && aboutSectionCoords) || (index === 1 && projectsSectionCoords) || (index === 2 && contactSectionCoords)

    window.scrollTo({
      left: sectionToView.left + window.scrollX,
      top: sectionToView.top + window.scrollY,
      behavior: 'smooth',
    });

    /*
    For modern browsers
    section.scrollIntoView({ behavior: 'smooth' });
    */

  });
})

// Sticky navigation: Intersection Observer API
const navHeight = navbar.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) navbar.classList.add('sticky');
  else navbar.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(homeSection);

