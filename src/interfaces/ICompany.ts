import { ICustomer } from "./ICustomer";

export interface ICompany {
    id: number;    
    name: string;
    erpId: number;
    taxNumber: string;
    address: string;
    postal: string;
    city: string;  
    customers: Array<ICustomer>  
}
