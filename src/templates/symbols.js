const symbols = {
    arrow: '➤'
};

if (process.platform === 'win32') {
    symbols.arrow = '>';
}

module.exports = symbols;