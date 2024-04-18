const none = 0;
const software = 1;
const hardware = 2;
const other = 3;

const min = software;
const max = other;

export const serviceRequestType = {
    min,
    none,
    software,
    hardware,
    other,
    max,

    items: [{
        id: none, 
        text: ''
    }, {
        id: software,
        text: 'Programowe'
    }, {
        id: hardware,
        text: 'Sprzętowe'
    }, {
        id: other,
        text: 'Inne' 
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



