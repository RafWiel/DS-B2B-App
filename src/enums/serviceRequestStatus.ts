const none = 0;
const submited = 1;
const accepted = 2;
const ongoing = 3;
const rejected = 4;
const closed = 5;
const closedInvoicing = 6;
const closedInvoice = 7;
const archived = 8;

export const serviceRequestStatus = {
    none,
    submited,
    accepted,
    ongoing,
    rejected,
    closed,
    closedInvoicing,
    closedInvoice,
    archived,

    items: [{
        id: none, 
        text: ''
    }, {
        id: submited,
        text: 'Zgłoszone'
    }, {
        id: accepted,
        text: 'Przyjęte'
    }, {
        id: ongoing,
        text: 'W realizacji' 
    }, {
        id: rejected,
        text: 'Odrzucone' 
    }, {
        id: closed,
        text: 'Zamknięte' 
    }, {
        id: closedInvoicing,
        text: 'Zamknięte do fakturowania' 
    }, {
        id: closedInvoice,
        text: 'Zamknięte faktura' 
    }, {
        id: archived,
        text: 'Zarchiwizowane' 
    }],

    getText(id: number): string {
        const item = this.items.find((u) => u.id === Number(id));

        return item ? item.text : '';
    },

    getFilterText(id: number): string {
        if (id === none) {
            return 'Wszystkie';
        }

        return this.getText(id);
    },
};



