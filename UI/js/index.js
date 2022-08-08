'use strict';

//Selectors
const chevron = document.querySelectorAll('.chevron-down');
const homeSection = document.getElementById('home');
const aboutSection = document.getElementById('about');
const projectsSection = document.getElementById('projects');
const contactSection = document.getElementById('contact');
const navbar = document.querySelector('.navbar');
const formUserName = document.getElementById('name');
const formUserEmail = document.getElementById('email');
const formUserMessage = document.getElementById('message');


/*********************************************************************************************
 Scroll using chevron
 ********************************************************************************************/

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

/*********************************************************************************************
 Page navigation
 ********************************************************************************************/

/*

//Not efficient

document.querySelectorAll('.nav__link').forEach(function (el) {
  el.addEventListener('click', function (e) {
    e.preventDefault();
    const id = this.getAttribute('href');
    console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  });
});


*/


// Efficient method

/*
1. Add event listener to common parent element
2. Determine what element originated the event
*/
document.querySelector('.navbar_links').addEventListener('click', function (e) {
  e.preventDefault();


  // Matching strategy
  if (e.target.classList.contains('navbar_link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({behavior: 'smooth'});
  }
});

/*********************************************************************************************
 Changing Navigation button's color according to section into view
 ********************************************************************************************/

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

/*********************************************************************************************
 Sticky navigation: Intersection Observer API
 ********************************************************************************************/

const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) navbar.classList.add('sticky'); else navbar.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null, threshold: 0, rootMargin: `-${navHeight}px`,
});

headerObserver.observe(homeSection);

/*********************************************************************************************
 Lazy loading images: Intersection Observer API
 ********************************************************************************************/

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

/***************************************************************************************************
 * Generating Modals
 * @param acknowledged {boolean}
 * @param message {string}
 * @returns {HTMLElement <void>}
 ***************************************************************************************************/

// Modal function
const modalCreator = (acknowledged, message) => {

  //Check Icon
  const checkIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="modal-message--icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"
         stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
    </svg>`
  //Error icon
  const errorIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="modal-message--icon" fill="none" viewBox="0 0 24 24" stroke="currentColor"
         stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
    </svg>`

  //Modal div
  const modal = `
        <div id="myModal" class="modal">
          <!-- Modal content -->
          <div class="modal-content">
            <div class="modal_message" style='color: ${acknowledged ? "green" : "red"}'>
            ${!acknowledged ? errorIcon : checkIcon}
            <p style="font-size: 2rem">${message}</p>
            </div>
          </div>
        </div>`


  // Insert Modal into body
  document.body.insertAdjacentHTML('afterbegin', modal);

  //Remove modal automatically after 3s
  setTimeout(() => {
    const insertedModalID = document.getElementById('myModal');
    insertedModalID.remove();
  }, 3000)
}

/*****************************************************************************************************
 * Main function to submit message
 * @returns {Promise<void>}
 * ***************************************************************************************************/

async function formSubmitHandler() {
  //Preventing default browser reload
  event.preventDefault();

  //Creating data
  const data = {
    name: formUserName.value, email: formUserEmail.value, message: formUserMessage.value,
  }

  //Fetching addMessage API
  const response = await fetch('https://portfolio-backend-api-v1.herokuapp.com/addMessage', {
    method: 'POST', headers: {
      'Content-Type': 'application/json',
    }, body: JSON.stringify(data)
  })

  //Destructuring response object
  const {acknowledged} = await response.json();

  //Calling modal function according to response got from server
  acknowledged ? modalCreator(true, 'Message sent🎉') : modalCreator(false, "There's some issue. Please try again😒")

  // Resetting form Inputs
  formUserName.value = "";
  formUserEmail.value = "";
  formUserMessage.value = "";
}
