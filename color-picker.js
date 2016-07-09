(function() {
    var BODY = document.body;
    var CANVAS = document.getElementsByTagName('canvas')[0];
    var CONTEXT = CANVAS.getContext('2d');

    var LENGTH = 400;
    var CIRCLE_OFFSET = 10;
    var DIAMETER = LENGTH - (CIRCLE_OFFSET * 2);
    var RADIUS = DIAMETER / 2;
    var MAX_RGB = 255;

    CANVAS.width = CANVAS.height = LENGTH;
    var label = BODY.appendChild(document.createElement("p"));
    var position = CIRCLE_OFFSET * 4 * LENGTH + (CIRCLE_OFFSET * 4);

    var curr_y = 100;
    var curr_x = -curr_y;
    
    var image_data = CONTEXT.createImageData(LENGTH, LENGTH);
    var pixels = image_data.data;

    // Setup DOM properties
    BODY.style.textAlign = "center";
    label.style.font = "2em courier";
    
    for (y = 0; y < LENGTH; y++) {
        for (x = 0; x < LENGTH; x++) {
            var rx = x - RADIUS;
            var ry = y - RADIUS;
            var distance = getCircleDistance(rx, ry);

            var hue = (Math.atan2(ry, rx) + Math.PI) / (Math.PI * 2);
            var saturation = Math.sqrt(distance) / RADIUS;
            var rgb = hsvToRgb(hue, saturation, 1);

            // Display current color
            pixels[position++] = rgb[0];
            pixels[position++] = rgb[1];
            pixels[position++] = rgb[2];
            pixels[position++] = distance > Math.pow(RADIUS, 2) ? 0 : 255;
        }
    }
    
    // Bind Event Handlers
    CANVAS.onmousedown = document.onmouseup = function(e) {
        // Unbind mouse move if this is a mouseup event
        // bind mousemove if this a mousedown event
        document.onmousemove = /p/.test(e.type) ? 0 : (redraw(e), redraw);
    }


    function getCircleDistance(x, y) {
        return Math.pow(x, 2) + Math.pow(y, 2);
    }

    function getAngle(x, y) {
        return Math.atan2(y, x);
    }

    function redraw(e) {
        // Change current position if the mouse has moved
        if (e.pageX) {
            curr_x = e.pageX - CANVAS.offsetLeft - (RADIUS + CIRCLE_OFFSET);
            curr_y = e.pageY - CANVAS.offsetTop - (RADIUS + CIRCLE_OFFSET);
        }

        var theta = getAngle(curr_x, curr_y);
        var distance = getCircleDistance(curr_x, curr_y);

        // If the user's mouse is outside of the circle, place the cursor on 
        // the circle's edge.
        if (distance > Math.pow(RADIUS, 2)) {
            curr_x = RADIUS * Math.cos(theta);
            curr_y = RADIUS * Math.sin(theta);
            var theta = getAngle(curr_x, curr_y);
            var distance = getCircleDistance(curr_x, curr_y);
        }

        curr_hue = (theta + Math.PI) / (Math.PI * 2); // Degrees along the circle
        curr_saturation = Math.sqrt(distance) / RADIUS;
        var [r, g, b] = hsvToRgb(curr_hue, curr_saturation, 1);
        // r = res[0]
        // g = res[1]
        // b = res[2]

        // Reset to color wheel and draw a spot on the current location. 
        CONTEXT.putImageData(image_data, 0, 0);
        updateFilter(r, g, b);

        cursor = new Image();
        cursor.src = 'JamesHead.png';
        cursor.onload = function() {
            x_pos = curr_x + RADIUS - CIRCLE_OFFSET - 5;
            y_pos = curr_y + RADIUS - CIRCLE_OFFSET + 5;
            CONTEXT.drawImage(cursor, x_pos, y_pos, 20, 20);
        }

        // // Heart:
        // CONTEXT.font = "1em arial";
        // CONTEXT.fillText("♥", curr_x + RADIUS + CIRCLE_OFFSET - 4, curr_y + RADIUS + CIRCLE_OFFSET + 4); 
    }

    /* Let's go! */
    redraw(0);
})();