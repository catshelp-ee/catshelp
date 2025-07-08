import GoogleService from "@services/google-service";
import path from "node:path";
import fs from "node:fs";
import sha256 from 'crypto-js/sha256';

export async function syncSheetsToDb() {
    if (!process.env.CATS_SHEETS_ID || !process.env.CATS_TABLE_NAME) {
        console.log("Google cats sheet id or table name not set. Skipping db sync");
        return;
    }

    const currentSheet = await getCurrentSheetData();
    if (!currentSheet) {
        console.log("Could not load data from google sheets. Skipping sync");
        return;
    }

    const previousSheet = getPreviousSheetData();
    const formattedSheet = formatSheetData(currentSheet);

    syncSheetDataToDb(previousSheet, formattedSheet);
    saveCurrentSheetAsPrevious(formattedSheet);
}

function formatSheetData(sheet) {
    const result = [];

    const sheetRows = sheet.data.sheets[0].data[0].rowData;
    const headerRow = getHeaderRowsColumnNames(sheetRows[0].values);
    for (let index = 1; index < sheetRows.length; index++) {
        let row = sheetRows[index];
        let newObject = {};
        for (let j = 0; j < row.values.length; j++) {
            let columnValue = row.values[j];
            let headerName = headerRow[j];
            newObject[headerName] = columnValue;
        }
        let hash = sha256(JSON.stringify(newObject));
        newObject['hash'] = hash.toString();
        result.push(newObject);
    }

    //remove header row
    return result.slice(1);
}

function getHeaderRowsColumnNames(headerValues) {
    const result = [];
    for (let index = 0; index < headerValues.length; index++) {
        const headerColumnValue = headerValues[index].formattedValue ? headerValues[index].formattedValue : '';
        if (headerColumnValue == 'PÄÄSTETUD JÄRJEKORRA NR (AA\'KK nr ..)') {
            result.push('jarjekorraNr')
        } else {
            result.push(headerColumnValue.replace(' ', '_'));
        }
    }
    return result;
}

function getSheetSaveLocation() {
    const tempDir = path.join(process.cwd(), "./files");
    const fullPath = path.resolve(tempDir, "previous_sheets_data.txt");
    return fullPath;
}

function getPreviousSheetData() {
    const saveLocation = getSheetSaveLocation();
    if (!fs.existsSync(saveLocation)) {
        return;
    }
    const data = fs.readFileSync(saveLocation, 'utf-8');
    if (!data) {
        return [];
    }
    return JSON.parse(data);
}

async function getCurrentSheetData() {
    const googleService = await GoogleService.create();
    const sheetData = await googleService.getSheetData(
        process.env.CATS_SHEETS_ID!,
        process.env.CATS_TABLE_NAME!
    );
    return sheetData;
}

function saveCurrentSheetAsPrevious(currentSheetData) {
    try {
        if (!currentSheetData) {
            return;
        }
        const data = JSON.stringify(currentSheetData);

        const saveLocation = getSheetSaveLocation();
        fs.writeFileSync(saveLocation, data);
    } catch (err) {
        console.error("Error writing sheets file:", err);
    }
}

function syncSheetDataToDb(previousSheetData, currentSheetData) {
    const oldValues = getPaastetudKpToHash(previousSheetData);

    const valuesToUpdate = getValuesToUpdate(currentSheetData, oldValues)
    const valuesToRemove = getValuesToRemove(currentSheetData, oldValues);
    
    //TODO actual saving
}

function getValuesToUpdate(data, oldValues) {
    const valuesToUpdate = [];
    data.forEach(row => {
        if (!oldValues['jarjekorraNr'] || !oldValues.hash != row.hash) {
            valuesToUpdate.push(row);
        }
    });
    return valuesToUpdate;
}

function getValuesToRemove(data, oldValues) {
    const valuesToRemove = [];
    const valuesToKeep = {};

    data.forEach(row => {
        let paastetudKp = row['jarjekorraNr'];
        valuesToKeep[paastetudKp] = true;
    });

    Object.keys(oldValues).forEach(key => {
        if (!valuesToKeep[key]) {
            valuesToRemove.push(key);
        }
    });
    return valuesToRemove;
}

function getPaastetudKpToHash(data) {
    const map = {};

    if (!data) {
        return map;
    }
    data.forEach(row => {
        map[row['jarjekorraNr']] = row['hash'];
    });
    return map;
}
