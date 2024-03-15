export interface ICustomer {
    id: number;
    companyId: number;
    type: number | string;
    login: string;
    name: string;
    phoneNumber: string;    
    email: string;
    isMailing: boolean; 
         
}
