const defaultIdols = [
    { 
      name: "Rosé", 
      date: "1997-02-11",
      photo: "https://i.imgur.com/8QZQZQZ.jpg",
      bio: "Main vocalist and dancer of BLACKPINK. Born in New Zealand, raised in Australia.",
      color: "Pink",
      nationality: "Korean",
      social: {
        instagram: "https://instagram.com/roses_are_rosie",
        twitter: "https://twitter.com/roses_are_rosie",
        youtube: "https://youtube.com/roses_are_rosie"
      }
    },
    { 
      name: "Jennie", 
      date: "1996-01-16",
      photo: "https://i.imgur.com/9Q9Q9Q9.jpg",
      bio: "Main rapper and vocalist of BLACKPINK. Born in Seoul, South Korea.",
      color: "Black",
      nationality: "Korean",
      social: {
        instagram: "https://instagram.com/jennierubyjane",
        twitter: "https://twitter.com/jennierubyjane",
        youtube: "https://youtube.com/jennierubyjane"
      }
    },
    { 
      name: "Jisoo", 
      date: "1995-01-03",
      photo: "https://i.imgur.com/7Q7Q7Q7.jpg",
      bio: "Main vocalist and visual of BLACKPINK. Born in Gunpo, South Korea.",
      color: "Red",
      nationality: "Korean",
      social: {
        instagram: "https://instagram.com/sooyaaa__",
        twitter: "https://twitter.com/sooyaaa__",
        youtube: "https://youtube.com/sooyaaa__"
      }
    },
    { 
      name: "Lisa", 
      date: "1997-03-27",
      photo: "https://i.imgur.com/6Q6Q6Q6.jpg",
      bio: "Main dancer and rapper of BLACKPINK. Born in Buriram, Thailand.",
      color: "Yellow",
      nationality: "Thai",
      social: {
        instagram: "https://instagram.com/lalalalisa_m",
        twitter: "https://twitter.com/lalalalisa_m",
        youtube: "https://youtube.com/lalalalisa_m"
      }
    }
  ];
  
  window.onload = function () {
    if (!localStorage.getItem("idols")) {
      localStorage.setItem("idols", JSON.stringify(defaultIdols));
    }
    displayIdols();
  };
  
  function saveUserBirthday() {
    const date = document.getElementById("userBirthday").value;
    if (date) {
      localStorage.setItem("userBirthday", date);
      displayIdols();
    }
  }
  
  // Initialize Quill editor
  const quill = new Quill('#editor', {
    theme: 'snow',
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['link']
      ]
    }
  });
  
  // Initialize lightbox
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const closeLightbox = document.querySelector('.close');
  
  // Photo preview functionality
  const photoInput = document.getElementById('idolPhoto');
  const photoPreview = document.getElementById('photoPreview');
  
  photoInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        photoPreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
      }
      reader.readAsDataURL(file);
    }
  });
  
  // Lightbox functionality
  document.querySelectorAll('.idol-card img').forEach(img => {
    img.addEventListener('click', function() {
      lightbox.style.display = 'block';
      lightboxImg.src = this.src;
    });
  });
  
  closeLightbox.addEventListener('click', function() {
    lightbox.style.display = 'none';
  });
  
  window.addEventListener('click', function(event) {
    if (event.target === lightbox) {
      lightbox.style.display = 'none';
    }
  });
  
  // Edit modal
  const editModal = document.createElement('div');
  editModal.className = 'edit-modal';
  editModal.innerHTML = `
    <div class="edit-modal-content">
      <span class="edit-modal-close">&times;</span>
      <h2>Edit Idol</h2>
      <input type="text" id="editName" placeholder="Idol Name">
      <input type="date" id="editBirthday">
      <div class="photo-upload">
        <label for="editPhoto">Photo:</label>
        <input type="file" id="editPhoto" accept="image/*">
        <div id="editPhotoPreview" class="photo-preview"></div>
      </div>
      <div id="editEditor" class="bio-editor"></div>
      <button onclick="saveEdit()">Save Changes</button>
    </div>
  `;
  document.body.appendChild(editModal);
  
  const editQuill = new Quill('#editEditor', {
    theme: 'snow',
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['link']
      ]
    }
  });
  
  let currentEditIndex = -1;
  
  function editIdol(index) {
    currentEditIndex = index;
    const idols = JSON.parse(localStorage.getItem("idols")) || [];
    const idol = idols[index];
    
    document.getElementById('editName').value = idol.name;
    document.getElementById('editBirthday').value = idol.date;
    document.getElementById('editPhotoPreview').innerHTML = `<img src="${idol.photo}" alt="Preview">`;
    editQuill.setContents(editQuill.clipboard.convert(idol.bio));
    
    editModal.style.display = 'block';
  }
  
  function saveEdit() {
    if (currentEditIndex === -1) return;
    
    const idols = JSON.parse(localStorage.getItem("idols")) || [];
    const idol = idols[currentEditIndex];
    
    idol.name = document.getElementById('editName').value;
    idol.date = document.getElementById('editBirthday').value;
    
    const photoFile = document.getElementById('editPhoto').files[0];
    if (photoFile) {
      const reader = new FileReader();
      reader.onload = function(e) {
        idol.photo = e.target.result;
        saveAndClose();
      }
      reader.readAsDataURL(photoFile);
    } else {
      saveAndClose();
    }
    
    function saveAndClose() {
      idol.bio = editQuill.root.innerHTML;
      localStorage.setItem("idols", JSON.stringify(idols));
      editModal.style.display = 'none';
      displayIdols();
    }
  }
  
  document.querySelector('.edit-modal-close').addEventListener('click', function() {
    editModal.style.display = 'none';
  });
  
  window.addEventListener('click', function(event) {
    if (event.target === editModal) {
      editModal.style.display = 'none';
    }
  });
  
  // Notification System
  function showNotification(message) {
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notificationMessage');
    notificationMessage.textContent = message;
    notification.style.display = 'block';
    
    // Auto hide after 5 seconds
    setTimeout(() => {
      closeNotification();
    }, 5000);
  }
  
  function closeNotification() {
    document.getElementById('notification').style.display = 'none';
  }
  
  // Search Functionality
  function searchIdols() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const idols = JSON.parse(localStorage.getItem("idols")) || [];
    const filteredIdols = idols.filter(idol => 
      idol.name.toLowerCase().includes(searchInput) ||
      idol.nationality.toLowerCase().includes(searchInput)
    );
    displayIdols(filteredIdols);
  }
  
  // Birthday Notification Check
  function checkUpcomingBirthdays() {
    const idols = JSON.parse(localStorage.getItem("idols")) || [];
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
  
    idols.forEach(idol => {
      const birthday = new Date(idol.date);
      birthday.setFullYear(today.getFullYear());
      
      if (birthday >= today && birthday <= nextWeek) {
        const daysUntil = Math.ceil((birthday - today) / (1000 * 60 * 60 * 24));
        showNotification(`${idol.name}'s birthday is in ${daysUntil} days! 🎉`);
      }
    });
  }
  
  // Check birthdays every hour
  setInterval(checkUpcomingBirthdays, 3600000);
  checkUpcomingBirthdays(); // Initial check
  
  // Update addIdol function
  function addIdol() {
    const name = document.getElementById("idolName").value;
    const date = document.getElementById("idolBirthday").value;
    const photoFile = document.getElementById("idolPhoto").files[0];
    const bio = document.getElementById("idolBio").value;
    const color = document.getElementById("idolColor").value;
    const nationality = document.getElementById("idolNationality").value;
    const instagram = document.getElementById("idolInstagram").value;
    const twitter = document.getElementById("idolTwitter").value;
    const youtube = document.getElementById("idolYouTube").value;
    
    if (name && date) {
      const newIdol = { 
        name, 
        date,
        bio: bio || "No biography available",
        color: color || "Pink",
        nationality: nationality || "Unknown",
        social: {
          instagram: instagram ? `https://instagram.com/${instagram.replace('@', '')}` : null,
          twitter: twitter ? `https://twitter.com/${twitter.replace('@', '')}` : null,
          youtube: youtube ? `https://youtube.com/${youtube}` : null
        }
      };
      
      if (photoFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
          newIdol.photo = e.target.result;
          saveIdol(newIdol);
        }
        reader.readAsDataURL(photoFile);
      } else {
        newIdol.photo = "https://via.placeholder.com/300x200?text=No+Photo";
        saveIdol(newIdol);
      }
    }
  }
  
  function saveIdol(idol) {
    const idols = JSON.parse(localStorage.getItem("idols")) || [];
    idols.push(idol);
    localStorage.setItem("idols", JSON.stringify(idols));
    displayIdols();
    showNotification(`${idol.name} has been added successfully!`);
    
    // Clear form
    document.getElementById("idolName").value = "";
    document.getElementById("idolBirthday").value = "";
    document.getElementById("idolPhoto").value = "";
    document.getElementById("idolBio").value = "";
    document.getElementById("idolColor").value = "";
    document.getElementById("idolNationality").value = "";
    document.getElementById("idolInstagram").value = "";
    document.getElementById("idolTwitter").value = "";
    document.getElementById("idolYouTube").value = "";
    photoPreview.innerHTML = "";
  }
  
  function deleteUserBirthday() {
    localStorage.removeItem("userBirthday");
    displayIdols();
  }
  
  function deleteIdol(index) {
    const idols = JSON.parse(localStorage.getItem("idols")) || [];
    idols.splice(index, 1);
    localStorage.setItem("idols", JSON.stringify(idols));
    displayIdols();
    showNotification("Idol deleted successfully!");
  }
  
  function displayIdols(idolsToShow = null) {
    const list = document.getElementById("idolList");
    list.innerHTML = "";
  
    const idols = idolsToShow || JSON.parse(localStorage.getItem("idols")) || [];
    const userBirthday = localStorage.getItem("userBirthday");
  
    idols.forEach((idol, index) => {
      const card = document.createElement("div");
      card.className = "idol-card";
      
      const heart = userBirthday && isDateClose(userBirthday, idol.date) ? " ❤️" : "";
      
      const socialLinks = idol.social ? `
        <div class="social-icons">
          ${idol.social.instagram ? `<a href="${idol.social.instagram}" target="_blank"><i class="fab fa-instagram"></i></a>` : ''}
          ${idol.social.twitter ? `<a href="${idol.social.twitter}" target="_blank"><i class="fab fa-twitter"></i></a>` : ''}
          ${idol.social.youtube ? `<a href="${idol.social.youtube}" target="_blank"><i class="fab fa-youtube"></i></a>` : ''}
        </div>
      ` : '';
      
      card.innerHTML = `
        <img src="${idol.photo}" alt="${idol.name}">
        <h3>${idol.name}${heart}</h3>
        <p class="date">${idol.date}</p>
        <p class="nationality">${idol.nationality}</p>
        <p class="bio">${idol.bio}</p>
        <p class="color">Favorite Color: <span style="color: ${idol.color.toLowerCase()}">${idol.color}</span></p>
        ${socialLinks}
        <button class="delete-btn" onclick="deleteIdol(${index})">Delete</button>
      `;
      
      list.appendChild(card);
    });
  }
  
  function isDateClose(date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
  
    const day1 = d1.getDate();
    const month1 = d1.getMonth();
    const day2 = d2.getDate();
    const month2 = d2.getMonth();
  
    const time1 = new Date(2000, month1, day1);
    const time2 = new Date(2000, month2, day2);
    const diff = Math.abs(time1 - time2);
  
    return diff <= 7 * 24 * 60 * 60 * 1000; // within 7 days
  }
  
  // Preview functionality
  function updatePreview() {
    const name = document.getElementById("idolName").value;
    const date = document.getElementById("idolBirthday").value;
    const bio = document.getElementById("idolBio").value;
    const color = document.getElementById("idolColor").value;
    const nationality = document.getElementById("idolNationality").value;
    const instagram = document.getElementById("idolInstagram").value;
    const twitter = document.getElementById("idolTwitter").value;
    const youtube = document.getElementById("idolYouTube").value;
  
    const previewCard = document.getElementById("previewCard");
    
    // Update preview card content
    previewCard.innerHTML = `
      <img src="${photoPreview.querySelector('img')?.src || 'https://via.placeholder.com/300x200?text=No+Photo'}" alt="Preview">
      <h3>${name || 'Idol Name'}</h3>
      <p class="date">${date || 'Birthday'}</p>
      <p class="nationality">${nationality || 'Nationality'}</p>
      <p class="bio">${bio || 'Biography will appear here...'}</p>
      <p class="color">Favorite Color: <span style="color: ${color?.toLowerCase() || 'pink'}">${color || 'Pink'}</span></p>
      <div class="social-icons">
        ${instagram ? `<a href="https://instagram.com/${instagram.replace('@', '')}" target="_blank"><i class="fab fa-instagram"></i></a>` : ''}
        ${twitter ? `<a href="https://twitter.com/${twitter.replace('@', '')}" target="_blank"><i class="fab fa-twitter"></i></a>` : ''}
        ${youtube ? `<a href="https://youtube.com/${youtube}" target="_blank"><i class="fab fa-youtube"></i></a>` : ''}
      </div>
    `;
  }
  
  // Initialize preview
  updatePreview();
  