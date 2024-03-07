var names = ['Mohamed', 'Med', 'Simo'];
var index = 0;
var nameElement = document.getElementById('name');
var currentName = '';

function typeWriter() {
  if (index >= names.length) {
    index = 0;
  }
  var nextName = names[index];
  if (currentName.length < nextName.length) {
    currentName += nextName[currentName.length];
    nameElement.textContent = currentName;
    setTimeout(typeWriter, 150); // Adjust typing speed (milliseconds)
  } else {
    setTimeout(deleteWriter, 1000); // Wait before deleting
  }
}

function deleteWriter() {
  if (currentName.length > 0) {
    currentName = currentName.slice(0, -1);
    nameElement.textContent = currentName;
    setTimeout(deleteWriter, 50); // Adjust deleting speed (milliseconds)
  } else {
    index++;
    setTimeout(typeWriter, 500); // Wait before typing the next name
  }
}

// Start the typing effect
typeWriter();


