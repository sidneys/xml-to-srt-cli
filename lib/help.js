'use strict'


/**
 * Modules
 * Node
 * @constant
 */
const os = require('os')
const path = require('path')

/**
 * Modules
 * External
 * @constant
 */
const appRootPath = require('app-root-path')
appRootPath.setPath(path.join(__dirname, '..'))
const chalk = require('chalk')
const indentString = require('indent-string')
const pad = require('pad')
const wordWrap = require('word-wrap')

/**
 * Modules
 * Internal
 * @constant
 */
const packageJson = require(path.join(appRootPath.path, 'package.json'))


/**
 * Environment
 * @constant
 */
const isCli = parseInt(process.env['ISCLI']) === 0 ? false : true

/**
 * @constant
 * @default
 */
const widthIndent = 4

/**
 * Layout Sizes
 */
let widthTotal = 80
if (isCli) {
    const windowSize = require('window-size')
    widthTotal = windowSize['width']
}
const widthMax = widthTotal - (widthIndent * 2)
const widthColumn = parseInt(widthTotal / 4)


/**
 * Format table headers
 * @param {String} text - Text
 * @returns {String} Padded Text
 */
let formatTextHeader = (text) => {
    let header
    header = `${chalk['bold'](text.toUpperCase())}`

    return header
}

/**
 * Format and wrap multi-line text
 * @param {String} text - String
 * @returns {String} Formatted string
 */
let formatTextParagraph = (text) => {
    return `${wordWrap(text, { indent: ' '.repeat(widthIndent), width: widthMax })}${os.EOL}`
}

/**
 * Format table row
 * @param {String} rowTitle - String
 * @param {String=} rowText - String
 * @returns {String} Formatted string
 */
let formatTableRow = (rowTitle, rowText = '') => {
    let row

    row = `${indentString(pad(rowTitle, widthColumn, { colors: true }), widthIndent)} ${rowText}${os.EOL}`

    return row
}


/**
 * Help
 */
let print = () => {
    console.log(formatTextHeader('name'))
    console.log(formatTextParagraph(`${packageJson.name} v${packageJson.version}`))

    console.log(formatTextHeader('homepage'))
    console.log(formatTextParagraph(`${packageJson.homepage}`))

    console.log(formatTextHeader('usage'))
    console.log(formatTableRow(`${chalk['bold'](Object.keys(packageJson.bin)[0])}  [ ${chalk['bold']('--format')} ${chalk['underline']('output-format')} ]`))

    console.log(formatTextHeader('options'))

    console.log(formatTableRow(`${chalk['bold']('--format')} ${chalk['underline']('output-format')}`, `"json", "text"`))

    console.log(formatTableRow(`${chalk['bold']('--help')}`, `Show help`))
    console.log(formatTableRow(`${chalk['bold']('--version')}`, `Print version`))
}


/**
 * @exports
 */
module.exports = {
    print: print
}
