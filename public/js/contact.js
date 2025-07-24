'use strict';

document.addEventListener('DOMContentLoaded', function () {
  const contactForm = document.querySelector('.contact-form');

  if (!contactForm) return;

  contactForm.addEventListener('submit', function (e) {
    const name = document.getElementById('sender_name');
    const email = document.getElementById('sender_email');
    const message = document.getElementById('message_content');

    let isValid = true;

    if (!name.value.trim()) {
      document.getElementById('name-error').style.display = 'block';
      name.style.borderColor = 'red';
      isValid = false;
    } else {
      document.getElementById('name-error').style.display = 'none';
      name.style.borderColor = '';
    }

    if (!email.value.trim() || !email.validity.valid) {
      document.getElementById('email-error').style.display = 'block';
      email.style.borderColor = 'red';
      isValid = false;
    } else {
      document.getElementById('email-error').style.display = 'none';
      email.style.borderColor = '';
    }

    if (!message.value.trim()) {
      document.getElementById('message-error').style.display = 'block';
      message.style.borderColor = 'red';
      isValid = false;
    } else {
      document.getElementById('message-error').style.display = 'none';
      message.style.borderColor = '';
    }

    if (!isValid) {
      e.preventDefault(); // prevent form submission
    }
  });
});
