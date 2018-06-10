#!/usr/bin/env node
'use strict'


/**
 * Modules
 * Node
 * @constant
 */
const fs = require('fs')
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
const logger = require('@sidneys/logger')({ write: true })
const fastXmlParser = require('fast-xml-parser')
const minimist = require('minimist')
const moment = require('moment')
/* eslint-disable no-unused-vars */
const momentDurationFormat = require('moment-duration-format')
const momentParseFormat = require('moment-parseformat')
/* eslint-enable */

/**
 * Modules
 * Internal
 * @constant
 */
const help = require(path.join(appRootPath.path, 'lib', 'help'))
const packageJson = require(path.join(appRootPath.path, 'package.json'))


/**
 * Log prefix
 * @constant
 */
const messagePrefix = chalk['bold']['cyan'](`[${Object.getOwnPropertyNames(packageJson.name)[0]}]`)
const errorPrefix = chalk['bold']['red'](`[${Object.getOwnPropertyNames(packageJson.name)[0]}]`)

/**
 * Timecode format
 * @constant
 * @default
 */
const defaultTimecodeFormat = 'HH:mm:ss.SSS'


/**
 * Format timecodes as HH:mm:ss.SSS
 * @param {String} timecode - Raw timecode
 * @return {String} Formatted Timecode
 */
let parseTimecode = (timecode) => {
    // logger.debug('formatTimecode')

    let timecodeMoment
    let timecodeFormatted

    // Timecode style is "00:01:04.240"
    if (momentParseFormat(timecode) === defaultTimecodeFormat) {
        // Handle 10/20-hour offsets (https://github.com/mattfoo/ebu-tt_to_srt)
        timecodeMoment = moment.duration(timecode)
        // 10 hour offset
        if ((timecodeMoment.hours() >= 10) && (timecodeMoment.hours() < 20)) {
            timecodeMoment = timecodeMoment.subtract(10, 'hours')
        }
        // 20 hour offset
        if (timecodeMoment.hours() >= 20) {
            timecodeMoment = timecodeMoment.subtract(20, 'hours')
        }
    }
    // Timecode style is "1.405s"
    else if (timecode.endsWith('s')) {
        // Parse seconds
        const timecodeSeconds = timecode.replace(/(s)$/, '')
        timecodeMoment = moment(timecodeSeconds, 'ss.SSS')
    }
    // Timecode style is unknown
    else {
        timecodeMoment = moment(timecode)
    }

    // Format timecode
    timecodeFormatted = timecodeMoment.format(defaultTimecodeFormat, { trim: false })

    return timecodeFormatted
}

/**
 * Render subtitle paragraph list into proper SRT (SubRip) subtitle format
 * @param {Array} paragraphList - Subtitle paragraph list
 * @return {String} SubRip Subtitle
 */
let renderSrt = (paragraphList) => {
    logger.debug('renderSrt')

    const entryList = []
    let entryCount = 1

    paragraphList.forEach((entry) => {
        // Get raw metadata,text paragraphs
        const metadata = entry['tt:p']
        // Get raw text paragraphs
        const textList = entry['tt:span'] instanceof Array ? entry['tt:span'] : [entry['tt:span']]

        const begin = parseTimecode(metadata['begin'])
        const end = parseTimecode(metadata['end'])

        entryList.push(entryCount)
        entryList.push(`${begin} --> ${end}`)

        entryList.push(textList.map(text => text['tt:span']).join(os.EOL) + os.EOL)

        entryCount++
    })

    return (entryList.join(os.EOL))
}

/**
 * Parse XML Subtitle data payload into array of paragraphs
 * @param {String} xmlData - XML subtitle data
 * @return {Array|Boolean} Subtitle paragraph list
 */
let parseXmlData = (xmlData) => {
    logger.debug('parseXmlData')

    const options = {
        attributeNamePrefix: '',
        attrNodeName: 'tt:p', //default is 'false'
        textNodeName: 'tt:span',
        ignoreAttributes: false,
        ignoreNameSpace: false,
        allowBooleanAttributes: false,
        cdataTagName: '__cdata', //default is 'false'
        cdataPositionChar: '\\c'
    }

    // Handle invalid XML
    if (fastXmlParser.validate(xmlData) !== true) {
        return false
    }

    const parsedObject = fastXmlParser.parse(xmlData, options)

    return parsedObject['tt:tt']['tt:body']['tt:div']['tt:p']
}


/**
 * Commandline interface
 */
if (require.main === module) {
    // Parse arguments
    let argv
    try {
        argv = minimist(process.argv.slice(2), {
            'boolean': ['help', 'version']
        })
    } catch (error) {}

    // DEBUG
    logger.debug('argv')

    // Help
    const argvHelp = argv['help']
    if (argvHelp) {
        help.print()
        process.exit(0)
    }

    // Version
    const argvVersion = argv['version']
    if (argvVersion) {
        console.log(messagePrefix, `v${packageJson.version}`)
        process.exit(0)
    }

    // Sourcefile
    let argvSourcefile = argv['_'][0]
    if (!argvSourcefile) {
        console.log(messagePrefix, `Source XML subtitle required.`)
        process.exit(0)
    }
    argvSourcefile = path.resolve(argvSourcefile)
    if (!fs.existsSync(argvSourcefile)) {
        console.log(errorPrefix, '[Error]', `File not found: "${argvSourcefile}"`)
        process.exit(1)
    }

    // Targetfile
    const targetFile = path.resolve(`${path.basename(argvSourcefile, path.extname(argvSourcefile))}.srt`)

    // Main
    fs.readFile(argvSourcefile, 'utf8', (error, xmlData) => {
        if (error) {
            console.log(errorPrefix, '[Error]', error)
            process.exit(1)

            return
        }

        // Parse / Validate XML
        const entryList = parseXmlData(xmlData)

        if (!entryList) {
            console.log(errorPrefix, '[Error]', 'Malformed XML Subtitle:', argvSourcefile)
            process.exit(1)

            return
        }

        // Render SRT
        const srtText = renderSrt(entryList)

        // Write SRT to  disk
        fs.writeFile(targetFile, srtText, 'utf8', (error) => {
            if (error) {
                console.log(errorPrefix, '[Error]', error)
                process.exit(1)

                return
            }

            console.log(messagePrefix, `XML Subtitle successfully converted to SRT (SubRip) format:`, targetFile)
            process.exit(0)
        })
    })
}
