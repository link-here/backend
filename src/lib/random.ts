import cryptoRandomString from 'crypto-random-string';

export default (length = 32): string => cryptoRandomString({length});
