/**
 * @description       : 
 * @author            : ChangeMeIn@UserSettingsUnder.SFDoc
 * @group             : 
 * @last modified on  : 12-28-2022
 * @last modified by  : ChangeMeIn@UserSettingsUnder.SFDoc
**/
public with sharing class NINVerification {
 
    @AuraEnabled(Cacheable=true)
    public static Boolean verifyNationalIdentificationNumber (String nationalIdentificationNumber) {

        // Check that the NIN ha 13 digits
        if (nationalIdentificationNumber.length() != 13) {
            return false;
        }
        // Extact the individual digits of the NIN
        List<Integer> digits = new List<Integer>();

        for (Integer i = 0; i < nationalIdentificationNumber.length(); i++) {
            digits.add(Integer.valueOf(nationalIdentificationNumber.substring(i, i + 1)));
        }
        System.debug('digits list ' + digits);


        // Check that the first two digits, second two digits
        Integer dayTwoDigits = digits[0] + digits[1];
        System.debug('dayTwoDigits ' + dayTwoDigits);
        Integer monthTwoDigits = digits[2] + digits[3];
        System.debug('monthTwoDigits ' + monthTwoDigits);

        if ( dayTwoDigits == 0 && monthTwoDigits == 0 ) {
            return false;
        } 
        
        // check constant
        if ( digits[7] != 5 && digits[8] != 0) {
            return false;
        }

        // Calculate the control sum
        Integer controlSum1 = (7 * (digits[0] + digits[6]) + 
          6 * (digits[1] + digits[7]) +
          5 * (digits[2] + digits[8]) +
          4 * (digits[3] + digits[8]) +
          3 * (digits[4] + digits[10]) +
          2 * (digits[5] + digits[11]));
        
        Integer controlSum2 = Math.mod(controlSum1, 11);
        Integer controlSum = (11 - controlSum2);

        // if the control sum is 10, the control sum for the national identification number is 0;
        if (controlSum > 9) {
            controlSum = 0;
        }

        // Check that the control sum of the national identification number is correct
        if ( controlSum != digits[12]) {
            return false;
        }

        return true;
    
    }
}