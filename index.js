
const touchArea = document.getElementById("touch-area")
const swipeContent = document.querySelector(".swipe-content")
const swiper = document.querySelector(".swiper-container")
// Initial mouse X and Y positions are 0
let mouseX, initialX = 0;
let mouseY, initialY = 0;
let isSwiped;
let isUp = false
let isLeft = false
let defaultSwipeContentHeight = 250
let middleSwipeContentHeight = window.innerHeight / 2
let deviceType = "";

// Events for touch and mouse
let events = {
    mouse: {
        down: "mousedown",
        up: "mouseup"
    },
    touch: {
        down: "touchstart",
        up: "touchend"
    }
}

const showSwiper = () => {
    swiper.classList.add("swiper")
    swiper.classList.remove("remover")
    swiper.style.height = '250px'
}

const removeSwiper = () => {
    swiper.classList.remove("swiper")
    swiper.classList.add("remover")
}

// detect touch device
const isTouchDevice = () => {
    try {
        document.createEvent("TouchEvent");
        deviceType = "touch";
        return true
    }
    catch(e) {
        deviceType = "mouse";
        return false
    }
}

isTouchDevice()

// Get left and top of touchArea
let rectLeft = touchArea.getBoundingClientRect().left;
let rectTop = touchArea.getBoundingClientRect().top;

// Get exact X and Y position of mouse/touch 
const getXY = (e, a='event') => {
    mouseX = (!isTouchDevice() ? e.pageX : a !== 'end' ? e.touches[0].pageX : e.changedTouches[0].pageX) - rectLeft
    mouseY = (!isTouchDevice() ? e.pageY : a !== "end" ? e.touches[0].pageY : e.changedTouches[0].pageY) - rectTop
}

// Start swipe
touchArea.addEventListener(events[deviceType].down, 
    (event) => {
        isSwiped = true;
        // Get X an Y Position
        getXY(event) 
        initialX = mouseX;
        initialY = mouseY;
    }
)

function handleSwipe(isUp) {
    if(isUp) {
        console.log('height: ', swiper.clientHeight);
        if(swiper.clientHeight === defaultSwipeContentHeight) {
            swiper.style.height = `${middleSwipeContentHeight}px`
        } else if (swiper.clientHeight == middleSwipeContentHeight) {
            swiper.style.height = '85vh'
        }
    } else {
        if(swiper.clientHeight > middleSwipeContentHeight) {
            swiper.style.height = `${middleSwipeContentHeight}px`
        } else if(swiper.clientHeight == middleSwipeContentHeight) {
            swiper.style.height = `${defaultSwipeContentHeight}px`
        }
    }
}

touchArea.addEventListener(events[deviceType].up, 
    (event) => {
        if(!isTouchDevice()) {
            event.preventDefault()
        }
        if(isSwiped) {
            getXY(event, 'end');
            let diffX = mouseX - initialX;
            let diffY = mouseY - initialY;

            if(Math.abs(diffY) > Math.abs(diffX)) {
                console.log(diffY > 0 ? "Down" : "Up");
                isUp = diffY > 0 ? false : true
                handleSwipe(isUp)
            }
        }
    }  
)

// Stop drawing
touchArea.addEventListener(events[deviceType].up,  () => { isSwiped = false})

touchArea.addEventListener("mouseleave", () => { isSwiped = false})

window.onload = () => {isSwiped = false}