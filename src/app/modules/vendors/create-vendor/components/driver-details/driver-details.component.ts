import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationModalComponent } from 'src/app/shared/components/confirmation-modal/confirmation-modal.component';
import { ToastService } from 'src/app/shared/components/toast/toast.service';
import { RiderAndDriverStatus } from 'src/app/shared/models/constants/vendor-registration-types';
import { VendorRegistrationService } from 'src/app/shared/services/vendor-registration.service';

@Component({
  selector: 'app-driver-details',
  templateUrl: './driver-details.component.html',
  styleUrls: ['./driver-details.component.scss']
})
export class DriverDetailsComponent implements OnInit {
  @Input() disableAll: boolean;
  buttonText: string = 'save & next';
  driverId: string;
  currentDriverStatus: RiderAndDriverStatus;

  driverDetailsForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    type: new FormControl('', [Validators.required]),
    contact: new FormControl('', [Validators.required]),
    dob: new FormControl('', [Validators.required]),
    photoDoc: new FormControl('', [Validators.required]),
    photoUrl: new FormControl('', [Validators.required]),
    panDoc: new FormControl('', [Validators.required]),
    panDocUrl: new FormControl('', [Validators.required]),
    aadharFrontDoc: new FormControl('', [Validators.required]),
    aadharFrontUrl: new FormControl('', [Validators.required]),
    aadharBackDoc: new FormControl('', [Validators.required]),
    aadharBackUrl: new FormControl('', [Validators.required]),
    drivingLicenseDoc: new FormControl('', [Validators.required]),
    drivingLicenseUrl: new FormControl('', [Validators.required]),
    cancelledChequeDoc: new FormControl('', [Validators.required]),
    cancelledChequeUrl: new FormControl('', [Validators.required]),
    accountNumber: new FormControl('', [Validators.required]),
    ifscCode: new FormControl('', [Validators.required]),
  })
  constructor(private activeRoute: ActivatedRoute, private vendorService: VendorRegistrationService,
    private toastMsgService: ToastService, private dialog: MatDialog) {
    this.driverId = this.activeRoute.snapshot.paramMap.get('outletId');
  }

  ngOnInit(): void {
    if (this.disableAll) {
      this.driverDetailsForm.disable();
      this.buttonText = 'next';
    }
  }


  getFileUploadUrl(file: FileList, controlName: string) { }

  /**
   * Method that opens file in new tab
   * @param controlName 
   */
  viewFile(controlName: string) {
    window.open(this.driverDetailsForm.get(controlName).value)
  }

  /**
 * Method that navigates to home page
 */
  goToHome() {
    window.history.back();
  }

  approveDriverDetails() {
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      data:
      {
        title: 'Are you sure?',
        message: 'You have approved the request. Do you still want to continue?'
      }
    });
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.vendorService.approveRiderAndDriver(this.driverId).subscribe(res => {
          window.history.back();
        })
      }
    })
  }

  rejectDriverDetails() {
    if (!this.vendorService.remarks) {
      this.toastMsgService.showWarning('Kindly add remarks');
      return;
    }
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      data:
      {
        title: 'Are you sure?',
        message: 'You have rejected the request. Do you still want to continue?'
      }
    });
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.vendorService.rejectRiderAndDriver(this.driverId).subscribe(res => {
          window.history.back();
        })
      }
    })
  }

}
