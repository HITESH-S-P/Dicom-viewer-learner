const e=`/* ! cornerstone - v0.9.0 - 2016-02-03 | (c) 2014 Chris Hafey | https://github.com/chafey/cornerstone */
if (typeof cornerstone === 'undefined') {
	globalThis.cornerstone = {
		internal: {},
		rendering: {}
	};
}

(function(cornerstone) {

	'use strict';

	function disable(element) {
		if (element === undefined) {
			throw 'disable: element element must not be undefined';
		}

		// Search for this element in this list of enabled elements
		const enabledElements = cornerstone.getEnabledElements();
		for (let i = 0; i < enabledElements.length; i++) {
			if (enabledElements[i].element === element) {
				// We found it!

				// Fire an event so dependencies can cleanup
				const eventData = {
					element
				};
				$(element).trigger('CornerstoneElementDisabled', eventData);

				// remove the child dom elements that we created (e.g.canvas)
				enabledElements[i].element.removeChild(enabledElements[i].canvas);

				// remove this element from the list of enabled elements
				enabledElements.splice(i, 1);
				return;
			}
		}
	}

	// module/private exports
	cornerstone.disable = disable;

}(cornerstone));
/**
 * This module is responsible for enabling an element to display images with cornerstone
 */
(function($, cornerstone) {

	'use strict';

	/**
     * sets a new image object for a given element
     * @param element
     * @param image
     */
	function displayImage(element, image, viewport) {
		if (element === undefined) {
			throw 'displayImage: parameter element cannot be undefined';
		}
		if (image === undefined) {
			throw 'displayImage: parameter image cannot be undefined';
		}

		const enabledElement = cornerstone.getEnabledElement(element);

		enabledElement.image = image;

		if (enabledElement.viewport === undefined) {
			enabledElement.viewport = cornerstone.internal.getDefaultViewport(enabledElement.canvas, image);
		}

		// merge viewport
		if (viewport) {
			for (const attrname in viewport) {
				if (viewport[attrname] !== null) {
					enabledElement.viewport[attrname] = viewport[attrname];
				}
			}
		}

		const now = new Date();
		let frameRate;
		if (enabledElement.lastImageTimeStamp !== undefined) {
			const timeSinceLastImage = now.getTime() - enabledElement.lastImageTimeStamp;
			frameRate = (1000 / timeSinceLastImage).toFixed();
		}
		else {
		}
		enabledElement.lastImageTimeStamp = now.getTime();

		const newImageEventData = {
			viewport: enabledElement.viewport,
			element: enabledElement.element,
			image: enabledElement.image,
			enabledElement,
			frameRate
		};

		$(enabledElement.element).trigger('CornerstoneNewImage', newImageEventData);

		cornerstone.updateImage(element);
	}

	// module/private exports
	cornerstone.displayImage = displayImage;
}($, cornerstone));
/**
 * This module is responsible for immediately drawing an enabled element
 */

(function($, cornerstone) {

	'use strict';

	/**
     * Immediately draws the enabled element
     *
     * @param element
     */
	function draw(element) {
		const enabledElement = cornerstone.getEnabledElement(element);

		if (enabledElement.image === undefined) {
			throw 'draw: image has not been loaded yet';
		}

		cornerstone.drawImage(enabledElement);
	}

	// Module exports
	cornerstone.draw = draw;

}($, cornerstone));
/**
 * This module is responsible for drawing invalidated enabled elements
 */

(function($, cornerstone) {

	'use strict';

	/**
     * Draws all invalidated enabled elements and clears the invalid flag after drawing it
     */
	function drawInvalidated() {
		const enabledElements = cornerstone.getEnabledElements();
		for (let i = 0; i < enabledElements.length; i++) {
			const ee = enabledElements[i];
			if (ee.invalid === true) {
				cornerstone.drawImage(ee);
			}
		}
	}

	// Module exports
	cornerstone.drawInvalidated = drawInvalidated;
}($, cornerstone));
/**
 * This module is responsible for enabling an element to display images with cornerstone
 */
(function(cornerstone) {

	'use strict';

	function enable(element) {
		if (element === undefined) {
			throw 'enable: parameter element cannot be undefined';
		}

		const canvas = document.createElement('canvas');
		element.appendChild(canvas);

		const el = {
			element,
			canvas,
			image: undefined, // will be set once image is loaded
			invalid: false, // true if image needs to be drawn, false if not
			data: {}
		};
		cornerstone.addEnabledElement(el);

		cornerstone.resize(element, true);

		return element;
	}

	// module/private exports
	cornerstone.enable = enable;
}(cornerstone));
(function(cornerstone) {

	'use strict';

	function getElementData(el, dataType) {
		const ee = cornerstone.getEnabledElement(el);
		if (ee.data.hasOwnProperty(dataType) === false) {
			ee.data[dataType] = {};
		}
		return ee.data[dataType];
	}

	function removeElementData(el, dataType) {
		const ee = cornerstone.getEnabledElement(el);
		delete ee.data[dataType];
	}

	// module/private exports
	cornerstone.getElementData = getElementData;
	cornerstone.removeElementData = removeElementData;

}(cornerstone));
(function(cornerstone) {

	'use strict';

	const enabledElements = [];

	function getEnabledElement(element) {
		if (element === undefined) {
			throw 'getEnabledElement: parameter element must not be undefined';
		}
		for (let i = 0; i < enabledElements.length; i++) {
			if (enabledElements[i].element == element) {
				return enabledElements[i];
			}
		}

		throw 'element not enabled';
	}

	function addEnabledElement(enabledElement) {
		if (enabledElement === undefined) {
			throw 'getEnabledElement: enabledElement element must not be undefined';
		}

		enabledElements.push(enabledElement);
	}

	function getEnabledElementsByImageId(imageId) {
		const ees = [];
		enabledElements.forEach(enabledElement => {
			if (enabledElement.image && enabledElement.image.imageId === imageId) {
				ees.push(enabledElement);
			}
		});
		return ees;
	}

	function getEnabledElements() {
		return enabledElements;
	}

	// module/private exports
	cornerstone.getEnabledElement = getEnabledElement;
	cornerstone.addEnabledElement = addEnabledElement;
	cornerstone.getEnabledElementsByImageId = getEnabledElementsByImageId;
	cornerstone.getEnabledElements = getEnabledElements;
}(cornerstone));
/**
 * This module will fit an image to fit inside the canvas displaying it such that all pixels
 * in the image are viewable
 */
(function(cornerstone) {

	'use strict';

	function getImageSize(enabledElement) {
		if (enabledElement.viewport.rotation === 0 || enabledElement.viewport.rotation === 180) {
			return {
				width: enabledElement.image.width,
				height: enabledElement.image.height
			};
		}
		else {
			return {
				width: enabledElement.image.height,
				height: enabledElement.image.width
			};
		}
	}

	/**
     * Adjusts an images scale and center so the image is centered and completely visible
     * @param element
     */
	function fitToWindow(element) {
		const enabledElement = cornerstone.getEnabledElement(element);
		const imageSize = getImageSize(enabledElement);

		const verticalScale = enabledElement.canvas.height / imageSize.height;
		const horizontalScale = enabledElement.canvas.width / imageSize.width;
		if (horizontalScale < verticalScale) {
			enabledElement.viewport.scale = horizontalScale;
		}
		else {
			enabledElement.viewport.scale = verticalScale;
		}
		enabledElement.viewport.translation.x = 0;
		enabledElement.viewport.translation.y = 0;
		cornerstone.updateImage(element);
	}

	cornerstone.fitToWindow = fitToWindow;
}(cornerstone));

/**
 * This file is responsible for returning the default viewport for an image
 */

(function($, cornerstone) {

	'use strict';

	/**
     * returns a default viewport for display the specified image on the specified
     * enabled element.  The default viewport is fit to window
     *
     * @param element
     * @param image
     */
	function getDefaultViewportForImage(element, image) {
		const enabledElement = cornerstone.getEnabledElement(element);
		const viewport = cornerstone.internal.getDefaultViewport(enabledElement.canvas, image);
		return viewport;
	}

	// Module exports
	cornerstone.getDefaultViewportForImage = getDefaultViewportForImage;
}($, cornerstone));
/**
 * This module is responsible for returning the currently displayed image for an element
 */

(function($, cornerstone) {

	'use strict';

	/**
     * returns the currently displayed image for an element or undefined if no image has
     * been displayed yet
     *
     * @param element
     */
	function getImage(element) {
		const enabledElement = cornerstone.getEnabledElement(element);
		return enabledElement.image;
	}

	// Module exports
	cornerstone.getImage = getImage;
}($, cornerstone));
/**
 * This module returns a subset of the stored pixels of an image
 */
(function(cornerstone) {

	'use strict';

	/**
     * Returns array of pixels with modality LUT transformation applied
     */
	function getPixels(element, x, y, width, height) {

		const storedPixels = cornerstone.getStoredPixels(element, x, y, width, height);
		const ee = cornerstone.getEnabledElement(element);

		const mlutfn = cornerstone.internal.getModalityLUT(ee.image.slope, ee.image.intercept, ee.viewport.modalityLUT);

		const modalityPixels = storedPixels.map(mlutfn);

		return modalityPixels;
	}

	// module exports
	cornerstone.getPixels = getPixels;
}(cornerstone));
/**
 * This module returns a subset of the stored pixels of an image
 */
(function(cornerstone) {

	'use strict';

	/**
     * Returns an array of stored pixels given a rectangle in the image
     * @param element
     * @param x
     * @param y
     * @param width
     * @param height
     * @returns {Array}
     */
	function getStoredPixels(element, x, y, width, height) {
		if (element === undefined) {
			throw 'getStoredPixels: parameter element must not be undefined';
		}

		x = Math.round(x);
		y = Math.round(y);
		const ee = cornerstone.getEnabledElement(element);
		const storedPixels = [];
		let index = 0;
		const pixelData = ee.image.getPixelData();
		for (let row = 0; row < height; row++) {
			for (let column = 0; column < width; column++) {
				const spIndex = ((row + y) * ee.image.columns) + (column + x);
				storedPixels[index++] = pixelData[spIndex];
			}
		}
		return storedPixels;
	}

	// module exports
	cornerstone.getStoredPixels = getStoredPixels;
}(cornerstone));
/**
 * This module contains functions to deal with getting and setting the viewport for an enabled element
 */
(function(cornerstone) {

	'use strict';

	/**
     * Returns the viewport for the specified enabled element
     * @param element
     * @returns {*}
     */
	function getViewport(element) {
		const enabledElement = cornerstone.getEnabledElement(element);

		const viewport = enabledElement.viewport;
		if (viewport === undefined) {
			return undefined;
		}
		return {
			scale: viewport.scale,
			translation: {
				x: viewport.translation.x,
				y: viewport.translation.y
			},
			voi: {
				windowWidth: viewport.voi.windowWidth,
				windowCenter: viewport.voi.windowCenter
			},
			invert: viewport.invert,
			pixelReplication: viewport.pixelReplication,
			rotation: viewport.rotation,
			hflip: viewport.hflip,
			vflip: viewport.vflip,
			modalityLUT: viewport.modalityLUT,
			voiLUT: viewport.voiLUT
		};
	}

	// module/private exports
	cornerstone.getViewport = getViewport;

}(cornerstone));

/**
 * This module deals with caching images
 */

(function(cornerstone) {

	'use strict';

	// dictionary of imageId to cachedImage objects
	const imageCache = {};
	// dictionary of sharedCacheKeys to number of imageId's in cache with this shared cache key
	const sharedCacheKeys = {};
	// array of cachedImage objects
	const cachedImages = [];

	let maximumSizeInBytes = 1024 * 1024 * 1024; // 1 GB
	let cacheSizeInBytes = 0;

	function setMaximumSizeBytes(numBytes) {
		if (numBytes === undefined) {
			throw 'setMaximumSizeBytes: parameter numBytes must not be undefined';
		}
		if (numBytes.toFixed === undefined) {
			throw 'setMaximumSizeBytes: parameter numBytes must be a number';
		}

		maximumSizeInBytes = numBytes;
		purgeCacheIfNecessary();
	}

	function purgeCacheIfNecessary() {
		// if max cache size has not been exceeded, do nothing
		if (cacheSizeInBytes <= maximumSizeInBytes) {
			return;
		}

		// cache size has been exceeded, create list of images sorted by timeStamp
		// so we can purge the least recently used image
		function compare(a, b) {
			if (a.timeStamp > b.timeStamp) {
				return -1;
			}
			if (a.timeStamp < b.timeStamp) {
				return 1;
			}
			return 0;
		}

		cachedImages.sort(compare);

		// remove images as necessary
		while (cacheSizeInBytes > maximumSizeInBytes) {
			const lastCachedImage = cachedImages[cachedImages.length - 1];
			cacheSizeInBytes -= lastCachedImage.sizeInBytes;
			delete imageCache[lastCachedImage.imageId];
			lastCachedImage.imagePromise.reject();
			cachedImages.pop();
			$(cornerstone).trigger('CornerstoneImageCachePromiseRemoved', { imageId: lastCachedImage.imageId });
		}

		const cacheInfo = cornerstone.imageCache.getCacheInfo();
		$(cornerstone).trigger('CornerstoneImageCacheFull', cacheInfo);
	}

	function putImagePromise(imageId, imagePromise) {
		if (imageId === undefined) {
			throw 'getImagePromise: imageId must not be undefined';
		}
		if (imagePromise === undefined) {
			throw 'getImagePromise: imagePromise must not be undefined';
		}

		if (imageCache.hasOwnProperty(imageId) === true) {
			throw 'putImagePromise: imageId already in cache';
		}

		const cachedImage = {
			loaded: false,
			imageId,
			sharedCacheKey: undefined, // the sharedCacheKey for this imageId.  undefined by default
			imagePromise,
			timeStamp: new Date(),
			sizeInBytes: 0
		};

		imageCache[imageId] = cachedImage;
		cachedImages.push(cachedImage);

		imagePromise.then(image => {
			cachedImage.loaded = true;

			if (image.sizeInBytes === undefined) {
				throw 'putImagePromise: image does not have sizeInBytes property or';
			}
			if (image.sizeInBytes.toFixed === undefined) {
				throw 'putImagePromise: image.sizeInBytes is not a number';
			}

			// If this image has a shared cache key, reference count it and only
			// count the image size for the first one added with this sharedCacheKey
			if (image.sharedCacheKey) {
				cachedImage.sizeInBytes = image.sizeInBytes;
				cachedImage.sharedCacheKey = image.sharedCacheKey;
				if (sharedCacheKeys[image.sharedCacheKey]) {
					sharedCacheKeys[image.sharedCacheKey]++;
				}
				else {
					sharedCacheKeys[image.sharedCacheKey] = 1;
					cacheSizeInBytes += cachedImage.sizeInBytes;
				}
			}
			else {
				cachedImage.sizeInBytes = image.sizeInBytes;
				cacheSizeInBytes += cachedImage.sizeInBytes;
			}
			purgeCacheIfNecessary();
		});
	}

	function getImagePromise(imageId) {
		if (imageId === undefined) {
			throw 'getImagePromise: imageId must not be undefined';
		}
		const cachedImage = imageCache[imageId];
		if (cachedImage === undefined) {
			return undefined;
		}

		// bump time stamp for cached image
		cachedImage.timeStamp = new Date();
		return cachedImage.imagePromise;
	}

	function removeImagePromise(imageId) {
		if (imageId === undefined) {
			throw 'removeImagePromise: imageId must not be undefined';
		}
		const cachedImage = imageCache[imageId];
		if (cachedImage === undefined) {
			throw 'removeImagePromise: imageId must not be undefined';
		}
		cachedImages.splice(cachedImages.indexOf(cachedImage), 1);

		// If this is using a sharedCacheKey, decrement the cache size only
		// if it is the last imageId in the cache with this sharedCacheKey
		if (cachedImages.sharedCacheKey) {
			if (sharedCacheKeys[cachedImages.sharedCacheKey] === 1) {
				cacheSizeInBytes -= cachedImage.sizeInBytes;
				delete sharedCacheKeys[cachedImages.sharedCacheKey];
			}
			else {
				sharedCacheKeys[cachedImages.sharedCacheKey]--;
			}
		}
		else {
			cacheSizeInBytes -= cachedImage.sizeInBytes;
		}
		delete imageCache[imageId];

		decache(cachedImage.imagePromise, cachedImage.imageId);

		return cachedImage.imagePromise;
	}

	function getCacheInfo() {
		return {
			maximumSizeInBytes,
			cacheSizeInBytes,
			numberOfImagesCached: cachedImages.length
		};
	}

	function decache(imagePromise, imageId) {
		imagePromise.then(image => {
			if (image.decache) {
				image.decache();
			}
			imagePromise.reject();
			delete imageCache[imageId];
		}).always(() => {
			delete imageCache[imageId];
		});
	}

	function purgeCache() {
		while (cachedImages.length > 0) {
			const removedCachedImage = cachedImages.pop();
			decache(removedCachedImage.imagePromise, removedCachedImage.imageId);
		}
		cacheSizeInBytes = 0;
	}

	function changeImageIdCacheSize(imageId, newCacheSize) {
		const cacheEntry = imageCache[imageId];
		if (cacheEntry) {
			cacheEntry.imagePromise.then(image => {
				const cacheSizeDifference = newCacheSize - image.sizeInBytes;
				image.sizeInBytes = newCacheSize;
				cacheSizeInBytes += cacheSizeDifference;
			});
		}
	}

	// module exports
	cornerstone.imageCache = {
		putImagePromise,
		getImagePromise,
		removeImagePromise,
		setMaximumSizeBytes,
		getCacheInfo,
		purgeCache,
		cachedImages,
		changeImageIdCacheSize
	};

}(cornerstone));

/**
 * This module deals with ImageLoaders, loading images and caching images
 */

(function($, cornerstone) {

	'use strict';

	const imageLoaders = {};

	let unknownImageLoader;

	function loadImageFromImageLoader(imageId) {
		const colonIndex = imageId.indexOf(':');
		const scheme = imageId.substring(0, colonIndex);
		const loader = imageLoaders[scheme];
		let imagePromise;
		if (loader === undefined || loader === null) {
			if (unknownImageLoader !== undefined) {
				imagePromise = unknownImageLoader(imageId);
				return imagePromise;
			}
			else {
				return undefined;
			}
		}
		imagePromise = loader(imageId);

		// broadcast an image loaded event once the image is loaded
		// This is based on the idea here: http://stackoverflow.com/questions/3279809/global-custom-events-in-jquery
		imagePromise.then(image => {
			$(cornerstone).trigger('CornerstoneImageLoaded', { image });
		});

		return imagePromise;
	}

	// Loads an image given an imageId and returns a promise which will resolve
	// to the loaded image object or fail if an error occurred.  The loaded image
	// is not stored in the cache
	function loadImage(imageId) {
		if (imageId === undefined) {
			throw 'loadImage: parameter imageId must not be undefined';
		}

		let imagePromise = cornerstone.imageCache.getImagePromise(imageId);
		if (imagePromise !== undefined) {
			return imagePromise;
		}

		imagePromise = loadImageFromImageLoader(imageId);
		if (imagePromise === undefined) {
			throw 'loadImage: no image loader for imageId';
		}

		return imagePromise;
	}

	// Loads an image given an imageId and returns a promise which will resolve
	// to the loaded image object or fail if an error occurred.  The image is
	// stored in the cache
	function loadAndCacheImage(imageId) {
		if (imageId === undefined) {
			throw 'loadAndCacheImage: parameter imageId must not be undefined';
		}

		let imagePromise = cornerstone.imageCache.getImagePromise(imageId);
		if (imagePromise !== undefined) {
			return imagePromise;
		}

		imagePromise = loadImageFromImageLoader(imageId);
		if (imagePromise === undefined) {
			throw 'loadAndCacheImage: no image loader for imageId';
		}

		cornerstone.imageCache.putImagePromise(imageId, imagePromise);

		return imagePromise;
	}


	// registers an imageLoader plugin with cornerstone for the specified scheme
	function registerImageLoader(scheme, imageLoader) {
		imageLoaders[scheme] = imageLoader;
	}

	// Registers a new unknownImageLoader and returns the previous one (if it exists)
	function registerUnknownImageLoader(imageLoader) {
		const oldImageLoader = unknownImageLoader;
		unknownImageLoader = imageLoader;
		return oldImageLoader;
	}

	// module exports

	cornerstone.loadImage = loadImage;
	cornerstone.loadAndCacheImage = loadAndCacheImage;
	cornerstone.registerImageLoader = registerImageLoader;
	cornerstone.registerUnknownImageLoader = registerUnknownImageLoader;

}($, cornerstone));

(function(cornerstone) {

	'use strict';

	function calculateTransform(enabledElement, scale) {

		const transform = new cornerstone.internal.Transform();
		transform.translate(enabledElement.canvas.width / 2, enabledElement.canvas.height / 2);

		// Apply the rotation before scaling for non square pixels
		const angle = enabledElement.viewport.rotation;
		if (angle !== 0) {
			transform.rotate(angle * Math.PI / 180);
		}

		// apply the scale
		let widthScale = enabledElement.viewport.scale;
		let heightScale = enabledElement.viewport.scale;
		if (enabledElement.image.rowPixelSpacing < enabledElement.image.columnPixelSpacing) {
			widthScale = widthScale * (enabledElement.image.columnPixelSpacing / enabledElement.image.rowPixelSpacing);
		}
		else if (enabledElement.image.columnPixelSpacing < enabledElement.image.rowPixelSpacing) {
			heightScale = heightScale * (enabledElement.image.rowPixelSpacing / enabledElement.image.columnPixelSpacing);
		}
		transform.scale(widthScale, heightScale);

		// unrotate to so we can translate unrotated
		if (angle !== 0) {
			transform.rotate(-angle * Math.PI / 180);
		}

		// apply the pan offset
		transform.translate(enabledElement.viewport.translation.x, enabledElement.viewport.translation.y);

		// rotate again so we can apply general scale
		if (angle !== 0) {
			transform.rotate(angle * Math.PI / 180);
		}

		if (scale !== undefined) {
			// apply the font scale
			transform.scale(scale, scale);
		}

		// Apply Flip if required
		if (enabledElement.viewport.hflip) {
			transform.scale(-1, 1);
		}

		if (enabledElement.viewport.vflip) {
			transform.scale(1, -1);
		}

		// translate the origin back to the corner of the image so the event handlers can draw in image coordinate system
		transform.translate(-enabledElement.image.width / 2, -enabledElement.image.height / 2);
		return transform;
	}

	// Module exports
	cornerstone.internal.calculateTransform = calculateTransform;
}(cornerstone));
/**
 * This module is responsible for drawing an image to an enabled elements canvas element
 */

(function($, cornerstone) {

	'use strict';

	/**
     * Internal API function to draw an image to a given enabled element
     * @param enabledElement
     * @param invalidated - true if pixel data has been invalidated and cached rendering should not be used
     */
	function drawImage(enabledElement, invalidated) {

		const start = new Date();

		enabledElement.image.render(enabledElement, invalidated);

		const context = enabledElement.canvas.getContext('2d');

		const end = new Date();
		const diff = end - start;
		// console.log(diff + ' ms');

		const eventData = {
			viewport: enabledElement.viewport,
			element: enabledElement.element,
			image: enabledElement.image,
			enabledElement,
			canvasContext: context,
			renderTimeInMs: diff
		};

		$(enabledElement.element).trigger('CornerstoneImageRendered', eventData);
		enabledElement.invalid = false;
	}

	// Module exports
	cornerstone.internal.drawImage = drawImage;
	cornerstone.drawImage = drawImage;

}($, cornerstone));
/**
 * This module generates a lut for an image
 */

(function(cornerstone) {

	'use strict';

	function generateLutNew(image, windowWidth, windowCenter, invert, modalityLUT, voiLUT) {
		if (image.lut === undefined) {
			image.lut = new Int16Array(image.maxPixelValue - Math.min(image.minPixelValue, 0) + 1);
		}
		const lut = image.lut;
		const maxPixelValue = image.maxPixelValue;
		const minPixelValue = image.minPixelValue;

		const mlutfn = cornerstone.internal.getModalityLUT(image.slope, image.intercept, modalityLUT);
		const vlutfn = cornerstone.internal.getVOILUT(windowWidth, windowCenter, voiLUT);

		let offset = 0;
		if (minPixelValue < 0) {
			offset = minPixelValue;
		}
		let storedValue;
		let modalityLutValue;
		let voiLutValue;
		let clampedValue;

		for (storedValue = image.minPixelValue; storedValue <= maxPixelValue; storedValue++) {
			modalityLutValue = mlutfn(storedValue);
			voiLutValue = vlutfn(modalityLutValue);
			clampedValue = Math.min(Math.max(voiLutValue, 0), 255);
			if (!invert) {
				lut[storedValue + -offset] = Math.round(clampedValue);
			}
			else {
				lut[storedValue + -offset] = Math.round(255 - clampedValue);
			}
		}
		return lut;
	}


	/**
     * Creates a LUT used while rendering to convert stored pixel values to
     * display pixels
     *
     * @param image
     * @returns {Array}
     */
	function generateLut(image, windowWidth, windowCenter, invert, modalityLUT, voiLUT) {
		if (modalityLUT || voiLUT) {
			return generateLutNew(image, windowWidth, windowCenter, invert, modalityLUT, voiLUT);
		}

		if (image.lut === undefined) {
			image.lut = new Int16Array(image.maxPixelValue - Math.min(image.minPixelValue, 0) + 1);
		}
		const lut = image.lut;

		const maxPixelValue = image.maxPixelValue;
		const minPixelValue = image.minPixelValue;
		const slope = image.slope;
		const intercept = image.intercept;
		const localWindowWidth = windowWidth;
		const localWindowCenter = windowCenter;
		let modalityLutValue;
		let voiLutValue;
		let clampedValue;
		let storedValue;

		// NOTE: As of Nov 2014, most javascript engines have lower performance when indexing negative indexes.
		// We improve performance by offsetting the pixel values for signed data to avoid negative indexes
		// when generating the lut and then undo it in storedPixelDataToCanvasImagedata.  Thanks to @jpambrun
		// for this contribution!

		let offset = 0;
		if (minPixelValue < 0) {
			offset = minPixelValue;
		}

		if (invert === true) {
			for (storedValue = image.minPixelValue; storedValue <= maxPixelValue; storedValue++) {
				modalityLutValue = storedValue * slope + intercept;
				voiLutValue = ((modalityLutValue - localWindowCenter) / localWindowWidth + 0.5) * 255.0;
				clampedValue = Math.min(Math.max(voiLutValue, 0), 255);
				lut[storedValue + -offset] = Math.round(255 - clampedValue);
			}
		}
		else {
			for (storedValue = image.minPixelValue; storedValue <= maxPixelValue; storedValue++) {
				modalityLutValue = storedValue * slope + intercept;
				voiLutValue = ((modalityLutValue - localWindowCenter) / localWindowWidth + 0.5) * 255.0;
				clampedValue = Math.min(Math.max(voiLutValue, 0), 255);
				lut[storedValue + -offset] = Math.round(clampedValue);
			}
		}
	}


	// Module exports
	cornerstone.internal.generateLutNew = generateLutNew;
	cornerstone.internal.generateLut = generateLut;
	cornerstone.generateLutNew = generateLutNew;
	cornerstone.generateLut = generateLut;
}(cornerstone));

/**
 * This module contains a function to get a default viewport for an image given
 * a canvas element to display it in
 *
 */
(function(cornerstone) {

	'use strict';

	/**
     * Creates a new viewport object containing default values for the image and canvas
     * @param canvas
     * @param image
     * @returns viewport object
     */
	function getDefaultViewport(canvas, image) {
		if (canvas === undefined) {
			throw 'getDefaultViewport: parameter canvas must not be undefined';
		}
		if (image === undefined) {
			throw 'getDefaultViewport: parameter image must not be undefined';
		}
		const viewport = {
			scale: 1.0,
			translation: {
				x: 0,
				y: 0
			},
			voi: {
				windowWidth: image.windowWidth,
				windowCenter: image.windowCenter
			},
			invert: image.invert,
			pixelReplication: false,
			rotation: 0,
			hflip: false,
			vflip: false,
			modalityLUT: image.modalityLUT,
			voiLUT: image.voiLUT
		};

		// fit image to window
		const verticalScale = canvas.height / image.rows;
		const horizontalScale = canvas.width / image.columns;
		if (horizontalScale < verticalScale) {
			viewport.scale = horizontalScale;
		}
		else {
			viewport.scale = verticalScale;
		}
		return viewport;
	}

	// module/private exports
	cornerstone.internal.getDefaultViewport = getDefaultViewport;
	cornerstone.getDefaultViewport = getDefaultViewport;
}(cornerstone));

(function(cornerstone) {

	'use strict';

	function getTransform(enabledElement) {
		// For now we will calculate it every time it is requested.  In the future, we may want to cache
		// it in the enabled element to speed things up
		const transform = cornerstone.internal.calculateTransform(enabledElement);
		return transform;
	}

	// Module exports
	cornerstone.internal.getTransform = getTransform;

}(cornerstone));
/**
 * This module is responsible for drawing an image to an enabled elements canvas element
 */

(function($, cornerstone) {

	'use strict';

	cornerstone.drawImage = cornerstone.internal.drawImage;
	cornerstone.generateLut = cornerstone.internal.generateLut;
	cornerstone.storedPixelDataToCanvasImageData = cornerstone.internal.storedPixelDataToCanvasImageData;
	cornerstone.storedColorPixelDataToCanvasImageData = cornerstone.internal.storedColorPixelDataToCanvasImageData;

}($, cornerstone));
/**
 * This module generates a Modality LUT
 */

(function(cornerstone) {

	'use strict';


	function generateLinearModalityLUT(slope, intercept) {
		const localSlope = slope;
		const localIntercept = intercept;
		return function(sp) {
			return sp * localSlope + localIntercept;
		};
	}

	function generateNonLinearModalityLUT(modalityLUT) {
		const minValue = modalityLUT.lut[0];
		const maxValue = modalityLUT.lut[modalityLUT.lut.length - 1];
		const maxValueMapped = modalityLUT.firstValueMapped + modalityLUT.lut.length;
		return function(sp) {
			if (sp < modalityLUT.firstValueMapped) {
				return minValue;
			}
			else if (sp >= maxValueMapped) {
				return maxValue;
			}
			else {
				return modalityLUT.lut[sp];
			}
		};
	}

	function getModalityLUT(slope, intercept, modalityLUT) {
		if (modalityLUT) {
			return generateNonLinearModalityLUT(modalityLUT);
		}
		else {
			return generateLinearModalityLUT(slope, intercept);
		}
	}

	// Module exports
	cornerstone.internal.getModalityLUT = getModalityLUT;

}(cornerstone));

/**
 * This module contains a function to convert stored pixel values to display pixel values using a LUT
 */
(function(cornerstone) {

	'use strict';

	function storedColorPixelDataToCanvasImageData(image, lut, canvasImageDataData) {
		const minPixelValue = image.minPixelValue;
		let canvasImageDataIndex = 0;
		let storedPixelDataIndex = 0;
		const numPixels = image.width * image.height * 4;
		const storedPixelData = image.getPixelData();
		const localLut = lut;
		const localCanvasImageDataData = canvasImageDataData;
		// NOTE: As of Nov 2014, most javascript engines have lower performance when indexing negative indexes.
		// We have a special code path for this case that improves performance.  Thanks to @jpambrun for this enhancement
		if (minPixelValue < 0) {
			while (storedPixelDataIndex < numPixels) {
				localCanvasImageDataData[canvasImageDataIndex++] = localLut[storedPixelData[storedPixelDataIndex++] + -minPixelValue]; // red
				localCanvasImageDataData[canvasImageDataIndex++] = localLut[storedPixelData[storedPixelDataIndex++] + -minPixelValue]; // green
				localCanvasImageDataData[canvasImageDataIndex] = localLut[storedPixelData[storedPixelDataIndex] + -minPixelValue]; // blue
				storedPixelDataIndex += 2;
				canvasImageDataIndex += 2;
			}
		}
		else {
			while (storedPixelDataIndex < numPixels) {
				localCanvasImageDataData[canvasImageDataIndex++] = localLut[storedPixelData[storedPixelDataIndex++]]; // red
				localCanvasImageDataData[canvasImageDataIndex++] = localLut[storedPixelData[storedPixelDataIndex++]]; // green
				localCanvasImageDataData[canvasImageDataIndex] = localLut[storedPixelData[storedPixelDataIndex]]; // blue
				storedPixelDataIndex += 2;
				canvasImageDataIndex += 2;
			}
		}
	}

	// Module exports
	cornerstone.internal.storedColorPixelDataToCanvasImageData = storedColorPixelDataToCanvasImageData;
	cornerstone.storedColorPixelDataToCanvasImageData = storedColorPixelDataToCanvasImageData;

}(cornerstone));

/**
 * This module contains a function to convert stored pixel values to display pixel values using a LUT
 */
(function(cornerstone) {

	'use strict';

	/**
     * This function transforms stored pixel values into a canvas image data buffer
     * by using a LUT.  This is the most performance sensitive code in cornerstone and
     * we use a special trick to make this go as fast as possible.  Specifically we
     * use the alpha channel only to control the luminance rather than the red, green and
     * blue channels which makes it over 3x faster.  The canvasImageDataData buffer needs
     * to be previously filled with white pixels.
     *
     * NOTE: Attribution would be appreciated if you use this technique!
     *
     * @param pixelData the pixel data
     * @param lut the lut
     * @param canvasImageDataData a canvasImgageData.data buffer filled with white pixels
     */
	function storedPixelDataToCanvasImageData(image, lut, canvasImageDataData) {
		const pixelData = image.getPixelData();
		const minPixelValue = image.minPixelValue;
		let canvasImageDataIndex = 3;
		let storedPixelDataIndex = 0;
		const localNumPixels = pixelData.length;
		const localPixelData = pixelData;
		const localLut = lut;
		const localCanvasImageDataData = canvasImageDataData;
		// NOTE: As of Nov 2014, most javascript engines have lower performance when indexing negative indexes.
		// We have a special code path for this case that improves performance.  Thanks to @jpambrun for this enhancement
		if (minPixelValue < 0) {
			while (storedPixelDataIndex < localNumPixels) {
				localCanvasImageDataData[canvasImageDataIndex] = localLut[localPixelData[storedPixelDataIndex++] + -minPixelValue]; // alpha
				canvasImageDataIndex += 4;
			}
		}
		else {
			while (storedPixelDataIndex < localNumPixels) {
				localCanvasImageDataData[canvasImageDataIndex] = localLut[localPixelData[storedPixelDataIndex++]]; // alpha
				canvasImageDataIndex += 4;
			}
		}

	}

	// Module exports
	cornerstone.internal.storedPixelDataToCanvasImageData = storedPixelDataToCanvasImageData;
	cornerstone.storedPixelDataToCanvasImageData = storedPixelDataToCanvasImageData;

}(cornerstone));

// Last updated November 2011
// By Simon Sarris
// www.simonsarris.com
// sarris@acm.org
//
// Free to use and distribute at will
// So long as you are nice to people, etc

// Simple class for keeping track of the current transformation matrix

// For instance:
//    var t = new Transform();
//    t.rotate(5);
//    var m = t.m;
//    ctx.setTransform(m[0], m[1], m[2], m[3], m[4], m[5]);

// Is equivalent to:
//    ctx.rotate(5);

// But now you can retrieve it :)

(function(cornerstone) {

	'use strict';


	// Remember that this does not account for any CSS transforms applied to the canvas
	function Transform() {
		this.reset();
	}

	Transform.prototype.reset = function() {
		this.m = [ 1, 0, 0, 1, 0, 0 ];
	};

	Transform.prototype.clone = function() {
		const transform = new Transform();
		transform.m[0] = this.m[0];
		transform.m[1] = this.m[1];
		transform.m[2] = this.m[2];
		transform.m[3] = this.m[3];
		transform.m[4] = this.m[4];
		transform.m[5] = this.m[5];
		return transform;
	};


	Transform.prototype.multiply = function(matrix) {
		const m11 = this.m[0] * matrix.m[0] + this.m[2] * matrix.m[1];
		const m12 = this.m[1] * matrix.m[0] + this.m[3] * matrix.m[1];

		const m21 = this.m[0] * matrix.m[2] + this.m[2] * matrix.m[3];
		const m22 = this.m[1] * matrix.m[2] + this.m[3] * matrix.m[3];

		const dx = this.m[0] * matrix.m[4] + this.m[2] * matrix.m[5] + this.m[4];
		const dy = this.m[1] * matrix.m[4] + this.m[3] * matrix.m[5] + this.m[5];

		this.m[0] = m11;
		this.m[1] = m12;
		this.m[2] = m21;
		this.m[3] = m22;
		this.m[4] = dx;
		this.m[5] = dy;
	};

	Transform.prototype.invert = function() {
		const d = 1 / (this.m[0] * this.m[3] - this.m[1] * this.m[2]);
		const m0 = this.m[3] * d;
		const m1 = -this.m[1] * d;
		const m2 = -this.m[2] * d;
		const m3 = this.m[0] * d;
		const m4 = d * (this.m[2] * this.m[5] - this.m[3] * this.m[4]);
		const m5 = d * (this.m[1] * this.m[4] - this.m[0] * this.m[5]);
		this.m[0] = m0;
		this.m[1] = m1;
		this.m[2] = m2;
		this.m[3] = m3;
		this.m[4] = m4;
		this.m[5] = m5;
	};

	Transform.prototype.rotate = function(rad) {
		const c = Math.cos(rad);
		const s = Math.sin(rad);
		const m11 = this.m[0] * c + this.m[2] * s;
		const m12 = this.m[1] * c + this.m[3] * s;
		const m21 = this.m[0] * -s + this.m[2] * c;
		const m22 = this.m[1] * -s + this.m[3] * c;
		this.m[0] = m11;
		this.m[1] = m12;
		this.m[2] = m21;
		this.m[3] = m22;
	};

	Transform.prototype.translate = function(x, y) {
		this.m[4] += this.m[0] * x + this.m[2] * y;
		this.m[5] += this.m[1] * x + this.m[3] * y;
	};

	Transform.prototype.scale = function(sx, sy) {
		this.m[0] *= sx;
		this.m[1] *= sx;
		this.m[2] *= sy;
		this.m[3] *= sy;
	};

	Transform.prototype.transformPoint = function(px, py) {
		const x = px;
		const y = py;
		px = x * this.m[0] + y * this.m[2] + this.m[4];
		py = x * this.m[1] + y * this.m[3] + this.m[5];
		return {
			x: px,
			y: py
		};
	};

	cornerstone.internal.Transform = Transform;
}(cornerstone));
/**
 * This module generates a VOI LUT
 */

(function(cornerstone) {

	'use strict';

	function generateLinearVOILUT(windowWidth, windowCenter) {
		return function(modalityLutValue) {
			return ((modalityLutValue - windowCenter) / windowWidth + 0.5) * 255.0;
		};
	}

	function generateNonLinearVOILUT(voiLUT) {
		const shift = voiLUT.numBitsPerEntry - 8;
		const minValue = voiLUT.lut[0] >> shift;
		const maxValue = voiLUT.lut[voiLUT.lut.length - 1] >> shift;
		const maxValueMapped = voiLUT.firstValueMapped + voiLUT.lut.length - 1;
		return function(modalityLutValue) {
			if (modalityLutValue < voiLUT.firstValueMapped) {
				return minValue;
			}
			else if (modalityLutValue >= maxValueMapped) {
				return maxValue;
			}
			else {
				return voiLUT.lut[modalityLutValue - voiLUT.firstValueMapped] >> shift;
			}
		};
	}

	function getVOILUT(windowWidth, windowCenter, voiLUT) {
		if (voiLUT) {
			return generateNonLinearVOILUT(voiLUT);
		}
		else {
			return generateLinearVOILUT(windowWidth, windowCenter);
		}
	}

	// Module exports
	cornerstone.internal.getVOILUT = getVOILUT;
}(cornerstone));

/**
 * This module contains a function to make an image is invalid
 */
(function(cornerstone) {

	'use strict';

	/**
     * Sets the invalid flag on the enabled element and fire an event
     * @param element
     */
	function invalidate(element) {
		const enabledElement = cornerstone.getEnabledElement(element);
		enabledElement.invalid = true;
		const eventData = {
			element
		};
		$(enabledElement.element).trigger('CornerstoneInvalidated', eventData);
	}

	// module exports
	cornerstone.invalidate = invalidate;
}(cornerstone));
/**
 * This module contains a function to immediately invalidate an image
 */
(function(cornerstone) {

	'use strict';

	/**
     * Forces the image to be updated/redrawn for the specified enabled element
     * @param element
     */
	function invalidateImageId(imageId) {

		const enabledElements = cornerstone.getEnabledElementsByImageId(imageId);
		enabledElements.forEach(enabledElement => {
			cornerstone.drawImage(enabledElement, true);
		});
	}

	// module exports
	cornerstone.invalidateImageId = invalidateImageId;
}(cornerstone));
/**
 * This module contains a helper function to covert page coordinates to pixel coordinates
 */
(function(cornerstone) {

	'use strict';

	/**
     * Converts a point in the page coordinate system to the pixel coordinate
     * system
     * @param element
     * @param pageX
     * @param pageY
     * @returns {{x: number, y: number}}
     */
	function pageToPixel(element, pageX, pageY) {
		const enabledElement = cornerstone.getEnabledElement(element);

		if (enabledElement.image === undefined) {
			throw 'image has not been loaded yet';
		}

		const image = enabledElement.image;

		// convert the pageX and pageY to the canvas client coordinates
		const rect = element.getBoundingClientRect();
		const clientX = pageX - rect.left - window.pageXOffset;
		const clientY = pageY - rect.top - window.pageYOffset;

		const pt = {
			x: clientX,
			y: clientY
		};
		const transform = cornerstone.internal.getTransform(enabledElement);
		transform.invert();
		return transform.transformPoint(pt.x, pt.y);
	}

	// module/private exports
	cornerstone.pageToPixel = pageToPixel;

}(cornerstone));

(function(cornerstone) {

	'use strict';

	/**
     * Converts a point in the pixel coordinate system to the canvas coordinate system
     * system.  This can be used to render using canvas context without having the weird
     * side effects that come from scaling and non square pixels
     * @param element
     * @param pt
     * @returns {x: number, y: number}
     */
	function pixelToCanvas(element, pt) {
		const enabledElement = cornerstone.getEnabledElement(element);
		const transform = cornerstone.internal.getTransform(enabledElement);
		return transform.transformPoint(pt.x, pt.y);
	}

	// module/private exports
	cornerstone.pixelToCanvas = pixelToCanvas;

}(cornerstone));

/**
 * This module is responsible for drawing an image to an enabled elements canvas element
 */

(function(cornerstone) {

	'use strict';

	const colorRenderCanvas = document.createElement('canvas');
	let colorRenderCanvasContext;
	let colorRenderCanvasData;

	let lastRenderedImageId;
	const lastRenderedViewport = {};

	function initializeColorRenderCanvas(image) {
		// Resize the canvas
		colorRenderCanvas.width = image.width;
		colorRenderCanvas.height = image.height;

		// get the canvas data so we can write to it directly
		colorRenderCanvasContext = colorRenderCanvas.getContext('2d');
		colorRenderCanvasContext.fillStyle = 'white';
		colorRenderCanvasContext.fillRect(0, 0, colorRenderCanvas.width, colorRenderCanvas.height);
		colorRenderCanvasData = colorRenderCanvasContext.getImageData(0, 0, image.width, image.height);
	}


	function getLut(image, viewport) {
		// if we have a cached lut and it has the right values, return it immediately
		if (image.lut !== undefined &&
            image.lut.windowCenter === viewport.voi.windowCenter &&
            image.lut.windowWidth === viewport.voi.windowWidth &&
            image.lut.invert === viewport.invert) {
			return image.lut;
		}

		// lut is invalid or not present, regenerate it and cache it
		cornerstone.generateLut(image, viewport.voi.windowWidth, viewport.voi.windowCenter, viewport.invert);
		image.lut.windowWidth = viewport.voi.windowWidth;
		image.lut.windowCenter = viewport.voi.windowCenter;
		image.lut.invert = viewport.invert;
		return image.lut;
	}

	function doesImageNeedToBeRendered(enabledElement, image) {
		if (image.imageId !== lastRenderedImageId ||
            lastRenderedViewport.windowCenter !== enabledElement.viewport.voi.windowCenter ||
            lastRenderedViewport.windowWidth !== enabledElement.viewport.voi.windowWidth ||
            lastRenderedViewport.invert !== enabledElement.viewport.invert ||
            lastRenderedViewport.rotation !== enabledElement.viewport.rotation ||
            lastRenderedViewport.hflip !== enabledElement.viewport.hflip ||
            lastRenderedViewport.vflip !== enabledElement.viewport.vflip
		) {
			return true;
		}

		return false;
	}

	function getRenderCanvas(enabledElement, image, invalidated) {

		// The ww/wc is identity and not inverted - get a canvas with the image rendered into it for
		// fast drawing
		if (enabledElement.viewport.voi.windowWidth === 255 &&
            enabledElement.viewport.voi.windowCenter === 128 &&
            enabledElement.viewport.invert === false &&
            image.getCanvas &&
            image.getCanvas()
		) {
			return image.getCanvas();
		}

		// apply the lut to the stored pixel data onto the render canvas
		if (doesImageNeedToBeRendered(enabledElement, image) === false && invalidated !== true) {
			return colorRenderCanvas;
		}

		// If our render canvas does not match the size of this image reset it
		// NOTE: This might be inefficient if we are updating multiple images of different
		// sizes frequently.
		if (colorRenderCanvas.width !== image.width || colorRenderCanvas.height != image.height) {
			initializeColorRenderCanvas(image);
		}

		// get the lut to use
		const colorLut = getLut(image, enabledElement.viewport);

		// the color image voi/invert has been modified - apply the lut to the underlying
		// pixel data and put it into the renderCanvas
		cornerstone.storedColorPixelDataToCanvasImageData(image, colorLut, colorRenderCanvasData.data);
		colorRenderCanvasContext.putImageData(colorRenderCanvasData, 0, 0);
		return colorRenderCanvas;
	}

	/**
     * API function to render a color image to an enabled element
     * @param enabledElement
     * @param invalidated - true if pixel data has been invaldiated and cached rendering should not be used
     */
	function renderColorImage(enabledElement, invalidated) {

		if (enabledElement === undefined) {
			throw 'drawImage: enabledElement parameter must not be undefined';
		}
		const image = enabledElement.image;
		if (image === undefined) {
			throw 'drawImage: image must be loaded before it can be drawn';
		}

		// get the canvas context and reset the transform
		const context = enabledElement.canvas.getContext('2d');
		context.setTransform(1, 0, 0, 1, 0, 0);

		// clear the canvas
		context.fillStyle = 'black';
		context.fillRect(0, 0, enabledElement.canvas.width, enabledElement.canvas.height);

		// turn off image smooth/interpolation if pixelReplication is set in the viewport
		if (enabledElement.viewport.pixelReplication === true) {
			context.imageSmoothingEnabled = false;
			context.mozImageSmoothingEnabled = false; // firefox doesn't support imageSmoothingEnabled yet
		}
		else {
			context.imageSmoothingEnabled = true;
			context.mozImageSmoothingEnabled = true;
		}

		// save the canvas context state and apply the viewport properties
		context.save();
		cornerstone.setToPixelCoordinateSystem(enabledElement, context);

		const renderCanvas = getRenderCanvas(enabledElement, image, invalidated);

		context.drawImage(renderCanvas, 0, 0, image.width, image.height, 0, 0, image.width, image.height);

		context.restore();

		lastRenderedImageId = image.imageId;
		lastRenderedViewport.windowCenter = enabledElement.viewport.voi.windowCenter;
		lastRenderedViewport.windowWidth = enabledElement.viewport.voi.windowWidth;
		lastRenderedViewport.invert = enabledElement.viewport.invert;
		lastRenderedViewport.rotation = enabledElement.viewport.rotation;
		lastRenderedViewport.hflip = enabledElement.viewport.hflip;
		lastRenderedViewport.vflip = enabledElement.viewport.vflip;
	}

	// Module exports
	cornerstone.rendering.colorImage = renderColorImage;
	cornerstone.renderColorImage = renderColorImage;
}(cornerstone));

/**
 * This module is responsible for drawing a grayscale imageß
 */

(function(cornerstone) {

	'use strict';

	const grayscaleRenderCanvas = document.createElement('canvas');
	let grayscaleRenderCanvasContext;
	let grayscaleRenderCanvasData;

	let lastRenderedImageId;
	const lastRenderedViewport = {};

	function initializeGrayscaleRenderCanvas(image) {
		// Resize the canvas
		grayscaleRenderCanvas.width = image.width;
		grayscaleRenderCanvas.height = image.height;

		// NOTE - we need to fill the render canvas with white pixels since we control the luminance
		// using the alpha channel to improve rendering performance.
		grayscaleRenderCanvasContext = grayscaleRenderCanvas.getContext('2d');
		grayscaleRenderCanvasContext.fillStyle = 'white';
		grayscaleRenderCanvasContext.fillRect(0, 0, grayscaleRenderCanvas.width, grayscaleRenderCanvas.height);
		grayscaleRenderCanvasData = grayscaleRenderCanvasContext.getImageData(0, 0, image.width, image.height);
	}

	function lutMatches(a, b) {
		// if undefined, they are equal
		if (!a && !b) {
			return true;
		}
		// if one is undefined, not equal
		if (!a || !b) {
			return false;
		}
		// check the unique ids
		return a.id !== b.id;
	}

	function getLut(image, viewport, invalidated) {
		// if we have a cached lut and it has the right values, return it immediately
		if (image.lut !== undefined &&
            image.lut.windowCenter === viewport.voi.windowCenter &&
            image.lut.windowWidth === viewport.voi.windowWidth &&
            lutMatches(image.lut.modalityLUT, viewport.modalityLUT) &&
            lutMatches(image.lut.voiLUT, viewport.voiLUT) &&
            image.lut.invert === viewport.invert &&
            invalidated !== true) {
			return image.lut;
		}

		// lut is invalid or not present, regenerate it and cache it
		cornerstone.generateLut(image, viewport.voi.windowWidth, viewport.voi.windowCenter, viewport.invert, viewport.modalityLUT, viewport.voiLUT);
		image.lut.windowWidth = viewport.voi.windowWidth;
		image.lut.windowCenter = viewport.voi.windowCenter;
		image.lut.invert = viewport.invert;
		image.lut.voiLUT = viewport.voiLUT;
		image.lut.modalityLUT = viewport.modalityLUT;
		return image.lut;
	}

	function doesImageNeedToBeRendered(enabledElement, image) {
		if (image.imageId !== lastRenderedImageId ||
            lastRenderedViewport.windowCenter !== enabledElement.viewport.voi.windowCenter ||
            lastRenderedViewport.windowWidth !== enabledElement.viewport.voi.windowWidth ||
            lastRenderedViewport.invert !== enabledElement.viewport.invert ||
            lastRenderedViewport.rotation !== enabledElement.viewport.rotation ||
            lastRenderedViewport.hflip !== enabledElement.viewport.hflip ||
            lastRenderedViewport.vflip !== enabledElement.viewport.vflip ||
            lastRenderedViewport.modalityLUT !== enabledElement.viewport.modalityLUT ||
            lastRenderedViewport.voiLUT !== enabledElement.viewport.voiLUT
		) {
			return true;
		}

		return false;
	}

	function getRenderCanvas(enabledElement, image, invalidated) {
		// apply the lut to the stored pixel data onto the render canvas

		if (doesImageNeedToBeRendered(enabledElement, image) === false && invalidated !== true) {
			return grayscaleRenderCanvas;
		}

		// If our render canvas does not match the size of this image reset it
		// NOTE: This might be inefficient if we are updating multiple images of different
		// sizes frequently.
		if (grayscaleRenderCanvas.width !== image.width || grayscaleRenderCanvas.height != image.height) {
			initializeGrayscaleRenderCanvas(image);
		}

		// get the lut to use
		const lut = getLut(image, enabledElement.viewport, invalidated);
		// gray scale image - apply the lut and put the resulting image onto the render canvas
		cornerstone.storedPixelDataToCanvasImageData(image, lut, grayscaleRenderCanvasData.data);
		grayscaleRenderCanvasContext.putImageData(grayscaleRenderCanvasData, 0, 0);
		return grayscaleRenderCanvas;
	}

	/**
     * API function to draw a grayscale image to a given enabledElement
     * @param enabledElement
     * @param invalidated - true if pixel data has been invaldiated and cached rendering should not be used
     */
	function renderGrayscaleImage(enabledElement, invalidated) {

		if (enabledElement === undefined) {
			throw 'drawImage: enabledElement parameter must not be undefined';
		}
		const image = enabledElement.image;
		if (image === undefined) {
			throw 'drawImage: image must be loaded before it can be drawn';
		}

		// get the canvas context and reset the transform
		const context = enabledElement.canvas.getContext('2d');
		context.setTransform(1, 0, 0, 1, 0, 0);

		// clear the canvas
		context.fillStyle = 'black';
		context.fillRect(0, 0, enabledElement.canvas.width, enabledElement.canvas.height);

		// turn off image smooth/interpolation if pixelReplication is set in the viewport
		if (enabledElement.viewport.pixelReplication === true) {
			context.imageSmoothingEnabled = false;
			context.mozImageSmoothingEnabled = false; // firefox doesn't support imageSmoothingEnabled yet
		}
		else {
			context.imageSmoothingEnabled = true;
			context.mozImageSmoothingEnabled = true;
		}

		// save the canvas context state and apply the viewport properties
		cornerstone.setToPixelCoordinateSystem(enabledElement, context);

		const renderCanvas = getRenderCanvas(enabledElement, image, invalidated);

		// Draw the render canvas half the image size (because we set origin to the middle of the canvas above)
		context.drawImage(renderCanvas, 0, 0, image.width, image.height, 0, 0, image.width, image.height);
		document.getElementsByTagName('body')[0].appendChild(renderCanvas);

		lastRenderedImageId = image.imageId;
		lastRenderedViewport.windowCenter = enabledElement.viewport.voi.windowCenter;
		lastRenderedViewport.windowWidth = enabledElement.viewport.voi.windowWidth;
		lastRenderedViewport.invert = enabledElement.viewport.invert;
		lastRenderedViewport.rotation = enabledElement.viewport.rotation;
		lastRenderedViewport.hflip = enabledElement.viewport.hflip;
		lastRenderedViewport.vflip = enabledElement.viewport.vflip;
		lastRenderedViewport.modalityLUT = enabledElement.viewport.modalityLUT;
		lastRenderedViewport.voiLUT = enabledElement.viewport.voiLUT;
	}

	// Module exports
	cornerstone.rendering.grayscaleImage = renderGrayscaleImage;
	cornerstone.renderGrayscaleImage = renderGrayscaleImage;

}(cornerstone));

/**
 * This module is responsible for drawing an image to an enabled elements canvas element
 */

(function(cornerstone) {

	'use strict';

	/**
     * API function to draw a standard web image (PNG, JPG) to an enabledImage
     *
     * @param enabledElement
     * @param invalidated - true if pixel data has been invaldiated and cached rendering should not be used
     */
	function renderWebImage(enabledElement, invalidated) {

		if (enabledElement === undefined) {
			throw 'drawImage: enabledElement parameter must not be undefined';
		}
		const image = enabledElement.image;
		if (image === undefined) {
			throw 'drawImage: image must be loaded before it can be drawn';
		}

		// get the canvas context and reset the transform
		const context = enabledElement.canvas.getContext('2d');
		context.setTransform(1, 0, 0, 1, 0, 0);

		// clear the canvas
		context.fillStyle = 'black';
		context.fillRect(0, 0, enabledElement.canvas.width, enabledElement.canvas.height);

		// turn off image smooth/interpolation if pixelReplication is set in the viewport
		if (enabledElement.viewport.pixelReplication === true) {
			context.imageSmoothingEnabled = false;
			context.mozImageSmoothingEnabled = false; // firefox doesn't support imageSmoothingEnabled yet
		}
		else {
			context.imageSmoothingEnabled = true;
			context.mozImageSmoothingEnabled = true;
		}

		// save the canvas context state and apply the viewport properties
		cornerstone.setToPixelCoordinateSystem(enabledElement, context);

		// if the viewport ww/wc and invert all match the initial state of the image, we can draw the image
		// directly.  If any of those are changed, we call renderColorImage() to apply the lut
		if (enabledElement.viewport.voi.windowWidth === enabledElement.image.windowWidth &&
            enabledElement.viewport.voi.windowCenter === enabledElement.image.windowCenter &&
            enabledElement.viewport.invert === false) {
			context.drawImage(image.getImage(), 0, 0, image.width, image.height, 0, 0, image.width, image.height);
		}
		else {
			cornerstone.renderColorImage(enabledElement, invalidated);
		}

	}

	// Module exports
	cornerstone.rendering.webImage = renderWebImage;
	cornerstone.renderWebImage = renderWebImage;

}(cornerstone));
/**
 */
(function(cornerstone) {

	'use strict';

	/**
     * Resets the viewport to the default settings
     *
     * @param element
     */
	function reset(element) {
		const enabledElement = cornerstone.getEnabledElement(element);
		const defaultViewport = cornerstone.internal.getDefaultViewport(enabledElement.canvas, enabledElement.image);
		enabledElement.viewport = defaultViewport;
		cornerstone.updateImage(element);
	}

	cornerstone.reset = reset;
}(cornerstone));

/**
 * This module is responsible for enabling an element to display images with cornerstone
 */
(function(cornerstone) {

	'use strict';

	function setCanvasSize(element, canvas) {
		// the device pixel ratio is 1.0 for normal displays and > 1.0
		// for high DPI displays like Retina
		/*

         This functionality is disabled due to buggy behavior on systems with mixed DPI's.  If the canvas
         is created on a display with high DPI (e.g. 2.0) and then the browser window is dragged to
         a different display with a different DPI (e.g. 1.0), the canvas is not recreated so the pageToPixel
         produces incorrect results.  I couldn't find any way to determine when the DPI changed other than
         by polling which is not very clean.  If anyone has any ideas here, please let me know, but for now
         we will disable this functionality.  We may want
         to add a mechanism to optionally enable this functionality if we can determine it is safe to do
         so (e.g. iPad or iPhone or perhaps enumerate the displays on the system.  I am choosing
         to be cautious here since I would rather not have bug reports or safety issues related to this
         scenario.

         var devicePixelRatio = window.devicePixelRatio;
         if(devicePixelRatio === undefined) {
         devicePixelRatio = 1.0;
         }
         */

		canvas.width = element.clientWidth;
		canvas.height = element.clientHeight;
		canvas.style.width = \`\${ element.clientWidth }px\`;
		canvas.style.height = \`\${ element.clientHeight }px\`;
	}

	/**
     * resizes an enabled element and optionally fits the image to window
     * @param element
     * @param fitToWindow true to refit, false to leave viewport parameters as they are
     */
	function resize(element, fitToWindow) {

		const enabledElement = cornerstone.getEnabledElement(element);

		setCanvasSize(element, enabledElement.canvas);

		if (enabledElement.image === undefined) {
			return;
		}

		if (fitToWindow === true) {
			cornerstone.fitToWindow(element);
		}
		else {
			cornerstone.updateImage(element);
		}
	}

	// module/private exports
	cornerstone.resize = resize;

}(cornerstone));
/**
 * This module contains a function that will set the canvas context to the pixel coordinates system
 * making it easy to draw geometry on the image
 */

(function(cornerstone) {

	'use strict';

	/**
     * Sets the canvas context transformation matrix to the pixel coordinate system.  This allows
     * geometry to be driven using the canvas context using coordinates in the pixel coordinate system
     * @param ee
     * @param context
     * @param scale optional scaler to apply
     */
	function setToPixelCoordinateSystem(enabledElement, context, scale) {
		if (enabledElement === undefined) {
			throw 'setToPixelCoordinateSystem: parameter enabledElement must not be undefined';
		}
		if (context === undefined) {
			throw 'setToPixelCoordinateSystem: parameter context must not be undefined';
		}

		const transform = cornerstone.internal.calculateTransform(enabledElement, scale);
		context.setTransform(transform.m[0], transform.m[1], transform.m[2], transform.m[3], transform.m[4], transform.m[5], transform.m[6]);
	}

	// Module exports
	cornerstone.setToPixelCoordinateSystem = setToPixelCoordinateSystem;
}(cornerstone));
/**
 * This module contains functions to deal with getting and setting the viewport for an enabled element
 */
(function(cornerstone) {

	'use strict';

	/**
     * Sets the viewport for an element and corrects invalid values
     *
     * @param element - DOM element of the enabled element
     * @param viewport - Object containing the viewport properties
     * @returns {*}
     */
	function setViewport(element, viewport) {

		const enabledElement = cornerstone.getEnabledElement(element);

		enabledElement.viewport.scale = viewport.scale;
		enabledElement.viewport.translation.x = viewport.translation.x;
		enabledElement.viewport.translation.y = viewport.translation.y;
		enabledElement.viewport.voi.windowWidth = viewport.voi.windowWidth;
		enabledElement.viewport.voi.windowCenter = viewport.voi.windowCenter;
		enabledElement.viewport.invert = viewport.invert;
		enabledElement.viewport.pixelReplication = viewport.pixelReplication;
		enabledElement.viewport.rotation = viewport.rotation;
		enabledElement.viewport.hflip = viewport.hflip;
		enabledElement.viewport.vflip = viewport.vflip;
		enabledElement.viewport.modalityLUT = viewport.modalityLUT;
		enabledElement.viewport.voiLUT = viewport.voiLUT;

		// prevent window width from being too small (note that values close to zero are valid and can occur with
		// PET images in particular)
		if (enabledElement.viewport.voi.windowWidth < 0.000001) {
			enabledElement.viewport.voi.windowWidth = 0.000001;
		}
		// prevent scale from getting too small
		if (enabledElement.viewport.scale < 0.0001) {
			enabledElement.viewport.scale = 0.25;
		}

		if (enabledElement.viewport.rotation === 360 || enabledElement.viewport.rotation === -360) {
			enabledElement.viewport.rotation = 0;
		}

		// Force the image to be updated since the viewport has been modified
		cornerstone.updateImage(element);
	}


	// module/private exports
	cornerstone.setViewport = setViewport;

}(cornerstone));

/**
 * This module contains a function to immediately redraw an image
 */
(function(cornerstone) {

	'use strict';

	/**
     * Forces the image to be updated/redrawn for the specified enabled element
     * @param element
     */
	function updateImage(element, invalidated) {
		const enabledElement = cornerstone.getEnabledElement(element);

		if (enabledElement.image === undefined) {
			throw 'updateImage: image has not been loaded yet';
		}

		cornerstone.drawImage(enabledElement, invalidated);
	}

	// module exports
	cornerstone.updateImage = updateImage;

}(cornerstone));
`;export{e as default};
//# sourceMappingURL=cornerstone-COt2BN7H-C9bWQNte.js.map
