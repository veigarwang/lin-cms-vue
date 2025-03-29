export function compareTable(newTable, oldTable) {
    let updatedFields = {}
    // console.log('ready to compare: ' + JSON.stringify(oldTable))
    Object.keys(newTable).forEach(key => {
        // console.log('key:' + key)
        if (newTable[key] instanceof Date) {
            // console.log('newTable[' + key + '] is Date')
            if (!isDateEqual(newTable[key], oldTable[key])) {
                // console.log('key: ' + newTable[key] + ' | ' + oldTable[key])
                updatedFields[key] = newTable[key]
            }
        } else if (newTable[key] !== oldTable[key]) {
            // console.log('key: ' + newTable[key] + ' | ' + oldTable[key])
            updatedFields[key] = newTable[key]
        }
        // else {
        //     console.log('key: ' + key + ' is the same')
        // }
    })
    //console.log('Object.keys(updatedFields).length: ' + Object.keys(updatedFields).length)
    return Object.keys(updatedFields).length > 0;
}

function isDateEqual(dateA, dateB) {
    var timestampA =
        dateA instanceof Date
            ? Date.UTC(dateA.getUTCFullYear(), dateA.getUTCMonth(), dateA.getUTCDate())
            : new Date(Number(dateA))

    var timestampB =
        dateB instanceof Date
            ? Date.UTC(dateB.getUTCFullYear(), dateB.getUTCMonth(), dateB.getUTCDate())
            : new Date(Number(dateB) + 8 * 60 * 60 * 1000)

    // the time got from Database is UTC but the one got from Date-Picker is UTC+8 so add 8 hours to the former
    timestampB = Date.UTC(timestampB.getUTCFullYear(), timestampB.getUTCMonth(), timestampB.getUTCDate())

    // console.log('timestampA: ' + timestampA + ' | timestampB: ' + timestampA)
    return timestampA === timestampB
}