document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');

  // add an event listener to the compose form
  document.querySelector('form').addEventListener('submit', () => {
    // call the send_mail function
    send_mail();
    // console.log('form submitted');
  });

});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // Get the Emails in the mailbox
  fetch(`/emails/${mailbox}`).then(response => response.json())
  .then(emails => {
    // print the emails
    console.log(emails);

    // show the emails in the mailbox
    emails.forEach(email => {
      list_email(email);
    });
  });

}

function send_mail() {
  // test if the function is being called
  console.log('send mail function called.');

  /**
   * Make POST request to /emails, passing values for
   *  -recipients
   *  -subject
   *  -body 
   */
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      // recipients: document.querySelector('#compose-recipients').value,
      // subject: document.querySelector('#compose-subject').value,
      // body: document.querySelector('#compose-body').value

      // test sample data
      recipients: 'abc@email.com',
      subject: 'Meeting time',
      body: 'How about we meet tomorrow at 3pm?'
    })
  }).then(response => response.json()).then(result => {
    // print the result to the console
    console.log(result);
  });

  // Load the 'sent' mailbox
  load_mailbox('sent');
}

function list_email(email) {
  // show an email in the email-view

  // create a container for the email
  const mail = document.createElement('div');
  mail.className = 'email_container';
  mail.innerHTML = email;

  // append it to the email-view
  document.querySelector('#emails-view').append(mail);
}