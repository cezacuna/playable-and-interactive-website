// const canvas = document.querySelector('canvas');
// const context = canvas.getContext('2d')

// canvas.width = 1024
// canvas.height = 576

// const image = new Image ()
// image.src = './img/Wildrange Map.png'

// // image.onload = () => {
// //     context.drawImage(image, -950, -4900)
// // }

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

// Load map image, foreground
const image = new Image();
image.src = './img/Wildrange Map.png';

const foregroundImage = new Image();
foregroundImage.src = './img/Foreground.png';

//Load NPCs
const npc1Image = new Image();
npc1Image.src = './img/NPC1_SellerHats_Armie.png';

const npc2Image = new Image();
npc2Image.src = './img/NPC2_RPSGame_Bee.png';

const npc3Image = new Image();
npc3Image.src = './img/NPC3_SellerJacket_Kozy.png';

const npc4Image = new Image();
npc4Image.src = './img/NPC4_NumberGame_Dina.png';

const npc5Image = new Image();
npc5Image.src = './img/NPC5_MarbleMan_Egberts.png';

// Load camper vans
const camperVanClosed = new Image();
camperVanClosed.src = './img/CamperVan1-Close.png';

const camperVanOpen = new Image();
camperVanOpen.src = './img/CamperVan1-Open.png';

const camperVan2Closed = new Image();
camperVan2Closed.src = './img/CamperVan2-Close.png';

const camperVan2Open = new Image();
camperVan2Open.src = './img/CamperVan2-Open.png';

const camperVan3Closed = new Image();
camperVan3Closed.src = './img/CamperVan3-Close.png';

const camperVan3Open = new Image();
camperVan3Open.src = './img/CamperVan3-Open.png';

const bonfireLogImage = new Image();
bonfireLogImage.src = './img/Bonfire_02-Sheet.png';

const bonfireFireImage = new Image();
bonfireFireImage.src = './img/Fire_01-Sheet.png';

const summitPostImage = new Image();
summitPostImage.src = './img/SummitPost.png';

// Load sign
const signImage = new Image();
signImage.src = './img/Sign.png';

let marbleCount = 0;
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('marble-count').innerText = `x ${marbleCount}`; 

const bgMusic = document.getElementById('bg-music');

  document.addEventListener('keydown', () => {
    if (bgMusic.paused) {
      bgMusic.play().catch(e => {
        console.log("Autoplay prevented:", e);
      });
    }
  });
});

let rpsPopupOpen = false;
const choices = ['rock', 'paper', 'scissors'];

// Constants
const TILE_SIZE = 96;
const MAP_COLUMNS = 30;

const tentImage = new Image();
tentImage.src = './img/PxTentBlue.png'; // initial tent

const tent = {
    x: 1090,
    y: 5000,
    width: TILE_SIZE * 3.4, // e.g. 48 * 3 = 144px wide
    height: TILE_SIZE * 2.6  // e.g. 48 * 3 = 96px tall
  };   

  const npc1 = {
    x: 2210,
    y: 4230,
    width: 384,
    height: 288,
    currentFrame: 0,
    frameElapsed: 0,
    frameHold: 35,
    frameCount: 4
  }; 

  const npc2 = {
    x: 2350,
    y: 4100,
    width: TILE_SIZE,
    height: TILE_SIZE,
    facingDirection: 'left', // default facing
    frameHold: 9999, // disables idle animation
    currentFrame: 0,
  };

  const npc3 = {
    x: 1200,
    y: 3555,
    width: TILE_SIZE,
    height: TILE_SIZE,
    currentFrame: 0,
    frameElapsed: 0,
    frameHold: 35,
    frameCount: 4
  };
  
  const npc4 = {
    x: 1970,
    y: 2690,
    width: TILE_SIZE,
    height: TILE_SIZE,
    currentFrame: 0,
    frameElapsed: 0,
    frameHold: 35,
    frameCount: 4
  };

  const npc5 = {
    x: 1700,
    y: 2690,
    width: TILE_SIZE,
    height: TILE_SIZE,
    currentFrame: 0,
    frameElapsed: 0,
    frameHold: 500,
    frameCount: 4
  };

  const camperVan = {
    x: 2400,
    y: 4230,
    width: 300, 
    height: 200, 
    doorX: 2400 + 144,
    doorY: 4230,
    doorWidth: 48,
    doorHeight: 96
  };  

  const camperVan2 = {
    x: 1524,
    y: 3370,
    width: 300,
    height: 200,
    doorX: 1524 + 144,
    doorY: 3380,
    doorWidth: 48,
    doorHeight: 96
  };
  
  const camperVan3 = {
    x: 2003,
    y: 2500,
    width: 300,
    height: 200,
    doorX: 2000 + 144,
    doorY: 2520,
    doorWidth: 48,
    doorHeight: 96
  };

  const welcomeSign = {
    x: 1735,
    y: 5090,
    width: TILE_SIZE,
    height: TILE_SIZE
  };  

  const bonfireLog = {
    x: 1550,
    y: 5300,
    width: TILE_SIZE,
    height: TILE_SIZE,
    currentFrame: 0,
    frameElapsed: 0,
    frameHold: 30,
    frameCount: 4,
  };   
  
  const bonfireFire = {
    x: 1550,
    y: 5250,
    width: TILE_SIZE,
    height: TILE_SIZE,
    currentFrame: 0,
    frameElapsed: 0,
    frameHold: 30,
    frameCount: 4,
  };
  
  const summitPost = {
    x: 500,
    y: 1500,
    width: TILE_SIZE,
    height: TILE_SIZE
  };  

  let hasPlacedFlag = false;
  let summitFlagPlaced = false;

    const summitFlag = {
        x: summitPost.x + TILE_SIZE, // just to the right of the summit post
        y: summitPost.y,
        width: TILE_SIZE,
        height: TILE_SIZE
    };

  let hasWonRPS = false;
  let hasWonNumberGame = false;
  let npc5DialogueStage = 0;
  let hasFoundVanMarble = false;
  let vanDoorOpen = false;
  let hasFoundVan2Marble = false;
  let van2DoorOpen = false;
  let hasFoundVan3Marble = false;
  let van3DoorOpen = false;

  let hasFlag = false;
  const flagImage = new Image();
  flagImage.src = './img/Flag.png';

  const marbleImage = new Image();
  marbleImage.src = './img/Marble.png';
  
  let currentHatImage = null;
  const hatImages = {
    black: './img/PxBlackHat.png',
    blue: './img/PxBlueHat.png',
    green: './img/PxGreenHat.png',
    pink: './img/PxPinkHat.png'
  };

  let currentJacketColor = null;
  let currentJacketImage = null;
  const jacketImages = {
    black: {
      down: './img/Jackets/PxBlackJacket_down.png',
      up: './img/Jackets/PxBlackJacket_up.png',
      left: './img/Jackets/PxBlackJacket_left.png',
      right: './img/Jackets/PxBlackJacket_right.png'
    },
    blue: {
      down: './img/Jackets/PxBlueJacket_down.png',
      up: './img/Jackets/PxBlueJacket_up.png',
      left: './img/Jackets/PxBlueJacket_left.png',
      right: './img/Jackets/PxBlueJacket_right.png'
    },
    green: {
        down: './img/Jackets/PxGreenJacket_down.png',
        up: './img/Jackets/PxGreenJacket_up.png',
        left: './img/Jackets/PxGreenJacket_left.png',
        right: './img/Jackets/PxGreenJacket_right.png'
    },
    pink: {
        down: './img/Jackets/PxPinkJacket_down.png',
        up: './img/Jackets/PxPinkJacket_up.png',
        left: './img/Jackets/PxPinkJacket_left.png',
        right: './img/Jackets/PxPinkJacket_right.png'
    },
  };
  
  const table = {
    x: 2210,
    y: 4300,
    width: 384,
    height: 288
  };  

  const jacketTable = {
    x: 1200,
    y: 3555,
    width: 384,
    height: 288
  }; 
  
  const numberTable = {
    x: 1970,
    y: 2786,
    width: TILE_SIZE,
    height: TILE_SIZE
  };

