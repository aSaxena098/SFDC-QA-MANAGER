import { LightningElement, wire } from 'lwc';
/*Importing Message Channels*/
import { MessageContext, publish } from 'lightning/messageService';
import FiltersChannels from '@salesforce/messageChannel/FilteresChannels__c';


/*Importing the obj and fields and wire adaptors*/
import { getObjectInfo, getPicklistValues } from 'lightning/uiObjectInfoApi';
import Emp_Obj from '@salesforce/schema/Employee__c';
import Emp_Grade from '@salesforce/schema/Employee__c.Grade__c';
import Emp_Testing_Type from '@salesforce/schema/Employee__c.Testing_Type__c';
export default class EmpFilter extends LightningElement {

   filters = {
      searchKey: '',
      empGrade: 'A'
   }

   @wire(getObjectInfo, {
      objectApiName: Emp_Obj
   })
   empDetailId

   @wire(getPicklistValues, {
      recordTypeId: '$empDetailId.data.defaultRecordTypeId',
      fieldApiName: Emp_Grade
   })
   gradeList

   @wire(getPicklistValues, {
      recordTypeId: '$empDetailId.data.defaultRecordTypeId',
      fieldApiName: Emp_Testing_Type
   })
   testingTypeList





   serachEmpNameHandler(event) {
      this.filters = { ...this.filters, searchKey: event.target.value }
      console.log(event.target.value);
      this.searchNamePublishHandler();
   }

   handleCheckBox(event) {
      const { name, value } = event.target.dataset;
      console.log('name', name);
      console.log('value', value);
   }






   /*implementing LMS*/
   @wire(MessageContext)
   context

   searchNamePublishHandler() {
      const message = {
         searchKeyData: {
            value: this.filters.searchKey
         }
      }
      publish(this.context, FiltersChannels, message);
   }
}