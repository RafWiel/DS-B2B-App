export interface IServiceRequest {
    id: number;       
    creationDate: Date;
    closureDate: Date;
    reminderDate: Date;
    ordinal: number;
    name: string;
    companyName: string;
    topic: string;
    description: string;
    status: number;
    requestType: number;
    submitType: number;
    invoice: string;
}
