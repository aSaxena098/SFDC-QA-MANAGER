import { LightningElement, wire, api } from 'lwc';
import updateIsCompleted from '@salesforce/apex/TaskCompleted.updateIsCompleted';
import TaskObject from '@salesforce/schema/Task_Manager__c';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getListUi } from 'lightning/uiListApi';
const actions = [
    { label: 'Task Completed', name: 'task_completed' },
];
const COLS = [
    { label: "Task-Id", fieldName: 'Name' },
    { label: "Task Details", fieldName: 'Task__c' },
    { label: "Primary", fieldName: 'Primary__c', type: 'boolean' },
    { label: "Complete By", fieldName: 'Complete_By__c' },
    { label: "Created By", fieldName: 'CreatedBy' },
    {
        type: 'action',
        typeAttributes: { rowActions: actions },
    },
];
export default class EmpTaskManager extends LightningElement {
    @api recordId
    isDataTableVisible = false;
    task = [];
    taskData = [];
    columns = COLS;
    record = {};

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
                if (item.fields.Task_Created_For__r.value.fields.Id.value == this.recordId && item.fields.Is_Completed__c.value == false) {
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
            this.isDataTableVisible = true;
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


    handleRowAction(event) {
        const eventName = event.detail.action.name;
        const row = event.detail.row;
        console.log(eventName);
        this.dispatchEvent(new ShowToastEvent({
            title: 'Task Completed',
            message: 'Assigned Task was Completed!!!',
            variant: 'success'
        }));
        this.deleteRow(row);
        // call apex method to udpate the is_completed field.


    }
    deleteRow(row) {
        console.log(JSON.stringify(row));
        console.log(row.Name, typeof row.Name);
        updateIsCompleted({ taskName: row.Name });
        const { id } = row;

        const index = this.findRowIndexById(id);
        if (index != -1) {
            this.task = this.task
                .slice(0, index)
                .concat(this.task.slice(index + 1));
        }
    }

    findRowIndexById(id) {
        let ret = -1;
        this.task.some((row, index) => {
            if (row.id === id) {
                ret = index;
                return true;
            }
            return false;
        });
        return ret;
    }

    showRowDetails(row) {
        this.record = row;
    }
}