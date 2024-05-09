const none = 0;
const other = 1;
const classic = 2;
const optima = 3;
const xl = 4;

const min = other;
const max = xl;

export const softwareProductType = {
    min,
    none,
    other,
    classic,
    optima,
    xl,
    max,

    items: [{
        id: none, 
        text: ''
    }, {
        id: other,
        text: 'Inny'
    }, {
        id: classic,
        text: 'Comarch ERP Klasyka'
    }, {
        id: optima,
        text: 'Comarch ERP Optima' 
    }, {
        id: xl,
        text: 'Comarch ERP XL' 
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



