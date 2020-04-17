class Timing {
    constructor(startH= 0, startM= 0, endH= 0, endM= 0) {
        this.startH = startH;
        this.startM = startM;
        this.endH = endH;
        this.endM = endM;
    }

    setTiming = (attr, toSet) => {
        // eslint-disable-next-line default-case
        switch (attr) {
            case 'startH': {
                this.startH = toSet;
                break;
            }
            case 'startM': {
                this.startM =  toSet;
                break;
            }
            case 'endH': {
                this.endH = toSet;
                break;
            }
            case 'endM': {
                this.endM = toSet;
                break;
            }
        }
    };

    setTimingFull = (timing) => {
        this.startH = timing.startH;
        this.startM = timing.startM;
        this.endH = timing.endH;
        this.endM = timing.endM;
    };

    storeLastValue = () => {
        this.reserveSH = this.startH;
        this.reserveSM = this.startM;
        this.reserveEH = this.endH;
        this.reserveEM = this.endM;
    };

    backup = () => {
        this.startH = this.reserveSH;
        this.startM = this.reserveSM;
        this.endH = this.reserveEH;
        this.endM = this.reserveEM;
    }
}

export default Timing