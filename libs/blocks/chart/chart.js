import { makeRelative } from '../../utils/utils.js';

function processDataset(data) {
  const dataset = {};
  const header = Object.keys(data[0]);
  
  // Remove group and unit from header
  const unit = header.indexOf('Unit');
  if (unit !== -1) header.splice(unit, 1);
  const group = header.indexOf('Group');
  if (group !== -1) header.splice(group, 1);

  // Use header to set source
  dataset.source = [header];
  data.forEach(element => {
    const values = header.map((column) => { return element[column] });
    dataset.source.push(values);
  });

  return dataset;
}

function processSeries(data) {
  const series = [];
  // TODO: Series data
  return series;
}

/**
 * Return data as object with two entries
 */
async function fetchData(link) {
  const path = makeRelative(link.href);
  const data = {};
  // Fetch request
  const resp = await fetch(path.toLowerCase());
  if (!resp.ok) return;
  const json = await resp.json();

  // Check the type of data
  if (json[':type'] == 'multi-sheet') {
    const dataSheet = json[':names'][0];
    const seriesSheet = json[':names'][1];
    data.data = json[dataSheet]?.data;
    data.series = json[seriesSheet]?.data;
  } else {
    data.data = json.data;
    data.series = [];
  }

  return data;
}

export default async function init(el) {
  const link = el.querySelector('a[href$="json"]');
  if (!link) return;

  // Fetch Data
  const data = await fetchData(link);
  if (!data) return;
  const chartData = {};

  chartData.dataSet = processDataset(data.data);
  chartData.series = processSeries(data);
  chartData.unit = data?.data[0]?.Unit;

  // TODO: Create Chart
  const chart = document.createElement('pre');
  chart.textContent = JSON.stringify(chartData, null, 2);

  link.replaceWith(chart);
}
