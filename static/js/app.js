
var bbData;
// load JSON data
// console.log('app start')
d3.json("samples.json").then((importedData) => {
    // console.log("fetched")

    bbData = importedData;

    // populate select dropdown
    var dropDown = d3.select('#selDataset')
        .classed("custom-select", true);

    var options = dropDown
        .selectAll('option')
        .data(importedData.names)
        .enter()
        .append('option')
        .text(function (d) { return d; });

});

// populate dashboard when id is selected
function optionChanged(sampleID) {
    // console.log(sampleID);
    // console.log(bbData)

    //filter the data to match the selection in the drop down
    var filter1 = bbData.metadata.filter(function (d) {
        if ((parseInt(d.id) === parseInt(sampleID))) {
            return d;
        }
    });

    //Build the table for the demographic information
    filter1.forEach((d) => {
        console.log(d);
        //Select the element where the table will go and remove the existing table, if any
        var demoInfo = d3.select('#sample-metadata');
        demoInfo.selectAll("table").remove();
        //Creat the new table element and assign it two classses
        var tableData = demoInfo
            .append('table')
            .classed("table-striped", true);
        //Create the body for the table
        var table_h_bb = tableData
            .append('tbody');
        //create the rows and cells for the table
        Object.entries(d).forEach(([key, value]) => {
            var bb_row = table_h_bb.append("tr");
            var bb_cell = bb_row.append("td").text(key.toUpperCase());
            var bb_cell = bb_row.append("td").text(value);
        });

    });

    //Filter the date in the samples array for plotting
    filter2 = bbData.samples.filter(function (x) {
        if ((parseInt(x.id) === parseInt(sampleID))) {
            return x;
        }
    });

    // // Sort the data array using the samples value
    // filter2.sort(function(a, b) {
    //     return parseFloat(b.sample_values) - parseFloat(a.sample_values);
    // });

    // // Reverse the array due to Plotly's defaults
    // filter2 = filter2.reverse();

    //Create the plot for the sample values
    filter2.forEach((x) => {
        console.log(x.sample_values);
        console.log(x.otu_ids);

        var trace = {
            type: 'bar',
            marker:{
            color: 'blue'
            },
            x: x.sample_values.slice(0, 10),
            y: x.otu_ids.slice(0, 10),
            hovertext: x.otu_labels.slice(0, 10),
            width: 20,
            orientation: 'h' 
        };

        var data = [trace];

        var layout = {
            title: "Top 10 OTUs",
        }
        
        Plotly.newPlot('bar', data, layout);
        var bubble_color=x.otu_ids;
        bubble_color = bubble_color.map(function(val){return val;});

        var trace1 = {
            x: x.otu_ids,
            y: x.sample_values,
            mode: 'markers',
            marker: {
                size: x.sample_values,
                color: bubble_color,
                colorscale: "Portland"
            }
        };

        var data = [trace1];

        var layout2 = {
            title: 'Belly Button Biodiversity',
        };

        Plotly.newPlot('bubble', data, layout2);

        // variable to collect wash frequency
        var wfreq;

        // Grab the wash frequwncy from the metadata
        filter1.forEach((d) => {
            wfreq = parseInt(d.wfreq);

        // Change NaN or null values to 0
            wfreq = wfreq || 0;
            console.log(`wash freq: ${wfreq}`);
        });

        var data = [
            {
                value: wfreq,
                title: `${wfreq} Belly Button Washes per Week`,
                type: "indicator",
                mode: "gauge+number",
                gauge: {
                    axis: { range: [null, 9], tickwidth: 1, tickcolor: "darkblue" },
                    bar: { color: "green" }, bgcolor: "white", borderwidth: 2, bordercolor: "gray",
                    steps: [{ range: [0, 4.5], color: 'lightgray' }, {
                        range: [4.5, 10], color: 'darkgray'
                    }], threshold: { line: { color: "dark green", width: 4 }, thickness: 0.75, value: wfreq }
                }
            }
        ];

var layout3 = {};


Plotly.newPlot('gauge', data, layout3);

});



}

             