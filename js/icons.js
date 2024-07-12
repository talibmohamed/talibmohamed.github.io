// Create an IntersectionObserver instance
const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('show'); // Add 'show' class after a delay
        }, index * 200); // Adjust delay as needed
        observer.unobserve(entry.target); // Stop observing once shown
      }
    });
  }, {
    threshold: 0.5 // Trigger when 50% of element is visible
  });
  
  // Select all elements with class 'hidden'
  const hiddenIcons = document.querySelectorAll('.hidden');
  
  // Observe each hidden element
  hiddenIcons.forEach(el => observer.observe(el));
  
  