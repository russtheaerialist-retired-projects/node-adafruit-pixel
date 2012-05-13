var spi = require('spi');

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
    this.device.write(pixel_buffer);
};

Pixel.prototype.off = function() {
    this.device.write(off_buffer);
};

Pixel.prototype.sync = function() {
    this.device.write(pixel_buffer);
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

module.exports.Pixel = Pixel;
