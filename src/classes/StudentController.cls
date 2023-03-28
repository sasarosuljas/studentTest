/**
 * @description       : 
 * @author            : ChangeMeIn@UserSettingsUnder.SFDoc
 * @group             : 
 * @last modified on  : 12-28-2022
 * @last modified by  : ChangeMeIn@UserSettingsUnder.SFDoc
**/
public with sharing class StudentController {


    @AuraEnabled(cacheable=true)
    public static List<Student__c> getObjects(Id examId) {
        
        List<Student__c> students = [SELECT Name, Last_Name__c FROM Student__c 
            WHERE Id IN ( SELECT Student__c FROM Enrollment__c WHERE Exam__c = :examId )
        ];

        return students;
    }

    @AuraEnabled
    public static void deleteEnrollments (List<Id> studentIds, Id currentExamId) {

        // Delete the Enrollment__c records that are associated with the specified student IDs
        delete [
            SELECT Id
            FROM Enrollment__c
            WHERE Student__c IN :studentIds
            AND Exam__c = :currentExamId
      ];
    }

}