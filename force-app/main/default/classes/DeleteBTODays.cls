public with sharing class DeleteBTODays {
    @AuraEnabled
    public static void DeleteBTODaysForAllEmp() {
        List<Employee__c> empList = [SELECT Id,BTO_DAYS__c FROM Employee__c WHERE BTO_DAYS__c !=0];
        List<Employee__c> newEmpList = new List<Employee__c>();
        for(Employee__c empRec:empList){
            empRec.BTO_DAYS__c = 0;
            newEmpList.add(empRec);
        }
        UPDATE newEmpList;
    }
}