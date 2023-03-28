import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getNationalIdentificationNumberData from '@salesforce/apex/MyApexClass.getNationalIdentificationNumberData';
import verifyNationalIdentificationNumber from '@salesforce/apex/NINVerification.verifyNationalIdentificationNumber';


export default class CreateStudent extends LightningElement {

    showPayerField = false;

    handleTypeOfStudyChange(e) {
        this.showPayerField = e.target.value === 'Part-time';
    }

    @track nationalIdentificationNumber;
    @track result;
    @track error;
    @track apexBoolean;

    handleNationalIdentificationNumberChange(e) {
        this.nationalIdentificationNumber = e.target.value;
    }

    handleSubmit(event) {

        event.preventDefault(); // stop the form from submitting

        // Make the Apex call to the verifyNationalIdentificationNumber method
        // verifyNationalIdentificationNumber({ nationalIdentificationNumber: this.nationalIdentificationNumber }) 
        //     .then(result => {

        //         // Check whether the National Identification Number is valid
        //         if (result === true) {

        //             // The National Identification Number is valid, so proceed with the form submission
        //             const fields = event.detail.fields;
        //             this.template.querySelector('lightning-record-edit-form').submit(fields);
        //             const eventMessage = new ShowToastEvent({
        //                 title:'Success',
        //                 message:'New student is created!',
        //                 variant:'success',
        //                 mode: 'dismissable'
        //             });
        //             this.dispatchEvent(eventMessage);
                   
        //         } else {

        //             const eventMessage = new ShowToastEvent({
        //                 title:'Error',
        //                 message:'National Identification Number is not valid! Please enter it again.',
        //                 variant:'error',
        //                 mode: 'dismissable'
        //             });
        //             this.dispatchEvent(eventMessage);
        //         }
        //     })
        //     .catch(error => {
        //         console.log(error);
        //     });

        // Make the Apex call to the getNationalIdentificationNumberData method
        getNationalIdentificationNumberData({ nationalIdentificationNumber: this.nationalIdentificationNumber }) 
            .then(result => {

                // Check whether the National Identification Number is valid
                if (result.message === 'OK') {

                    // The National Identification Number is valid, so proceed with the form submission
                    const fields = event.detail.fields;
                    this.template.querySelector('lightning-record-edit-form').submit(fields);
                    const eventMessage = new ShowToastEvent({
                        title:'Success',
                        message:'New student is created!',
                        variant:'success',
                        mode: 'dismissable'
                    });
                    this.dispatchEvent(eventMessage);
                   
                } else {

                    const eventMessage = new ShowToastEvent({
                        title:'Error',
                        message: result.message,
                        variant:'error',
                        mode: 'dismissable'
                    });
                    this.dispatchEvent(eventMessage);
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    handleError(e) {
        // Get the `lightning-messages` component
        const messages = this.template.querySelector('lightning-messages');
        
        // Clear any existing error messages
        messages.clearError();
        
        // Add a custom error message to the `lightning-messages` component
        messages.addError('An error occurred while submitting the form. Please try again.');
    }

}