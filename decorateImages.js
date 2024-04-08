;(function decorateImages() {
    let inputField = null
    let selectedImage = null
    createInputDialog()

    async function process() {
        const images = Array.from(document.getElementsByTagName('img'))
        const altRandomWords = await getRandomWords(images.length)

        images.forEach((img, index) => {
            if (!img.getAttribute('data-processed')) {
                img.setAttribute('data-processed', 1)
                img.setAttribute('alt', altRandomWords[index])
                highlightImg(img)
                img.addEventListener('click', onImageClick)
            }
        })
    }

    const observer = new MutationObserver((mutations) => {
        mutations.forEach(async (mutation) => {
            if (mutation.type === 'childList') {
                const isImagesAdded = Array.from(mutation.addedNodes).some(
                    (node) => node.tagName === 'IMG'
                )
                if (isImagesAdded) {
                    process()
                }
            }
        })
    })

    observer.observe(document.body, { childList: true, subtree: true })

    process()

    function onImageClick(event) {
        if (event.target === selectedImage) {
            unhighlightSelectedImg()
            highlightImg(selectedImage)
            selectedImage = null
            hideInput()
            return
        }
        if (selectedImage) {
            unhighlightSelectedImg()
            highlightImg(selectedImage)
        }
        selectedImage = event.target
        highlightSelectedImg()
        setInputValue()
        showInput()
        inputField.focus()
    }

    function highlightSelectedImg() {
        selectedImage.style.border = '2px solid rgb(0, 38, 255)'
        selectedImage.style.boxShadow = '4px 3px 5px rgba(0, 38, 255, 0.5)'
    }

    function unhighlightSelectedImg() {
        if (selectedImage) {
            selectedImage.style.border = ''
            selectedImage.style.boxShadow = ''
        }
    }

    function highlightImg(img) {
        img.style.cursor = 'pointer'
        img.style.border = '2px solid rgb(255, 0, 0)'
        img.style.boxShadow = '4px 3px 5px rgba(255, 0, 0, 0.5)'
    }

    function setFocusedInputStyles() {
        inputField.style.outline = '2px solid #425cfb'
        inputField.style.boxShadow = '4px 3px 5px rgba(0, 38, 255, 0.5)'
    }

    function setInputValue() {
        const altAttribute = selectedImage.getAttribute('alt')
        inputField.value = altAttribute ? altAttribute : ''
    }

    function hideInput() {
        const styles = {
            display: 'none',
        }

        Object.assign(inputField.style, styles)
    }

    function showInput() {
        const screenWidth = window.innerWidth
        const screenHeight = window.innerHeight
        const inputWidth = 200

        const styles = {
            display: 'block',
            position: 'fixed',
            top: screenHeight / 2 - 25 + 'px',
            left: screenWidth / 2 - inputWidth / 2 + 'px',
            width: inputWidth + 'px',
        }

        Object.assign(inputField.style, styles)
    }

    function onInputDialogClose(event) {
        if (event.key === 'Enter' || event.key === 'Escape') {
            unhighlightSelectedImg()
            highlightImg(selectedImage)
            selectedImage = null
            hideInput()
        }
    }

    function createInputDialog() {
        inputField = document.createElement('input')

        inputField.addEventListener('focus', setFocusedInputStyles)
        inputField.addEventListener('input', changeAltText)
        inputField.addEventListener('keydown', onInputDialogClose)

        inputField.type = 'text'
        const inputFieldStyles = {
            display: 'none',
            position: 'fixed',
            padding: '20px',
            boxSizing: 'border-box',
        }
        Object.assign(inputField.style, inputFieldStyles)
        document.body.appendChild(inputField)
    }

    function changeAltText() {
        selectedImage.setAttribute('alt', inputField.value)
    }

    async function getRandomWords(wordsCount) {
        if (wordsCount) {
            try {
                const res = await fetch(
                    `https://random-word-api.herokuapp.com/word?number=${wordsCount}`
                )
                const randomWords = await res.json()
                return randomWords
            } catch (error) {
                console.log(error)
            }
        }
        return []
    }
})()