const playerImage = new Image();
playerImage.src = './img/player-walk.png';

const directionToColumn = {
    down: 0,
    up: 1,
    left: 2,
    right: 3
  };

let facingDirection = 'down'; // default facing
let currentFrame = 0;
let frameElapsed = 0;
const frameHold = 22; // higher = slower animation
const frameCount = 4; // how many frames per direction

let npcDialogueOpen = false;

// Replace this with your full collision data array
const collisionData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 4557, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 4557, 0, 4557, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 4557, 0, 0, 0, 4557, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 4557, 0, 0, 0, 0, 0, 4557, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 4557, 0, 0, 0, 0, 0, 0, 4557, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 4557, 0, 0, 0, 0, 0, 0, 0, 0, 4557, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 4557, 0, 0, 0, 0, 0, 0, 0, 0, 4557, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 4557, 0, 0, 0, 0, 0, 0, 0, 13283, 0, 4557, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 4557, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4557, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 4557, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4557, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 4557, 0, 0, 0, 13283, 0, 0, 0, 0, 0, 0, 0, 4557, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 4557, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4557, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 4557, 0, 0, 0, 0, 0, 0, 0, 0, 4557, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 4557, 0, 0, 0, 0, 0, 0, 4557, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 4557, 0, 0, 0, 0, 0, 4557, 0, 0, 0, 0, 0, 0, 0, 0, 4557, 4557, 0, 4557, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 4557, 4557, 0, 0, 0, 0, 4557, 0, 0, 0, 0, 0, 4557, 4557, 0, 0, 13293, 0, 4557, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 4557, 0, 0, 0, 0, 4557, 4557, 4557, 4557, 4557, 0, 0, 0, 0, 0, 0, 0, 4557, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 4557, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4557, 4557, 0, 0, 0, 4557, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 4557, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4557, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4557, 4557, 4557, 4557, 4557, 4557, 4557, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4557, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4557, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4557, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4557, 4557, 0, 0, 0, 0, 0, 0, 0, 0, 4557, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4557, 4557, 4557, 4557, 4557, 0, 0, 0, 4557, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4557, 4557, 0, 0, 4557, 4557, 4557, 0, 0, 0, 0, 0, 4557, 0, 0, 4557, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4557, 4557, 0, 0, 4557, 4557, 13293, 0, 13293, 4557, 0, 0, 0, 4557, 0, 0, 0, 4557, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 4557, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4557, 4557, 4557, 4557, 0, 0, 0, 4557, 0, 0,
    0, 0, 0, 0, 4557, 4557, 4557, 4557, 4557, 0, 0, 0, 13293, 13293, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4557, 0, 0,
    0, 0, 0, 4557, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4557, 0, 0, 0,
    0, 0, 4557, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4557, 4557, 4557, 4557, 4557, 0, 0, 0, 0,
    0, 0, 4557, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 13293, 0, 0, 0, 4557, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 4557, 0, 0, 0, 0, 4557, 4557, 4557, 4557, 0, 0, 0, 0, 0, 0, 0, 0, 4557, 0, 0, 4557, 4557, 4557, 4557, 0, 0, 0, 0,
    0, 0, 4557, 0, 0, 0, 4557, 0, 0, 0, 0, 4557, 4557, 4557, 4557, 4557, 4557, 4557, 4557, 0, 0, 4557, 0, 0, 0, 0, 4557, 0, 0, 0,
    0, 0, 4557, 0, 0, 0, 0, 4557, 4557, 4557, 4557, 4557, 4557, 4557, 4557, 4557, 4557, 4557, 4557, 4557, 4557, 4557, 0, 0, 0, 0, 13293, 4557, 0, 0,
    0, 0, 0, 4557, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4557, 4557, 13293, 0, 13293, 4557, 0,
    0, 0, 0, 0, 4557, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4557, 0,
    0, 0, 0, 0, 0, 4557, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4557, 0, 0,
    0, 0, 0, 0, 0, 0, 4557, 4557, 4557, 4557, 4557, 4557, 4557, 4557, 0, 0, 4557, 4557, 4557, 4557, 4557, 4557, 0, 0, 0, 0, 4557, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4557, 4557, 4557, 0, 0, 4557, 4557, 4557, 0, 0, 0, 4557, 4557, 4557, 4557, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 4557, 4557, 13284, 0, 0, 0, 0, 0, 0, 13287, 4557, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 4557, 13284, 0, 0, 0, 0, 0, 0, 0, 0, 13287, 4557, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 4557, 0, 0, 4557, 4557, 0, 0, 0, 0, 0, 0, 4557, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 4557, 0, 13293, 4557, 4557, 13293, 0, 0, 0, 13293, 0, 4557, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 4557, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4557, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 4557, 0, 0, 0, 0, 0, 0, 13293, 0, 0, 0, 4557, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4557, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4557, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4557, 0, 0, 0, 0, 0, 0, 0, 4557, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4557, 4557, 4557, 4557, 4557, 4557, 4557, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

