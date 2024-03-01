import ArticleIcon from '@mui/icons-material/Article';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PeopleAltIcon from '@mui/icons-material/People';
import FactoryIcon from '@mui/icons-material/Factory';
import BadgeIcon from '@mui/icons-material/Badge';

const home = '/';
const serviceRequests = '/service-requests';
const phoneConsultations = '/phone-consultations';
const registrationRequests = '/registration-requests';
const customers = '/customers';
const customer = '/customers/:id';
const companies = '/companies';
const employees = '/employees';
const employee = '/employees/:id';

const routes = {
    home,
    serviceRequests,
    phoneConsultations,
    registrationRequests,
    customers,
    customer,
    companies,
    employees,
    employee,

    items: [{
        id: home, 
        text: 'Home',
        isSidebarItem: false,
    }, {
        id: serviceRequests,
        text: 'Zlecenia serwisowe',
        isSidebarItem: true,        
        renderIcon: () => {
            return <ArticleIcon />;
        }
    }, {
        id: phoneConsultations,
        text: 'Konsultacje telefoniczne',
        isSidebarItem: true,
        renderIcon: () => {
            return <PhoneIcon />;
        }
    }, {
        id: registrationRequests,
        text: 'Zgłoszenia rejestracji',
        isSidebarItem: true,
        renderIcon: () => {
            return <PersonAddIcon />;
        }
    }, {
        id: companies,
        text: 'Firmy',
        isSidebarItem: true,
        renderIcon: () => {
            return <FactoryIcon />;
        }
    }, {
        id: customers,
        text: 'Klienci',
        isSidebarItem: true,
        renderIcon: () => {
            return <PeopleAltIcon />;
        }
    }, {
        id: customer,
        text: 'Klient',
        isSidebarItem: false        
    }, {
        id: employees,
        text: 'Pracownicy',
        isSidebarItem: true,
        renderIcon: () => {
            return <BadgeIcon />;
        }
    }, {
        id: employee,
        text: 'Pracownik',
        isSidebarItem: false        
    }],
    
    getText(id: string): string {        
        const item = this.items.find((u) => u.id === String(id));

        return item ? item.text : '';
    },

    getTextUpper(id: string): string {
        return this.getText(id).toUpperCase();
    },

    isText(id: string): boolean {        
        const item = this.items.find((u) => u.id === String(id));

        return item ? item.isSidebarItem : false;
    },
};

export default routes;


