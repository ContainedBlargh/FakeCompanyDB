function stringToInt(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
}
Math.seedRandom = function (s) {
    seed = s;
};
Math.seededRandom = function () {
    seed = (seed * 9301 + 49297) % 233280;
    var x = Math.sin(seed++) * 10000.0;
    return x - Math.floor(x);
};

function wave(step, freq, amp) {
    return Math.sin(step * freq) * amp;
}
