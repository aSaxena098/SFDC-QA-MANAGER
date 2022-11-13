trigger DuplicateEmpIDCreation on Employee__c (before INSERT,before UPDATE,after update) {
    switch on Trigger.OperationType {
        when BEFORE_INSERT {
            Set<String> empIdSet = new Set<String>();
            for(Employee__c empRec:Trigger.new){
                empIdSet.add(empRec.Emp_ID__c);
            }
            List<Employee__c> empList = [SELECT Id,Emp_ID__c FROM Employee__c WHERE Emp_ID__c IN:empIdSet];
            for(Employee__c empNewrec: Trigger.new){
                if(empList.size()>0){
                    empNewrec.Emp_ID__c.addError('Employee ID is already in use');
                }
            }
        }
        when AFTER_UPDATE{
            for(Employee__c empRec:Trigger.new){
                if(empRec.Send_Mail__c==true && Trigger.oldMap.get(empRec.Id).Send_Mail__c==false && empRec.BTO_Days__c<9){
                    List<Messaging.Email> emailList = new List<Messaging.Email>();
                    Messaging.SingleEmailMessage emailMsg = new Messaging.SingleEmailMessage();
                    String[] toAddresses = new String[]{empRec.Email_Id__c};
                    emailMsg.setToAddresses(toAddresses);
                    String emailSub = 'BTO Reminder';
                    emailMsg.setSubject(emailSub);

                    String content = 'Please increase your BTO Days as they are less than 9';
                    emailMsg.setHtmlBody(content);
                    emailList.add(emailMsg);

                    Messaging.sendEmail(emailList);

                }
            }
        }
    }
}