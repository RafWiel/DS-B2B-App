const none = 0;
const www = 1;
const email = 2;
const phone = 3;
const internal = 4;

export const serviceRequestSubmitType = {
    none,
    www,
    email,
    phone,
    internal,

    items: [{
        id: none, 
        text: ''
    }, {
        id: www,
        text: 'WWW'
    }, {
        id: email,
        text: 'E-mail'
    }, {
        id: phone,
        text: 'Telefon' 
    }, {
        id: internal,
        text: 'Wewnętrzne' 
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



