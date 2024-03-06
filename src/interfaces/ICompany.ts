import { ICustomer } from "./ICustomer";

export interface ICompany {
    id: number;
    erpId: number;
    name: string;
    taxNumber: string;
    address: string;
    postal: string;
    city: string;  
    customers: Array<ICustomer>  
}
