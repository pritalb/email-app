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
      recipients: document.querySelector('#compose-recipients').value,
      subject: document.querySelector('#compose-subject').value,
      body: document.querySelector('#compose-body').value

      // test sample data
      // recipients: 'abc@email.com',
      // subject: 'Meeting time',
      // body: 'How about we meet tomorrow at 3pm?'
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
  console.log('list_email function called');

  // create a container for the email
  const mail = document.createElement('div');

  // create the email title
  const name = document.createElement('h3');
  name.innerHTML = email.subject;
  
  // create a div to show sender, recipient and timestamp info
  const info_container = document.createElement('div');

  const timestamp = document.createElement('div');
  timestamp.innerHTML = 'On: ' + email.timestamp;

  const sender_name = document.createElement('div');
  sender_name.innerHTML = 'From: ' + email.sender;

  const recipients_name = document.createElement('div');
  recipients_name.innerHTML = 'To: ' + JSON.parse(JSON.stringify(email.recipients));
  
  info_container.append(sender_name);
  info_container.append(recipients_name);
  info_container.append(timestamp);

  mail.append(name);
  mail.append(info_container);

  // add an event listener to the div to listen for click event
  mail.addEventListener('click', () => {
    // clicked on the email
    // open the email
    open_mail(email.id);
  });

  // create a div to contain the mails and the buttons. since both the mails and the buttons would have their own click events, we dont want them to overlap
  const mail_container = document.createElement('div');
  mail_container.className = 'email_container';
  mail_container.append(mail);

  if (email.read) {
    mail_container.style.backgroundColor = '#CECECE';
  } else {
    mail_container.style.backgroundColor = '#FFFFFF';
  }

  // add a button to archive/unarchive the email
  if (email.archived) {
    const button = document.createElement('button');
    button.innerHTML = 'Unarchive';
    button.className = 'btn btn-sm btn-outline-primary email_button';

    button.addEventListener('click', () => {
      unarchive(email.id);
    })

    mail_container.append(button);
  } else {
    const button = document.createElement('button');
    button.innerHTML = 'Archive';
    button.className = 'btn btn-sm btn-outline-primary email_button';

    button.addEventListener('click', () => {
      archive(email.id);
    })

    mail_container.append(button);
  }

  // add a reply button to the email
  const reply_button = document.createElement('button');
  reply_button.innerHTML = 'Reply';
  reply_button.className = 'btn btn-sm btn-outline-primary email_button';

  reply_button.addEventListener('click', () => {
    reply(email);
  });
  mail_container.append(reply_button);
  

  // append it to the email-view
  document.querySelector('#emails-view').append(mail_container);
}

function open_mail(email_id) {
  // open the email with the id: email_id
  fetch(`/emails/${email_id}`).then(response => response.json())
  .then(email => {
    // print email
    console.log(email);

    // show the email in its own view
    show_email(email);

    // set its read attribute to true
    read(email.id);
  });
}

function show_email(email) {
  // create a new div to store the email
  const mail = document.createElement('div');
  mail.className = 'container-mid';

  // clear the emails-view and set it to email container
  document.querySelector('#emails-view').innerHTML = '';
  document.querySelector('#emails-view').append(mail);

  const subject_container = document.createElement('div');
  subject_container.className = 'container-small';

  const sender_container = document.createElement('div');
  sender_container.className = 'container-small';

  const recipients_container = document.createElement('div');
  recipients_container.className = 'container-small';

  const timestamp_container = document.createElement('div');
  timestamp_container.className = 'container-small';

  const email_body = document.createElement('div');
  email_body.className = 'container-small';

  subject_container.innerHTML = 'Subject: ' + email.subject;
  sender_container.innerHTML = 'From: ' + email.sender;
  recipients_container.innerHTML = 'To: ' + JSON.parse(JSON.stringify(email.recipients));
  timestamp_container.innerHTML = 'On: ' + email.timestamp;
  email_body.innerHTML = email.body;

  mail.append(subject_container);
  mail.append(sender_container);
  mail.append(recipients_container);
  mail.append(timestamp_container);
  mail.append(email_body);
}

function read(email_id) {
  // set an email to read
  fetch(`/emails/${email_id}`, {
    method: 'PUT',
    body: JSON.stringify({
      read: true
    })
  });

  console.log('read function called');
}

function archive(email_id) {
  // set an email to read
  fetch(`/emails/${email_id}`, {
    method: 'PUT',
    body: JSON.stringify({
      archived: true
    })
  });

  // load the inbox
  load_mailbox('archive');
}

function unarchive(email_id) {
  // set an email to read
  fetch(`/emails/${email_id}`, {
    method: 'PUT',
    body: JSON.stringify({
      archived: false
    })
  });

  // load the inbox
  load_mailbox('inbox');
}

function reply(email) {
  // reply to the email
  console.log('reply function called on email titled ', email.subject);

  // load the compose email form
  compose_email();

  // prefill the necessary data
  document.querySelector('#compose-recipients').value = email.sender;
  document.querySelector('#compose-subject').value = 'Re: ' + email.subject;
  document.querySelector('#compose-body').value = 'On ' + email.timestamp + ', ' + email.sender + ' wrote: ' + email.body;

}