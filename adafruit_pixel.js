var spi = require('spi');
var Easing = require('easing');

var STEPS = 25;
var DURATION_SCALE = 1000/STEPS;

function Throb(setter, pixels, start_color, end_color, duration, options)
{
    this.setter = setter;
    this.pixels = pixels;
    this.start_color = start_color;
    this.end_color = end_color;
    this.duration = duration;
    if (options !== undefined && "easing" in options) {
        this.easing = Easing(STEPS, options.easing, {
            endToEnd:true
        });
    } else {
        this.easing = Easing(STEPS, 'linear', {
            endToEnd:true
        });
    }
    this.step = 0;
    this.running = false;
}

Throb.prototype.start = function() {
    console.log(this.easing);
    this.running = true;
    this.tick();
}

Throb.prototype.stop = function() {
    this.running = false;
}

Throb.prototype.calculate_single = function(start_value, end_value) {
    var retval = start_value + (end_value-start_value)*this.easing[this.step];
    return retval;
}

Throb.prototype.calculate_rgb = function() {
    var r = this.calculate_single(this.start_color[0],
                                  this.end_color[0]);
    var g = this.calculate_single(this.start_color[1],
                                  this.end_color[1]);
    var b = this.calculate_single(this.start_color[2],
                                  this.end_color[2]);

    return [r,g,b];
}

Throb.prototype.tick = function() {
    var self = this;
    rgb = this.calculate_rgb();
    // Loop through all of the pixels in pixels, and call set
    this.pixels.forEach(function(element, index, array) {
        self.setter.set(element, rgb[0], rgb[1], rgb[2]);
    });
    self.setter.sync();

    this.step = (this.step+=1)%STEPS;
    if (this.running) {
        setTimeout(function() { self.tick(); },
            this.duration*DURATION_SCALE);
    }
}

function Pixel(device, num_pixels) {
    this.num_pixels = num_pixels;
    this.pixel_buffer = new Buffer(num_pixels*3);
    this.off_buffer = new Buffer(num_pixels*3);
    this.device = new spi.Spi();
    this.device.open(device, {
        "mode": spi.MODE[0],
        "chipSelect": spi.CS['none'],
        "maxSpeed": 1000000
    });

    this.pixel_buffer.fill(0);
    this.off_buffer.fill(0);
    this.device.write(this.pixel_buffer);
    this.animate = null;
};

Pixel.prototype.off = function() {
    this.device.write(this.off_buffer);
};

Pixel.prototype.sync = function() {
    this.device.write(this.pixel_buffer);
};

Pixel.prototype.all = function(r,g,b) {
    for(var i = 0; i < this.num_pixels; i++) {
        this.set(i, r, g, b);
    }
}

Pixel.prototype.clear = function() {
    this.pixel_buffer.fill(0);
}

Pixel.prototype.set = function(pixel, r, g, b) {
    this.pixel_buffer[pixel*3] = r;
    this.pixel_buffer[pixel*3+1] = g;
    this.pixel_buffer[pixel*3+2] = b;
}

Pixel.prototype.throb = function(pixels, start_color, end_color, duration, options) {
    this.stop();
    this.animate = new Throb(this, pixels, start_color, end_color, duration, options);
    this.animate.start();
}

Pixel.prototype.stop = function() {
    if (this.animate !== null) {
        this.animate.stop();
        this.animate = null;
    }
}

module.exports.Pixel = Pixel;
