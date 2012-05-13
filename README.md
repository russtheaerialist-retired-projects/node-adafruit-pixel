node-adafruit-pixel
===================

NodeJS interface for controlling the atafruit pixel led strings

**Depends on the node-spi module which isn't complete yet**

usage
-----

```javascript
var Pixel = require('adafruit_pixel').Pixel;

var lights = Pixel('/dev/spidev1.1', 25);
lights.all(0xff, 0, 0);
lights.sync(); // Updates strand with current buffer
lights.set(1, 0xff, 0xff, 0);
lights.set(2, 0xff, 0xff, 0xff);
lights.sync();
lights.off(); // All off immediately (saves previous state)
lights.sync(); // Restores previous state
```
