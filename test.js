function drawPath(svg, path, startX, startY, endX, endY) {
    // Get the path's stroke width
    var stroke = parseFloat(path.getAttribute("stroke-width"));
    // Check if the SVG is big enough to draw the path, if not, set height/width
    if (parseFloat(svg.getAttribute("height")) < endY) svg.setAttribute("height", endY);
    if (parseFloat(svg.getAttribute("width")) < (startX + stroke)) svg.setAttribute("width", startX + stroke);
    if (parseFloat(svg.getAttribute("width")) < (endX + stroke)) svg.setAttribute("width", endX + stroke);

    var deltaX = (endX - startX) * 0.15;
    var deltaY = (endY - startY) * 0.15;
    // Choose the shortest distance for further calculations
    var delta = deltaY < Math.abs(deltaX) ? deltaY : Math.abs(deltaX);

    // Set sweep-flag (counter/clock-wise)
    var arc1 = 0, arc2 = 1;
    if (startX > endX) {
        arc1 = 1;
        arc2 = 0;
    }

    // Draw the path
    path.setAttribute("d",
        "M" + startX + " " + startY +
        " V" + (startY + delta) +
        " A" + delta + " " + delta + " 0 0 " + arc1 + " " + (startX + delta * Math.sign(deltaX)) + " " + (startY + 2 * delta) +
        " H" + (endX - delta * Math.sign(deltaX)) +
        " A" + delta + " " + delta + " 0 0 " + arc2 + " " + endX + " " + (startY + 3 * delta) +
        " V" + endY
    );
}

function connectElements(svg, path, startElem, endElem) {
    var svgContainer = document.getElementById("svgContainer");

    // If the first element is lower than the second, swap them
    if (startElem.getBoundingClientRect().top > endElem.getBoundingClientRect().top) {
        var temp = startElem;
        startElem = endElem;
        endElem = temp;
    }

    // Get (top, left) corner coordinates of the SVG container
    var svgTop = svgContainer.getBoundingClientRect().top;
    var svgLeft = svgContainer.getBoundingClientRect().left;

    // Get (top, left) coordinates for the two elements
    var startCoord = startElem.getBoundingClientRect();
    var endCoord = endElem.getBoundingClientRect();

    // Calculate path's start (x,y) coordinates
    var startX = startCoord.left + 0.5 * startElem.offsetWidth - svgLeft;
    var startY = startCoord.top + startElem.offsetHeight - svgTop;

    // Calculate path's end (x,y) coordinates
    var endX = endCoord.left + 0.5 * endElem.offsetWidth - svgLeft;
    var endY = endCoord.top - svgTop;

    // Call function for drawing the path
    drawPath(svg, path, startX, startY, endX, endY);
}
