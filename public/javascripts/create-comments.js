// button toggle
function postButtonToggle() {
  const closeButton = document.querySelector('#cm-close');
  const addButton = document.querySelector('#cm-add');
  const form = document.querySelector('#comment-form');

  closeButton.classList.toggle('display-block');
  addButton.classList.toggle('display-hide');
  form.classList.toggle('display-block');
}

document.querySelector('#cm-add').addEventListener('click', postButtonToggle);
document.querySelector('#cm-close').addEventListener('click', postButtonToggle);

// Create a comment
async function newCommentSubmit(event) {
  event.preventDefault();

  const comment_text = document.querySelector('#comment-input').value;
  const post_id = window.location.toString().split('/')[
    window.location.toString().split('/').length-1
  ];

  if(comment_text && post_id) {
    const respose = await fetch('/api/comments', {
      method: 'POST',
      body: JSON.stringify({
        post_id,
        comment_text
      }),
      headers: {
        'Content-Type' : 'application/json'
      }
    });

    if(respose.ok) {
      document.location.reload();
    } else {
      alert(respose.statusText);
    }

  }
}

document.querySelector('#comment-form').addEventListener('submit', newCommentSubmit);