import { serviceRequestStatus } from "./serviceRequestStatus";

const none = 0;
const submited = 0x100 + serviceRequestStatus.submited; //maska 0xFF, zeby nie byla taka sama wartosc 
const active = 
    serviceRequestStatus.submited + 
    serviceRequestStatus.accepted + 
    serviceRequestStatus.ongoing;
const closed = 
    serviceRequestStatus.closed + 
    serviceRequestStatus.closedInvoicing + 
    serviceRequestStatus.closedInvoice + 
    serviceRequestStatus.archived;

export const serviceRequestSimpleStatus = {
    none,
    submited,
    active,    
    closed,
    
    items: [{
        id: none, 
        text: ''
    }, {
        id: active,
        text: 'Aktywne'
    }, {
        id: submited,
        text: 'Nowe'
    }, {
        id: closed,
        text: 'Zamknięte' 
    }],

    getText(id: number): string {
        const item = this.items.find((u) => u.id === Number(id));

        return item ? item.text : 'X';
    },

    getFilterText(id: number): string {
        if (id === none) {
            return 'Wszystkie';
        }

        return this.getText(id);
    },
};



