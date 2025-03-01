document.getElementById('create-project').addEventListener('click', () => {
  document.querySelectorAll('#main-content > div').forEach(el => el.classList.add('hidden'));
  document.getElementById('editor').classList.remove('hidden');

  const dragArea = document.getElementById('drag-area');
  const previewArea = document.getElementById('preview-area');

  dragArea.querySelectorAll('.draggable').forEach(item => {
    item.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', e.target.dataset.type);
    });
  });

  previewArea.addEventListener('dragover', (e) => {
    e.preventDefault();
  });

  previewArea.addEventListener('drop', (e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('text/plain');
    let element = null;

    switch (type) {
      case 'image':
        element = document.createElement('input');
        element.type = 'file';
        element.accept = 'image/*';
        element.addEventListener('change', (event) => {
          const file = event.target.files[0];
          const img = document.createElement('img');
          img.src = URL.createObjectURL(file);
          img.style.maxWidth = '100px';
          previewArea.appendChild(img);
        });
        element.click();
        break;
      case '3d':
        element = document.createElement('input');
        element.type = 'file';
        element.accept = '.gltf,.glb';
        element.addEventListener('change', (event) => {
          const file = event.target.files[0];
          const model = document.createElement('div');
          model.textContent = '3D-модель загружена (не отображается)';
          model.style.color = '#007bff';
          previewArea.appendChild(model);
        });
        element.click();
        break;
      case 'text':
        const text = prompt('Введите текст для AR:');
        if (text) {
          const textDiv = document.createElement('div');
          textDiv.textContent = text;
          textDiv.style.color = '#000';
          textDiv.style.maxWidth = '100px';
          previewArea.appendChild(textDiv);
        }
        break;
    }
  });

  document.getElementById('save-project').addEventListener('click', () => {
    const projectData = Array.from(previewArea.children).map(el => el.outerHTML).join('\n');
    localStorage.setItem('ar-project', projectData);
    alert('Проект сохранён локально!');
  });
});
