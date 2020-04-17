class RoomInfo {
    constructor(stringId, rusName) {
        this.stringId = stringId;
        this.rusName = rusName;
    }
}

const Room = [
    new RoomInfo('normalRoom', 'Тупо комната'),
    new RoomInfo('Stadium', 'Стадион'),
    new RoomInfo('trainingRoom', 'Кочалка'),
    new RoomInfo('meeting room', 'Беседка'),
    new RoomInfo('bigroom', 'Здоровая комната'),
    new RoomInfo('bigroom but not so big as you think', 'Комната)')
];

const TypeOfEvent = {
    PARTY: 'DRINKING_PARTY',
    CONCERT: 'PARTY',
    SPORTS_MATCH: 'MATCH',
    SPORTS_TRAINING: 'TRAINING',
    OTHER: 'OTHER'
};

export {Room, TypeOfEvent}