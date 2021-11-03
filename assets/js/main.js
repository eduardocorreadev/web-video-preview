
console.log('❤️️') // Thanks :)

/* ========================================= */
/* Area for creating new videos for preview */
/* ======================================= */
let videoDisplayArea = document.getElementById('video-display-area') // Getting video display area
let videoCreationPlace = document.getElementById('video-creation-place') // Getting creation area

// Open video creation area
document.querySelector('#btn-open-creation-area button').addEventListener('click', () => { 
    videoDisplayArea.style.display = 'none'
    videoCreationPlace.style.display = 'block'
})

// Close video creation area
document.getElementById('button-cancel').addEventListener('click', () => { 
    videoDisplayArea.style.display = 'block'
    videoCreationPlace.style.display = 'none'
})

// Button that will get all form items, validate and add a new video to the preview
document.getElementById('submit-create').addEventListener('click', event => { 
    event.preventDefault()

    let videoCreationForm = document.getElementById('video-creation-form') // Getting video creation form for the preview

    let titleVideo = videoCreationForm.title_video.value // Title Video Value
    let nameChannel = videoCreationForm.name_channel.value // Name Channel Value
    let durationVideo = videoCreationForm.duration_video.value // Video Duration Value
    let videoId = videoCreationForm.video_id.value // Video ID Value
    let startVideo = Math.floor(Math.random() * (durationVideo - 0)) + 0 // The duration value was obtained and a math was created to obtain the random value

    // Check that the main fields are not empty
    if (!(titleVideo == '' && durationVideo == '' && startVideo == '' && videoId == '')) {

        if (nameChannel == '') nameChannel = 'Não informado!' // The channel name is not required, so if not filled in, a default value will be added

        // Trying to get the item: 'list-videos' present inside the localStorage, if it doesn't find it means it doesn't exist, so it takes an empty array. (JSON)
        let listVideos = JSON.parse(localStorage.getItem('list-videos') || '[]') 

        // With the Array, whether it is empty or not, it will push with the data received in the form.
        listVideos.push({titleVideo, nameChannel, durationVideo, startVideo, videoId})

        localStorage.setItem('list-videos', JSON.stringify(listVideos)) // Adding a array in localStorage named: list-videos

    } else {
        // VALIDAR ERROS DOS INPUTS DEPOIS
        console.log('Falha!')
    }

})

/* ===================================== */
/* Getting videos and displaying in html*/
/* =================================== */
let videosRender = JSON.parse(localStorage.getItem('list-videos')) // Getting all values ​​present in localStorage with key 'list-videos'
let localVideos = document.getElementById('videos') // Element where all videos are displayed

// Get each element from 'videoRender' and add in 'video'
videosRender.map(video => { 
    let addVideo = `
        <div class="video-item" draggable="true">
            <div class="screen">
                <div class="video-block-action"></div>
                    <iframe
                        src="https://www.youtube.com/embed/${video.videoId}?controls=0&disablekb=1&fs=0&rel=0&start=${video.startVideo}"
                        title="YouTube video player" frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen>
                    </iframe>
                <div class="timer-video-preview"></div>
            </div>
            <div class="info-video">
                <h3>${video.titleVideo}</h3>
                <span>${video.durationVideo} Segundos</span>
                <p>Por: <span>${video.nameChannel}</span></p>
            </div>
        </div>
        `
    localVideos.innerHTML += addVideo // Adding the video to the html
})


/* ================================================*/ 
/* Preview and delete videos with 'drag and drop' */ 
/* ============================================= */ 
const cards = document.querySelectorAll('div.video-item') // Getting all videos with class 'video-item'

// Counting and displayed on the button the amount of 'video-item' found.
document.querySelector('.btn-open-creation-area button span').innerHTML = `(${cards.length})`

