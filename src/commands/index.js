const add = require('../modules/git/commands/add');
const branch = require('../modules/git/commands/branch');
const checkout = require('../modules/git/commands/checkout');
const status = require('../modules/git/commands/status');
const unstage = require('../modules/git/commands/unstage');

const hg = require('./hg');
const hgm = require('./hgMulti');
const hgCommit = require('./hgCommit');
const hgLog = require('./hgLog');
const hgStatus = require('./hgStatus');

module.exports = {
    ga: add,
    gb: branch,
    gco: checkout,
    gs: status,
    gu: unstage,
    ha: hgm('add', 'Adding '),
    ham: hg('amend'),
    hc: hgCommit,
    hf: hgm('forget', 'Forgetting '),
    hl: hgLog,
    hr: hgm('remove', 'Removing '),
    hs: hgStatus,
};