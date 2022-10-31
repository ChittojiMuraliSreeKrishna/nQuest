import AsyncStorage from '@react-native-async-storage/async-storage';
import EscPosPrinter from 'react-native-esc-pos-printer';


const PrintService = async (type) => {
  try {
    const printers = await EscPosPrinter.discover();
    const targetIp = await AsyncStorage.getItem("printerIp");
    console.log(`TCP:${targetIp}`);
    const printer = printers[ 0 ];

    await EscPosPrinter.init({
      target: `TCP:${targetIp}`,
      seriesName: 'EPOS2_TM_M30',
      language: 'EPOS2_LANG_EN',
    });

    const printing = new EscPosPrinter.printing();
    if (type === 'start') {
      console.log("start");
      const status = await printing
        .initialize()
        .align('center')
        .size(2, 2)
        .text('Connected')
        .newline()
        .bold()
        .cut()
        .addPulse()
        .send();
      console.log('Success:', status);
    } else {
      const status = await printing
        .initialize()
        .align('center')
        .size(3, 3)
        .line('DUDE!')
        .smooth()
        .line('DUDE!')
        .smooth()
        .size(1, 1)
        .text('is that a ')
        .bold()
        .underline()
        .text('printer?')
        .bold()
        .underline()
        .newline(2)
        .align('center')
        .barcode({
          value: 'Test123',
          type: 'EPOS2_BARCODE_CODE93',
          hri: 'EPOS2_HRI_BELOW',
          width: 2,
          height: 50,
        })
        .qrcode({
          value: 'Test123',
          level: 'EPOS2_LEVEL_M',
          width: 5,
        })
        .cut()
        .addPulse()
        .send();
      console.log('Success:', status);
    }
  } catch (e) {
    console.log('Error:', e);
  }
};


export default PrintService;
