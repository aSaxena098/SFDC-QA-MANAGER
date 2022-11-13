public with sharing class EmpTeamMembers {
    @AuraEnabled(cacheable=true)
    public static List<Employee__c> getTeamMembersList(String projectName){
        return [SELECT Id, Name, Grade__c,Email_ID__c ,Employee_Image__c FROM Employee__c WHERE Project_Name__c =: projectName]; 
    }
}