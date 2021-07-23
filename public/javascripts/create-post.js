// button toggle
function postButtonToggle() {
  const closeButton = document.querySelector('#cp-close');
  const addButton = document.querySelector('#cp-add');
  const form = document.querySelector('#post-form');

  closeButton.classList.toggle('display-block');
  addButton.classList.toggle('display-hide');
  form.classList.toggle('display-block');
}

document.querySelector('#cp-add').addEventListener('click', postButtonToggle);
document.querySelector('#cp-close').addEventListener('click', postButtonToggle);


async function newPostSubmit(event) {
  event.preventDefault();

  console.log('button clicked');

  const title = document.querySelector('#title-input').value;
  const content = document.querySelector('#content-input').value;

  console.log(title,content);
  const respose = await fetch('/api/posts', {
    method: 'POST',
    body: JSON.stringify({
      title,
      content
    }),
    headers: {
      'Content-Type' : 'application/json'
    }
  });

  console.log(respose);
  if(respose.ok) {
    document.location.replace('/dashboard');
  } else {
    alert(respose.statusText);
  }
}

document.querySelector('#post-form').addEventListener('submit', newPostSubmit);