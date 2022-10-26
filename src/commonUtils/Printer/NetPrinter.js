import { NetPrinter } from "react-native-thermal-receipt-printer";

// interface INetPrinter {
//   device_name: string;
//   host: string;
//   port: number;
// }


import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export class ConnectPrinter extends Component {
  componentDidMount = () => {
    NetPrinter.init().then(() => {
      this.setState(Object.assign({}, this.state, { printers: [ { host: '192.168.10.241', port: 9100 } ] }));
    });
  };

  _connectPrinter = (host, port) => {
    //connect printer
    NetPrinter.connectPrinter(host, port).then(
      (printer) => this.setState(Object.assign({}, this.state, { currentPrinter: printer })),
      error => console.warn(error));
  };

  printTextTest = () => {
    if (this.state.currentPrinter) {
      NetPrinter.printText("<C>sample text</C>\n");
    }
  };

  printBillTest = () => {
    if (this.state.currentPrinter) {
      NetPrinter.printBill("<C>sample bill</C>");
    }
  };


  render () {
    return (
      <View style={styles.container}>
        {
          this.state.printers.map(printer => (
            <TouchableOpacity key={printer.device_id} onPress={(printer) => this._connectPrinter(printer.host, printer.port)}>
              {`device_name: ${printer.device_name}, host: ${printer.host}, port: ${printer.port}`}
            </TouchableOpacity>
          ))
        }
        <TouchableOpacity onPress={() => this.printTextTest()}>
          <Text> Print Text </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.printBillTest()}>
          <Text> Print Bill Text </Text>
        </TouchableOpacity>
      </View>
    );
  }

}

export default NetPrinter;

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
