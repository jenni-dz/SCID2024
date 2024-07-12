document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('file-input');
    const imageContainer = document.getElementById('image-container');
    const addImageIcon = document.getElementById('add-image');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    let currentIndex = 0;

    // Adicionando o controle de clique para abrir a seleção de arquivo ao clicar no ícone de adicionar imagem
    document.getElementById('add-image-icon').addEventListener('click', function() {
        fileInput.click();
    });

    // Adicionando o controle de evento de mudança para processar a imagem selecionada
    fileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const imgContainer = document.createElement('div');
                imgContainer.classList.add('image-item');
                const img = document.createElement('img');
                img.src = e.target.result;
                imgContainer.appendChild(img);
                const removeIcon = document.createElement('i');
                removeIcon.classList.add('remove-icon', 'fa-solid', 'fa-times-circle');
                imgContainer.appendChild(removeIcon);
                imageContainer.insertBefore(imgContainer, addImageIcon);

                if (imageContainer.querySelectorAll('.image-item').length === 1) {
                    imgContainer.classList.add('active');
                }

                // Adicionando um ouvinte de evento para remover a imagem ao clicar no ícone de exclusão
                removeIcon.addEventListener('click', function() {
                    const items = imageContainer.querySelectorAll('.image-item');
                    const indexToRemove = Array.from(items).indexOf(imgContainer);

                    if (imgContainer.classList.contains('active')) {
                        if (currentIndex === indexToRemove) {
                            currentIndex = (currentIndex === items.length - 1) ? currentIndex - 1 : currentIndex;
                        }
                        updateActiveImage();
                    }
                    imgContainer.remove();

                    if (document.querySelectorAll('.image-item').length === 0) {
                        document.getElementById('add-image').style.display = 'block';
                    }
                    updateActiveImage();
                });

                // Adicionando um ouvinte de evento para selecionar a imagem ao clicar nela
                imgContainer.addEventListener('click', function() {
                    imgContainer.classList.toggle('selected');
                });

                updateActiveImage();
            };
            reader.readAsDataURL(file);
        }

        // Limpar o valor do input de arquivo para garantir que o evento change seja disparado sempre
        this.value = null;
    });

    function updateActiveImage() {
        const items = imageContainer.querySelectorAll('.image-item');
        items.forEach((item, index) => {
            item.classList.toggle('active', index === currentIndex);
        });
    }

    prevButton.addEventListener('click', () => {
        const items = imageContainer.querySelectorAll('.image-item');
        if (items.length > 0) {
            currentIndex = (currentIndex - 1 + items.length) % items.length;
            updateActiveImage();
        }
    });

    nextButton.addEventListener('click', () => {
        const items = imageContainer.querySelectorAll('.image-item');
        if (items.length > 0) {
            currentIndex = (currentIndex + 1) % items.length;
            updateActiveImage();
        }
    });
});
