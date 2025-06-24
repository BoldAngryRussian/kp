package com.omsk.kp.utils

import java.text.DecimalFormat
import java.text.DecimalFormatSymbols
import java.util.Locale

fun formatToAmount(amount: Double): String {
    val symbols = DecimalFormatSymbols(Locale("ru")).apply {
        groupingSeparator = ' '
        decimalSeparator = '.'
    }
    return DecimalFormat("#,##0.00", symbols)
        .format(amount)
}