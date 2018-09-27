const {data: jsonData} = window;

// array of GDP data
const {source_name, description, from_date, to_date, data: GDPData} = jsonData;

//placeholders for min/max GDP
let minGDP = Infinity;
let maxGDP = -Infinity;

//loop thru the GDP Array to find min/max
GDPData.forEach(element => {
  const GDP = element[1];
  if (GDP < minGDP) minGDP = GDP;
  if (maxGDP < GDP) maxGDP = GDP;
});

console.log('min: ', minGDP, ' max ', maxGDP, source_name, description, from_date, to_date, )