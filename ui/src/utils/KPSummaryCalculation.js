const KPSummaryCalculation = (rowData, additionalServices) => {

    let totalPurchase = 0;
    let totalTransport = 0;
    let totalSale = 0;
    let totalMargin = 0;
    let totalServices = 0

    console.log("additionalServices", additionalServices)

    additionalServices.forEach(item => {
        totalServices += parseFloat(item.total) || 0;
    });

    rowData.forEach(item => {
        totalPurchase += parseFloat(item.totalPurchase) || 0;
        totalTransport += parseFloat(item.totalTransport) || 0;
        totalSale += parseFloat(item.totalSale) || 0;
        totalMargin += parseFloat(item.margin) || 0;
    });

    const format = (number) => new Intl.NumberFormat('ru-RU', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(number);

    return {
        totalPurchase: format(totalPurchase),
        totalTransport: format(totalTransport),
        totalSale: format(totalSale),
        totalAdditionalServices: format(totalServices),
        totalMargin: format(totalMargin),
    };
}

export { KPSummaryCalculation };