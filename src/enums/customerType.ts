const none = 0;
const supervisor = 2;
const employee = 3;

const customerType = {
    none,
    supervisor,
    employee,

    items: [{
        id: none, 
        text: ''
    }, {
        id: supervisor,
        text: 'Kierownik'
    }, {
        id: employee,
        text: 'Pracownik' 
    }],

    getText(id: number): string {
        const item = this.items.find((u) => u.id === Number(id));

        return item ? item.text : '';
    },

    getFilterText(id: number): string {
        if (id === none) {
            return 'Wszyscy';
        }

        return this.getText(id);
    },
};

export default customerType;


