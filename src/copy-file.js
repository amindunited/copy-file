/**
 * @license
 * Copyright Robin Buckley. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file
 */
'use strict';

const fs = require('fs');

const copyFile = (source, target) => {

  const readStream = fs.createReadStream(source);
  const writeStream = fs.createWriteStream(target);

  return new Promise(function(resolve, reject) {

    readStream.on('error', reject);
    writeStream.on('error', reject);
    writeStream.on('finish', resolve);
    readStream.pipe(writeStream);

  }).catch(function(error) {

    readStream.destroy();
    writeStream.end();
    throw error;

  });
}

module.exports = copyFile;
