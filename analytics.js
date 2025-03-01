document.getElementById('view-analytics').addEventListener('click', () => {
  document.querySelectorAll('#main-content > div').forEach(el => el.classList.add('hidden'));
  document.getElementById('analytics').classList.remove('hidden');

  let views = localStorage.getItem('ar-views') ? parseInt(localStorage.getItem('ar-views')) : 0;
  views++;
  localStorage.setItem('ar-views', views);
  document.getElementById('views').textContent = views;

  fetch('https://ipapi.co/json/')
    .then(response => response.json())
    .then(data => {
      document.getElementById('location').textContent = data.city + ', ' + data.country;
    })
    .catch(error => {
      document.getElementById('location').textContent = 'Не удалось определить';
      console.error('Ошибка геолокации:', error);
    });
});
