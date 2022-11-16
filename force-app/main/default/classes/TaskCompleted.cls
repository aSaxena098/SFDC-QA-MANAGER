public with sharing class TaskCompleted {
    @AuraEnabled
    public static void updateIsCompleted(String taskName){
       // Integer taskNumber = Integer.valueof(taskName);
        List<Task_Manager__c> emptaskList = [SELECT ID,Name,Is_Completed__c,Completed_On__c FROM Task_Manager__c WHERE Name =: taskName];
        List<Task_Manager__c> updateEmpList = new List<Task_Manager__c>();
        for(Task_Manager__c task:emptaskList){
            task.Is_Completed__c = true;
            task.Completed_On__c = system.today();
            updateEmpList.add(task);
        }
        UPDATE updateEmpList;
    }

    public static void updateCompletedDate(List<String> taskNameList){
        List<Task_Manager__c> emptaskList = [SELECT ID,Name,Is_Completed__c,Completed_On__c FROM Task_Manager__c WHERE Name IN: taskNameList];
        List<Task_Manager__c> updateEmpList = new List<Task_Manager__c>();
        for(Task_Manager__c task:emptaskList){
            task.Is_Completed__c=false;
            task.Assigned_Date__c=system.today();
            task.Completed_On__c = null;
            updateEmpList.add(task);
        }
        UPDATE updateEmpList;
    }
}