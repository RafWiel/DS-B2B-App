const all = 0;
const administrator = 1;
const supervisor = 2;
const employee = 3;

const employeeType = {
    all,
    administrator,
    supervisor,
    employee,

    items: [{
        id: all, 
        text: 'Wszyscy'
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
};

export default employeeType;


