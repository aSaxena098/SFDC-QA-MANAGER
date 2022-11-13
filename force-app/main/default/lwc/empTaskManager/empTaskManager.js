import { LightningElement, wire, api } from 'lwc';
import TaskObject from '@salesforce/schema/Task_Manager__c';
import { getListUi } from 'lightning/uiListApi';
const COLS = [
    { label: "Task-Id", fieldName: 'Name' },
    { label: "Task Details", fieldName: 'Task__c' },
    { label: "Primary", fieldName: 'Primary__c', type: 'boolean' },
    { label: "Complete By", fieldName: 'Complete_By__c' },
    { label: "Created By", fieldName: 'CreatedBy' },
]
export default class EmpTaskManager extends LightningElement {
    @api recordId
    isDataTableVisible
    task = [];
    taskData = [];
    columns = COLS;
    @wire(getListUi, {
        objectApiName: TaskObject,
        listViewApiName: "Employee_Tasks"
    })
    taskViewHandler({ data, error }) {
        if (data) {
            console.log(this.recordId);
            console.log(data);
            this.taskData = data.records.records.map(item => {
                console.log(item.fields.Task_Created_For__r.value.fields.Id.value);
                if (item.fields.Task_Created_For__r.value.fields.Id.value == this.recordId) {
                    return {
                        "Name": this.getValue(item, "Name"),
                        "Task__c": this.getValue(item, "Task__c"),
                        "Primary__c": this.getValue(item, "Primary__c"),
                        "Complete_By__c": this.getValue(item, "Complete_By__c"),
                        "CreatedBy": item.fields.CreatedBy['displayValue']
                    }
                } else {
                    // console.log('no task found');
                    return [...this.taskData];
                }
            })
            console.log(this.taskData);
            this.task = this.taskData.filter(ele => {
                if (ele.length != 0) {
                    return ele;
                }
            })
            console.log(this.task);
        }
        if (error) {
            console.log(error);
        }
    }

    getValue(data, field) {
        return data.fields[field].value
    }

}