trigger TaskManagement on Task_Manager__c (before update,before insert,after update) {
    switch on Trigger.OperationType {
        when BEFORE_INSERT{
            for(Task_Manager__c task:Trigger.new){
                if(task.Is_Completed__c==true){
                    task.addError('You can check Is Completed Checkbox');
                }
                else if(task.Completed_On__c!=null){
                    task.addError('You can not fill the Completed on field of the task');
                }
            }
        }
        when AFTER_UPDATE{
            List<String> taskNameList = new List<String>();
            for(Task_Manager__c taskRec : Trigger.new){
                if(taskRec.Is_Completed__c==false && Trigger.oldMap.get(taskRec.Id).Is_Completed__c==true){
                    taskNameList.add(taskRec.Name);
                }
            }
            TaskCompleted.updateCompletedDate(taskNameList);
        }
    }
}