/**
 * @description       : 
 * @author            : ChangeMeIn@UserSettingsUnder.SFDoc
 * @group             : 
 * @last modified on  : 12-27-2022
 * @last modified by  : ChangeMeIn@UserSettingsUnder.SFDoc
**/
public with sharing class MyApexClass {

    @AuraEnabled(cacheable=true)
    public static Map<String, Object> getNationalIdentificationNumberData(String nationalIdentificationNumber) {
       
        try {
            // Make the HTTP GET request to the web service's URL
            Http http = new Http();
            HttpRequest request = new HttpRequest();
            request.setEndpoint('https://app.agilcon.com/job/emso.php?emso=' + nationalIdentificationNumber);
            request.setMethod('GET');
            HttpResponse response = http.send(request);

            // Parse the response data as JSON
            Map<String, Object> data = (Map<String, Object>) JSON.deserializeUntyped(response.getBody());
            return data;
            
        } catch (Exception e) {
            // An error occurred while making the HTTP request or parsing the response data.
            // You can handle the error here by logging it, displaying a message to the user, etc.
            Map<String, Object> error = new Map<String, Object> {
                'status' => 'ERROR',
                'message' => e.getMessage()
            };
            return error;
        }
    }
}