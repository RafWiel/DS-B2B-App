const none = 0;
const employee = 1;

export const ownershipType = {
    none,
    employee,
    
    items: [{
        id: none, 
        text: ''
    }, {
        id: employee,
        text: 'Moje'
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



