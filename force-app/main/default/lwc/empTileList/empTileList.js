import { LightningElement, wire, api } from 'lwc';
/*Importing Message Channels*/
import { MessageContext, subscribe, publish } from 'lightning/messageService';
import FiltersChannels from '@salesforce/messageChannel/FilteresChannels__c';
import EmployeeRecordID from '@salesforce/messageChannel/EmployeeRecordID__c';


import getEmpList from '@salesforce/apex/EmpListHandler.getEmpList';
export default class EmpTileList extends LightningElement {
   empId;
   empList;
   searchKey = '';
   @wire(getEmpList, { key: '$searchKey' })
   empListHandler({ data, error }) {
      if (data) {
         console.log(data);
         this.empList = [...data];
      }
      if (error) {
         console.log(error);
      }
   }

   /*Selevcting the record Id form the EMP Tile*/
   handleClickOnEmpCard(event) {
      let empRecordId = event.target.dataset.value;
      console.log(empRecordId);
      this.empId = empRecordId;
      this.sendPublishEmpRecordId();
   }


   /*Handling LMS*/


   connectedCallback() {
      this.subscribeMessage();
   }

   @wire(MessageContext)
   context

   sendPublishEmpRecordId() {
      let recordId = {
         recordIdData: {
            value: this.empId
         }
      }
      publish(this.context, EmployeeRecordID, recordId);
   }

   subscribeMessage() {
      subscribe(this.context, FiltersChannels, (message) => { this.handleMessage(message) })
   }

   handleMessage(message) {
      this.searchKey = message.searchKeyData.value;
   }
}