const addImageBtn = document.getElementById('add-image-btn')
const gallery = document.getElementById('gallery')
addImageBtn.addEventListener('click', () => {
    const img = document.createElement('img')
    img.src =
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRF1IwK6-SxM83UpFVY6WtUZxXx-phss_gAUfdKbkTfau6VWVkt'
    gallery.appendChild(img)
})
