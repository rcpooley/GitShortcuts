const add = require('./add');
const branch = require('./branch');
const checkout = require('./checkout');
const status = require('./status');
const unstage = require('./unstage');

const hg = require('./hg');
const hgm = require('./hgMulti');
const hgCommit = require('./hgCommit');
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
    hr: hgm('remove', 'Removing '),
    hs: hgStatus,
};