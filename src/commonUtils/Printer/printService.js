import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment/moment';
import EscPosPrinter from 'react-native-esc-pos-printer';


const PrintService = async (type, barcode, object, invoiceTax) => {
  console.log({ type, object, barcode, invoiceTax });
  // var object = [ { sno: 1, barcode: 'bar-enca93', quantity: 4, itemMrp: 4000, itemDiscount: 5000, totalMrp: 11000 } ];
  try {
    const printers = await EscPosPrinter.discover();
    const targetIp = await AsyncStorage.getItem("printerIp");
    console.log(`TCP:${targetIp}`);

    await EscPosPrinter.init({
      target: `TCP:${targetIp}`,
      seriesName: 'EPOS2_TM_M30',
      language: 'EPOS2_LANG_EN',
    }).then((res) => {
      console.log({ res });
      AsyncStorage.setItem("prinStat", "ok");
    }).catch((err) => {
      console.log({ err });
      AsyncStorage.setItem("prinStat", "no");
    });

    const printing = new EscPosPrinter.printing();
    const printer = await printing;
    if (type === 'start') {
      printer.initialize();
      printer.align('center');
      printer.size(2, 2);
      printer.text('Connected');
      printer.newline();
      printer.bold();
      printer.cut();
      printer.addPulse();
      printer.send();
    } else if (type === 'DSNUM') {
      let dsNum = barcode;
      printer.initialize();
      printer.align('center');
      printer.size(2, 2);
      printer.smooth(true);
      printer.line('EASY RETAIL');
      printer.line('ESTIMATION SLIP');
      printer.smooth(false);
      printer.size(1, 1);
      printer.text('Date: ' + moment(new Date()).format("DD-MM-YYYY HH:mm::ss").toString());
      printer.newline();
      printer.line('________________________________________________');
      printer.align('left');
      printer.line('S.NO    BARCODE      QTY    MRP   DISC    AMOUNT');
      printer.size(0, 0);
      printer.line('________________________________________________');
      printer.newline();
      for (let i = 0; i < object.length; i++) {
        printer.line(' ' + String(parseInt(i) + 1) + '    ' + object[ i ].barcode + '      ' + object[ i ].quantity + '     ' + object[ i ].itemMrp + '     ' + object[ i ].itemDiscount + '      ' + object[ i ].totalMrp);
        printer.line('------------------------------------------------');
      }
      // printer.newline();
      // for (let i = 0; i < object.length; i++) {
      //   printer.line('S.NO:' + String(parseInt(i) + 1) + ', BARCODE:' + object[ i ].barcode + ', QTY:' + object[ i ].quantity + '\n' + 'MRP:' + object[ i ].itemMrp + ', DISC:' + object[ i ].itemDiscount + ', AMOUNT' + object[ i ].totalMrp);
      //   printer.line('------------------------------------------------');
      // }
      printer.newline();
      printer.align('left');
      let grandTotal = 0;
      let totalqty = 0;
      let promoDiscount = 0;
      object.forEach(bardata => {
        grandTotal = grandTotal + bardata.totalMrp;
        promoDiscount = promoDiscount + bardata?.itemDiscount;
        totalqty = totalqty + parseInt(bardata.quantity);
      });
      let netpayable = grandTotal - promoDiscount;
      printer.text('Gross Amount: ' + grandTotal + '\n');
      printer.text('TOTAL DISCOUNT: ' + promoDiscount + '\n');
      printer.line('________________________________________________');
      printer.newline();
      printer.align('center');
      printer.size(2, 1);
      printer.line('Total Qty: ' + totalqty);
      printer.smooth();
      printer.line('Net Payable: ' + netpayable);
      printer.smooth();
      printer.newline();
      printer.barcode({
        value: dsNum,
        type: 'EPOS2_BARCODE_CODE93',
        hri: 'EPOS2_HRI_BELOW',
        width: 3,
        height: 70,
      });
      printer.newline(2);
      printer.size(1, 1);
      printer.text('THANK YOU');
      printer.newline();
      printer.cut();
      printer.addPulse();
      printer.send();
    } else if (type === "INVOICE") {
      let esNum = barcode;
      printer.initialize();
      printer.align('center');
      printer.size(2, 2);
      printer.smooth(true);
      printer.bold(true);
      printer.line('EASY RETAIL');
      printer.line('OTSI - Hi-tech city');
      printer.smooth(false);
      printer.size(1, 1);
      printer.align('left');
      printer.text('GST no: \n');
      printer.size(2, 1);
      printer.align('center');
      printer.text('*Invoice* \n');
      printer.size(0, 0);
      printer.text('Date: ' + moment(new Date()).format("DD-MM-YYYY HH:mm::ss").toString());
      printer.newline();
      printer.align('left');
      printer.text('SmNumber: ' + '\n');
      printer.text('________________________________________________\n');
      printer.text('CUSTOMER NAME: ' + invoiceTax.tagCustomerName + '\n');
      printer.text('Mobile: ' + invoiceTax.mobileNumber + '\n');
      printer.text('________________________________________________\n');
      printer.bold(false);
      printer.align('center');
      printer.text('* ITEMS LIST * \n');
      printer.align('left');
      printer.line('________________________________________________');
      printer.line('S.NO    BARCODE      QTY    MRP   DISC    AMOUNT');
      printer.line('________________________________________________');
      printer.size(0, 0);
      printer.newline();
      for (let i = 0; i < object.length; i++) {
        printer.line(' ' + String(parseInt(i) + 1) + '    ' + object[ i ].barcode + '      ' + object[ i ].quantity + '     ' + object[ i ].itemMrp + '     ' + object[ i ].itemDiscount + '      ' + object[ i ].totalMrp);
        printer.line('------------------------------------------------');
      }
      printer.newline();
      printer.align('left');
      printer.text('Gross Amount: ');
      printer.align('right');
      printer.text(invoiceTax.Amount);
      printer.text('\n');
      printer.align('left');
      printer.text('Promo Discount: ' + invoiceTax.totalPromoDisc +
        '\n');
      printer.text('Manual Discount: ' + invoiceTax.totalManualDisc +
        '\n');
      if (invoiceTax.returnSlipAmount > 0) {
        printer.text('RT Amount: ' + invoiceTax.returnSlipAmount + '\n');
      }
      // if (invoiceTax.gvAppliedAmount > 0) {
      // printer.text('Coupon Amount: ' + invoiceTax.gvAppliedAmount + '\n');
      // }
      // printer.line('________________________________________________');
      // printer.newline();
      // printer.text('Total Amount: ' + invoiceTax.netPayableAmount + '\n');
      // printer.line('________________________________________________');
      // printer.text('Tax  \n');
      // printer.line('________________________________________________');
      // printer.text('SGST: ' + invoiceTax.sgst + '\n');
      // printer.text('CGST: ' + invoiceTax.cgst + '\n');
      // printer.line('________________________________________________');
      // printer.text('Net Total(tax inc): ' + invoiceTax.netPayableAmount + '\n');
      // printer.line('________________________________________________');
      printer.barcode({
        value: esNum,
        type: 'EPOS2_BARCODE_CODE93',
        hri: 'EPOS2_HRI_BELOW',
        width: 3,
        height: 70,
      });
      printer.newline(2);
      printer.size(1, 1);
      printer.text('THANK YOU');
      printer.newline();
      printer.cut();
      printer.addPulse();
      printer.send();
    }
    console.log('Success:', printer);
  } catch (e) {
    console.log('Error:', e);
  }
};


export default PrintService;
