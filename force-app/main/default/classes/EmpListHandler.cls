public with sharing class EmpListHandler {




   @AuraEnabled(cacheable=true)
   public static List<Employee__c> getEmpList(String key){
      String searchKey = '%'+key+'%';
      if(key!=null){
         return [SELECT Id, Name, EMP_ID__c, Grade__c, Employee_Image__c FROM Employee__c WHERE NAME LIKE: searchKey];
      }
      return [SELECT Id, Name, EMP_ID__c, Grade__c, Employee_Image__c FROM Employee__c];
   }
}