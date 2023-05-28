const fs = require('fs');
const jsonToXml = require('./jsonToXml');

function jsonConverter() {
  try {
    const orderJson = JSON.parse(fs.readFileSync('order.json'));
    const mappingJson = JSON.parse(fs.readFileSync('mapping.json'));

    const xmlHeader =
      '<SalesOrders xmlns:xsd="http://www.w3.org/2001/XMLSchema-instance" xsd:noNamespaceSchemaLocation="SORTOIDOC.XSD">\n';
    //const xmlData = jsonToXml(orderJson, mappingJson);

    let xmlData = '';

    mappingJson.forEach((mapping) => {
      const target = mapping.target;
      const values = mapping.values;

      xmlData += `<${target}>\n`;
      xmlData += jsonToXml(orderJson, values);
      xmlData += `</${target}>\n`;
    });

    const xml =
      xmlHeader + `<Orders>\n${xmlData}</Orders>` + '\n</SalesOrders>';

    fs.writeFileSync('results.xml', xml);
    console.log('Conversion completed. Check results.xml file.');
  } catch (error) {
    console.error('Error converting JSON to XML:', error);
  }
}

module.exports = jsonConverter;
