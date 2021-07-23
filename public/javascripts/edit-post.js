// close button handler
document.querySelector('#edit-close').addEventListener('click', () => {
  document.location.replace('/dashboard');
});

// add the data value to textarea
document.addEventListener('DOMContentLoaded', () => {
  const contentEl = document.querySelector('#content-input');
  const content = contentEl.getAttribute('data');
  
  return contentEl.innerHTML = content;
});

// edit a post
async function editPostHandler(event) {
  event.preventDefault();

  const id = document.location.toString().split('/')[
    document.location.toString().split('/').length-1
  ];

  const title = document.querySelector('#title-input').value;
  const content = document.querySelector('#content-input').value;

  const response = await fetch(`/api/posts/${id}`, {
    method: 'PUT',
      body: JSON.stringify({
        title,
        content
      }),
      headers: {
        'Content-Type': 'application/json'
      }
  }); 

  if(response.ok) {
    document.location.replace('/dashboard');
  } else {
    alert(response.statusText);
  }

}

document.querySelector('.edit-form').addEventListener('submit', editPostHandler);