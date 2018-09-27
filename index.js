//grab data from window
const {data: jsonData} = window;

// array of GDP data
const {source_name, description, from_date, to_date, data: GDPData} = jsonData;
const totalData = GDPData.length;
console.log(`totalData: ${totalData}`)

//placeholders for min/max GDP
let minGDP = Infinity;
let maxGDP = -Infinity;

const barWidth = 1125/totalData;
const getYear = dateString => dateString.slice(0, dateString.indexOf('-'));

//min/max Date
const minDate = new Date(GDPData[0][0]);
const maxDate = new Date(GDPData[GDPData.length-1][0]);

//loop thru the GDP Array to find min/max
GDPData.forEach(element => {
  const GDP = element[1];
  if (GDP < minGDP) minGDP = GDP;
  if (maxGDP < GDP) maxGDP = GDP;
});

const svg = d3.select('body')
              .append('svg')
              .attr('width', '1200')
              .attr('height', '900');

const xscale = d3.scaleLinear()
                .domain([minDate, maxDate])
                .range([0, 1125]);

const yscale = d3.scaleLinear()
                .domain([minGDP, maxGDP])
                .range([875, 50]);

const x_axis = d3.axisBottom()
                .scale(xscale);

const y_axis = d3.axisLeft()
                .scale(yscale);

svg.append('g')
  .attr('transform', 'translate(50, 875)')
  .call(x_axis)
  .selectAll('text').remove();

svg.append('g')
  .attr('transform', 'translate(50,0)')
  .call(y_axis);

svg.selectAll('rect')
  .data(GDPData)
  .enter().append('rect')
  .attr('height',d => 825*(d[1]/maxGDP))
  .attr('width',barWidth)
  .attr('fill','pink')
  .attr('x',(d, i) => (barWidth*i)+50)
  .attr('y',d => 875-825*(d[1]/maxGDP));

console.log('minGDP: ', minGDP)
console.log('maxGDP: ', maxGDP)
console.log('0: ', GDPData[0][1])
console.log('50: ', GDPData[50][1])
console.log('100: ', GDPData[100][1])
console.log('200: ', GDPData[200][1])
console.log('250: ', GDPData[250][1], 825*(GDPData[250][1]/maxGDP))