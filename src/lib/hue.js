export const randomHex = () =>
    `#${Math.floor(Math.random() * 0x1000000)
        .toString(16)
        .padStart(6, "0")
        .toUpperCase()}`;

export const isHexGuess = (value) => /^([0-9A-F]{3}|[0-9A-F]{6})$/.test(value);

const hexToRgb = (hex) => {
    let digits = hex.replace("#", "");
    if (digits.length === 3) {
        // short hex values, e.g. #FFF or #000
        digits = [...digits].map((d) => d + d).join("");
    }
    return [0, 2, 4].map((i) => parseInt(digits.slice(i, i + 2), 16));
};

// 100% is an exact match, 0% is as far apart as two colours can be
export const accuracy = (target, guess) => {
    const a = hexToRgb(target);
    const b = hexToRgb(guess);
    const diff = a.reduce((sum, channel, i) => sum + Math.abs(channel - b[i]), 0);
    return (100 - (diff / 765) * 100).toFixed(2);
};

export const expandHex = (hex) => `#${hexToRgb(hex)
    .map((channel) => channel.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase()}`;
