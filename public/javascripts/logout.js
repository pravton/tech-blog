// logout functionality
async function logout() {
  const response = await fetch('/api/users/logout', {
    method: 'post',
    headers: {'Content-Typr': 'application/json'},
  });

  if(response.ok) {
    document.location.replace('/');
  } else {
    alert(response.statusText);
  }
};

if(document.querySelector('#logout')) {
  document.querySelector('#logout').addEventListener('click', logout);
};

