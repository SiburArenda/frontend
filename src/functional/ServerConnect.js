function connectServer(
    toSend,
    onConnect,
    method,
    headers,
    urlAfterCom,
    onResponseError = code => console.error('Error on response, errorCode = ' + code),
    onSendError = e => console.error('Error on send: ' + e)
) {
    const request = new XMLHttpRequest();

    request.onerror = e => onSendError(e);

    request.onreadystatechange = () => {

        if (request.readyState === 4) {

            if ([200, 201, 202, 204, 208, 226].includes(request.status)) {
                onConnect(request.responseText);
            } else if (399 < request.status) {
                onResponseError(request.status);
            }
        }
    };

    request.open(method.toUpperCase(), 'http://siburarenda.publicvm.com/' + urlAfterCom, true);
    for (let headerInd in headers) {
        const header = headers[headerInd];
        request.setRequestHeader(header.name, header.value);
    }
    request.send(toSend);
}

function checkToken(onTokenChecked, token, userLogin, password, onResponseError, onSendError) {

    console.log('Checking token');

    const headers = [
        {name: 'Authorization', value: 'Bearer_' + token},
        {name: 'Content-Type', value: 'application/json'}
    ];

    const toSend = JSON.stringify({ username: userLogin, password: password });

    connectServer(
        null,
        responseText => {
            if (responseText !== 'true') {
                console.log('(onConnect - not true)Token has expired, connecting server for a new one');
                connectServer(
                    toSend,
                    onTokenChecked,
                    'post',
                    [{name: 'Content-Type', value: 'application/json'}],
                    'api/public/login',
                    code => onResponseError(),
                    e => onSendError()
                )
            } else {
                console.log('Token is OK, performing whatever you need');
                onTokenChecked(responseText);
            }
        },
        'get',
        headers,
        'api/public/token',
        e => {
            console.log('(onResponseError) Token has expired, connecting server for a new one. Server said ' + e);
            onResponseError();
        },
        e => {
            console.log('(onSendError) Token has expired, connecting server for a new one. Server said ' + e);
            onSendError();
        });
    // TODO: Security!
}

export {connectServer, checkToken};