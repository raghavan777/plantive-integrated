const logger = {
    info: (msg) => {
        console.log(`ℹ️ ${msg}`);
    },
    error: (msg, err) => {
        if (err) {
            console.error(`❌ ${msg}`, err);
        } else {
            console.error(`❌ ${msg}`);
        }
    },
    warn: (msg) => {
        console.warn(`⚠️ ${msg}`);
    }
};

module.exports = { logger };