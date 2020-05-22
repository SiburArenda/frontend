class RoomInfo {
    constructor(serverName, name, auditory, description, tags, isAdditionTo) {
        this.serverName = serverName;
        this.name = name;
        this.auditory = auditory;
        this.description = description;
        this.tags = tags;
        this.isAdditionTo = isAdditionTo === '-1' ? 'independent' : isAdditionTo;
        this.amount = 1;
    }

    getURL = (len = -1) => {
        if (this.name.startsWith('VIP')) {
            return 'VIP_ложи'
        }
        if (len !== -1) {
            const split = this.name.split(' ');
            if (len < split.length) {
                let urlName = '';
                for (let i = 0; i < len; i++) {
                    urlName += split[i] + (i === len - 1 ? '' : '_')
                }
                return urlName;
            }
        }
        return this.name.replace(/ /g, '_');
    }
}

function roomArrayFormation(initialArray, forApplicationEdit = false){
    const roomArray = [];

    for (let roomIndex in initialArray) {

        const roomObj = initialArray[roomIndex];

        const priorName = roomObj.name;
        let name = '';
        let serverName = '';
        if (priorName.indexOf('#') !== -1) {
            const splitSpace = priorName.split(' ');
            name = `${splitSpace[0]} ${splitSpace[1]}`;
            const splitHash = priorName.split(' #');
            serverName = splitHash[0];
        } else {
            name = priorName;
            serverName = priorName;
        }

        const auditory = roomObj.auditory === -1 ? 0 : roomObj.auditory;
        if (name === 'VIP ложи') {
            name += ` на ${auditory} персон`
        }

        let add = false;
        for (let i in roomArray) {
            if (roomArray[i].name === name) {
                roomArray[i].amount++;
                add = true;
                break;
            }
        }

        if (!add) {
            const description = roomObj.description;

            const tags = roomObj.tags.slice(0, roomObj.tags.length - 1);

            const isAdditionTo = roomObj.tags[roomObj.tags.length - 1];

            const newRoomInfo = !forApplicationEdit
                ?
                new RoomInfo(serverName, name, auditory, description, tags, isAdditionTo)
                :
                {
                    serverName: serverName,
                    name: name,
                    amount: 1,
                    maxAmount: null,
                    isAdditionTo: isAdditionTo
                }
            ;
            roomArray.push(newRoomInfo);
        }

    }

    return roomArray;
}

export {RoomInfo, roomArrayFormation};