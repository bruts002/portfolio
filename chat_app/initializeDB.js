const fs = require('fs');
const config = require('./config');

const copyFile = (source, target) => {
    const rd = fs.createReadStream(source);
    const wr = fs.createWriteStream(target);
    return new Promise( (resolve, reject) => {
        rd.on('error', reject);
        wr.on('error', reject);
        wr.on('finish', resolve);
        rd.pipe(wr);
    }).catch( error => {
        rd.destroy();
        wr.end();
        throw error;
    });
};

copyFile(config.BASE_DB_PATH, config.DATA_BASE_PATH);
