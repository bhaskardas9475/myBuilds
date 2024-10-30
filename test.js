function signum(x) {
    return (x < 0) ? -1 : 1;
}

function absolute(x) {
    return (x < 0) ? -x : x;
}

function drawPath(svg, path, startX, startY, endX, endY) {
    // get the path's stroke width
    var stroke = parseFloat(path.getAttribute("stroke-width"));

    // check if the svg is big enough to draw the path, if not, set height/width
    if (parseFloat(svg.getAttribute("height")) < endY) svg.setAttribute("height", endY);
    if (parseFloat(svg.getAttribute("width")) < (startX + stroke)) svg.setAttribute("width", (startX + stroke));
    if (parseFloat(svg.getAttribute("width")) < (endX + stroke)) svg.setAttribute("width", (endX + stroke));

    var deltaX = (endX - startX) * 0.15;
    var deltaY = (endY - startY) * 0.15;
    var delta = deltaY < absolute(deltaX) ? deltaY : absolute(deltaX);

    // set sweep-flag
    var arc1 = 0, arc2 = 1;
    if (startX > endX) {
        arc1 = 1;
        arc2 = 0;
    }

    // draw the path
    path.setAttribute("d", "M" + startX + " " + startY +
                            " V" + (startY + delta) +
                            " A" + delta + " " + delta + " 0 0 " + arc1 + " " + (startX + delta * signum(deltaX)) + " " + (startY + 2 * delta) +
                            " H" + (endX - delta * signum(deltaX)) +
                            " A" + delta + " " + delta + " 0 0 " + arc2 + " " + endX + " " + (startY + 3 * delta) +
                            " V" + endY);
}

function connectElements(svg, path, startElem, endElem) {
    var svgContainer = document.getElementById("svgContainer");

    // if first element is lower than the second, swap!
    if (startElem.getBoundingClientRect().top > endElem.getBoundingClientRect().top) {
        var temp = startElem;
        startElem = endElem;
        endElem = temp;
    }

    // get (top, left) corner coordinates of the svg container
    var svgTop = svgContainer.getBoundingClientRect().top + window.scrollY;
    var svgLeft = svgContainer.getBoundingClientRect().left + window.scrollX;

    // get (top, left) coordinates for the two elements
    var startCoord = startElem.getBoundingClientRect();
    var endCoord = endElem.getBoundingClientRect();

    // calculate path's start (x, y) coords
    var startX = startCoord.left + 0.5 * startElem.offsetWidth - svgLeft;
    var startY = startCoord.top + startElem.offsetHeight - svgTop;

    // calculate path's end (x, y) coords
    var endX = endCoord.left + 0.5 * endElem.offsetWidth - svgLeft;
    var endY = endCoord.top - svgTop;

    // call function for drawing the path
    drawPath(svg, path, startX, startY, endX, endY);
}
