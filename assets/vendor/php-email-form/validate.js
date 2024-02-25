(function () {
  "use strict";

  let forms = document.querySelectorAll('.php-email-form');

  forms.forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      let thisForm = this;

      let action = thisForm.getAttribute('action');
      let recaptcha = thisForm.getAttribute('data-recaptcha-site-key');

      if (!action) {
        displayError(thisForm, 'The form action property is not set!');
        return;
      }

      // Show loading spinner
      thisForm.querySelector('.loading').classList.add('d-block');
      // Hide previous error/success messages
      thisForm.querySelector('.error-message').classList.remove('d-block');
      thisForm.querySelector('.sent-message').classList.add('d-block');

      let formData = new FormData(thisForm);

      if (recaptcha) {
        // Check if reCaptcha is loaded
        if (typeof grecaptcha !== "undefined") {
          grecaptcha.ready(function () {
            try {
              grecaptcha.execute(recaptcha, {
                action: 'php_email_form_submit'
              }).then(token => {
                formData.set('recaptcha-response', token);
                php_email_form_submit(thisForm, action, formData);
              });
            } catch (error) {
              displayError(thisForm, error);
            }
          });
        } else {
          displayError(thisForm, 'The reCaptcha JavaScript API is not loaded!')
        }
      } else {
        php_email_form_submit(thisForm, action, formData);
      }
    });
  });

  function php_email_form_submit(thisForm, action, formData) {
    fetch(action, {
        method: 'POST',
        body: formData,
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      })
      .then(response => {
        if (response.ok) {
          return response.text();
        } else {
          throw new Error(`${response.status} ${response.statusText} ${response.url}`);
        }
      })
      .then(data => {
        // Hide loading spinner
        thisForm.querySelector('.loading').classList.remove('d-block');
        if (data.trim() == 'OK') {
          // Show success message and reset form
          thisForm.querySelector('.sent-message').classList.add('d-block');
          thisForm.reset();
        } else {
          throw new Error(data ? data : 'Form submission failed and no error message returned from: ' + action);
        }
      })
      .catch((error) => {
        // Display error message
        displayError(thisForm, error);
      });
  }

  function displayError(thisForm, error) {
    // Hide loading spinner
    thisForm.querySelector('.loading').classList.remove('d-block');
    // Display error message
    thisForm.querySelector('.error-message').innerHTML = error;
    thisForm.querySelector('.sent-message').classList.add('d-block');
  }

})();
