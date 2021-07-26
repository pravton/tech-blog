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

// change the file name when uploading
const fileInput = document.querySelector('#file-input');
fileInput.onchange = () => {
  document.querySelector('#file-name').textContent = fileInput.files[0].name;
}

// new for submit form
async function newPostSubmit(event) {
  event.preventDefault();

  const form = document.querySelector('#post-form');
  const formData = new FormData(form);
  const respose = await fetch('/api/posts', {
    method: 'POST',
    body:formData 
  });

  console.log('this is response' , respose);
  if(respose.ok) {
    document.location.replace('/dashboard');
  } else {
    alert(respose.statusText);
  }
}

document.querySelector('#post-form').addEventListener('submit', newPostSubmit);