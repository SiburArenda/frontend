function connectServer(toSend, onConnect, method, headers, urlAfterCom, waiting = () => {}) {
    const request = new XMLHttpRequest();

    request.onreadystatechange = () => {
        if (request.readyState === 4) {
            onConnect(request.responseText);
        } else {
            waiting();
        }
    };

    request.open(method.toUpperCase(), 'http://siburarenda.publicvm.com/' + urlAfterCom, true);
    for (let headerInd in headers) {
        const header = headers[headerInd];
        request.setRequestHeader(header.name, header.value);
    }
    request.send(toSend);
}

function checkToken(refreshToken, token, userLogin, password) {

    const headers = [
        {name: 'Authorization', value: 'Bearer_' + token},
        {name: 'Content-Type', value: 'application/json'}
    ];

    const onResponse = responseText => {
        if (responseText !== 'true') {
            const toSend = JSON.stringify({ username: userLogin, password: password });
            connectServer(
                toSend,
                refreshToken,
                'post',
                [{name: 'Content-Type', value: 'application/json'}],
                'api/public/login'
            )
        }
    };

    connectServer(null, onResponse, 'get', headers, 'api/public/token');
    // TODO: Security!
}

export {connectServer, checkToken};