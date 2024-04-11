document.getElementById('start-game').addEventListener('click', function () {
    window.location.href = 'index.html'; // The path to your game HTML file
    document.addEventListener('DOMContentLoaded', () => {
        const container = document.createElement('div');
        container.className = 'background-container';
        document.body.appendChild(container);

        for (let i = 8315; i < 8377; i++) {
            const imgDiv = document.createElement('div');
            imgDiv.style.backgroundImage = `url('IMG_${i + 1}.png')`;
            // Random positioning
            imgDiv.style.position = 'absolute';
            imgDiv.style.left = `${Math.random() * 100}%`;
            imgDiv.style.top = `${Math.random() * 100}%`;
            container.appendChild(imgDiv);
        }
    });

});