// Convert collision data to boundary rectangles
let boundaries = [];
collisionData.forEach((value, index) => {
    if (value !== 0) {
        const x = (index % MAP_COLUMNS) * TILE_SIZE;
        const y = Math.floor(index / MAP_COLUMNS) * TILE_SIZE;
        boundaries.push({ x, y, width: TILE_SIZE, height: TILE_SIZE });
    }
});

// Remove collision from the table (so it's interactable but not solid)
boundaries = boundaries.filter(b => !(b.x === table.x && b.y === table.y));
boundaries = boundaries.filter(b => !(b.x === jacketTable.x && b.y === jacketTable.y));
boundaries = boundaries.filter(b => !(b.x === numberTable.x && b.y === numberTable.y));
boundaries = boundaries.filter(b => !(b.x === welcomeSign.x && b.y === welcomeSign.y));

// Add NPC1 as a solid collision object
  boundaries.push({
    x: npc1.x,
    y: npc1.y,
    width: TILE_SIZE,
    height: TILE_SIZE
  });  

  boundaries.push({
    x: npc3.x,
    y: npc3.y,
    width: TILE_SIZE,
    height: TILE_SIZE
  });

  boundaries.push({
    x: npc4.x,
    y: npc4.y,
    width: TILE_SIZE,
    height: TILE_SIZE
  });

  boundaries.push({
    x: npc5.x,
    y: npc5.y,
    width: TILE_SIZE,
    height: TILE_SIZE
  });  

  // Camper Van 1 boundary
    boundaries.push({
        x: camperVan.x,
        y: camperVan.y,
        width: camperVan.width,
        height: camperVan.height
    });
  
  // Camper Van 2 boundary
    boundaries.push({
        x: camperVan2.x,
        y: camperVan2.y,
        width: camperVan2.width,
        height: camperVan2.height
    });

  // Camper Van 3 boundary
    boundaries.push({
        x: camperVan3.x,
        y: camperVan3.y,
        width: camperVan3.width,
        height: camperVan3.height
    });

    // Add Summit Post collision
    boundaries.push({
        x: summitPost.x,
        y: summitPost.y,
        width: 5,
        height: 5,
  });  
  
// Helper function for rectangle collision detection
function isColliding(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}

function isNearNPC(npc) {
    const buffer = 20; // tolerance in pixels
    const playerRect = {
      x: player.x,
      y: player.y,
      width: player.width,
      height: player.height
    };
  
    const npcRect = {
      x: npc.x + mapX - buffer,
      y: npc.y + mapY - buffer,
      width: TILE_SIZE + buffer * 2,
      height: TILE_SIZE + buffer * 2
    };
  
    return isColliding(playerRect, npcRect);
  }  

function isNearTent() {
    const playerRect = { x: player.x, y: player.y, width: player.width, height: player.height };
    const tentRect = {
      x: tent.x + mapX,
      y: tent.y + mapY,
      width: tent.width,
      height: tent.height
    };
    return isColliding(playerRect, tentRect);
  } 

// Player (stays centered on screen), smaller box to pass through single pixel paths
const player = {
    x: canvas.width / 2 - TILE_SIZE / 2 + 4,  
    y: canvas.height / 2 - TILE_SIZE / 2 + 4,
    width: TILE_SIZE - 8,
    height: TILE_SIZE - 8
  };
  

// Initial map offset (camera)
let mapX = -1000;
let mapY = -4900;

