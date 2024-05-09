import { softwareProductType } from "./softwareProductType";

const none = 0;
const other = 1;

const classicInvoices = 10;
const classicTrade = 11;
const classicTradeCs = 12;
const classicTaxBook = 13;
const classicTradeBook = 14;
const classicHrAndPayroll = 15;
const classicPayrollPlus = 16;

const optimaCashRegisterBank = 30;
const optimaInvoices = 31;
const optimaTrade = 32;
const optimaTradePlus = 33;
const optimaService = 34;
const optimaBI = 35;
const optimaAssets = 36;
const optimaTaxBook = 37;
const optimaTradeBook = 38;
const optimaTradeBookPlus = 39;
const optimaCRM = 40;
const optimaHrAndPayroll = 41;
const optimaHrAndPayrollPlus = 42;
const optimaAnalysis = 43;

const xlSale = 60;
const xlImport = 61;
const xlOrders = 62;
const xlAccounting = 63;
const xlAssets = 64;
const xlService = 65;
const xlDepartmentsAdministrator = 66;
const xlCRM = 67;
const xlProduction = 68;
const xlBI = 69;
const xlHrAndPayroll = 70;

const min = other;
const max = xlHrAndPayroll;

export const softwareModuleType = {
    min,
    none,
    other,
    classicInvoices,
    classicTrade,
    classicTradeCs,
    classicTaxBook,
    classicTradeBook,
    classicHrAndPayroll,
    classicPayrollPlus,
    optimaCashRegisterBank,
    optimaInvoices,
    optimaTrade,
    optimaTradePlus,
    optimaService,
    optimaBI,
    optimaAssets,
    optimaTaxBook,
    optimaTradeBook,
    optimaTradeBookPlus,
    optimaCRM,
    optimaHrAndPayroll,
    optimaHrAndPayrollPlus,
    optimaAnalysis,
    xlSale,
    xlImport,
    xlOrders,
    xlAccounting,
    xlAssets,
    xlService,
    xlDepartmentsAdministrator,
    xlCRM,
    xlProduction,
    xlBI,
    xlHrAndPayroll,
    max,

    items: [{
        id: none, 
        productId: [ softwareProductType.none, softwareProductType.other, softwareProductType.classic, softwareProductType.optima, softwareProductType.xl ],
        text: ''
    }, {
        id: other,
        productId: [ softwareProductType.other, softwareProductType.classic, softwareProductType.optima, softwareProductType.xl ],
        text: 'Inny'
    }, {
        id: classicInvoices,
        productId: [softwareProductType.classic],
        text: 'Faktury (FA)'
    }, {
        id: classicTrade,
        productId: [softwareProductType.classic],
        text: 'Handel (FPP)' 
    }, {
        id: classicTradeCs,
        productId: [softwareProductType.classic],
        text: 'Handel CS (FPP CS)' 
    }, {
        id: classicTaxBook,
        productId: [softwareProductType.classic],
        text: 'Księga podatkowa (KP)' 
    }, {
        id: classicTradeBook,
        productId: [softwareProductType.classic],
        text: 'Księga handlowa (KH)' 
    }, {
        id: classicHrAndPayroll,
        productId: [softwareProductType.classic],
        text: 'Płace i Kadry (PIK)' 
    }, {
        id: classicPayrollPlus,
        productId: [softwareProductType.classic],
        text: 'Płace Plus (PLP)' 
    }, {
        id: optimaCashRegisterBank,
        productId: [softwareProductType.optima],
        text: 'Kasa Bank' 
    }, {
        id: optimaInvoices,
        productId: [softwareProductType.optima],
        text: 'Faktury' 
    }, {
        id: optimaTrade,
        productId: [softwareProductType.optima],
        text: 'Handel' 
    }, {
        id: optimaTradePlus,
        productId: [softwareProductType.optima],
        text: 'Handel Plus' 
    }, {
        id: optimaService,
        productId: [softwareProductType.optima],
        text: 'Serwis' 
    }, {
        id: optimaBI,
        productId: [softwareProductType.optima],
        text: 'Analizy BI' 
    }, {
        id: optimaAssets,
        productId: [softwareProductType.optima],
        text: 'Środki trwałe' 
    }, {
        id: optimaTaxBook,
        productId: [softwareProductType.optima],
        text: 'Księga podatkowa' 
    }, {
        id: optimaTradeBook,
        productId: [softwareProductType.optima],
        text: 'Księga handlowa' 
    }, {
        id: optimaTradeBookPlus,
        productId: [softwareProductType.optima],
        text: 'Księga handlowa Plus' 
    }, {
        id: optimaCRM,
        productId: [softwareProductType.optima],
        text: 'CRM' 
    }, {
        id: optimaHrAndPayroll,
        productId: [softwareProductType.optima],
        text: 'Płace i Kadry' 
    }, {
        id: optimaHrAndPayrollPlus,
        productId: [softwareProductType.optima],
        text: 'Płace i Kadry Plus' 
    }, {
        id: optimaAnalysis,
        productId: [softwareProductType.optima],
        text: 'Analizy' 
    }, {
        id: xlSale,
        productId: [softwareProductType.xl],
        text: 'Sprzedaż' 
    }, {
        id: xlImport,
        productId: [softwareProductType.xl],
        text: 'Import' 
    }, {
        id: xlOrders,
        productId: [softwareProductType.xl],
        text: 'Zamówienia' 
    }, {
        id: xlAccounting,
        productId: [softwareProductType.xl],
        text: 'Księgowość' 
    }, {
        id: xlAssets,
        productId: [softwareProductType.xl],
        text: 'Środki trwałe' 
    }, {
        id: xlService,
        productId: [softwareProductType.xl],
        text: 'Serwis' 
    }, {
        id: xlDepartmentsAdministrator,
        productId: [softwareProductType.xl],
        text: 'Administrator Oddziałów' 
    }, {
        id: xlCRM,
        productId: [softwareProductType.xl],
        text: 'CRM' 
    }, {
        id: xlProduction,
        productId: [softwareProductType.xl],
        text: 'Produkcja' 
    }, {
        id: xlBI,
        productId: [softwareProductType.xl],
        text: 'Business Inteligence' 
    }, {
        id: xlHrAndPayroll,
        productId: [softwareProductType.xl],
        text: 'Kadry i Płace' 
    }
],

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



