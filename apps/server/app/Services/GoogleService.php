<?php

namespace App\Services;

use Google\Client;
use Google\Service\Sheets;
use Illuminate\Http\Request;

class GoogleService
{

    public static function addNewAnimalDataToSheets($data, $user): void {
        $client = new Client();
        $client->setApplicationName('catshelp');
        $client->setAuthConfig(config('services.google_sheets.credentials_path'));

        /*
        const row = new Array(30).fill('');
        row[0] = data.rankNr!;
        row[1] = data.rankNr!;
        row[7] = user.fullName;
        row[17] = formatDate(new Date());
        row[20] = `${data.state}, ${data.location}`;
        row[30] = data.notes;
        */

        //TODO vajab uuesti implementeerimist.
    }


    private function getUpdatedData($row, $animalProfile) {
        //TODO vajab uuesti implementeerimist.
        /*
        //NAME
        values[0] = this.createUserEnteredValue(animalProfile.mainInfo.name);
        //RESCUE SEQUENCE NUMBER
        values[1] = this.createUserEnteredValue(animalProfile.mainInfo.rankNr);
        //OVER ONE YEAR
        values[2] = this.createUserEnteredValue(row[2].formattedValue);
        //UNDER ONE YEAR
        values[3] = this.createUserEnteredValue(row[3].formattedValue);
        //CONTRACT NUMBER
        values[4] = this.createUserEnteredValue(row[4].formattedValue);
        //STATUS
        values[5] = this.createUserEnteredValue(animalProfile.mainInfo.status);
        //LOCATION
        values[6] = this.createUserEnteredValue(animalProfile.mainInfo.location);
        //SHELTER OR CLINIC NAME
        values[7] = this.createUserEnteredValue(row[7].formattedValue);
        //MENTOR
        values[8] = this.createUserEnteredValue(row[8].formattedValue);
        //BIRTH DATE
        values[9] = this.createUserEnteredValue(formatDate(animalProfile.mainInfo.birthDate));
        //GENDER
        values[10] = this.createUserEnteredValue(animalProfile.mainInfo.gender);
        //COAT COLOR
        values[11] = this.createUserEnteredValue(animalProfile.mainInfo.coatColour);
        //FUR LENGTH
        values[12] = this.createUserEnteredValue(animalProfile.mainInfo.coatLength);
        //ADDITIONAL NOTES
        values[13] = this.createUserEnteredValue(animalProfile.mainInfo.additionalNotes);
        //MICROCHIP
        values[14] = this.createUserEnteredValue(animalProfile.mainInfo.microchip);
        //MICROCHIP REGISTERED IN LLR
        values[15] = this.createUserEnteredValue(animalProfile.mainInfo.chipRegisteredWithUs ? 'Jah' : 'Ei');
        //PHOTO
        values[16] = this.createUserEnteredValue(row[16].formattedValue);
        //RESCUE DATE
        values[17] = this.createUserEnteredValue(formatDate(animalProfile.mainInfo.rescueDate));
        //ARRIVAL AT SHELTER DATE
        values[18] = this.createUserEnteredValue(row[18].formattedValue);
        //ADOPTION DATE
        values[19] = this.createUserEnteredValue(row[19].formattedValue);
        //FINDING LOCATION
        values[20] = this.createUserEnteredValue(row[20].formattedValue);
        //LAST POSTED ON FACEBOOK
        values[21] = this.createUserEnteredValue(row[21].formattedValue);
        //LAST POSTED ON WEBSITE
        values[22] = this.createUserEnteredValue(row[22].formattedValue);
        //SPAYED OR NEUTERED
        values[23] = this.createUserEnteredValue(animalProfile.mainInfo.spayedOrNeutered ? 'Jah' : 'Ei');
        //COMPLEX VACCINE
        values[24] = this.createUserEnteredValue(row[24].formattedValue);
        //NEXT VACCINE DATE
        values[25] = this.createUserEnteredValue(row[25].formattedValue);
        //RABIES VACCINE
        values[26] = this.createUserEnteredValue(row[26].formattedValue);
        //NEXT RABIES DATE
        values[27] = this.createUserEnteredValue(row[27].formattedValue);
        //DEWORMING OR FLEA TREATMENT DATE
        values[28] = this.createUserEnteredValue(row[28].formattedValue);
        //DEWORMING OR FLEA TREATMENT NAME
        values[29] = this.createUserEnteredValue(row[29].formattedValue);
        //OTHER
        values[30] = this.createUserEnteredValue(animalProfile.mainInfo.additionalNotes);
        return values;
        */
    }

    function findRowToEdit($animalRescueSequenceNumber) {
        //TODO vajab uuesti implementeerimist.
        /*
        const sheet = await this.getSheetData(process.env.CATS_SHEETS_ID!, process.env.CATS_TABLE_NAME!);
        const sheetRows = sheet.data.sheets![0].data![0].rowData!;

        for (let index = 1; index < sheetRows.length; index++) {
            const row = sheetRows[index];
            const rescueSequenceNumber = row.values![1].formattedValue;

            if (rescueSequenceNumber !== animalRescueSequenceNumber) {
                continue;
            }

            return [row, index, sheet.data.sheets![0].properties!.sheetId!];
        }
        return null;
        */
    }

    public static function updateAnimalDataInSeets($animal): void {
        //TODO vajab implementeerimist.

        $row = self::findRowToEdit($animal->mainInfo->rankNr);
        if (!$row) {
            //TODO handle case when row is not found.
            return;
        }
        $values = self::getUpdatedData($row, $animal);
    }
}
