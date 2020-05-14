function connectDatabase(interaction, method, onGet = () => console.log('Done')) {

    if (!('indexedDB' in window)) {
        console.error('This browser doesn\'t support IndexedDB');
        return;
    }

    const idb = window.indexedDB;
    const dbPromise = idb.open('sibur-db', 1);

    dbPromise.onerror = e => {
        console.error('Database error: ' + e.target.errorCode);
    };

    dbPromise.onsuccess = e => {
        const actualDB = e.target.result;
        const transaction = actualDB.transaction(['componentStates'], method === 'get' ? 'readonly' : 'readwrite');

        transaction.onerror = e => {
            console.error('Transaction error: ' + e.target.errorCode);
        };

        const store = transaction.objectStore('componentStates');

        let request = null;

        if (method === 'get') {
            request = store.get(interaction);

            request.onsuccess = e => {
                onGet(e.target.result);
            }
        } else {
            interaction.forEach(i => {
                switch (method) {
                    case 'put': {
                        try {
                            request = store.put(i);
                        } catch (e) {
                            console.log('Error: ' + e + ' with ' + i.componentName)
                        }
                        break;
                    }

                    case 'delete': {
                        request = store.delete(i);
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