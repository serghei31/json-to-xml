function jsonToXml(json, mapping) {
  let xml = '';
  let cpol = 0;

  mapping.forEach((map) => {
    const origin = map.origin;
    const target = map.target;
    let data = origin ? getValueFromPath(json, origin) : map.static_value;
    const orders = map.orders ? getValueFromPath(json, map.orders) : '';

    if (map.convert_function) {
      data = eval(map.convert_function);
    }

    if (map.values) {
      if (map.orders) {
        cpol = orders.length;
        for (let i = 0; i < cpol; i++) {
          xml += `<${target}>\n`;
          map.values.forEach((item) => {
            const origin = item.origin;
            const target = item.target;
            const poLine = i + 1;
            let data = origin
              ? getValueFromPath(json.items[`${i}`], origin)
              : item.static_value;

            if (item.convert_function) {
              data = eval(item.convert_function);
            }
            xml += `<${target}>${data}</${target}>\n`;
          });
          xml += `</${target}>\n`;
        }
      } else {
        xml += `<${target}>\n`;
        map.values.forEach((item) => {
          const origin = item.origin;
          const target = item.target;
          let data = origin
            ? getValueFromPath(json, origin)
            : item.static_value;

          if (item.convert_function) {
            data = eval(item.convert_function);
          }
          xml += `<${target}>${data}</${target}>\n`;
        });
        xml += `</${target}>\n`;
      }
    } else {
      xml += `<${target}>${data}</${target}>\n`;
    }
  });

  return xml;
}

function getValueFromPath(obj, path) {
  const properties = path.split('.');
  let value = obj;

  properties.forEach((prop) => {
    value = value ? value[prop] : '';
  });

  return value;
}

function convertCurrencyToSymbol(currencyCode) {
  // Define a map of currency codes and their corresponding symbols
  const currencySymbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    AUD: 'A$',
    CAD: 'C$',
    // Add more currency codes and symbols as needed
  };

  // Check if the currency code exists in the map
  if (currencyCode in currencySymbols) {
    return currencySymbols[currencyCode];
  } else {
    return 'Unknown';
  }
}

module.exports = jsonToXml;
