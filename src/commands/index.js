const add = require('./add');
const branch = require('./branch');
const checkout = require('./checkout');
const status = require('./status');
const unstage = require('./unstage');

module.exports = {
    ga: add,
    gb: branch,
    gco: checkout,
    gs: status,
    gu: unstage
};