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

    increaseAmount = () => this.amount += 1;

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

export default RoomInfo;