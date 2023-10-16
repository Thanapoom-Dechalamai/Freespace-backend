const method = {
    areObjectsEqual(objA, objB)
    {
        // Get the keys of both objects
        const keysA = Object.keys(objA);
        // Iterate through the keys and compare values
        for (const key of keysA)
        {
            // Compare the values of the current key
            if (objA[key] != objB[key])
            {
                return false;
            }
        }
        // If all checks pass, the objects have the same values
        return true;
    },
    getRandomInteger(min, max)
    {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    isUsernameAvailable(string)
    {
        // Create a regular expression that matches English characters, numbers, dots, and underscores.
        const englishNumbersDotsAndUnderscoresRegex = /^[a-zA-Z0-9_\.]+$/;

        // Use the regular expression to check the string.
        const isEnglishNumbersDotsAndUnderscores = englishNumbersDotsAndUnderscoresRegex.test(string);

        return isEnglishNumbersDotsAndUnderscores;
    }



};

module.exports = { ...method };