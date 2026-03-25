import { temperatureMap } from 'utils/kp_consts';

// Приводит разные варианты ввода числа к Number или null
const normalizeNumber = (v) => {
    if (v === null || v === undefined || v === '') return null;
    const s = String(v)
        .replace(/\u00A0/g, '') // non-breaking space
        .replace(/\s+/g, '')
        .replace(/,/g, '.');
    const n = parseFloat(s);
    return isNaN(n) ? null : n;
}

const calculateUpdatedRows = (rowData, kpEditData, selectedIds) => {
    if (!rowData || rowData.length === 0 || !kpEditData) return rowData;

    const recalculatedRow = recalculateDataAfterKPEditExecuted(rowData, kpEditData, selectedIds)
    return recalculationWhenRowDataChanged(recalculatedRow)
}

const recalculationWhenRowDataChanged = (rowData) => {
    console.log('Recalculating row data after changes...', rowData);
    return rowData.map(row => {
        const amount = normalizeNumber(row.amount);
        const weightKg = normalizeNumber(row.weightKg);
        const purchasePrice = normalizeNumber(row.purchasePrice);
        const markupPercent = normalizeNumber(row.markupPercent);
        const markupExtra = normalizeNumber(row.markupExtra);
        const transportPercent = normalizeNumber(row.transportPercent);
        const transportExtra = normalizeNumber(row.transportExtra);

        const totalWeight = totalWeightCalculation(amount, weightKg)
        const markupTotal = markupCalculation(purchasePrice, markupPercent, markupExtra)
        const transportTotal = transportCalculation(weightKg, transportPercent, transportExtra)
        const salePrice = salePriceCalculation(purchasePrice, markupTotal, transportTotal)
        const totalPurchase = totalPurchaseCalculation(amount, purchasePrice)
        const totalSale = totalSaleCalculation(amount, purchasePrice, markupTotal, transportTotal)
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
            // Записываем нормализованные значения обратно, чтобы UI тоже показывал их в едином формате
            purchasePrice,
            markupPercent,
            markupExtra,
            transportPercent,
            transportExtra,
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
        let temperatureCode = row.temperatureCode

        if (calculate === 'weight') {
            weightKg = value;
        }

        if (calculate === 'temperature_mode') {
            temperatureCode = value
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
            transportExtra,
            temperatureCode
        }
    })
}

const getTemperatureCodeByName = (name) => {
  const entry = Object.entries(temperatureMap).find(([code, label]) => label === name);
  return entry ? Number(entry[0]) : null;
};

const markupCalculation = (purchasePrice, markupPercent, markupExtra) => {
    const pp = normalizeNumber(purchasePrice);
    const mp = normalizeNumber(markupPercent) || 0;
    const me = normalizeNumber(markupExtra) || 0;

    if (pp === null) return null;

    const result = me + (pp * mp / 100);
    return (result !== null && result !== undefined && result >= 0) ? result.toFixed(2) : null;
};

const transportCalculation = (weightKg, transportPercent, transportExtra) => {
    const w = normalizeNumber(weightKg) || 0;
    const tp = normalizeNumber(transportPercent) || 0;
    const te = normalizeNumber(transportExtra) || 0;
    const result = te + (w * tp);
    return (result !== null && result !== undefined && !isNaN(result)) ? result.toFixed(2) : null;
}


const salePriceCalculation = (purchasePrice, markupTotal, transportTotal) => {
    const pp = normalizeNumber(purchasePrice);
    const mt = normalizeNumber(markupTotal);
    const tt = normalizeNumber(transportTotal);
    if (pp !== null && mt !== null && tt !== null) {
        return (pp + mt + tt).toFixed(2);
    }
    return null;
}

const totalPurchaseCalculation = (amount, purchasePrice) => {
    const a = normalizeNumber(amount);
    const pp = normalizeNumber(purchasePrice);
    if (a !== null && pp !== null) {
        return (a * pp).toFixed(2);
    }
    return null;
}

const totalSaleCalculation = (amount, purchasePrice, markupTotal, transportTotal) => {
    const a = normalizeNumber(amount);
    const pp = normalizeNumber(purchasePrice);
    const mt = normalizeNumber(markupTotal);
    const tt = normalizeNumber(transportTotal);
    if (a !== null && pp !== null && mt !== null && tt !== null) {
        const salePrice = pp + mt + tt;
        return (a * salePrice).toFixed(2)
    }
    return null
}

const totalTransportCalculation = (amount, transportTotal) => {
    const a = normalizeNumber(amount);
    const tt = normalizeNumber(transportTotal);
    if (a !== null && tt !== null) {
        return (a * tt).toFixed(2)
    }
    return null
}

const marginCalculation = (totalSale, totalPurchase, totalTransport) => {
    const ts = normalizeNumber(totalSale);
    const tp = normalizeNumber(totalPurchase);
    const tt = normalizeNumber(totalTransport);
    if (ts !== null && tp !== null && tt !== null) {
        return (ts - tp - tt).toFixed(2);
    }
    return null
}

const totalWeightCalculation = (amount, weightKg) => {
    const a = normalizeNumber(amount);
    const w = normalizeNumber(weightKg);
    if (a !== null && w !== null) {
        return (a * w).toFixed(2)
    }
    return null
}

export { calculateUpdatedRows, recalculationWhenRowDataChanged };