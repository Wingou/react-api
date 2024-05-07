function valueFormat(value) {
    if (value !== null) { return value.replace("'", "''"); }
}

module.exports = valueFormat;