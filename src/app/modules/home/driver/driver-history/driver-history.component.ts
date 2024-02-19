import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OutletCard, RiderAndDriverStatus, RiderAndDriverStatusList, Services } from 'src/app/shared/models/constants/vendor-registration-types';
import { VendorRegistrationService } from 'src/app/shared/services/vendor-registration.service';

@Component({
  selector: 'app-driver-history',
  templateUrl: './driver-history.component.html',
  styleUrls: ['./driver-history.component.scss']
})
export class DriverHistoryComponent implements OnInit {
  currentPage: number = 1;
  pageSize: number = 10;
  totalDriverRecords: number;
  historyDriverList: OutletCard[] = [];
  search: string;
  approvalStatus: RiderAndDriverStatus[] = ['approved', 'rejected'];
  readonly driverStatusList = RiderAndDriverStatusList;
  constructor(private vendorService: VendorRegistrationService, private router: Router) { }
  ngOnInit(): void {
    this.showHistoryRiderList();
  }
  /**
  * Method that redirects to view-outlet details page from history tab
  * @param driverId 
  */
  viewDriver(driverId) {
    this.router.navigate(['vendors/view-vendor', driverId], { queryParams: { service: Services.Driver } });
  }
  /**
* Method that shows history tab rider list for admin
* @param pageIndex 
* @param pageSize 
*/
  showHistoryRiderList(searchFlag?: boolean) {
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
      this.historyDriverList = [];
      for (const i of res['result']['records']) {
        this.historyDriverList.push(OutletCard.fromJson(i));
      }
      this.totalDriverRecords = res['result']['total_records'];
    }
    )
  }

}
