document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM fully loaded and parsed');

  let currentUser = ''

  const loginForm = document.getElementById('login-form');
  if (!loginForm) {
    console.error('Login form not found');
    return;
  }

  loginForm.addEventListener('submit', async function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');
    const supportMessage = document.getElementById('support-message');

    if (!username || !password) {
      console.error('Username or password input element not found');
      return;
    }

    console.log('Username:', username);
    console.log('Password:', password);

    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password })
    });

    const result = await response.json();

    if (result.status === 'success') {
        currentUser = result.username;
###################        document.cookie = `username=${currentUser}; path=/;`;

      if (result.role === 'admin') {
        window.location.href = 'admin_page.html';
      } else if (result.role === 'user') {
        window.location.href = 'user_page.html';
      } else {
        errorMessage.textContent = 'Неправильные учетные данные или пользователь заблокирован';
        supportMessage.textContent = 'По вопросам доступа обращайтесь в Департамент сопровождения общебанковских централизованных систем';
        console.log('Не удалось выполнить вход: недопустимые учетные данные');
      }
    } else {
      errorMessage.textContent = 'Не удалось выполнить вход';
      supportMessage.textContent = 'По вопросам доступа обращайтесь в Департамент сопровождения общебанковских централизованных систем';
      console.log('Не удалось выполнить вход: непредвиденная ошибка');
    }
  });
});