const baseSpeed = 2;
const runSpeed = 6;
// const speed = keys.space ? runSpeed : baseSpeed;

// Keyboard state
const keys = { w: false, a: false, s: false, d: false, space: false };

// Main animation loop
function animate() {
    requestAnimationFrame(animate);

context.imageSmoothingEnabled = false;
  
// Separate movement logic for smoother corners
const speed = keys.space ? runSpeed : baseSpeed;

let dx = 0;
let dy = 0;
if (keys.w) dy += speed;
if (keys.s) dy -= speed;
if (keys.a) dx += speed;
if (keys.d) dx -= speed;

// Try X movement first
let nextMapX = mapX + dx;
let canMoveX = true;

for (const boundary of boundaries) {
  const boundaryRect = {
    x: boundary.x + nextMapX,
    y: boundary.y + mapY,
    width: TILE_SIZE,
    height: TILE_SIZE
  };
  if (isColliding(player, boundaryRect)) {
    canMoveX = false;
    break;
  }
}
if (canMoveX) {
  mapX = nextMapX;
}

// Then try Y movement separately
let nextMapY = mapY + dy;
let canMoveY = true;

for (const boundary of boundaries) {
  const boundaryRect = {
    x: boundary.x + mapX,
    y: boundary.y + nextMapY,
    width: TILE_SIZE,
    height: TILE_SIZE
  };
  if (isColliding(player, boundaryRect)) {
    canMoveY = false;
    break;
  }
}
if (canMoveY) {
  mapY = nextMapY;
}

const isMoving = keys.w || keys.a || keys.s || keys.d;

if (isMoving) {
  frameElapsed++;
  if (frameElapsed >= frameHold) {
    currentFrame = (currentFrame + 1) % frameCount;
    frameElapsed = 0;
  }
} else {
  currentFrame = 0; // reset to idle frame
}

    // Draw background map
    context.drawImage(image, mapX, mapY);
  
    // Draw collision tiles (currently invisible)
    // boundaries.forEach(b => {
    //   context.fillStyle = 'rgba(255, 0, 0, 0.3)';
    //   context.fillRect(Math.floor(b.x + mapX), Math.floor(b.y + mapY), TILE_SIZE, TILE_SIZE);
    // });

    context.drawImage(
        tentImage,
        tent.x + mapX,
        tent.y + mapY,
        tent.width,
        tent.height
      );      

    // Animate NPC1
    npc1.frameElapsed++;
        if (npc1.frameElapsed >= npc1.frameHold) {
        npc1.currentFrame = (npc1.currentFrame + 1) % npc1.frameCount;
        npc1.frameElapsed = 0;
    }

    const npc1FrameWidth = 16;  // pixel size of each frame
    const npc1FrameHeight = 16;
    const npc1SourceX = npc1.currentFrame * npc1FrameWidth;
    const npc1SourceY = 0; // assuming only 1 row

    context.drawImage(
        npc1Image,
        npc1SourceX, npc1SourceY,
        npc1FrameWidth, npc1FrameHeight,
        npc1.x + mapX, npc1.y + mapY,
        TILE_SIZE, TILE_SIZE
    );

    // Animate NPC2
    npc2.frameElapsed++;
        if (npc2.frameElapsed >= npc2.frameHold) {
        npc2.currentFrame = (npc2.currentFrame + 1) % npc2.frameCount;
        npc2.frameElapsed = 0;
    }

    const npc2FrameWidth = 16;
    const npc2FrameHeight = 16;
    const npc2SourceX = npc2.currentFrame * npc2FrameWidth;
    const npc2SourceY = 0;

    context.drawImage(
        npc2Image,
        npc2SourceX, npc2SourceY,
        npc2FrameWidth, npc2FrameHeight,
        npc2.x + mapX, npc2.y + mapY,
        TILE_SIZE, TILE_SIZE
    );

    // Animate NPC3
    npc3.frameElapsed++;
        if (npc3.frameElapsed >= npc3.frameHold) {
        npc3.currentFrame = (npc3.currentFrame + 1) % npc3.frameCount;
        npc3.frameElapsed = 0;
    }

    const npc3FrameWidth = 16;
    const npc3FrameHeight = 16;
    const npc3SourceX = npc3.currentFrame * npc3FrameWidth;
    const npc3SourceY = 0;

    context.drawImage(
        npc3Image,
        npc3SourceX, npc3SourceY,
        npc3FrameWidth, npc3FrameHeight,
        npc3.x + mapX, npc3.y + mapY,
        TILE_SIZE, TILE_SIZE
    );

    // Animate NPC4
    npc4.frameElapsed++;
        if (npc4.frameElapsed >= npc4.frameHold) {
        npc4.currentFrame = (npc4.currentFrame + 1) % npc4.frameCount;
        npc4.frameElapsed = 0;
        }

    const npc4FrameWidth = 16;
    const npc4FrameHeight = 16;
    const npc4SourceX = npc4.currentFrame * npc4FrameWidth;
    const npc4SourceY = 0;

    context.drawImage(
        npc4Image,
        npc4SourceX, npc4SourceY,
        npc4FrameWidth, npc4FrameHeight,
        npc4.x + mapX, npc4.y + mapY,
        TILE_SIZE, TILE_SIZE
    );

    // // Animate NPC5
    npc5.frameElapsed++;
        if (npc5.frameElapsed >= npc5.frameHold) {
        npc5.currentFrame = (npc5.currentFrame + 1) % npc5.frameCount;
        npc5.frameElapsed = 0;
    }

    const npc5FrameWidth = 16;
    const npc5FrameHeight = 16;
    const npc5SourceX = npc5.currentFrame * npc5FrameWidth;
    const npc5SourceY = 0;

    context.drawImage(
        npc5Image,
        npc5SourceX, npc5SourceY,
        npc5FrameWidth, npc5FrameHeight,
        npc5.x + mapX, npc5.y + mapY,
        TILE_SIZE, TILE_SIZE
    );

    // Camper Van 1
    const vanImage = vanDoorOpen ? camperVanOpen : camperVanClosed;
    context.drawImage(
        vanImage,
        camperVan.x + mapX,
        camperVan.y + mapY,
        camperVan.width,
        camperVan.height
    );

    // Camper Van 2
    const van2Image = van2DoorOpen ? camperVan2Open : camperVan2Closed;
    context.drawImage(
        van2Image,
        camperVan2.x + mapX,
        camperVan2.y + mapY,
        camperVan2.width,
        camperVan2.height
    ); 

    // Camper Van 3
    const van3Image = van3DoorOpen ? camperVan3Open : camperVan3Closed;
    context.drawImage(
        van3Image,
        camperVan3.x + mapX,
        camperVan3.y + mapY,
        camperVan3.width,
        camperVan3.height
    ); 

    // Sign
    context.drawImage(
        signImage,
        welcomeSign.x + mapX,
        welcomeSign.y + mapY,
        welcomeSign.width,
        welcomeSign.height
      );
      
    // Animate bottom bonfire log
    bonfireLog.frameElapsed++;
        if (bonfireLog.frameElapsed >= bonfireLog.frameHold) {
        bonfireLog.currentFrame = (bonfireLog.currentFrame + 1) % bonfireLog.frameCount;
        bonfireLog.frameElapsed = 0;
    }

    const bonfireLogFrameWidth = 32;
    const bonfireLogFrameHeight = 32;
    const bonfireLogSourceX = bonfireLog.currentFrame * bonfireLogFrameWidth;

    context.drawImage(
        bonfireLogImage,
        bonfireLogSourceX, 0,
        bonfireLogFrameWidth, bonfireLogFrameHeight,
        bonfireLog.x + mapX,
        bonfireLog.y + mapY,
        TILE_SIZE, TILE_SIZE
    );

    // Animate bonfire fire
    bonfireFire.frameElapsed++;
        if (bonfireFire.frameElapsed >= bonfireFire.frameHold) {
        bonfireFire.currentFrame = (bonfireFire.currentFrame + 1) % bonfireFire.frameCount;
        bonfireFire.frameElapsed = 0;
    }

    const bonfireFireFrameWidth = 32;
    const bonfireFireFrameHeight = 32;
    const bonfireFireSourceX = bonfireFire.currentFrame * bonfireFireFrameWidth;

    context.drawImage(
        bonfireFireImage,
        bonfireFireSourceX, 0,
        bonfireFireFrameWidth, bonfireFireFrameHeight,
        bonfireFire.x + mapX,
        bonfireFire.y + mapY,
        TILE_SIZE, TILE_SIZE
    );

    // Summit post
    context.drawImage(
        summitPostImage,
        summitPost.x + mapX,
        summitPost.y + mapY,
        summitPost.width,
        summitPost.height
      ); 
      
      if (hasPlacedFlag) {
        context.drawImage(
          flagImage,
          summitFlag.x + mapX,
          summitFlag.y + mapY,
          summitFlag.width,
          summitFlag.height
        );
      } 
      
      if (summitFlagPlaced) {
        context.drawImage(
          flagImage,
          summitFlag.x + mapX,
          summitFlag.y + mapY,
          summitFlag.width,
          summitFlag.height
        );
      }           

    // Draw player sprite
    const spriteFrameWidth = 16;
    const spriteFrameHeight = 16;

    const directionToRow = {
        down: 0,
        up: 1,
        left: 2,
        right: 3
    };

    const sourceX = currentFrame * spriteFrameWidth;
    const sourceY = directionToRow[facingDirection] * spriteFrameHeight;

    context.imageSmoothingEnabled = false;

    context.drawImage(
        playerImage,
        sourceX, sourceY,
        spriteFrameWidth, spriteFrameHeight,
        Math.floor(player.x), Math.floor(player.y),
        TILE_SIZE, TILE_SIZE
        );

    // 🎩 Draw Hat if selected
    if (currentHatImage) {
        const hatOffsetX = 0;
        const hatOffsetY = 0; // Adjust upward
        context.drawImage(
        currentHatImage,
        Math.floor(player.x + hatOffsetX),
        Math.floor(player.y + hatOffsetY),
        TILE_SIZE,
        TILE_SIZE
        );
    }  

    // 🧥 Draw Jacket if selectesd
    if (currentJacketImage) {
        const jacketOffsetX = 0;
        const jacketOffsetY = 0;
        context.drawImage(
        currentJacketImage,
        Math.floor(player.x + jacketOffsetX),
        Math.floor(player.y + jacketOffsetY),
        TILE_SIZE,
        TILE_SIZE
        );
    }

    // Draw foreground layer (AFTER player)
    context.drawImage(foregroundImage, mapX, mapY); 
}  

