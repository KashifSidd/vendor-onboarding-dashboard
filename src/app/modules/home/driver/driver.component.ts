import { Component, OnInit } from '@angular/core';
import { OutletCard, RiderAndDriverStatus, Roles, Services } from 'src/app/shared/models/constants/vendor-registration-types';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { VendorRegistrationService } from 'src/app/shared/services/vendor-registration.service';

@Component({
  selector: 'app-driver',
  templateUrl: './driver.component.html',
  styleUrls: ['./driver.component.scss']
})
export class DriverComponent implements OnInit {
  currentPage: number = 1;
  pageSize: number = 10;
  totalDriverRecords: number;
  driverList: OutletCard[] = [];
  search: string;
  role: Roles;
  readonly roles = Roles;
  approvalStatus: RiderAndDriverStatus[] = ['pending'];
  constructor(private authenticationService: AuthenticationService, private vendorService: VendorRegistrationService) { }
  ngOnInit(): void {
    this.role = this.authenticationService.role;
    this.getDriverList();
  }
  /**
   * Method that gets all riders list for approval
   * @param searchFlag 
   */
  getDriverList(searchFlag?: boolean) {
    if (searchFlag) {
      this.currentPage = 1;
    }
    const data = {
      filter: {
        approval_status: this.approvalStatus
      },
      pagination: {
        page_index: this.currentPage - 1,
        page_size: this.pageSize
      }
    }
    if (this.search) {
      data['search_text'] = this.search;
    }
    this.vendorService.filterRiderAndDriverList(Services.Driver, data).subscribe(res => {
      this.driverList = [];
      for (const i of res['result']['records']) {
        this.driverList.push(OutletCard.fromJson(i, Services.Driver));
      }
      this.totalDriverRecords = res['result']['total_records'];
    });
  }

}