// Get all videos inside 'cards' and separate each one into 'card'
cards.forEach(card => {
    let iframeElement = card.querySelector('iframe') // Getting 'iframeElement' inside the 'card'
    let iframeElementSaveSrc = iframeElement.src // A variable to save the initial state of the 'iframeElement', considering that it will undergo modifications.
    let loadPreview = card.querySelector('.timer-video-preview') // Getting progress bar inside the 'card'
    let timeHoverVideo, timePreview; // Variables for using setTimeout()

    /* Function will check if '&autoplay=1' does not already exist, if not, will add to url. To start the progress bar, an 'on' class will be added. 
    After 30s a 'removePreview()' function will be called. */
    function addPreview(index) { // The 'index' is to mark the position of '&autoplay' in the url 
        if (!iframeElement.src.split('&')[index]) {
            iframeElement.src = iframeElement.src + '&autoplay=1'
            loadPreview.classList.add('on')

            timePreview = setTimeout(() => {
                removePreview()
            }, 30000)
        }
    }

    /* The function will go back to url in its initial phase and removing the 'on' class added in the 'addPreview()' function.
    To confirm, setTimeout() has been reset */
    function removePreview() {
        iframeElement.src = iframeElementSaveSrc // (Variable that was created to save the initial state of the url)
        loadPreview.classList.remove('on')

        clearTimeout(timeHoverVideo)
        clearTimeout(timePreview)
    }

    /* When the mouse enters the area, it will create a setTimeout of 1s and call the function
    addPreview with index 5.*/
    card.addEventListener('mouseenter', () => {
        timeHoverVideo = setTimeout(() => {
            addPreview(5)
        }, 1000);
    })

    /* When the mouse leaves the area, it will remove everything with the 'removePreview()' function */
    card.addEventListener('mouseleave', removePreview)

    /* If the browser tab has been changed while Preview is active, it will remove everything with the 'removePreview()' function */
    window.addEventListener('blur', removePreview)
    

    /* ===================================================================================*/
    /* Using the same 'cards', the 'DRAG and DROP' will be created to delete the videos. */
    /* ================================================================================ */ 
    const dropzoneElement = document.getElementById('trash-dropzone') // Element where the video will be dropped
    const screenDelItem = document.getElementById('screen-del-item') // Screen of animation of video successfully deleted

    /* When the drag starts, this function will be called.
    It will add a class named: 'is-dragging' which will be used
    further ahead and will show and change image of drop area.
    Lastly, calling removePreview() to not start the video while dragging. */
    card.addEventListener('dragstart', event => {
        event.target.classList.add('is-dragging')

        dropzoneElement.style.display = 'block'
        dropzoneElement.src = 'assets/icons/trash-closed.svg'

        removePreview()
    })

    /* When the video being dragged is dropped, this function will be called.
    It will remove the 'is-dragging' class and hide the drop element. */
    card.addEventListener('dragend', event => {
        event.target.classList.remove('is-dragging')
        dropzoneElement.style.display = 'none'
    })

    /* When the drop area identifies a video about it that can be dropped. **/
    dropzoneElement.addEventListener('dragover', event => {
        event.preventDefault()
        dropzoneElement.src = 'assets/icons/trash-open.svg' //Changing the image to an open version.
    })

    /*  When the drop area identifies that the video that can be dropped has left the area  */
    dropzoneElement.addEventListener('dragleave', () => {
        dropzoneElement.src = 'assets/icons/trash-closed.svg' // Changing the image to a closed version
    })

    // When the video is finally dropped into the drop area.
    // The function will check if where it was dropped is really a drop area.
    // A class called 'on-screen-del' will be created for the 'video successfully deleted' screen.
    // With this screen, an animation be called, then in the next function with the 'animationend' event, it will be checked
    // if rotated animation was: 'slide-top', if so, class: 'on-screen-del' will be removed
    dropzoneElement.addEventListener('drop', event => {
        event.preventDefault()

        if (event.target.className == dropzoneElement.className) {
            document.querySelector('.is-dragging').style.display = 'none'
            screenDelItem.classList.add('on-screen-del')

            screenDelItem.addEventListener('animationend', event => {
                if (event.animationName === 'slide-top') {
                    screenDelItem.classList.remove('on-screen-del')

                    // CONTINUE...
                    
                }
            })
        }
    })

})

