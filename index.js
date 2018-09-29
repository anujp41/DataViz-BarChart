//grab data from window
const {data: jsonData} = window;

// array of GDP data
const {source_name, description, from_date, to_date, data: GDPData} = jsonData;
const totalData = GDPData.length;
const tickYear = GDPData.filter(d => {
  const date = d[0];
  const year = parseInt(date.slice(0, date.indexOf('-')));
  const month = date.slice(date.indexOf('-')+1, date.lastIndexOf('-'));
  if (year%5 === 0 && month === '01') return year;
}).map(item => parseInt(item.slice(0, item.indexOf('-'))));
tickYear.unshift(1947);

//placeholders for min/max GDP
let minGDP = Infinity;
let maxGDP = -Infinity;

const barWidth = 1125/totalData;
const getYear = dateString => dateString.slice(0, dateString.indexOf('-'));

//utils
const formatDate = date => {
  const year = date.slice(0, 4);
  const month = parseInt(date.slice(date.indexOf('-')+1, date.lastIndexOf('-')));
  return `${year} Q${month%4+1}`;
}

const formatAmount = amount => {
  amount = amount.toString();
  const hasDecimal = amount.includes('.');
  let decimal = null;
  if (hasDecimal) {
    decimal = amount.slice(amount.indexOf('.'));
  };
  const amtInt = hasDecimal ? amount.slice(0, amount.indexOf('.')) : amount;
  if (amtInt.length <= 3) {
    return hasDecimal ? `$${amtInt}${decimal} billion` : `$${amtInt} billion`;
  } else {
    const commaAmt = `,${amtInt.slice(-3)}`;
    const commaBefore = `${amtInt.slice(0, -3)}`;
    return hasDecimal ? `$${commaBefore}${commaAmt}${decimal} billion` : `$${commaBefore}${commaAmt} billion`;
  }
}

const formatToolTip = d => `<h5>${formatDate(d[0])}</h5><h5>${formatAmount(d[1])}</h5>`

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
                .domain([d3.min(tickYear), d3.max(tickYear)])
                .range([0, 1125]);

const yscale = d3.scaleLinear()
                .domain([minGDP, maxGDP])
                .range([875, 50]);

const x_axis = d3.axisBottom()
                .scale(xscale)
                .tickFormat(d3.format("d"));

const y_axis = d3.axisLeft()
                .scale(yscale);

svg.append('g')
  .attr('transform', 'translate(50, 875)')
  .call(x_axis);

svg.append('g')
  .attr('transform', 'translate(50,0)')
  .call(y_axis);

svg.selectAll('rect')
  .data(GDPData)
  .enter().append('rect')
  .attr('class', 'rect')
  .attr('height', d => 825*(d[1]/maxGDP))
  .attr('width', barWidth)
  .attr('x', (d, i) => (barWidth*i)+50)
  .attr('y', d => 875-825*(d[1]/maxGDP))
  .on('mouseover', () => {
    tooltip.style('visibility', 'visible')
  })
  .on("mousemove", d => {
    return tooltip
            .style("top", (event.pageY+25)+"px").style("left",(event.pageX+25)+"px")
            .html(formatToolTip(d));
  })
  .on('mouseout', d => {
    tooltip.style('visibility', 'hidden')
  });

const tooltip = d3.select('body')
                  .append('div')
                  .attr('class', 'tooltip');

d3.select('body')
  .append('div')
  .attr('class', 'title')
  .html(`<p>United States GDP</p>`);