import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment/moment';
import EscPosPrinter from 'react-native-esc-pos-printer';


const PrintService = async (type, barcode, object, invoiceTax) => {
  console.log({ type, object, barcode, invoiceTax });
  // var object = [{ sno: 1, barcode: 'bar-enca93', quantity: 4, itemMrp: 4000, itemDiscount: 5000, totalMrp: 11000 }]; // for Testing
  try {
    const targetIp = await AsyncStorage.getItem("printerIp");
    console.log(`TCP:${targetIp}`);

    // Initilizing Printer
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
    // For Normal connect
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
    }
    // For Delivery Slip
    else if (type === 'DSNUM') {
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
      printer.line('S.NO BARCODE  QTY   MRP    DISC     AMOUNT');
      printer.size(0, 0);
      printer.line('________________________________________________');
      printer.newline(); // Print Style 1
      for (let i = 0; i < object.length; i++) {
        printer.line(' ' + String(parseInt(i) + 1) + ' ' + object[i].barcode + '  ' + parseInt(object[i].quantity) + '   ' + parseFloat(object[i].itemMrp).toFixed(2) + '  ' + parseFloat(object[i].itemDiscount).toFixed(2) + '  ' + parseFloat(object[i].totalMrp).toFixed(2));
        printer.line('------------------------------------------------');
      }

      printer.newline();
      printer.align('left');
      let grandTotal = 0;
      let totalqty = 0;
      let promoDiscount = 0;
      object.forEach(bardata => {
        grandTotal = parseFloat(grandTotal) + parseFloat(bardata.totalMrp);
        promoDiscount = parseFloat(promoDiscount) + parseFloat(bardata?.itemDiscount);
        totalqty = parseInt(totalqty) + parseInt(bardata.quantity);
      });
      let netpayable = grandTotal - promoDiscount;
      printer.text('Gross Amount: ' + parseFloat(grandTotal).toFixed(2) + '\n');
      printer.text('TOTAL DISCOUNT: ' + parseFloat(promoDiscount).toFixed(2) + '\n');
      printer.line('________________________________________________');
      printer.newline();
      printer.align('center');
      printer.size(2, 1);
      printer.line('Total Qty: ' + parseInt(totalqty));
      printer.smooth();
      printer.line('Net Payable: ' + parseFloat(netpayable).toFixed(2));
      printer.smooth();
      printer.newline();
      printer.barcode({ // For Barcode
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
    }
    // For Testing
    else if (type === "Invoice") {
      let esnum = barcode;
      alert(esnum);
      console.log({ invoiceTax, object });
    }
    // For invoice
    else if (type === "INVOICE") {
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
      if (invoiceTax[0].customerFullName) {
        printer.text('CUSTOMER NAME: ' + invoiceTax[0].customerFullName + '\n');
      } else {
        printer.text('CUSTOMER NAME: ' + '' + '\n');
      }
      if (invoiceTax[0].mobileNumber) {
        printer.text('Mobile: ' + invoiceTax[0].mobileNumber + '\n');
      } else {
        printer.text('Mobile: ' + '' + '\n');
      }
      printer.text('________________________________________________\n');
      printer.bold(false);
      printer.align('center');
      printer.text('* ITEMS LIST * \n');
      printer.align('left');
      printer.line('________________________________________________');
      printer.line('S.NO BARCODE  QTY    MRP    DISC     AMOUNT');
      printer.line('________________________________________________');
      printer.size(0, 0);
      printer.newline();
      for (let i = 0; i < object.length; i++) {
        printer.line(' ' + String(parseInt(i) + 1) + ' ' + object[i].barCode + '  ' + parseInt(object[i].quantity) + '   ' + parseFloat(object[i].itemPrice).toFixed(2) + '  ' + parseFloat(object[i].manualDiscount + object[i].promoDiscount).toFixed(2) + '  ' + parseFloat(object[i].grossValue).toFixed(2));
        printer.line('------------------------------------------------');
      }
      printer.newline();
      printer.align('left');
      printer.text('Gross Amount: ');
      printer.align('right');
      printer.text('' + invoiceTax[0].grossAmount + '\n');
      printer.align('left');
      printer.text('Promo Discount: ' + parseFloat(invoiceTax[0].totalPromoDisc).toFixed(2) +
        '\n');
      printer.text('Manual Discount: ' + parseFloat(invoiceTax[0].totalManualDisc).toFixed(2) +
        '\n');
      if (invoiceTax[0].returnSlipAmount > 0) {
        printer.text('RT Amount: ' + parseFloat(invoiceTax[0].returnSlipAmount).toFixed(2) + '\n');
      }
      if (invoiceTax[0].gvAppliedAmount > 0) {
        printer.text('Coupon Amount: ' + parseFloat(invoiceTax[0].gvAppliedAmount).toFixed(2) + '\n');
      }
      printer.line('________________________________________________');
      printer.newline();
      printer.text('Total Amount: ' + parseFloat(invoiceTax[0].grossAmount).toFixed(2) + '\n');
      printer.line('________________________________________________');
      printer.text('Tax  \n');
      printer.line('________________________________________________');
      printer.text('SGST: ' + parseFloat(invoiceTax[0].sgst).toFixed(2) + '\n');
      printer.text('CGST: ' + parseFloat(invoiceTax[0].cgst).toFixed(2) + '\n');
      printer.line('________________________________________________');
      printer.text('Net Total(tax inc): ' + parseFloat(invoiceTax[0].netTotal).toFixed(2) + '\n');
      printer.line('________________________________________________');
      printer.align('center');
      printer.barcode({ // For Barcode
        value: barcode,
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
    else if (type === 'RESTAURANT') {
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
      printer.bold(false);
      printer.align('center');
      printer.text('* ITEMS LIST * \n');
      printer.align('left');
      printer.line('________________________________________________');
      printer.line('S.NO NAME  QTY    MRP    DISC     AMOUNT');
      printer.line('________________________________________________');
      printer.size(0, 0);
      printer.newline();
      for (let i = 0; i < object.length; i++) {
        printer.line(' ' + String(parseInt(i) + 1) + ' ' + object[i].name + '  ' + parseInt(object[i].quantity) + '   ' + parseFloat(object[i].itemPrice).toFixed(2) + '  ' + parseFloat(object[i].manualDiscount + object[i].promoDiscount).toFixed(2) + '  ' + parseFloat(object[i].value).toFixed(2));
        printer.line('------------------------------------------------');
      }
      printer.newline();
      printer.align('left');
      let grandTotal = 0;
      let totalQty = 0;
      let promoDiscount = 0;
      object.forEach((bardata) => {
        grandTotal = grandTotal + bardata?.value;
        promoDiscount = promoDiscount + bardata?.promoDiscount;
        totalQty = totalQty + parseInt(bardata.quantity);
      });
      let netPayableAmt = grandTotal - promoDiscount;
      printer.text('Gross Amount: ');
      printer.align('right');
      printer.text('' + parseFloat(grandTotal).toFixed(2) + '\n');
      printer.align('left');
      printer.text('Promo Discount: ' + parseFloat(promoDiscount).toFixed(2) +
        '\n');
      printer.line('________________________________________________');
      printer.newline();
      printer.text('Total QTY: ' + totalQty + '\n');
      printer.line('________________________________________________');
      printer.text('Net Total(tax inc): ' + parseFloat(netPayableAmt).toFixed(2) + '\n');
      printer.line('________________________________________________');
      printer.align('center');
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
