document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM fully loaded and parsed');

  const loginForm = document.getElementById('login-form');
  if (!loginForm) {
    console.error('Login form not found');
    return;
  }

  loginForm.addEventListener('submit', function(event) {
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

    const correctUsername = 'rory';
    const correctPassword = '5555';

    const adminUsername = 'admin';
    const adminPassword = '12345';

    if (username === adminUsername && password === adminPassword) {
    window.location.href = 'admin_page.html';
  } else if (username === correctUsername && password === correctPassword) {
    window.location.href = 'user_page.html';
  } else {
    errorMessage.textContent = 'Не удалось подключиться/пользователь заблокирован';
    supportMessage.textContent = 'По вопросам доступа обращайтесь в Департамент сопровождения общебанковских централизованных систем';
    console.log('Login failed: Invalid credentials');
  }
  });
});
