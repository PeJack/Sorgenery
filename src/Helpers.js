let Helpers = {
    GetRandom: function (low, high) {
        return~~ (Math.random() * (high - low)) + low;
    },
    spriteOffset: {
        strike1: 360,
        strike2: 362,
        strike3: 364,
        accelerate: 366,
        blueBlast: 369,
        purpleBlast: 373,
        acceleration: 377,
        superCharged: 378,
        alert: 379,
        callHelp: 380,
        xpBubble: 381,
        sleep: 382,
        immune: 383,
        magicMissile: 390,
        lightningBolt: 398,
        smallSparks: 400,
        sparks: 404,
        fireBall: 408,
        iceBall: 420,
        normalArrow: 428,
        arrowHit: 432,
        fire: 0,
        ice: 2,
        shield: 4,
        ice2: 6,
        poof: 8,
        explosionPoof: 10,
        orangePoof: 12,
        greyPoof: 14,
        superCharge: 16,
        iceBlock: 20,
        fireBlock: 22,
        explodingStone: 24,
        crossCut: 28,
        splode: 30,
        blueBall: 32,
        blueSparkle: 36
    },
    pointInCircle: function (x, y, cx, cy, radius) {
        let distancesquared = (x - cx) * (x - cx) + (y - cy) * (y - cy);
        return distancesquared <= radius * radius;
    }
};


export default Helpers;