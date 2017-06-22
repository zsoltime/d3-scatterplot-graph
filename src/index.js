import { axisBottom, axisLeft } from 'd3-axis';
import { mouse, select } from 'd3-selection';
import { scaleLinear, scaleTime } from 'd3-scale';
import { max } from 'd3-array';
import { timeFormat } from 'd3-time-format';
import { json } from 'd3-request';
import { easeBack } from 'd3-ease';
import 'd3-transition';
import 'styles';

const url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json';

function visualize(data) {
  const margins = {
    top: 10,
    right: 75,
    bottom: 20,
    left: 40,
  };
  const canvasWidth = window.innerWidth * 0.8;
  const canvasHeight = window.innerHeight * 0.75;
  const width = canvasWidth - margins.right - margins.left;
  const height = canvasHeight - margins.top - margins.bottom;
  const formatTime = timeFormat('%M:%S');
  const offsetInSeconds = data[0].Seconds;
  const extendX = 4 * 1000;
  const extendY = 1;

  // create svg canvas
  const svg = select('#graph')
    .append('svg')
      .attr('class', 'graph')
      .attr('width', canvasWidth)
      .attr('height', canvasHeight)
      .attr('viewBox', `0 0 ${canvasWidth} ${canvasHeight}`);

  const graph = svg.append('g')
    .attr('transform', `translate(${margins.left}, ${margins.top})`);

  // add the tooltip
  const tooltip = select('#graph')
    .append('div')
      .attr('class', 'tooltip');

  // set ranges and scale the range of data
  const scaleX = scaleTime()
    .domain([
      max(data, d => (d.Seconds - offsetInSeconds) * 1000) + extendX,
      0,
    ])
    .rangeRound([0, width]);

  const scaleY = scaleLinear()
    .domain([
      max(data, d => d.Place) + extendY,
      0,
    ])
    .range([height, 0]);

  // define axes
  const axisX = axisBottom(scaleX)
    .tickFormat(formatTime)
    .ticks(12);
  const axisY = axisLeft(scaleY)
    .ticks(10);

  // add x axis
  graph.append('g')
    .attr('class', 'graph__axis graph__axis--x')
    .attr('transform', `translate(0, ${height})`)
    .call(axisX)
    .append('text')
      .attr('class', 'graph__label')
      .attr('transform', `translate(${width}, ${-margins.bottom})`)
      .attr('dy', '0.875em')
      .attr('text-anchor', 'end')
      .text('Time behind #1');

  // add y axis
  graph.append('g')
    .attr('class', 'graph__axis graph__axis--y')
    .call(axisY)
    .append('text')
      .attr('class', 'graph__label')
      .attr('transform', 'rotate(-90)')
      .attr('y', 15)
      .text('Place');

  // add the circles
  const circles = graph.append('g')
    .attr('class', 'graph__circles')
    .selectAll('.graph__circle')
    .data(data)
    .enter();

  const circlePosX = d => scaleX((d.Seconds - offsetInSeconds) * 1000);
  const circlePosY = d => scaleY(d.Place);

  circles.append('circle')
    .attr('class', d => (
      d.Doping ?
      'graph__circle graph__circle--doping' :
      'graph__circle'))
    .attr('r', 7)
    .attr('cx', d => circlePosX(d))
    .attr('cy', height)
    .transition()
    .ease(easeBack)
    .duration(1000)
    .delay((d, i) => i * 10)
    .attr('cy', d => circlePosY(d))
    .style('transform-origin', d => `${circlePosX(d)}px ${circlePosY(d)}px`);

  circles.selectAll('circle')
    .on('mouseover', (d) => {
      const tooltipX = `calc(${mouse(document.body)[0]}px - 50%)`;
      const tooltipY = `calc(${mouse(document.body)[1]}px - 100%)`;
      const content = `
      <p class="tooltip__header">
        <span class="name">${d.Name}</span>
        <span class="country">${d.Nationality}</span>
        <span class="year">${d.Year}</span>
        <span class="time">${d.Time}</span>
      </p>
      <p class="tooltip__footer">Doping: ${d.Doping || 'None'}</p>`;

      tooltip.transition()
        .duration(200)
        .style('opacity', 1);

      tooltip.html(content)
        .style('transform', `translate(${tooltipX}, ${tooltipY})`);
    })
    .on('mouseout', () => {
      tooltip.transition()
        .duration(200)
        .style('opacity', 0);
      tooltip.html('');
    });

  circles.append('text')
    .attr('class', 'graph__name')
    .attr('x', d => circlePosX(d) - 100)
    .attr('y', () => height)
    .style('opacity', 0)
    .transition()
    .ease(easeBack)
    .duration(1000)
    .delay((d, i) => i * 10)
    .attr('x', d => circlePosX(d) + 10)
    .attr('y', d => circlePosY(d) + 4)
    .style('opacity', 1)
    .text(d => d.Name);
}

json(url, (err, data) => {
  if (err) throw err;
  visualize(data);
});
