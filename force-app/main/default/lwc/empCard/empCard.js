import { LightningElement, wire } from 'lwc';
import { getFieldValue } from 'lightning/uiRecordApi';

/*importing the navigation modules*/
import { NavigationMixin } from 'lightning/navigation';


/*importing LMS*/
import { MessageContext, subscribe, publish } from 'lightning/messageService';
import FiltersChannels from '@salesforce/messageChannel/FilteresChannels__c';
import EmployeeRecordID from '@salesforce/messageChannel/EmployeeRecordID__c';

import Emp_Object from '@salesforce/schema/Employee__c';
import Name from '@salesforce/schema/Employee__c.Name';
import Base_loc from '@salesforce/schema/Employee__c.Base_Location__c';
import Emp_Id from '@salesforce/schema/Employee__c.EMP_ID__c';
import Designation from '@salesforce/schema/Employee__c.Designation__c';
import Phone_Number from '@salesforce/schema/Employee__c.Phone_No__c';
import Supervisor from '@salesforce/schema/Employee__c.Supervisor__c';
import Testing_Type from '@salesforce/schema/Employee__c.Testing_Type__c';
import Email_Id from '@salesforce/schema/Employee__c.Email_Id__c';
import N_1 from '@salesforce/schema/Employee__c.N_1__c';
import Emp_Image from '@salesforce/schema/Employee__c.Employee_Image__c';
export default class EmpCard extends NavigationMixin(LightningElement) {
   recordId = 'a045i000006qcZBAAY';
   empImage;
   name
   designation = Designation;
   testingType = Testing_Type;
   phoneNumber = Phone_Number;
   empId = Emp_Id;
   baseLocation = Base_loc;
   supervisor = Supervisor;
   emailId = Email_Id;
   n_1 = N_1;

   recordFormLoaded(event) {
      console.log(JSON.stringify(event.detail));
      const { records } = event.detail;
      const data = records[this.recordId];
      this.empImage = getFieldValue(data, Emp_Image);
      this.name = getFieldValue(data, Name);
   }

   connectedCallback() {
      this.subscribeMessage();
   }

   @wire(MessageContext)
   context

   subscribeMessage() {
      subscribe(this.context, EmployeeRecordID, (message) => { this.handleMessage(message) })
   }

   handleMessage(message) {
      this.recordId = message.recordIdData.value;
      console.log(this.recordId);
   }



   /*Navigation to the Record page of the Employee*/
   naviagteToRecordPage(){
      this[NavigationMixin.Navigate]({
         type: 'standard__recordPage',
         attributes: {
             recordId: this.recordId,
             objectApiName: 'Employee__c',
             actionName: 'view' 
         }
     })
   }



}