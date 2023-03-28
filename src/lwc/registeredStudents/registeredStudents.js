import { LightningElement, api, track, wire } from 'lwc';
import  getObjects  from '@salesforce/apex/StudentController.getObjects';
import deleteEnrollments from '@salesforce/apex/StudentController.deleteEnrollments';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';


export default class RegisteredStudents extends NavigationMixin(LightningElement) {

    @track columns = [
        { label: 'Name', fieldName: 'Name'},
        { label: 'Last Name', fieldName: 'Last_Name__c'}
    ];
    
    @api examId;
    @api recordId;
    @track students;
    _wiredResult;
    
    @api ids = [];

    @wire(getObjects, {examId: '$recordId'}) wiredObjects(result) {
       
        this._wiredResult = result;
        this.examId = this.recordId;

            if (result.data) {
                this.students = result.data;
                this.error = undefined;

            } else if(result.error) {
                this.error = result.error;
                this.students = undefined;
            }
    }

 
    getSelectedRec() {

        var selectedRecords =  this.template.querySelector("lightning-datatable").getSelectedRows();

        if(selectedRecords.length > 0){
            
            selectedRecords.forEach(currentItem => {
                    this.ids.push(currentItem.Id);
                });

            try {
                deleteEnrollments( { studentIds: this.ids , currentExamId: this.examId } ).then(() => {

                    // Refresh the list of registerd students after the delete action is completed
                    this.refreshTable();

                    const eventMessage = new ShowToastEvent({
                        title:'Success',
                        message:'Student is deregistered from this exam!',
                        variant:'success',
                        mode: 'dismissable'
                    });
                    this.dispatchEvent(eventMessage);

                });

            } catch (error) {
                console.log("Error: "  + error);
            }
        } else {
            const eventMessage = new ShowToastEvent({
                title:'Information',
                message:'There are no students registered for this exam!',
                variant:'info',
                mode: 'dismissable'
            });
            this.dispatchEvent(eventMessage);
        }
    }

    refreshTable() {
        return refreshApex(this._wiredResult);
    }

    actionToCreateNewEnrollment() {
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Enrollment__c',
                actionName: 'new',
            }
        });
        
        this.refreshTable();
    }
}