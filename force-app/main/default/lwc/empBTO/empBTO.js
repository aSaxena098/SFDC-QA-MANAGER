import { LightningElement, wire } from 'lwc';
import getEmpListDatatable from '@salesforce/apex/EmpListListDatatable.getEmpListDatatable';
import DeleteBTODaysForAllEmp from '@salesforce/apex/DeleteBTODays.DeleteBTODaysForAllEmp';
// import createAndSendCSVFile from '@salesforce/apex/EmailHandler.createAndSendCSVFile';
import { exportCSVFile } from 'c/utils';
import { refreshApex } from '@salesforce/apex';
import { getListUi } from 'lightning/uiListApi';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import Emp_Obj from '@salesforce/schema/Employee__c';
const cols = [
   { label: "Name", fieldName: "Name" },
   { label: "EMP ID", fieldName: "EMP_ID__c" },
   { label: "Grade", fieldName: "Grade__c" },
   { label: "Project Name", fieldName: "Project_Name__c", editable: true },
   { label: "Base Location", fieldName: "Base_Location__c" },
   { label: "BTO Days", fieldName: "BTO_Days__c", editable: true },
   { label: "Send Mail", fieldName: "Send_Mail__c", editable: true, type: 'boolean' },
]
export default class EmpBTO extends LightningElement {
   /*Implementing Datatable*/
   refreshData;
   totalPages
   currentpage = 1
   empRecords = [];
   filteredRecords = [];
   columns = cols;
   pageToken = null;
   previousPageToken = null;
   nextPageToken = null;
   pagesize = 5
   draftValues = [];
   @wire(getListUi, {
      objectApiName: Emp_Obj,
      listViewApiName: 'BTO_Tracker',
      pageSize: '$pagesize',
      pageToken: '$pageToken'
   })
   empRecordsHandler({ data, error }) {
      if (data) {
         console.log(data);
         this.filteredRecords = data.records.records.map(item => {
            return {
               "Id": this.getValue(item, 'Id'),
               "Name": this.getValue(item, 'Name'),
               "EMP_ID__c": this.getValue(item, 'EMP_ID__c'),
               "Grade__c": this.getValue(item, 'Grade__c'),
               "Project_Name__c": this.getValue(item, 'Project_Name__c'),
               "Base_Location__c": this.getValue(item, 'Base_Location__c'),
               "BTO_Days__c": this.getValue(item, 'BTO_Days__c'),
               "Send_Mail__c": this.getValue(item, 'Send_Mail__c')
            }
         })
         // this.currentpage=1;
         this.totalPages = Math.floor(this.empRecords.length / this.pagesize) + 1;
         this.nextPageToken = data.records.nextPageToken;
         this.previousPageToken = data.records.previousPageToken;
      }
      if (error) {
         console.log(error);
      }
   }

   getValue(data, field) {
      return data.fields[field].value;
   }

   /*Pagination Buttons*/

   handleNextPageHandler() {
      this.pageToken = this.nextPageToken;

      if (this.currentpage == this.totalPages) {
         this.currentpage = 1;
      } else {
         this.currentpage++;
      }
   }
   handlePreviousPageHandler() {
      this.pageToken = this.previousPageToken;
      if (this.currentpage == 1) {
         this.currentpage = 1
      } else {
         this.currentpage--;
      }

   }

   /*Implemnting Apex and LWC for search functionality */
   @wire(getEmpListDatatable)
   empSearchList({ data, error }) {
      if (data) {
         console.log(data);
         this.empRecords = data;
         this.filteredRecords = data;
      }
      if (error) {
         console.error(error);
      }
   }

   /*Searching the Datatable*/
   searchHandler(event) {
      if (event.keyCode === 13) {
         const { value } = event.target
         console.log(value);
         if (value) {
            this.filteredRecords = this.empRecords.filter(eachObj => {
               return Object.keys(eachObj).some(key => {
                  return eachObj[key] == value;
               })
            })
         }
         else {
            this.empRecordsHandler(this.empRecords);
         }
      }


   }

   /*Refreshing the Datatable*/
   @wire(getListUi, {
      objectApiName: Emp_Obj,
      listViewApiName: 'BTO_Tracker',
      pageSize: '$pagesize',
      pageToken: '$pageToken'
   })
   refreshDatatable(response) {
      this.refreshData = response;
   }
   refreshHandler(event) {
      // eval("$A.get('e.force:refreshView').fire();");
      refreshApex(this.refreshData);
   }

   /*Save Button*/
   saveDraftValuesHandler(event) {
      console.log(JSON.stringify(event.detail.draftValues));
      const recordInputs = event.detail.draftValues.map(item => {
         const fields = { ...item };
         return { fields: fields };
      });
      const promises = recordInputs.map(item => {
         updateRecord(item);
      })
      Promise.all(promises).then(() => {
         console.log('Bto is updated');
         this.draftValues = [];
         this.dispatchEvent(new ShowToastEvent({
            title: 'BTO-Update',
            message: 'BTO Days are Updated',
            variant: 'success'
         }))
      })

         .catch((error) => {
            this.dispatchEvent(new ShowToastEvent({
               title: 'BTO-Update',
               message: 'BTO Days are not updated' + error,
               variant: 'error'
            }));
         })
   }
   /*Creating headers in CSV file For BTO*/
   headers = {
      Name: 'Name',
      EMP_ID__c: 'EMP ID',
      Grade__c: 'Grade',
      Project_Name__c: 'Project Name',
      Base_Location__c: 'Base Location',
      BTO_Days__c: 'BTO Days',
   }

   /*exporting in the form of cvs file*/

   exportHandler() {
      console.log('download triggered');
      refreshApex(this.refreshData);
      exportCSVFile(this.headers, this.empRecords, "BTO");
      console.log('menthod completed');
   }

   /*Mail Handler*/
   // @wire(createAndSendCSVFile)
   // sendMail
   // mailHandler() {
   //    this.sendMail();
   //    console.log('mail sent');
   // }

   /* delte BTO Days from every EMP Record*/


   showPopUp;
   deleteBTODaysHandler() {
      this.showPopUp = true;
      console.log('delete initiated');
   }
   closeDeletePopUp() {
      this.showPopUp = false;
   }
   okDeleteDays() {
      console.log('deleting days apex method should be initiated first!!')
      DeleteBTODaysForAllEmp();
      this.showPopUp = false;

   }
}