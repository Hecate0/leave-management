import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InventoryService } from '../inventory.service';
import { AlertService } from '../alert.service';
import { group } from '@angular/animations';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  visible: boolean = true;
  changetype: boolean = true;
  registerformE: any = FormGroup; // Use FormGroup type
  // manager:any =  FormGroup;
  errorMessage: string = '';
  visibleEmployeeForm: boolean = false;
  visibleManagerForm: boolean = false;
  managerIds:string[]=[];
  employeeIds: string[] = ['2427RS01E1', '2427RS01E2', '2427RS01E3','2427RS01E4','2427RS01E5','2427RS01E6','2427RS01E9','2427RS01E7', '2427RS01B7','2425RS01V5'];
  departments: string[] = ['Software', 'J1C', 'Monitering', 'Rapido', 'Digital Marketing'];
  roles: string[] = ['ROLE_EMPLOYEE', 'ROLE_MANAGER'];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private inventoryService: InventoryService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
     //this.manager = this.fb.group({
      //userId: ['']
    //});

    this.inventoryService.manager().subscribe((res:any)=>{
     this.managerIds = res;
    }),(err:any) =>{
      console.log(err)
    }

    this.registerformE = this.fb.group({
      name: ['', Validators.required],
      password: ['', Validators.required],
      role: ['', Validators.required],
      mobileNo: ['', Validators.required],
      email: ['', Validators.required],
      departmentName: ['', Validators.required],
      manager: [null ||  '']
    });
  }

  showEmployeeForm() {
    this.visibleEmployeeForm = true;
    this.visibleManagerForm = false;
  }

  showManagerForm() {
    this.visibleManagerForm = true;
    this.visibleEmployeeForm = false;
  }

  submitted: boolean = false;
  registerE() {
    this.submitted = true;
    if (this.registerformE.valid) {
      let role = this.registerformE.value.role;
      if(role === 'ROLE_MANAGER') {
        delete this.registerformE.value.manager
      } else {
        this.registerformE.value.manager = {userId: this.managerIds[0]}
      }
      this.inventoryService.registerNew(this.registerformE.value).subscribe((res: any) => {
        console.log(res)
        if (res?.statusCode === 201) {
          this.alertService.snackSuccess("Registered Successful")
          this.router.navigate(['/login']);
        } 
      },
        (err: any) => {
          console.log(err)
            this.alertService.snackError(err.error.errmessage,);
       
        }
      );
    }
  }

  viewpass() {
    this.visible = !this.visible;
    this.changetype = !this.changetype;
  }

  get f() { return this.registerformE.controls; }
}
