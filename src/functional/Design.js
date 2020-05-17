let deg = 0;
function waiting(id) {
    const waitIcon = document.getElementById(id);
    if (waitIcon != null) {
        if (navigator.userAgent.match("Chrome")) {
            waitIcon.style.WebkitTransform = "rotate(" + deg + "deg)";
        } else if (navigator.userAgent.match("Firefox")) {
            waitIcon.style.MozTransform = "rotate(" + deg + "deg)";
        } else if (navigator.userAgent.match("MSIE")) {
            waitIcon.style.msTransform = "rotate(" + deg + "deg)";
        } else if (navigator.userAgent.match("Opera")) {
            waitIcon.style.OTransform = "rotate(" + deg + "deg)";
        } else {
            waitIcon.style.transform = "rotate(" + deg + 'deg)';
        }
        deg -= 2;
        if (deg < -359) {
            deg = -2;
        }
        setTimeout(() => waiting(id), 1);
    }

}

function flyBird(id, remove) {
    const bird = document.getElementById(id);
    if (bird != null) {
        const opacity = bird.style.opacity;
        const topStr = bird.style.top;
        const top = +topStr.substring(0, topStr.length - 2);
        bird.style.opacity = (opacity - 0.02) + '';
        bird.style.top = (top - 1) + 'px';
        if (+opacity < 0) {
            remove(id);
        } else {
            setTimeout(() => flyBird(id, remove), 20);
        }
    }
}

export {waiting, flyBird};