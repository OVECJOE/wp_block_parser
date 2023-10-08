class Randomizer {
    private static readonly _random = Math.random;
    private static readonly _floor = Math.floor;
    private static readonly _max = Number.MAX_SAFE_INTEGER;
    private static readonly _min = Number.MIN_SAFE_INTEGER;

    static generateUniqueID() {
        // Generate a 13 digits string representing the current timestamp in hexadecimal
        const timestamp = new Date().getTime().toString(16);

        // Generate 5 digits string to add to the timestamp in order to avoid collisions
        const suffix = Randomizer._floor(
            Randomizer._random() * (Randomizer._max - Randomizer._min) + Randomizer._min
        ).toString(16).slice(0, 5)

        return timestamp + '-' + suffix
    }    
}

export default Randomizer