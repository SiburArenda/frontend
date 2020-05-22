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
        bird.style.opacity = (opacity - 0.01) + '';
        bird.style.top = (top - 1) + 'px';
        if (+opacity < 0) {
            remove(id);
        } else {
            setTimeout(() => flyBird(id, remove), 20);
        }
    }
}

function leadZero(num) {
    let ans = num + "";
    while (ans.length < 2) {
        ans = '0' + ans;
    }
    return ans;
}

function getEventTypeByID(id) {
    // eslint-disable-next-line default-case
    switch (id) {
        case 'PARTY':
            return 'Концерт, представление';
        case 'DRINKING_PARTY':
            return 'Корпоратив, семинар, собрание';
        case 'MATCH':
            return 'Матч';
        case 'TRAINING':
            return 'Тренировка';
        case 'OTHER':
            return 'Мероприятие'
    }
}

function inputsToDefaults(tagNames, containerId) {
    const container = document.getElementById(containerId);
    if (container != null) {
        for (let i in tagNames) {
            const tagName = tagNames[i];
            const fields = container.getElementsByTagName(tagName);
            console.log(fields);
            for (let i = 0; i < fields.length; i++) {
                fields.item(i).value = fields.item(i).defaultValue;
            }
        }
    }
}

export {waiting, flyBird, leadZero, getEventTypeByID, inputsToDefaults};