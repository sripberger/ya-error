/* eslint no-console: off, max-classes-per-file: off */

import YaError from './yaerror';

class OmgError extends YaError {}
class WowError extends YaError {}

const omg = new OmgError();
const wow = new WowError();
const ya = new YaError();
const err = new Error();

console.log(YaError.is(OmgError, omg));
console.log(YaError.is(WowError, omg));
console.log(YaError.is(YaError, omg));
console.log(YaError.is(Error, omg));

console.log();
console.log(YaError.is(OmgError, wow));
console.log(YaError.is(WowError, wow));
console.log(YaError.is(YaError, wow));
console.log(YaError.is(Error, wow));

console.log();
console.log(YaError.is(OmgError, ya));
console.log(YaError.is(WowError, ya));
console.log(YaError.is(YaError, ya));
console.log(YaError.is(Error, ya));

console.log();
console.log(YaError.is(OmgError, err));
console.log(YaError.is(WowError, err));
console.log(YaError.is(YaError, err));
console.log(YaError.is(Error, err));
