export interface INewServiceRequest {
    id: number;   
    customerId: number;    
    topic: string;
    description: string;    
    requestType: number;
    submitType: number;    
    softwareProduct: number;
    softwareModule: number;
    softwareVersion: string;
    softwareOS: number;
}
