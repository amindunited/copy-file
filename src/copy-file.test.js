/**
 * @license
 * Copyright Robin Buckley. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file
 */
'use strict';

const fs = require('fs');
const copyFile = require('./index');
const expect = require('chai').expect

const expectedContent = 'Hey';
const testFilePath = './copy-file-promise-test-file.js';
const resultFilePath = './copy-file-promise-result-file.js';

const getFile = function (filePath) {
  const promise = new Promise((resolve, reject) =>{
    fs.readFile(filePath, 'utf8', (err, contents) => {
      if (!err) {
        resolve(contents);
      } else {
        resolve({});
      }
    });
  });
  return promise;
};

const cleanup = () => {
  const promise = new Promise((resolve, reject) => {
    fs.stat(resultFilePath, (err, stats) => {
      if (!err) {
        if (stats.isFile() === true) {
          fs.unlink(testFilePath, (err) => {
            resolve();
          });
          fs.unlink(resultFilePath, (err) => {
            resolve();
          });
        }
      } else {
        resolve();
      }
    });
  });
  return promise;
};

describe('Copy File Promise', () => {

  beforeEach(() => {
    const promise = new Promise((resolve, reject) => {
      fs.writeFile(testFilePath, expectedContent, 'utf8', (err, contents) => {
        if (!err) {
          resolve(contents);
        } else {
          throw(err);
          reject(err);
        }
      });
    });
    return promise;
  });

  it('should export a function', () => {
    expect(copyFile).to.be.a('function');
  });

  it('should return a promise', () => {
    expect(copyFile(testFilePath, resultFilePath).then).to.be.a('function');
  });

  it('should handle an error', () => {
    copyFile('/this.file.doesnt.exist', resultFilePath)
      .then(() => getFile(resultFilePath),
        (err) => {
          expect(true).to.be.equal(true);
        }
      );
  });

  it('should copy a file', () => {
    copyFile(testFilePath, resultFilePath)
      .then(() => getFile(resultFilePath))
      .then((content) => {
        expect(content).to.equal(expectedContent);
      });
  });

  it('should leave the original file intact', () => {
    copyFile(testFilePath, resultFilePath)
      .then(() => getFile(resultFilePath))
      .then((content) => {
        expect(content).to.equal(expectedContent);
        cleanup();
      });
  });

});
