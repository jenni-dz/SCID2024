document.addEventListener('DOMContentLoaded', () => {
    const slider = document.getElementById('slider');
    const handle = document.getElementById('handle');
    const filterValueElement = document.getElementById('filterValue');

    let sliderRect = slider.getBoundingClientRect();
    let dragging = false;
    let animationFrameRequested = false;

    function updateFilterValue(positionY) {
        const min = sliderRect.top;
        const max = sliderRect.bottom;
        const range = max - min;

        // Limit the position to the slider boundaries
        if (positionY < min) positionY = min;
        if (positionY > max) positionY = max;

        // Calculate the filter value (0 to 100)
        const value = Math.round((1 - (positionY - min) / range) * 100);
        filterValueElement.textContent = value;

        // Adjust handle position
        handle.style.top = `${((positionY - min) / range) * 100}%`;

        // Adjust filter value element position
        const handleRect = handle.getBoundingClientRect();
        filterValueElement.style.top = `${handleRect.top - filterValueElement.offsetHeight}px`;
    }

    function updateFilterValueThrottled(positionY) {
        if (!animationFrameRequested) {
            requestAnimationFrame(() => {
                updateFilterValue(positionY);
                animationFrameRequested = false;
            });
            animationFrameRequested = true;
        }
    }

    handle.addEventListener('mousedown', (e) => {
        dragging = true;
        sliderRect = slider.getBoundingClientRect(); // Update the slider's rect
    });

    document.addEventListener('mousemove', (e) => {
        if (dragging) {
            updateFilterValueThrottled(e.clientY);
        }
    });

    document.addEventListener('mouseup', () => {
        dragging = false;
    });

    // Adjust handle position initially
    updateFilterValue(sliderRect.bottom); // Start at the bottom (0 value)

    // Update filter value when clicking on the slider
    slider.addEventListener('click', (e) => {
        const mouseY = e.clientY;
        updateFilterValue(mouseY);
    });

    // Adicionando o controle de clique para abrir a seleção de arquivo ao clicar no ícone de adicionar imagem
    document.getElementById('add-image-icon').addEventListener('click', function() {
        document.getElementById('file-input').click();
    });

    // Adicionando o controle de evento de mudança para processar a imagem selecionada
    document.getElementById('file-input').addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const imgContainer = document.createElement('div');
                imgContainer.classList.add('image-item'); // Adicionando uma classe para cada item de imagem
                const img = document.createElement('img');
                img.src = e.target.result;
                imgContainer.appendChild(img);
                document.getElementById('image-container').insertBefore(imgContainer, document.getElementById('add-image'));
                // Adicionando um ouvinte de evento para selecionar a imagem ao clicar nela
                imgContainer.addEventListener('click', function() {
                    // Alternar a classe 'selected' na imagem clicada
                    imgContainer.classList.toggle('selected');
                });
                // Adicionando um ouvinte de evento para remover a imagem ao clicar no ícone de exclusão
                const removeIcon = document.createElement('i');
                removeIcon.classList.add('remove-icon');
                removeIcon.classList.add('fa-solid');
                removeIcon.classList.add('fa-times-circle'); // Alterando para o ícone "x" vermelho
                removeIcon.style.color = 'red'; // Definindo a cor vermelha
                removeIcon.style.fontSize = '1.5em'; // Ajustando o tamanho do ícone
                imgContainer.appendChild(removeIcon);
                removeIcon.addEventListener('click', function() {
                    if (imgContainer.classList.contains('selected')) {
                        imgContainer.remove();
                    } else {
                        // Remover a imagem próxima na sequência
                        const selectedImage = document.querySelector('.image-item.selected');
                        if (selectedImage) {
                            selectedImage.remove();
                        }
                    }
                });
            };
            reader.readAsDataURL(file);
        }
    });

    // Seletor para o botão "TODAS"
    const selectAllButton = document.getElementById('selectAllImages');

    // Adicionando um ouvinte de evento de clique ao botão "TODAS"
    selectAllButton.addEventListener('click', () => {
        // Selecionando todas as imagens
        const images = document.querySelectorAll('.image-item');
        images.forEach(image => {
            image.classList.add('selected');
            image.classList.remove('hidden');
        });
    });

    // Seletor para o botão "SOMENTE SELECIONADAS"
    const selectOnlyButton = document.querySelector('.imagem-button:not(#selectAllImages)');

    // Adicionando um ouvinte de evento de clique ao botão "SOMENTE SELECIONADAS"
    selectOnlyButton.addEventListener('click', () => {
        // Tornar todas as imagens visíveis novamente
        const images = document.querySelectorAll('.image-item');
        images.forEach(image => {
            image.classList.remove('hidden');
        });
    });
});