// Start animation after image loads
let mapLoaded = false;
let playerLoaded = false;
let foregroundLoaded = false;

image.onload = () => {
    mapLoaded = true;
    if (mapLoaded && playerLoaded && foregroundLoaded) animate();
  };
  
  playerImage.onload = () => {
    playerLoaded = true;
    if (mapLoaded && playerLoaded && foregroundLoaded) animate();
  };
  
  foregroundImage.onload = () => {
    foregroundLoaded = true;
    if (mapLoaded && playerLoaded && foregroundLoaded) animate();
  };

// Key listeners
window.addEventListener('keydown', (e) => {
    if (!npcDialogueOpen) {
        if (e.key === 'w') { keys.w = true; facingDirection = 'up'; }
        if (e.key === 'a') { keys.a = true; facingDirection = 'left'; }
        if (e.key === 's') { keys.s = true; facingDirection = 'down'; }
        if (e.key === 'd') { keys.d = true; facingDirection = 'right'; }
        if (e.key === ' ') { keys.space = true; }
        if (currentJacketColor) {
            updateJacketImage();
          }          
    }
      if (e.key === 'Enter') {
        if (npcDialogueOpen) {
          closeNPCDialogue();
        } else if (isNearTent()) {
          openTentPopup();
        } else if (isNearNPC(npc1)) {
          openNPCDialogue();
        } else if (isNearVanDoor()) {
            const dialogueBox = document.getElementById('dialogue-box');
            dialogueBox.style.display = 'block';
            npcDialogueOpen = true;
          
            if (!hasFoundVanMarble) {
              marbleCount++;
              document.getElementById('marble-count').innerText = `x ${marbleCount}`;
              hasFoundVanMarble = true;
              vanDoorOpen = true;
              dialogueBox.innerText = "You found a marble!";
            } else {
              dialogueBox.innerText = "Nothing to see here.";
            }
        } else if (isNearVan2Door()) {
            const dialogueBox = document.getElementById('dialogue-box');
            dialogueBox.style.display = 'block';
            npcDialogueOpen = true;
          
            if (!hasFoundVan2Marble) {
              marbleCount++;
              document.getElementById('marble-count').innerText = `x ${marbleCount}`;
              hasFoundVan2Marble = true;
              van2DoorOpen = true;
              dialogueBox.innerText = "You found a marble!";
            } else {
              dialogueBox.innerText = "Nothing to see here.";
            }
        } else if (isNearVan3Door()) {
            const dialogueBox = document.getElementById('dialogue-box');
            dialogueBox.style.display = 'block';
            npcDialogueOpen = true;
          
            if (!hasFoundVan3Marble) {
              marbleCount++;
              document.getElementById('marble-count').innerText = `x ${marbleCount}`;
              hasFoundVan3Marble = true;
              van3DoorOpen = true;
              dialogueBox.innerText = "You found a marble!";
            } else {
              dialogueBox.innerText = "Nothing to see here.";
            }
        } else if (isNearTable()) {
          openHatPopup();
        } else if (isNearNPC2()) {
          openRPSPopup();
        } else if (isNearNPC3()) {
            showKozyDialogue();
        } else if (isNearJacketTable()) {
            openJacketPopup();
        } else if (isNearNPC4() || isNearNumberTable()) {
            showDinaDialogue();
            setTimeout(() => {
              openNumberPopup();
            }, 1000); // Delay before number game
        } else if (isNearNPC5()) {
            showEgbertsDialogue();
        } else if (isNearWelcomeSign()) {
            npcDialogueOpen = true;
            const dialogueBox = document.getElementById('dialogue-box');
            dialogueBox.innerText = "Sign: Welcome to Wildrange! Explore freely, and don't forget — the summit's just up ahead!";
            dialogueBox.style.display = 'block';
        } else if (isNearBonfire()) {
            npcDialogueOpen = true;
            const dialogueBox = document.getElementById('dialogue-box');
            dialogueBox.innerText = "Toasty!";
            dialogueBox.style.display = 'block';
        } else if (isNearSummitPost()) {
            openSummitPopup();
        }                            
      }                  
});

