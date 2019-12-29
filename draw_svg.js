d3.json("dataset_makeup/level2_html.json").then(function(level2) {
    d3.json("dataset_makeup/level3_html.json").then(function(level3) {
        d3.json("dataset_makeup/links_html.json").then(function(links) {
            draw_svg(level2, level3, links)
        })
    })
})

// Draw svg using D3
function draw_svg(level2, level3, links) {
    console.log(level2)
    console.log(level3)
    console.log(links)

    height = 1000
    node_width = 150

    // d3.json("dataset_makeup/level2_html.json").then(function(level2) {
    svg = d3.select("#svg-container")
        .append("svg")
        .attr("id", "my-svg")
        .attr("style", "height:1000px; width: 800px")

    group2 = svg.selectAll()
        .append("g")
        .data(level2)
        .enter()
        .append("g")

    yScale = d3.scaleBand()
        .range([0, height])
        .domain(level2.map((e) => e.uid))
        .padding(.4)

    group2.append("rect")
        .attr("fill", "#33EEAF")
        .attr("x", "10px")
        .attr("y", (e) => yScale(e.uid))
        .attr("width", node_width)
        .attr("height", "20px")
        .attr("id", (e) => {
            for (var i = 0; i < e.majors.length; i++) {
                major = e.majors[i]
                d3.select("#td-" + major)
                    .attr("width", node_width)
                    .append("li")
                    .text(e.name)
                    .attr("class", "legend-uid legend-uid-" + e.uid)
                d3.select("#th-" + major)
                    .attr("style", "background:" + get_color(major))
            }
            return e.uid
        })
        .on("click", (e) => click_node(e.uid))

    group2.append("text")
        .attr("x", "20px")
        .attr("y", (e) => yScale(e.uid) + 15)
        .text((e) => e.name)
        .on("click", (e) => click_node(e.uid))

    // d3.json("dataset_makeup/level3_html.json").then(function(level3) {
    group3 = svg.selectAll()
        .append("g")
        .data(level3)
        .enter()
        .append("g")

    yScale = d3.scaleBand()
        .range([0, height])
        .domain(level3.map((e) => e.uid))
        .padding(.4)

    group3.append("rect")
        .attr("fill", (e) => get_color(e.major))
        .attr("x", "310px")
        .attr("y", (e) => yScale(e.uid))
        .attr("width", node_width)
        .attr("height", "8px")
        .attr("id", (e) => e.uid)
        .on("click", (e) => click_node(e.uid))

    group3.append("text")
        .attr("x", "320px")
        .attr("y", (e) => yScale(e.uid) + 8)
        .attr("font-size", "8px")
        .text((e) => e.name)
        .on("click", (e) => click_node(e.uid))

    // d3.json("dataset_makeup/links_html.json").then(function(links) {
    linkers = svg.selectAll()
        .append("g")
        .data(links)
        .enter()
        .append("g")

    linkers.append("path")
        .attr("fill", "transparent")
        .attr("stroke-width", 0.5)
        .attr("stroke", (e) => d3.select("#" + e.uid2).attr("fill"))
        .attr("stroke-opacity", 0.2)
        .attr("d", (e) =>
            " M " +
            (parseInt(d3.select("#" + e.uid1).attr("x")) + node_width) + " " + parseInt(d3.select("#" + e.uid1).attr("y")) +
            " C " +
            (parseInt(d3.select("#" + e.uid1).attr("x")) + node_width * 3 / 2) + " " + parseInt(d3.select("#" + e.uid1).attr("y")) + "," +
            (parseInt(d3.select("#" + e.uid2).attr("x")) - node_width / 2) + " " + parseInt(d3.select("#" + e.uid2).attr("y")) + "," +
            (parseInt(d3.select("#" + e.uid2).attr("x"))) + " " + parseInt(d3.select("#" + e.uid2).attr("y"))
        )
        .attr("class", (e) => "line " + "line-uid-" + e.uid1 + " line-uid-" + e.uid2)
}

function get_color(major) {
    switch (major) {
        case "Organization":
            return "#827658";
        case "Police":
            return "#547135";
        case "Propagation":
            return "#10e385";
        case "Military":
            return "#00ae33";
        case "Law":
            return "#ef4630";
        case "Industry":
            return "#90aaee";
    }
}

function click_node(uid) {
    console.log(uid)

    // Reset
    d3.selectAll(".line")
        .attr("stroke-width", 0.5)
        .attr("stroke-opacity", 0.2)

    d3.selectAll(".legend-uid")
        .attr("style", "color:gray")

    // Set
    d3.selectAll(".line-uid-" + uid)
        .attr("stroke-width", 2)
        .attr("stroke-opacity", 1)

    d3.selectAll(".legend-uid-" + uid)
        .attr("style", "color:red")
}