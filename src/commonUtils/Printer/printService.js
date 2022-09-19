import eventBus from "./eventBus";


const PrinterStatusBill = (type, barcode, object) => {
  console.log(object);
  // 192.168.1.13  HOME
  // 10.80.2.50 OFC
  const printerIPAddress = JSON.parse(sessionStorage.getItem('printerIp'));
  const printerPort = JSON.parse(sessionStorage.getItem('printerPort'));
  //   const [textToPrint, setTextToPrint] = useState("");
  let connectionStatus = '';
  let ePosDevice;
  let printer = {};

  const STATUS_CONNECTED = "Connected";


  connectionStatus = "Connecting ...";

  if (!printerIPAddress) {
    connectionStatus = "Type the printer IP address";
    return;
  }
  if (!printerPort) {
    connectionStatus = "Type the printer port";
    return;
  }

  connectionStatus = "Connecting ...";
  // ePosDevice = new epson.ePOSDevice();
  let ePosDev = new window.epson.ePOSDevice();
  ePosDevice = ePosDev;

  ePosDev.connect(printerIPAddress, printerPort, (data) => callBack_connect(data));
  function callBack_connect (data) {
    if (data === "OK") {
      sessionStorage.setItem('print_config', data);
      eventBus.dispatch("printerStatus", { message: data });
      ePosDev.createDevice(
        "local_printer",
        ePosDev.DEVICE_TYPE_PRINTER,
        { crypto: true, buffer: false },
        (devobj, retcode) => {
          if (retcode === "OK") {
            printer = devobj;
            connectionStatus = STATUS_CONNECTED;
            let prn = devobj;


            // var receiptString =
            // "======================\n" +
            // "|       Invoice      |\n" +
            // "======================\n" +
            // "Item             Price\n" +
            // "----------------------\n" +
            // "shirts           10.40\n" +
            // "T-shirts         20.60\n" +
            // "paste            10.00\n" +
            // "Idlyrava         15.00\n" +
            // "pants            10.00\n" +
            // "bendi            25.00\n" +
            // "brinja           10.00\n" +
            // "tamatoo          45.00\n" +
            // "shorts           50.00\n" +
            // "shoes            70.00\n" +
            // "sandle           30.00\n" +
            // "fliplops         55.00\n" +
            // "----------------------\n" +
            // "Total-----------220.00\n";
            // prn.addText(receiptString);
            // prn.addFeedLine(5);
            // prn.addCut(prn.CUT_FEED);

            // prn.send();

            // *************************PRINT BILL*****************************
            if (type === "start") {
              prn.addTextPosition(205);
              prn.addTextVPosition(205);
              prn.addText('Printer Connected\n');
            }
            else if (type === "DSNUM") {
              let dsNum = barcode;
              // prn.addTextPosition(212);
              // prn.addTextVPosition(486);
              // prn.addText('EASY RETAIL\n');
              // prn.addTextPosition(240);
              // prn.addText('ESTIMATION SLIP\n');
              // prn.addText(' =============================================\n');
              // prn.addTextPosition(3);
              // prn.addBarcode('eh4545212121r', prn.BARCODE_CODE39, prn.HRI_BELOW, prn.FONT_B, 2, 90);
              // prn.addText(' =============================================\n');
              prn.addTextPosition(205);
              prn.addText('EASY REATIL\n');
              prn.addTextPosition(137);
              prn.addTextVPosition(548);
              prn.addText('ESTIMATION SLIP NUMBER\n');
              // prn.addText(' =============================================\n');
              prn.addTextVPosition(246);
              prn.addBarcode(dsNum, prn.BARCODE_CODE39, prn.HRI_BELOW, prn.FONT_A, 2, 83);
              // prn.addText(' =============================================\n');
              prn.addTextPosition(211);
              prn.addTextVPosition(208);
              prn.addText('THANK YOU\n');
            } else if (type === 'INVOICE') {
              let inNum = barcode;
              prn.addTextPosition(212);
              prn.addTextVPosition(486);
              prn.addText('EASY RETAIL\n');
              prn.addTextPosition(240);
              prn.addText('Invoice\n');
              prn.addText(' =============================================\n');
              prn.addTextPosition(3);
              prn.addBarcode(inNum, prn.BARCODE_CODE39, prn.HRI_BELOW, prn.FONT_B, 2, 90);
              prn.addText(' =============================================\n');
              prn.addTextPosition(10);
              prn.addText('CUSTOMER NAME:   Kadali         \n');
              prn.addTextPosition(10);
              prn.addText('Mobile       :   8328418471      \n');
              prn.addText(' =============================================\n');
              prn.addText(' |                ITEMS LIST                 |\n');
              prn.addText(' =============================================\n');
              prn.addText(' S.No   Item     Qty    Type     Disc    Price\n');
              prn.addText(' ---------------------------------------------\n');
              for (let i = 0; i < object.length; i++) {
                prn.addText(i + '.' + object[ i ].barCode + '  ' + object[ i ].quantity + ' ' + object[ i ].itemPrice + '\n');
              }
              // prn.addText(' 1.    shirts     2       M      0.0   1850.00\n');
              // prn.addText(' 2.    sarees     4       F      0.0   2550.00\n');
              // prn.addText(' 3.    T-shirts   3       M      0.0   3000.00\n');
              // prn.addText(' 4.    shorts     2       M      0.0    750.00\n');
              // prn.addText(' 5.    pants      1       T      0.0    800.00\n');
              // prn.addText(' 6.    shoes      1       S      0.0   1250.00\n');
              // prn.addText(' 7.    socks      2       M      0.0    250.00\n');
              // prn.addText(' 8.    paste      5       Y      0.0    450.00\n');
              // prn.addText(' 9.    soaps      6       M      0.0    350.00\n');
              // prn.addText(' 10.   brushes    5       F      0.0    800.00\n');
              prn.addText(' ---------------------------------------------\n');
              prn.addText(' Total            31             0.0  11230.00\n');
              prn.addText(' ---------------------------------------------\n');
              prn.addText(' Tax                                          \n');
              prn.addText(' ---------------------------------------------\n');
              prn.addText(' SGST                                   125.00\n');
              prn.addText(' CGST                                   125.00\n');
              prn.addText(' IGST                                     0.00\n');
              prn.addText(' ---------------------------------------------\n');
              prn.addText(' Net Total                            11230.00\n');
              prn.addText(' ---------------------------------------------\n');
              // prn.addSymbol('http://www.google.com/', prn.SYMBOL_QRCODE_MODEL_1, prn.LEVEL_DEFAULT, 9, 8, 350);
              prn.addText(' ==================THANK YOU===================\n');
            }


            prn.addCut(prn.CUT_FEED);
            // *************************PRINT BILL*****************************

            prn.send();
          } else {
            throw retcode;
          }
        }
      );
    } else {
      console.error("Printer Not connected");
    }
  };

};

export default PrinterStatusBill;
