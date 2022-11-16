/*
if task is not complted on time raise escalitions or warning messages. --> have to make end users for this feedback
*/ 

trigger TaskManagement on Task_Manager__c (before update,before insert,after update,after insert) {
    switch on Trigger.OperationType {
        when BEFORE_INSERT{
            for(Task_Manager__c task:Trigger.new){
                if(task.Is_Completed__c==true)
                {
                    task.addError('You can not remove the Complted On Date field');
                }
                else if(task.Completed_On__c!=null)
                {
                    task.addError('You can not fill the Completed on field of the task');
                }
                else
                {
                    task.Assigned_Date__c = system.today();
                }
            }
        }
        when AFTER_UPDATE{
            List<String> taskNameList = new List<String>();
            for(Task_Manager__c taskRec : Trigger.new)
            {
                if(taskRec.Is_Completed__c==false && Trigger.oldMap.get(taskRec.Id).Is_Completed__c==true)
                {
                    taskNameList.add(taskRec.Name);
                }
            }
            TaskCompleted.updateCompletedDate(taskNameList);
        }
    }
}