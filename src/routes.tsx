import ArticleIcon from '@mui/icons-material/Article';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PeopleAltIcon from '@mui/icons-material/People';
import FactoryIcon from '@mui/icons-material/Factory';
import BadgeIcon from '@mui/icons-material/Badge';

const home = '/';
const companies = '/companies';
const company = '/companies/:id';
const customers = '/customers';
const customer = '/customers/:id';
const employees = '/employees';
const employee = '/employees/:id';
const phoneConsultations = '/phone-consultations';
const registrationRequests = '/registration-requests';
const serviceRequests = '/service-requests';


const routes = {
    home,
    companies,
    company,    
    customers,
    customer,
    employees,
    employee,    
    phoneConsultations,
    registrationRequests,
    serviceRequests,    

    items: [{
        id: home, 
        text: 'Home',
        isSidebarItem: false,
    }, {
        id: companies,
        text: 'Firmy',
        isSidebarItem: true,
        sidebarIndex: 3,
        renderIcon: () => {
            return <FactoryIcon />;
        }
    }, {
        id: company,
        text: 'Firma',
        isSidebarItem: false,        
    }, {
        id: customers,
        text: 'Klienci',
        isSidebarItem: true,
        sidebarIndex: 4,
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
        sidebarIndex: 5,
        renderIcon: () => {
            return <BadgeIcon />;
        }
    }, {
        id: employee,
        text: 'Pracownik',
        isSidebarItem: false        
    }, {
        id: phoneConsultations,
        text: 'Konsultacje telefoniczne',
        isSidebarItem: true,
        sidebarIndex: 2,
        renderIcon: () => {
            return <PhoneIcon />;
        }
    }, {
        id: registrationRequests,
        text: 'Zgłoszenia rejestracji',
        isSidebarItem: true,
        sidebarIndex: 1,
        renderIcon: () => {
            return <PersonAddIcon />;
        }
    }, {
        id: serviceRequests,
        text: 'Zlecenia serwisowe',
        isSidebarItem: true,    
        sidebarIndex: 0,    
        renderIcon: () => {
            return <ArticleIcon />;
        }
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


