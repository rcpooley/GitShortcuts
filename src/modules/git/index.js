const add = require('./commands/add');
const amend = require('./commands/amend');
const branch = require('./commands/branch');
const checkout = require('./commands/checkout');
const commit = require('./commands/commit');
const status = require('./commands/status');
const unstage = require('./commands/unstage');
const diff = require('./commands/diff');

module.exports = {
    ga: add,
    gam: amend,
    gb: branch,
    gco: checkout,
    gc: commit,
    gs: status,
    gu: unstage,
    gd: diff,
};
