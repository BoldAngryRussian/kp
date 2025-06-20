const calculateUpdatedRows = (rowData, kpEditData) => {
    if (!rowData || rowData.length === 0 || !kpEditData) return rowData;

    const value = kpEditData.value ?? null;
    const type = kpEditData.type ?? null;
    const calculate = kpEditData.calculate ?? null;

    return rowData.map(row => {

        let markupPercent = row.markupPercent;
        let markupExtra = row.markupExtra;
        let markupTotal = row.markupTotal;

        let transportPercent = row.transportPercent;
        let transportExtra = row.transportExtra;
        let transportTotal = row.transportTotal;

        let weightKg = row.weightKg;
        let amount = row.amount;

        if (calculate === 'weight') {
            weightKg = value;
        }

        if (calculate === 'count') {
            amount = value;
        }

        const totalWeight = totalWeightCalculation(amount, weightKg)

        const markupResult = markupCalculation(calculate, row, value, type)
        if (markupResult) {
            markupPercent = markupResult.markupPercent
            markupExtra = markupResult.markupExtra
            markupTotal = markupResult.markupTotal
        }

        const transportResult = transportCalculation(calculate, row, value, type)
        if (transportResult) {
            transportPercent = transportResult.transportPercent
            transportExtra = transportResult.transportExtra
            transportTotal = transportResult.transportTotal
        }

        let salePrice = salePriceCalculation(row.purchasePrice, markupTotal, transportTotal)
        let totalPurchase = totalPurchaseCalculation(amount, row.purchasePrice)
        let totalSale = totalSaleCalculation(amount, row.purchasePrice, markupTotal, transportTotal)
        let totalTransport = totalTransportCalculation(amount, transportTotal)
        let margin = marginCalculation(totalSale, totalPurchase, totalTransport)

        return {
            ...row,
            salePrice,
            totalPurchase,
            totalSale,
            markupPercent,
            markupExtra,
            markupTotal,
            transportPercent,
            transportExtra,
            transportTotal,
            totalTransport,
            totalWeight,
            weightKg,
            amount,
            margin
        };
    });
}

const markupCalculation = (calculate, row, value, type) => {

    let markupPercent = row.markupPercent;
    let markupExtra = row.markupExtra;
    let markupTotal = row.markupTotal;

    if (calculate === 'markup' && row.purchasePrice != null && value != null && type != null) {
        if (type === "percent") {
            let markupExtraValue = markupExtra ?? 0;
            markupPercent = value;
            markupTotal = (row.purchasePrice * value / 100 + markupExtraValue).toFixed(2);

            return { markupPercent, markupExtra, markupTotal };
        } else if (type === "fixed") {
            let markupPercentValue = markupPercent ?? 0;
            markupExtra = value;
            markupTotal = (value + (row.purchasePrice * markupPercentValue / 100)).toFixed(2);

            return { markupPercent, markupExtra, markupTotal };
        }
    }
    return null;
}

const transportCalculation = (calculate, row, value, type) => {

    let transportPercent = row.transportPercent;
    let transportExtra = row.transportExtra;
    let transportTotal = row.transportTotal;

    if (calculate === 'transport' && row.purchasePrice != null && value != null && type != null) {
        if (type === "percent") {
            let transportExtraValue = transportExtra ?? 0;
            transportPercent = value;
            transportTotal = (row.weightKg * value + transportExtraValue).toFixed(2);

            return { transportPercent, transportExtra, transportTotal }
        } else if (type === "fixed") {
            let transportPercentValue = transportPercent ?? 0;
            transportExtra = value;
            transportTotal = (value + row.weightKg * transportPercentValue).toFixed(2);

            return { transportPercent, transportExtra, transportTotal }
        }
    }

    return null;
}


const salePriceCalculation = (purchasePrice, markupTotal, transportTotal) => {
    if (purchasePrice != null && markupTotal != null && transportTotal != null) {
        if (!isNaN(purchasePrice) && !isNaN(markupTotal) && !isNaN(transportTotal)) {
            return (
                parseFloat(purchasePrice) +
                parseFloat(markupTotal) +
                parseFloat(transportTotal)
            ).toFixed(2);
        }
    }
    return null;
}

const totalPurchaseCalculation = (amount, purchasePrice) => {
    if (!isNaN(amount) && !isNaN(purchasePrice)) {
        return (
            parseFloat(amount) * parseFloat(purchasePrice)
        ).toFixed(2);
    }
    return null;
}

const totalSaleCalculation = (amount, purchasePrice, markupTotal, transportTotal) => {
    if (amount != null && purchasePrice != null && markupTotal != null && transportTotal != null) {
        if (!isNaN(amount) && !isNaN(purchasePrice) && !isNaN(markupTotal) && !isNaN(transportTotal)) {
            const salePrice = parseFloat(purchasePrice) + parseFloat(markupTotal) + parseFloat(transportTotal)
            return (amount * salePrice).toFixed(2)
        }
    }
    return null
}

const totalTransportCalculation = (amount, transportTotal) => {
    if (amount != null && transportTotal != null){
        if (!isNaN(amount) && !isNaN(transportTotal)){
            return (parseFloat(amount) * parseFloat(transportTotal)).toFixed(2)
        }
    }
    return null
}

const marginCalculation = (totalSale, totalPurchase, totalTransport) => {
    if (totalSale != null && totalPurchase != null && totalTransport != null) {
        if (!isNaN(totalSale) && !isNaN(totalPurchase) && !isNaN(totalTransport)) {            
            return (parseFloat(totalSale) - parseFloat(totalPurchase) - parseFloat(totalTransport)).toFixed(2);
        }
    }
    return null
}

const totalWeightCalculation = (amount, weightKg) => {
    if (amount != null && weightKg != null){
        if (!isNaN(amount) && !isNaN(weightKg)){
            return  (parseFloat(amount) * parseFloat(weightKg)).toFixed(2)
        }
    }
    return null
}

export { calculateUpdatedRows };