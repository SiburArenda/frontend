function connectDatabase(
    interaction,
    method,
    onSuccess = () => {},
    onDBError = e => console.error('Database error: ' + e.target.errorCode),
    onTError = e => console.error('Transaction error: ' + e.target.errorCode),
    onNoSupport = () => console.error('This browser doesn\'t support IndexedDB')
) {

    if (!('indexedDB' in window)) {
        onNoSupport();
        return;
    }

    const idb = window.indexedDB;
    const dbPromise = idb.open('sibur-db', 1);

    dbPromise.onerror = e => onDBError(e);

    dbPromise.onsuccess = e => {

        const actualDB = e.target.result;
        const transaction = actualDB.transaction(['componentStates'], method === 'get' ? 'readonly' : 'readwrite');

        transaction.onerror = e => onTError(e);

        const store = transaction.objectStore('componentStates');

        let request = null;

        if (method === 'get') {
            request = store.get(interaction);

            request.onsuccess = e => {

                onSuccess(e.target.result);
            }
        } else {
            interaction.forEach(i => {
                switch (method) {
                    case 'put': {
                        const request = store.put(i);
                        request.onsuccess = () => onSuccess();
                        break;
                    }

                    case 'delete': {
                        request = store.delete(i);
                        request.onsuccess = () => onSuccess();
                        break;
                    }

                    default: {
                        console.error('Illegal transaction method name: ' + method);
                        return;
                    }
                }
            });
        }
    };

    dbPromise.onupgradeneeded = e => {
        const actualDB = e.target.result;

        if (!actualDB.objectStoreNames.contains('componentStates')) {
            actualDB.createObjectStore(
                'componentStates',
                {keyPath: 'componentName', autoIncrement: false})
        }

    };
}

export {connectDatabase}