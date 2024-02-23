const no = 0;
const yes = 1;

const boolEnum = {
    no,
    yes,
    
    items: [{
        id: no, 
        text: 'Nie'
    }, {
        id: yes,
        text: 'Tak'
    }],

    getText(id: number): string {
        const item = this.items.find((u) => u.id === Number(id));

        return item ? item.text : '';
    },    
};

export default boolEnum;


