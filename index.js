const fs = require('fs');
const {createCanvas, loadImage} = require('canvas');


const IMG_WIDTH = 89*1.25;
const IMG_HEIGHT = 124*1.25;

// loading deck data from JSON for demo
const deckData = fs.readFileSync('./deck.json');
const _list = JSON.parse(deckData);


// default object configuration
const defaultConfig = {
  imageWidth: IMG_WIDTH,
  imageHeight: IMG_HEIGHT,
  spacingX: 2,
  spacingY: 2,
  cardsX: 10,
  cardsY: 5,
};

/**
 * Creates an image representation of the deck list.
 * 
 * @param {Array} deckList Object containing information about deck and its cards
 * @param {Object} config Settings for the resulting image. Defaults to defaultConfig
 */
async function deckListToImage(deckList, config=defaultConfig) {

  const settings = Object.assign(defaultConfig, config);
  const canvasW = (settings.imageWidth+settings.spacingX)*settings.cardsX;
  const canvasH = (settings.imageHeight+settings.spacingY)*settings.cardsY;

  const canvas = createCanvas(canvasW, canvasH);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = "#eeeeee";
  ctx.fillRect(0,0, canvas.width, canvas.height);
  let i_x = 0;
  let i_y = 0;
  const imgs = [];

  deckList.cards.sort((a,b) => (a.level - b.level) || (a.card_type - b.card_type));
  deckList.cards.forEach((card) => { imgs.push(loadImage(card.image_url)) })

  const allImages = await Promise.all(imgs);

  allImages.forEach((img) => {
    const x = i_x % settings.cardsX;
    const posX = (settings.imageWidth+settings.spacingX) * x;
    const posY = (settings.imageHeight+settings.spacingY)*i_y;
    ctx.drawImage(img,posX, posY, settings.imageWidth, settings.imageHeight);

    i_x++;

    // add a new row 
    if( i_x % settings.cardsX === 0) {
      i_y += 1;
    }
  })


  return canvas;
}