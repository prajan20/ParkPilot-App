const logger = require('./logger');

class Gestures {
  /**
   * Performs a single tap at a coordinate or element center
   */
  static async tap(driver, elementOrCoord) {
    let x, y;
    if (typeof elementOrCoord.x === 'number' && typeof elementOrCoord.y === 'number') {
      x = elementOrCoord.x;
      y = elementOrCoord.y;
    } else {
      const location = await elementOrCoord.getLocation();
      const size = await elementOrCoord.getSize();
      x = Math.round(location.x + size.width / 2);
      y = Math.round(location.y + size.height / 2);
    }

    logger.info(`Performing tap at coordinates: (${x}, ${y})`);
    await driver.performActions([
      {
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x, y },
          { type: 'pointerDown', button: 0 },
          { type: 'pause', duration: 100 },
          { type: 'pointerUp', button: 0 }
        ]
      }
    ]);
  }

  /**
   * Performs a double tap at a coordinate or element center
   */
  static async doubleTap(driver, elementOrCoord) {
    let x, y;
    if (typeof elementOrCoord.x === 'number' && typeof elementOrCoord.y === 'number') {
      x = elementOrCoord.x;
      y = elementOrCoord.y;
    } else {
      const location = await elementOrCoord.getLocation();
      const size = await elementOrCoord.getSize();
      x = Math.round(location.x + size.width / 2);
      y = Math.round(location.y + size.height / 2);
    }

    logger.info(`Performing double tap at: (${x}, ${y})`);
    await driver.performActions([
      {
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x, y },
          { type: 'pointerDown', button: 0 },
          { type: 'pause', duration: 100 },
          { type: 'pointerUp', button: 0 },
          { type: 'pause', duration: 100 },
          { type: 'pointerDown', button: 0 },
          { type: 'pause', duration: 100 },
          { type: 'pointerUp', button: 0 }
        ]
      }
    ]);
  }

  /**
   * Performs a long press at a coordinate or element center
   */
  static async longPress(driver, elementOrCoord, durationMs = 1500) {
    let x, y;
    if (typeof elementOrCoord.x === 'number' && typeof elementOrCoord.y === 'number') {
      x = elementOrCoord.x;
      y = elementOrCoord.y;
    } else {
      const location = await elementOrCoord.getLocation();
      const size = await elementOrCoord.getSize();
      x = Math.round(location.x + size.width / 2);
      y = Math.round(location.y + size.height / 2);
    }

    logger.info(`Performing long press at: (${x}, ${y}) for ${durationMs}ms`);
    await driver.performActions([
      {
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x, y },
          { type: 'pointerDown', button: 0 },
          { type: 'pause', duration: durationMs },
          { type: 'pointerUp', button: 0 }
        ]
      }
    ]);
  }

  /**
   * Performs a swipe from start coordinates to end coordinates
   */
  static async swipe(driver, fromX, fromY, toX, toY, durationMs = 1000) {
    logger.info(`Performing swipe from (${fromX}, ${fromY}) to (${toX}, ${toY}) over ${durationMs}ms`);
    await driver.performActions([
      {
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x: fromX, y: fromY },
          { type: 'pointerDown', button: 0 },
          { type: 'pause', duration: 100 },
          { type: 'pointerMove', duration: durationMs, x: toX, y: toY },
          { type: 'pointerUp', button: 0 }
        ]
      }
    ]);
  }

  /**
   * Scrolls the screen in a specified direction ('up', 'down', 'left', 'right')
   */
  static async scroll(driver, direction = 'down') {
    const size = await driver.getWindowSize();
    const width = size.width;
    const height = size.height;

    let startX, startY, endX, endY;

    if (direction === 'down') {
      startX = Math.round(width / 2);
      startY = Math.round(height * 0.8);
      endX = Math.round(width / 2);
      endY = Math.round(height * 0.2);
    } else if (direction === 'up') {
      startX = Math.round(width / 2);
      startY = Math.round(height * 0.2);
      endX = Math.round(width / 2);
      endY = Math.round(height * 0.8);
    } else if (direction === 'left') {
      startX = Math.round(width * 0.8);
      startY = Math.round(height / 2);
      endX = Math.round(width * 0.2);
      endY = Math.round(height / 2);
    } else if (direction === 'right') {
      startX = Math.round(width * 0.2);
      startY = Math.round(height / 2);
      endX = Math.round(width * 0.8);
      endY = Math.round(height / 2);
    }

    logger.info(`Scrolling screen ${direction}...`);
    await this.swipe(driver, startX, startY, endX, endY, 800);
  }

  /**
   * Drags an element and drops it onto a target element
   */
  static async dragAndDrop(driver, sourceElement, targetElement) {
    const sourceLoc = await sourceElement.getLocation();
    const sourceSize = await sourceElement.getSize();
    const sourceX = Math.round(sourceLoc.x + sourceSize.width / 2);
    const sourceY = Math.round(sourceLoc.y + sourceSize.height / 2);

    const targetLoc = await targetElement.getLocation();
    const targetSize = await targetElement.getSize();
    const targetX = Math.round(targetLoc.x + targetSize.width / 2);
    const targetY = Math.round(targetLoc.y + targetSize.height / 2);

    logger.info(`Dragging from (${sourceX}, ${sourceY}) to (${targetX}, ${targetY})`);
    await driver.performActions([
      {
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x: sourceX, y: sourceY },
          { type: 'pointerDown', button: 0 },
          { type: 'pause', duration: 500 }, // hold briefly
          { type: 'pointerMove', duration: 1500, x: targetX, y: targetY },
          { type: 'pointerUp', button: 0 }
        ]
      }
    ]);
  }

  /**
   * Performs a pinch close gesture (zoom out) on the screen
   */
  static async pinch(driver) {
    const size = await driver.getWindowSize();
    const centerX = Math.round(size.width / 2);
    const centerY = Math.round(size.height / 2);

    logger.info('Performing pinch (zoom out) gesture...');
    await driver.performActions([
      {
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x: centerX - 100, y: centerY },
          { type: 'pointerDown', button: 0 },
          { type: 'pointerMove', duration: 1000, x: centerX - 10, y: centerY },
          { type: 'pointerUp', button: 0 }
        ]
      },
      {
        type: 'pointer',
        id: 'finger2',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x: centerX + 100, y: centerY },
          { type: 'pointerDown', button: 0 },
          { type: 'pointerMove', duration: 1000, x: centerX + 10, y: centerY },
          { type: 'pointerUp', button: 0 }
        ]
      }
    ]);
  }

  /**
   * Performs a pinch open gesture (zoom in) on the screen
   */
  static async zoom(driver) {
    const size = await driver.getWindowSize();
    const centerX = Math.round(size.width / 2);
    const centerY = Math.round(size.height / 2);

    logger.info('Performing zoom (zoom in) gesture...');
    await driver.performActions([
      {
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x: centerX - 10, y: centerY },
          { type: 'pointerDown', button: 0 },
          { type: 'pointerMove', duration: 1000, x: centerX - 250, y: centerY },
          { type: 'pointerUp', button: 0 }
        ]
      },
      {
        type: 'pointer',
        id: 'finger2',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x: centerX + 10, y: centerY },
          { type: 'pointerDown', button: 0 },
          { type: 'pointerMove', duration: 1000, x: centerX + 250, y: centerY },
          { type: 'pointerUp', button: 0 }
        ]
      }
    ]);
  }
}

module.exports = Gestures;
