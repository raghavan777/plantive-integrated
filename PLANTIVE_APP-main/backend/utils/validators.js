export const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

export const validatePassword = (password) =>
    password && password.length >= 6;

export const validateCoordinates = (lat, lon) =>
    typeof lat === "number" &&
    typeof lon === "number" &&
    lat >= -90 &&
    lat <= 90 &&
    lon >= -180 &&
    lon <= 180;
