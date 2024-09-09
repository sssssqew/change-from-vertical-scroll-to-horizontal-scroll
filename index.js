import { lerp } from "./utils.js"
import { createProjects } from "./projects.js"

const main = document.querySelector('main')
const video = document.querySelector('video')
const videoSection = document.querySelector('#video')

createProjects()

main.addEventListener('scroll', () => {
    animateVideo()
})

// Video
const headerLeft = document.querySelector('.text__header__left')
const headerRight = document.querySelector('.text__header__right')

function animateVideo(){
    let {bottom} = videoSection.getBoundingClientRect()
    // console.log(bottom) // 브라우저 상단과 요소 하단까지의 거리. 스크롤 내리면 요소가 올라오면서 bottom 값은 점점 작아짐
    let diff = bottom - window.innerHeight
    // console.log(diff) // 스크롤 내리다가 더이상 스크롤 내리지 못하고 바닥이면 0. 스크롤 내리는동안 양수값이면서 점점 작아짐.
    // console.log(diff * 0.0005)
    let scale = 1 - diff * 0.0005 // diff 는 양수값(1 -> 0)이면서 점점 작아지므로 scale 값은 점점 커지면서 1에 가까워짐.
    // console.log(scale)
    scale = scale < .2 ? .2 : scale > 1 ? 1 : scale // scale 값을 0.2와 1사이로 제한
    // console.log(scale)
    video.style.transform = `scale(${scale})`

    // Text transformation
    let textTrans = bottom - window.innerHeight // 값이 양수이며 스크롤 내릴때 점점 줄어들다가 비디오 요소가 브라우저 바닥에 닿으면 textTrans 값은 0
    textTrans = textTrans < 0 ? 0 : textTrans // 비디오 요소가 브라우저 상단보다 올라가면 bottom 은 window.innerHeight 보다 작아지므로 textTrans 는 0보다 작아질수 있음. 이때 0으로 제한하지 않으면 글자가 중앙에서 서로 교차하여 지나가버림.
    headerLeft.style.transform = `translateX(${-textTrans}px)`
    headerRight.style.transform = `translateX(${textTrans}px)`
}

// Projects
const projectsSticky = document.querySelector('.projects__sticky')
const projectSlider = document.querySelector('.projects__slider')

let projectTargetX = 0
let projectCurrentX = 0

let percentages = { // 디바이스 크기에 따라 슬라이드 이미지 크기를 다르게 설정하기 위함
    small: 700,
    medium: 300,
    large: 100
}

let limit = window.innerWidth <= 600 ? percentages.small :
            window.innerWidth <= 1100 ? percentages.medium: 
            percentages.large

function setLimit(){
    let limit = window.innerWidth <= 600 ? percentages.small :
            window.innerWidth <= 1100 ? percentages.medium: 
            percentages.large 
}

window.addEventListener('resize', setLimit) // 디바이스 크기를 변경할때마다 슬라이드 이미지 사이즈를 다르게 설정

// 스크롤을 내릴수록 main.scrollTop 값은 점점 커지며, main.scrollTop 값과 offsetTop 값이 같아진다는 의미는 project 섹션이 브라우저 상단에 닿았다는 의미다
// percentage 의미 : 브라우저 상단과 projects 섹션간의 거리가 브라우저 높이 대비 몇 % 인지. 그리고 양수 음수에 따라 브라우저 상단보다 projects 섹션이 아래에 있는지 위에 있는지 알려준다
// 예를 들어 percentage 가 -200% 이면 projects 섹션은 브라우저 상단보다 브라우저 높이의 두배만틈 아래에 위치한다. 
// percentage 가 -50% 이면 projects 섹션은 브라우저 상단보다 브라우저 높이의 50%만큼 아래에 위치한다. 즉, projects 섹션은 브라우저 화면의 수직중앙에 위치한다.
// projects 섹션은 브라우저 상단에 닿는순간부터 스크롤을 내리면 percentage 가 양수값으로 점점 커진다. 그 의미는 섹션이 닿는순간부터 해당 섹션을 왼쪽으로 이동한다는 의미다.
// 결국 정리하면 브라우저 높이대비 projects 섹션과 브라우저 상단간 거리의 % 를 가로방향으로 몇 % 움직일지로 전환한 것이다.
// 예를 들어 projectCurrentX 값이 100 이면 슬라이드는 왼쪽으로 -100vw 만큼 이동한다. 이는 슬라이드 이미지 4장 정도가 움직이는 거리다.
// 현재 슬라이더 높이가 200% (브라우저 높이의 두배)이므로 스크롤을 브라우저 하단까지 완전히 내리는동안 슬라이더는 8장 정도 움직인다.
// 하지만 슬라이더 높이 200%는 현재 보여지는 슬라이드 이미지 4장을 포함한 높이이므로 실제 projects 섹션이 브라우저 상단에 닿고부터는 100%만큼만 이동이 가능하다.
// 결국 projects 섹션이 브라우저 상단에 닿고나서 스크롤 내린만큼 슬라이더를 왼쪽으로 이동시킨다.
function animateProjects(){
    let offsetTop = projectsSticky.parentElement.offsetTop  // main 요소(부모 요소)와 projects section 요소와의 거리
    // console.log(offsetTop) // 고정값
    // console.log(main.scrollTop) // 0에서부터 스크롤 내릴수록 점점 커지는 양수값
    let percentage = (main.scrollTop - offsetTop)
    // console.log(percentage) // 스크롤 내릴수록 음수값에서 0을 거쳐 양수값으로 점점 커짐
    percentage = (main.scrollTop - offsetTop) / window.innerHeight * 100
    percentage = percentage < 0 ? 0 : percentage > limit ? limit : percentage // percentage 값이 음수이면 projects 섹션이 브라우저 상단에 닿지 않은 경우이므로 이때는 percentage 값을 0으로 고정하여 projects 섹션이 브라우저 상단에 닿기 전에는 슬라이드 이미지가 움직이지 않도록 고정함
    // limit 은 현재 100이다. 모바일 디바이스에서는 현재보다 큰 limit 을 적용한다. 왜냐하면 컨텐츠 길이를 800%로 설정하였기 때문이다. 즉 -700vw (슬라이드 사진이 7장 움직인다.)
    projectTargetX = percentage
    console.log(percentage)
    projectCurrentX = lerp(projectCurrentX, projectTargetX, .1)
    projectSlider.style.transform = `translate3d(${-projectCurrentX}vw, 0, 0)`

    requestAnimationFrame(animateProjects)
}

animateProjects()

