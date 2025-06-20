const calculateUpdatedRows = (rowData, kpEditData, selectedIds) => {
    if (!rowData || rowData.length === 0 || !kpEditData) return rowData;

    const recalculatedRow = recalculateDataAfterKPEditExecuted(rowData, kpEditData, selectedIds)
    return recalculationWhenRowDataChanged(recalculatedRow)
}

const recalculationWhenRowDataChanged = (rowData) => {
    return rowData.map(row => {
        const amount = row.amount;
        const weightKg = row.weightKg;
        const totalWeight = totalWeightCalculation(amount, weightKg)
        const markupTotal = markupCalculation(row)
        const transportTotal = transportCalculation(row)
        const salePrice = salePriceCalculation(row.purchasePrice, markupTotal, transportTotal)
        const totalPurchase = totalPurchaseCalculation(amount, row.purchasePrice)
        const totalSale = totalSaleCalculation(amount, row.purchasePrice, markupTotal, transportTotal)
        const totalTransport = totalTransportCalculation(amount, transportTotal)
        const margin = marginCalculation(totalSale, totalPurchase, totalTransport)

        return {
            ...row,
            salePrice,
            totalPurchase,
            totalSale,
            markupTotal,
            transportTotal,
            totalTransport,
            totalWeight,
            weightKg,
            amount,
            margin
        };
    });
}

const recalculateDataAfterKPEditExecuted = (rowData, kpEditData, selectedIds) => {
    const value = kpEditData.value ?? null;
    const type = kpEditData.type ?? null;
    const calculate = kpEditData.calculate ?? null;
    const elems = kpEditData.elems ?? null;

    return rowData.map(row => {

        //  Если пользователь указал применить только для выделенных
        if (elems === 'checked' && !selectedIds.includes(row.id))
            return row

        let weightKg = row.weightKg;
        let amount = row.amount;
        let markupPercent = row.markupPercent;
        let markupExtra = row.markupExtra;
        let transportPercent = row.transportPercent;
        let transportExtra = row.transportExtra;

        if (calculate === 'weight') {
            weightKg = value;
        }

        if (calculate === 'count') {
            amount = value;
        }

        if (calculate === 'markup' && type === "percent") {
            markupPercent = value;
        }

        if (calculate === 'markup' && type === "fixed") {
            markupExtra = value;
        }

        if (calculate === 'transport' && type === "percent") {
            transportPercent = value;
        }

        if (calculate === 'transport' && type === "fixed") {
            transportExtra = value;
        }


        return {
            ...row,
            weightKg,
            amount,
            markupPercent,
            markupExtra,
            transportPercent,
            transportExtra
        }
    })
}

const markupCalculation = (row) => {
    const markupPercent = parseFloat(row.markupPercent) || 0;
    const markupExtra = parseFloat(row.markupExtra) || 0;
    const purchasePrice = parseFloat(row.purchasePrice);

    if (isNaN(purchasePrice)) return null;

    const result = markupExtra + (purchasePrice * markupPercent / 100);
    return result > 0 ? result.toFixed(2) : null;
};

const transportCalculation = (row) => {
    let transportPercent = parseFloat(row.transportPercent) || 0;
    let transportExtra = parseFloat(row.transportExtra) || 0;
    let result = transportExtra + (row.weightKg * transportPercent)
    return (result > 0) ? result.toFixed(2) : null
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
    if (amount != null && purchasePrice != null) {
        if (!isNaN(amount) && !isNaN(purchasePrice)) {
            return (
                parseFloat(amount) * parseFloat(purchasePrice)
            ).toFixed(2);
        }
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
    if (amount != null && transportTotal != null) {
        if (!isNaN(amount) && !isNaN(transportTotal)) {
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
    if (amount != null && weightKg != null) {
        if (!isNaN(amount) && !isNaN(weightKg)) {
            return (parseFloat(amount) * parseFloat(weightKg)).toFixed(2)
        }
    }
    return null
}

export { calculateUpdatedRows, recalculationWhenRowDataChanged };