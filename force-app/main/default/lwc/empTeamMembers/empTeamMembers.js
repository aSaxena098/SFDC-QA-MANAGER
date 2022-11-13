import { LightningElement,wire,api,track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { getRecord, createRecord, updateRecord, deleteRecord, getRecordUi, getFieldValue, getFieldDisplayValue, getRecordCreateDefaults, createRecordInputFilteredByEditedFields, generateRecordInputForCreate, generateRecordInputForUpdate } from 'lightning/uiRecordApi';
import Project_Name from '@salesforce/schema/Employee__c.Project_Name__c';
import getTeamMembersList from '@salesforce/apex/EmpTeamMembers.getTeamMembersList';
export default class EmpTeamMembers extends NavigationMixin(LightningElement) {
@api recordId
projectName 
teamMembersData;
@track isVisible = ''


@wire(getTeamMembersList,{projectName:'$projectName'})
teamMembers({data,error}){
    if(data){
        this.teamMembersData = [...data];
       // console.log(data);
    }
    if(error){
        console.log(error);
    }
}

@wire(getRecord,{
    recordId:'$recordId',
    fields:[Project_Name]
})
membersHandler({data,error}){
    if(data){
        this.projectName = data.fields.Project_Name__c.value
        console.log(data);
        
    }
    if(error){
        console.log(error);
    }
}


    handleTeamMembersDetails(event){
        let empRecordId = event.target.dataset.value;
         
        if(empRecordId==this.recordId){
           let empbutton =  event.target;
           console.log(JSON.stringify(empbutton.classList));
           //empbutton.classList.add("slds-hidden");
        }
        console.log("clicked")
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: empRecordId,
                objectApiName: 'Employee__c',
                actionName: 'view' 
                }
        })
    }


  

}