window.addEventListener('keyup', (e) => {
    if (e.key === 'w') keys.w = false;
    if (e.key === 'a') keys.a = false;
    if (e.key === 's') keys.s = false;
    if (e.key === 'd') keys.d = false;
    if (e.key === ' ') keys.space = false;
});

function openTentPopup() {
    document.getElementById('tent-popup').style.display = 'block';
  }
  
  function closeTentPopup() {
    document.getElementById('tent-popup').style.display = 'none';
  }
  
  function changeTent(color) {
    tentImage.src = `./img/PxTent${capitalize(color)}.png`;
    closeTentPopup();
  }
  
  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }  

function openNPCDialogue() {
    npcDialogueOpen = true;
    const dialogueBox = document.getElementById('dialogue-box');
    dialogueBox.style.display = 'block';
  }

function closeNPCDialogue() {
    npcDialogueOpen = false;
    const dialogueBox = document.getElementById('dialogue-box');
    dialogueBox.style.display = 'none';
  }

  function isNearTable() {
    const buffer = 20;
    const playerRect = { x: player.x, y: player.y, width: player.width, height: player.height };
    const tableRect = {
      x: table.x + mapX - buffer,
      y: table.y + mapY - buffer,
      width: table.width + buffer * 2,
      height: table.height + buffer * 2
    };
    return isColliding(playerRect, tableRect);
  }
  
  function openHatPopup() {
    document.getElementById('hat-popup').style.display = 'block';
  }
  
  function closeHatPopup() {
    document.getElementById('hat-popup').style.display = 'none';
  }
  
  function setHat(color) {
    const image = new Image();
    image.src = hatImages[color];
    image.onload = () => {
      currentHatImage = image;
      closeHatPopup();
    };
  }
  
  function removeHat() {
    currentHatImage = null;
    closeHatPopup();
  }

  function isNearJacketTable() {
    const buffer = 20;
    const playerRect = { x: player.x, y: player.y, width: player.width, height: player.height };
    const tableRect = {
      x: jacketTable.x + mapX - buffer,
      y: jacketTable.y + mapY - buffer,
      width: jacketTable.width + buffer * 2,
      height: jacketTable.height + buffer * 2
    };
    return isColliding(playerRect, tableRect);
  }  
  
  function isNearNPC2() {
    const buffer = 20;
    const playerRect = { x: player.x, y: player.y, width: player.width, height: player.height };
    const npcRect = {
      x: npc2.x + mapX - buffer,
      y: npc2.y + mapY - buffer,
      width: TILE_SIZE + buffer * 2,
      height: TILE_SIZE + buffer * 2
    };
    return isColliding(playerRect, npcRect);
  }

  function isNearNPC3() {
    const buffer = 20;
    const playerRect = { x: player.x, y: player.y, width: player.width, height: player.height };
    const npcRect = {
      x: npc3.x + mapX - buffer,
      y: npc3.y + mapY - buffer,
      width: TILE_SIZE + buffer * 2,
      height: TILE_SIZE + buffer * 2
    };
    return isColliding(playerRect, npcRect);
  }  

  function isNearNPC4() {
    const buffer = 20;
    const playerRect = { x: player.x, y: player.y, width: player.width, height: player.height };
    const npcRect = {
      x: npc4.x + mapX - buffer,
      y: npc4.y + mapY - buffer,
      width: TILE_SIZE + buffer * 2,
      height: TILE_SIZE + buffer * 2
    };
    return isColliding(playerRect, npcRect);
  }

  function isNearNPC5() {
    const buffer = 20;
    const playerRect = { x: player.x, y: player.y, width: player.width, height: player.height };
    const npcRect = {
      x: npc5.x + mapX - buffer,
      y: npc5.y + mapY - buffer,
      width: TILE_SIZE + buffer * 2,
      height: TILE_SIZE + buffer * 2
    };
    return isColliding(playerRect, npcRect);
  }  

  function showKozyDialogue() {
    npcDialogueOpen = true;
    const dialogueBox = document.getElementById('dialogue-box');
    dialogueBox.innerText = "Kozy: Bundle up before the summit!";
    dialogueBox.style.display = 'block';
  }  

  function openJacketPopup() {
    document.getElementById('jacket-popup').style.display = 'block';
  }
  
  function closeJacketPopup() {
    document.getElementById('jacket-popup').style.display = 'none';
  }
  
  function setJacket(color) {
    currentJacketColor = color;
    updateJacketImage();
    closeJacketPopup();
  }

  function updateJacketImage() {
    if (!currentJacketColor) return;
  
    const image = new Image();
    image.src = jacketImages[currentJacketColor][facingDirection];
    image.onload = () => {
      currentJacketImage = image;
    };
  }  
  
  function removeJacket() {
    currentJacketColor = null;
    currentJacketImage = null;
    closeJacketPopup();
  }

  function openRPSPopup() {
    rpsPopupOpen = true;
    document.getElementById('rps-popup').style.display = 'block';
  }
  
  function closeRPSPopup() {
    rpsPopupOpen = false;
    document.getElementById('rps-popup').style.display = 'none';
    document.getElementById('rps-result').innerText = '';
  }
  
  function chooseRPS(playerChoice) {
    const npcChoice = choices[Math.floor(Math.random() * choices.length)];
    let result = '';
  
    if (playerChoice === npcChoice) result = "It's a draw!";
    else if (
      (playerChoice === 'rock' && npcChoice === 'scissors') ||
      (playerChoice === 'paper' && npcChoice === 'rock') ||
      (playerChoice === 'scissors' && npcChoice === 'paper')
    ) {
      result = "You win!";
      if (!hasWonRPS) {
        marbleCount++;
        hasWonRPS = true;
        document.getElementById('marble-count').innerText = `x ${marbleCount}`;
      } else {
        result += " (You already won a marble!)";
      }
    } else {
      result = "You lost!";
    }
  
    document.getElementById('rps-result').innerText = `You chose ${playerChoice}, Bee chose ${npcChoice}.\n${result}`;
  }

  function isNearNumberTable() {
    const buffer = 20;
    const playerRect = { x: player.x, y: player.y, width: player.width, height: player.height };
    const tableRect = {
      x: numberTable.x + mapX - buffer,
      y: numberTable.y + mapY - buffer,
      width: TILE_SIZE + buffer * 2,
      height: TILE_SIZE + buffer * 2
    };
    return isColliding(playerRect, tableRect);
  }  

  function showDinaDialogue() {
    npcDialogueOpen = true;
    const dialogueBox = document.getElementById('dialogue-box');
    dialogueBox.innerText = "Dina: Think fast! Give me a number between 1-5!";
    dialogueBox.style.display = 'block';
  }
  
  function openNumberPopup() {
    document.getElementById('number-popup').style.display = 'block';
  }
  
  function closeNumberPopup() {
    document.getElementById('number-popup').style.display = 'none';
  }
  
  function checkNumberAnswer() {
    const input = document.getElementById('number-input').value;
    const number = parseInt(input);
    const npcNumber = Math.floor(Math.random() * 5) + 1; // 1–5
    const dialogueBox = document.getElementById('dialogue-box');
  
    if (number >= 1 && number <= 5) {
      if (number === npcNumber) {
        if (!hasWonNumberGame) {
          marbleCount++;
          hasWonNumberGame = true;
          document.getElementById('marble-count').innerText = `x ${marbleCount}`;
          dialogueBox.innerText = `Correct! We both chose ${npcNumber}, here’s a marble.`;
        } else {
          dialogueBox.innerText = `Correct! We both chose ${npcNumber}. (You already won a marble!)`;
        }           
      } else {
        dialogueBox.innerText = `Nope! I chose ${npcNumber}.`;
      }
    } else {
      dialogueBox.innerText = "That's not between 1 and 5!";
    }
  
    closeNumberPopup();
    dialogueBox.style.display = 'block';
    npcDialogueOpen = true;
  }
  
  function showEgbertsDialogue() {
    const dialogueBox = document.getElementById('dialogue-box');
    npcDialogueOpen = true;
    dialogueBox.style.display = 'block';
  
    const lines = [
      "Egberts: Hey, you're almost at the summit!",
      "Egberts: You don't have a flag yet?",
      "Egberts: I can give you one for five marbles."
    ];
  
    // If still going through the initial 3 lines
    if (npc5DialogueStage < lines.length) {
      dialogueBox.innerText = lines[npc5DialogueStage];
      npc5DialogueStage++;
    } 
    // Check if player has 5 marbles and doesn't have the flag yet
    else if (marbleCount >= 5 && !hasFlag) {
      dialogueBox.innerText = "Egberts: Oh cool, you've got 5 of them, here's your flag!";
      hasFlag = true;
      document.getElementById('flag-display').style.display = 'inline-flex';
      npc5DialogueStage++; 
    } 
    else {
      dialogueBox.innerText = ""; 
      closeNPCDialogue();
      npc5DialogueStage = 0; 
    }
  }  

  function isNearVanDoor() {
    const buffer = 20;
    const playerRect = {
      x: player.x,
      y: player.y,
      width: player.width,
      height: player.height
    };
  
    const doorRect = {
      x: camperVan.doorX + mapX - buffer,
      y: camperVan.doorY + mapY - buffer,
      width: camperVan.doorWidth + buffer * 2,
      height: camperVan.doorHeight + buffer * 2
    };
  
    return isColliding(playerRect, doorRect);
  }  

  function isNearVan2Door() {
    const buffer = 20;
    const playerRect = {
      x: player.x,
      y: player.y,
      width: player.width,
      height: player.height
    };
  
    const doorRect = {
      x: camperVan2.doorX + mapX - buffer,
      y: camperVan2.doorY + mapY - buffer,
      width: camperVan2.doorWidth + buffer * 2,
      height: camperVan2.doorHeight + buffer * 2
    };
  
    return isColliding(playerRect, doorRect);
  }  

  function isNearVan3Door() {
    const buffer = 20;
    const playerRect = {
      x: player.x,
      y: player.y,
      width: player.width,
      height: player.height
    };
  
    const doorRect = {
      x: camperVan3.doorX + mapX - buffer,
      y: camperVan3.doorY + mapY - buffer,
      width: camperVan3.doorWidth + buffer * 2,
      height: camperVan3.doorHeight + buffer * 2
    };
  
    return isColliding(playerRect, doorRect);
  }  

  function isNearWelcomeSign() {
    const buffer = 20;
    const playerRect = {
      x: player.x,
      y: player.y,
      width: player.width,
      height: player.height
    };
  
    const signRect = {
      x: welcomeSign.x + mapX - buffer,
      y: welcomeSign.y + mapY - buffer,
      width: welcomeSign.width + buffer * 2,
      height: welcomeSign.height + buffer * 2
    };
  
    return isColliding(playerRect, signRect);
  }  

  function isNearBonfire() {
    const buffer = 20;
    const playerRect = {
      x: player.x,
      y: player.y,
      width: player.width,
      height: player.height
    };
  
    const fireRect = {
        x: bonfireLog.x + mapX - buffer,
        y: bonfireLog.y + mapY - buffer,
        width: bonfireLog.width + buffer * 2,
        height: bonfireLog.height + buffer * 2
      };      
  
    return isColliding(playerRect, fireRect);
  }

  function isNearSummitPost() {
    const buffer = 20;
    const playerRect = { x: player.x, y: player.y, width: player.width, height: player.height };
    const summitRect = {
      x: summitPost.x + mapX - buffer,
      y: summitPost.y + mapY - buffer,
      width: summitPost.width + buffer * 2,
      height: summitPost.height + buffer * 2
    };
    return isColliding(playerRect, summitRect);
  }  

  function openSummitPopup() {
    document.getElementById('summit-popup').style.display = 'block';
  }
  
  function closeSummitPopup() {
    document.getElementById('summit-popup').style.display = 'none';
  }

  function placeFlagAtSummit() {
    const dialogueBox = document.getElementById('dialogue-box');
  
    if (!hasFlag) {
      npcDialogueOpen = true;
      dialogueBox.innerText = "You don't have a flag!";
      dialogueBox.style.display = 'block';
      return;
    }
  
    // Player has a flag – place it
    summitFlagPlaced = true;
    hasFlag = false;
    document.getElementById('flag-display').style.display = 'none';
    document.getElementById('marble-count').innerText = `x ${marbleCount}`;
  
    closeSummitPopup();
  }
  
  function toggleMusic() {
  const bgMusic = document.getElementById('bg-music');
  if (bgMusic.paused) {
    bgMusic.play();
  } else {
    bgMusic.pause();
  }
}
