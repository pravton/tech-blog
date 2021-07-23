async function deletePostHandler(event) {
  event.preventDefault();

  const id = document.querySelector('#post-delete').getAttribute('post-id');
  console.log(id);

  const response = await fetch(`/api/posts/${id}`, {
    method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
  }); 

  if(response.ok) {
    document.location.reload();
  } else {
    alert(response.statusText);
  }

}

document.querySelector('#post-delete').addEventListener('click', deletePostHandler);