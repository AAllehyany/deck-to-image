const fs = require('fs');
const {createCanvas, loadImage} = require('canvas');


// Dimensions/Spacing for the resulting image
const IMG_WIDTH = 89*1.25;
const IMG_HEIGHT = 124*1.25;
const CARD_SPACING_X = 2;
const CARD_SPACING_Y = 2;
const CANVAS_WIDTH = (IMG_WIDTH+CARD_SPACING_X)*10;
const CANVAS_HEIGHT = (IMG_HEIGHT+CARD_SPACING_Y)*5;

// loading deck data from JSON for demo
const deckData = fs.readFileSync('./deck.json');
const _list = JSON.parse(deckData);

/**
 * Creates an image representation of the deck list.
 * 
 * @param {Array} deckList Object containing information about deck and its cards
 */
async function deckListToImage(deckList) {

  const canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
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
      const x = i_x % 10;
      ctx.drawImage(img, (IMG_WIDTH+CARD_SPACING_X)*x, (IMG_HEIGHT+CARD_SPACING_Y)*i_y, IMG_WIDTH, IMG_HEIGHT);
      i_x++;
      if( i_x % 10 === 0) {
        i_y += 1;
      }
  })


  const buffer = canvas.toBuffer('image/png');
  fs.writeFile(`${deckList.name}.png`, buffer, (err) => {
    console.log(err);
  });
}

deckListToImage(_list);