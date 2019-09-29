function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  var defaultURL = `/metadata/${sample}`;
  // var myData = sample_metadata;
  //var tbody = d3.select("sample-metadata");
  // tbody.html("")

  d3.json(defaultURL).then(function(sample) {
    var tbody = d3.select("#sample-metadata");
    tbody.html("");
  // myData.forEach((metadata) => {
  //   var row = tbody.append("ul");
    //var metadata = sample_metadata;
    Object.entries(sample).forEach(([key, value]) => {
      var cell = tbody.append("p");
      cell.text(`${key}:  ${value}`);
    });
  });
};


    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
  // d3.json(defaultURL).then(function(sample) {
  //   var data = [{
  //     domain: { x: [0,10], y: [0,10] },
  //     value: sample.WFREQ,
  //     title: {text: "Belly Button Washing Frequency"},
  //     type: 'indicator',
  //     mode: "gauge+number"
  //   }];
  //   var layout = {
  //     width: 600,
  //     height: 400,
  //     margin: { t: 5, b: 5}
  //   };
  //   Plotly.newPlot(gd, data, layout);
  // });



function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var defaultURL = `/samples/${sample}`;
  // @TODO: Build a Pie Chart
  // HINT: You will need to use slice() to grab the top 10 sample_values, otu_ids, and labels (10 each).
  var layout = {
    height: 400,
    width: 600
  };

  d3.json(defaultURL).then(function(data) {
    data = [{
      "labels": data.otu_ids.slice(0,10),
      "values": data.sample_values.slice(0,10),
      "hover": data.otu_labels.slice(0,10),
      "type": "pie"}]
    Plotly.plot("pie", data, layout);
  });

  // // @TODO: Build a Bubble Chart using the sample data
  d3.json(defaultURL).then(function(data) { 
    var trace = {
      x: data.otu_ids,
      y: data.sample_values,
      //type: 'scatter',
      mode: 'markers',
        marker: {
          size: data.sample_values,
          color: data.otu_ids,
          text: data.otu_labels
        }
      };

    var data = [trace];

    var layout = {
      title: 'Biodiversity of Belly Buttons',
      showlegend: false,
      axis: "OTU-ID",
      height: 600,
      width: 1200
    };
  
    Plotly.newPlot('bubble', data, layout);
  });
};

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

//Initialize the dashboard

init();

