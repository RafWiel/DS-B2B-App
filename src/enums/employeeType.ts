const none = 0;
const administrator = 1;
const supervisor = 2;
const employee = 3;

export const employeeType = {
    none,
    administrator,
    supervisor,
    employee,

    items: [{
        id: none, 
        text: ''
    }, {
        id: administrator,
        text: 'Administrator'
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


