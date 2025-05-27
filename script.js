document.addEventListener('DOMContentLoaded', function() {
  // Mobile Menu Toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileMenu = document.querySelector('.mobile-menu');
  
  mobileMenuBtn.addEventListener('click', function() {
    mobileMenu.classList.toggle('active');
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', function(e) {
    if (!mobileMenu.contains(e.target) && e.target !== mobileMenuBtn) {
      mobileMenu.classList.remove('active');
    }
  });

  // Modal functionality
  const modals = document.querySelectorAll('.modal');
  const closeModalBtns = document.querySelectorAll('.close-modal');
  const cancelBtns = document.querySelectorAll('.cancel-btn');
  
  // Open modals
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  
  // Close modals
  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  // Close all modals
  function closeAllModals() {
    modals.forEach(modal => {
      modal.classList.remove('active');
    });
    document.body.style.overflow = '';
  }
  
  // Event listeners for opening modals
  document.getElementById('submit-idea-btn')?.addEventListener('click', () => openModal('idea-submission-modal'));
  document.getElementById('mobile-submit-idea-btn')?.addEventListener('click', () => {
    openModal('idea-submission-modal');
    mobileMenu.classList.remove('active');
  });
  document.getElementById('scan-qr-btn')?.addEventListener('click', () => openModal('qr-modal'));
  
  // Event listeners for viewing ideas
  document.querySelectorAll('.view-idea-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      openModal('idea-modal');
    });
  });
  
  // Event listeners for joining challenges
  document.querySelectorAll('.join-challenge-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      openModal('challenge-modal');
    });
  });
  
  // Event listeners for closing modals
  closeModalBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const modal = this.closest('.modal');
      closeModal(modal.id);
    });
  });
  
  cancelBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const modal = this.closest('.modal');
      closeModal(modal.id);
    });
  });
  
  // Close modal when clicking on backdrop
  modals.forEach(modal => {
    modal.addEventListener('click', function(e) {
      if (e.target === this) {
        closeModal(this.id);
      }
    });
  });
  
  // Close modal with Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });

  // Tab navigation
  const tabBtns = document.querySelectorAll('.tab-btn');
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      // Remove active class from all buttons
      tabBtns.forEach(b => b.classList.remove('active'));
      
      // Add active class to clicked button
      this.classList.add('active');
      
      // Here you would typically load content for the selected tab
      // For this example, we'll just log the tab
      console.log(`Switched to ${this.dataset.tab} tab`);
    });
  });

  // Idea submission form
  const ideaForm = document.getElementById('idea-form');
  if (ideaForm) {
    ideaForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form values
      const title = document.getElementById('idea-title').value;
      const category = document.getElementById('idea-category').value;
      const description = document.getElementById('idea-description').value;
      const benefits = document.getElementById('idea-benefits').value;
      
      // Here you would typically send this data to a server
      console.log('Idea submitted:', {
        title,
        category,
        description,
        benefits
      });
      
      // Show success message
      alert('Your idea has been submitted successfully!');
      
      // Reset form and close modal
      ideaForm.reset();
      document.getElementById('file-names').textContent = '';
      closeModal('idea-submission-modal');
    });
  }

  // File upload display
  const fileInput = document.getElementById('idea-attachments');
  if (fileInput) {
    fileInput.addEventListener('change', function() {
      const fileNames = document.getElementById('file-names');
      fileNames.textContent = '';
      
      if (this.files.length > 0) {
        const filesList = document.createElement('div');
        
        for (let i = 0; i < this.files.length; i++) {
          const fileItem = document.createElement('div');
          fileItem.textContent = `${i + 1}. ${this.files[i].name}`;
          filesList.appendChild(fileItem);
        }
        
        fileNames.appendChild(filesList);
      }
    });
  }

  // Upvote functionality
  document.querySelectorAll('.btn-upvote').forEach(btn => {
    btn.addEventListener('click', function() {
      const upvoteCount = this.querySelector('span');
      let count = parseInt(upvoteCount.textContent);
      
      if (this.classList.contains('active')) {
        // Already upvoted, remove upvote
        this.classList.remove('active');
        count--;
      } else {
        // Add upvote
        this.classList.add('active');
        count++;
      }
      
      upvoteCount.textContent = count;
    });
  });

  // Bookmark functionality
  document.querySelectorAll('.bookmark-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      this.classList.toggle('active');
      
      if (this.classList.contains('active')) {
        this.innerHTML = '<i class="fas fa-bookmark"></i> Saved';
      } else {
        this.innerHTML = '<i class="fas fa-bookmark"></i> Save';
      }
    });
  });

  // QR Code Scanner
  if (document.getElementById('qr-reader')) {
    const html5QrCode = new Html5Qrcode("qr-reader");
    const qrResult = document.getElementById('qr-reader-results');
    
    function onScanSuccess(decodedText, decodedResult) {
      // Handle the scanned code
      qrResult.innerHTML = `
        <div class="qr-result-success">
          <i class="fas fa-check-circle"></i>
          <p>Scanned successfully!</p>
          <p>Content: ${decodedText}</p>
        </div>
      `;
      
      // Stop scanning after success
      html5QrCode.stop().then(() => {
        console.log("QR Code scanning stopped.");
      }).catch(err => {
        console.log("Unable to stop scanning.", err);
      });
      
      // Close modal after 3 seconds
      setTimeout(() => {
        closeModal('qr-modal');
        qrResult.innerHTML = '';
      }, 3000);
    }
    
    function onScanFailure(error) {
      // Handle scan failure
      console.warn(`QR error = ${error}`);
    }
    
    // Start scanner when modal opens
    document.getElementById('qr-modal').addEventListener('click', function(e) {
      if (e.target === this || e.target.classList.contains('close-modal')) {
        html5QrCode.stop().catch(err => {
          console.log("Unable to stop scanning.", err);
        });
      }
    });
    
    // Start scanner
    const config = { fps: 10, qrbox: 250 };
    html5QrCode.start({ facingMode: "environment" }, config, onScanSuccess, onScanFailure)
      .catch(err => {
        console.log("Unable to start scanning.", err);
      });
  }
  
  // Join challenge functionality
  document.querySelectorAll('.join-challenge-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const challengeCard = this.closest('.challenge-card');
      const challengeId = challengeCard.dataset.challengeId;
      
      // Here you would typically send a request to join the challenge
      console.log(`Joined challenge ${challengeId}`);
      
      // Update button state
      this.textContent = 'Joined';
      this.classList.add('active');
      this.disabled = true;
    });
  });
  
  // User profile dropdown
  const userProfile = document.querySelector('.user-profile');
  if (userProfile) {
    userProfile.addEventListener('click', function(e) {
      e.stopPropagation();
      const profileMenu = this.querySelector('.profile-menu');
      profileMenu.classList.toggle('visible');
    });
  }
  
  // Close profile menu when clicking elsewhere
  document.addEventListener('click', function() {
    const profileMenu = document.querySelector('.profile-menu');
    if (profileMenu) profileMenu.classList.remove('visible');
  });
  
  // Logout functionality
  document.getElementById('logout-btn')?.addEventListener('click', function(e) {
    e.preventDefault();
    // Here you would typically handle logout
    alert('You have been logged out');
    // Redirect to login page
    // window.location.href = 'login.html';
  });
});

