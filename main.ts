/****************************************************************************************
 * Project: Micro:bit Multiplayer Game
 * Description: Core logic and custom extensions for micro:bit multiplayer interaction.
 * 
 * File: main.ts
 * Contains: Main logic. Task 1
 * 
 * Author: Sebastian Barillaro
 * Date: 2025-06-10
 * Platform: Microsoft MakeCode for micro:bit
 * 
 * Notes:
 * - Designed for use with MakeCode editor (https://makecode.microbit.org/)
 * - Compatible with MakeCode's TypeScript (pxt) environment
 * 
 * License: Reserved for Luxembourg Tech School ASBL
 ****************************************************************************************/


// === Constants ===
const defaultDeliveryTime = 6  // seconds
const defaultRadioGroup = 10
const mGameOver = "gameOver"

// === Flag Variables ===
let orderActive = false // false = order not active ; true = order activated!
let gameOver = false // false = game is NOT over (playing) ; true = the game is over.

// === Support Variables ===
let deliveryDoor = ""
let deliveryTime = defaultDeliveryTime;
let myScore = 0

// === Configuration variables ===
// =======================================
// ========= Task: 
// =======================================
// TODO: Set printMessage to false to stop showing the message on the LED display
// print radio Message
let printMessage = true;

// Set the number of players!
let players = 10;
// Set your ID (Might be unique in your group)
let myID = randint(1, players); // Change the random value for something fix
// Set the difficulty of the game: "easy", (more to come later)
let difficulty = "easy";
// Set the ringbell options list
let ringbellPanel = ["A", "B", "0", "1", "2"]


// =======================================
// ========= Task 1:
// =======================================
// Configure the radio Group
// TODO: radio.setGroup(use the radioGroup here)
    radio.setGroup(defaultRadioGroup)

// start the game!
// TODO: Call the startGame function
    startGame();

// === Receive Radio Message ===
// This function executes when the device receives a radio message.
radio.onReceivedString(radioMessageReceived)

// === handler of the reception ===
function radioMessageReceived(message: string) {
    // Adding some music notification when you receive a message
    music.playTone(262, 100)
    music.playTone(362, 100)
    music.playTone(462, 100)

    // You have received a radio message. We will print it on the display
    if (printMessage == true){
        basic.showString(message);
    }

    // If the game is over, we do nothing (return)
    if (gameOver == true) {
        // Show the NO icon during 1 second (a visual reference)
        basic.showIcon(IconNames.Ghost)
        basic.pause(1000)
        return // This return instruction ends the function. 
               // It continues where it was called from
    }

    // The game is not over. Let's see what we have received
// =======================================
// ========= Task: 2
// =======================================
// TODO: check if the message received is equal to "gameOver"
   if (message == "gameOver") {
        // The message received indicates to end the game
        endGame()
        // return makes the function end
        return;
    }

    // The header of the message indicates what type of message is
    // Let's extract the header of the message
    let header = message.substr(0, 5) // this line extracts the first 5 letters
// =======================================
// ========= Task: 3
// =======================================
// TODO: Check if the header of the message is "order"
    if (header == "order") {
        // The message is of type order!
        // Just a visual representation
        announceOrder();
        // Decode the message to obtain the information
        let messageInfo = decode(message);
        //Process the order message information!
        processOrderMessage(messageInfo)
    }
}

function decode(message:string){
    // The message received has four parts: order, Courier ID, ring bell, and delivery time.
    // All the parts are together, separated by a :
    // For example order:5:B:6
    // We store the fields in variables starting with m (m for message)
    let mType = "";
    let mCourierId = 0;
    let mDeliveryDoor = "";
    let mDeliveryTime = 0;
    let mParts = [];
    // =======================================
    // ========= Task: 4
    // =======================================
    //TODO: split the message by the separator :
    //      take the message parts (0, 1, 2, and 3) in separated 
    //      variables (mType, mCourierId, mDeliveryDoor, mDeliveryTime)
    // We need to split the parts by the separator
    mParts = message.split(":")
    mType = mParts[0];
    mCourierId = parseInt(mParts[1]);
    mDeliveryDoor = mParts[2];
    mDeliveryTime = parseInt(mParts[3]);

    // Return a structure with all the message information
    return {
        type: mType,
        courierId: mCourierId,
        deliveryDoor: mDeliveryDoor,
        deliveryTime: mDeliveryTime
    };
}

function processOrderMessage(messageInfo:any) {
    // messageInfo has all the information of the message
    // Use the information to decide what to do next

    //DEBUG uncomment the next line to catch all the orders
    // myID = messageInfo.courierID;
    
    // Check if the order was sent to me :-O
    if (messageInfo.courierId == myID) {
        // Caramba!! The order is for me!!!
        // mark the flag order active!
        orderActive = true
        // save the message info into the micro:bit memory
        deliveryDoor = messageInfo.deliveryDoor
        deliveryTime = messageInfo.deliveryTime

        // Show the door to deliver the order on the LED display
        basic.showString("Door:" + deliveryDoor)

        // Start the countdown during "deliveryTime" seconds
        countdown(deliveryTime)

        // The countdown function ended.
        // was the order delivered?  
        // Check if you delivered the pizza (or not) 
        if (orderActive == true){
            // The order remains pending. I am very sorry for you >:-D
            deliveryFail() // booom!!!
        }
    } else { // This ELSE comes from above if (messageInfo.CourierId == myID)
        // The order is not for me (fiuuuuu)
        basic.pause(1000)
        // Show I add a point
        basic.showString("+1")
    }
}

// === Inputs handlers ===
// This function executes when the button A is pressed
input.onButtonPressed(Button.AB, function () {
    // call the showStatus function
    showStatus();
    // pressing AB disable the printing message on screen
    printMessage = false;
})

// This function executes when the button A is pressed
input.onButtonPressed(Button.A, function () {
    // deliver the order to door "A"
    deliverTo("A"); // Use "A", not A
})

// This function executes when the button B is pressed
input.onButtonPressed(Button.B, function () {
    // deliver the order to door "B".
    deliverTo("B"); // Use "B", not B
})

// This function executes when the pin 0 is closed
input.onPinPressed(TouchPin.P0, function () {
    // deliver the order to door "0"
    deliverTo("0");
})

// This function executes when the pin 1 is closed
input.onPinPressed(TouchPin.P1, function () {
    // deliver the order to door "1"
    deliverTo("1");
})

// This function executes when the pin 2 is closed
input.onPinPressed(TouchPin.P2, function () {
    // deliver the order to door "2"
    deliverTo("2");
})


// === Helper: Handle Delivery Attempt ===
function deliverTo(ringPressed: string) {
    // Check if the game is over.
    if (gameOver == true) 
    { // If the game is over, there is nothing to do
        return // end of function
    }

    // NOTE: If you are reading this after the if gameOver validation, it means that
    //       the game is not over. We keep delivering the order!
    // The game is not over. Check if the order is active
    if (orderActive == true) {
        // The order is active! 
        // Check if delivered correctly. Door must equal ringbell
        if (deliveryDoor == ringPressed){
            // order delivered correctly. Well done!
            deliveryOK()
        } else {
            // order is not delivered ok. I am very sorry for you :-p
            deliveryFail()
        }
    }
}

// === Logo pressed: Create a pizza order ===
input.onLogoEvent(TouchButtonEvent.Pressed, createOrder)

function createOrder() {
    // Not create order if there is another order active already
    if (orderActive == true) return;
    // Not create order if the game is over already
    if (gameOver == true) return;
    const now = control.millis()
    if (now - lastSendTime > cooldownTimer * 1000) {
        lastSendTime = now
// =======================================
// ========= Task: 7
// =======================================
        let message = ""
        // TODO: use encodeInfo funtion to create a message
        // message = encodeInfo();
        // TODO: use sendMessage function to send the message
        // sendMessage(message);
    } else {
        basic.showIcon(IconNames.Chessboard)
        basic.pause(200)
    }
}


// === Helper: prepare Order ===
function encodeInfo():string {
// We need to prepare the order message before sending it.
    // The message is comprised of several parts separated by a :
    // Consider the following example
    // - Type of message = order
    // - courierID = 12
    // - door = B
    // - DeliveryTime = 5 seconds
    // Combining all the data,
    // you can CODIFY a message as order:12:B:5
    
// Let's start by creating our variables. The m in the name says is for messaging
    let mType = "order"
    let mCourierID;        // the courier destination
    let mDoor;             // the door to deliver the order
    let mDeliveryTime         // the time left to deliver the order
    let mSeparator = ":"  // a separator, to not mix the data
    let message: string   // The message with the full order

// Choose a courier to send the order
    do { // Choose a random courier ID
        mCourierID = randint(1, players)
    } while (mCourierID == myID); // This checks that you don't send the order to yourself

// Choose a random door
    // We choose a random option from all the ringbellPanel chances
    let ringbellOption = randint(0, ringbellPanel.length - 1)
    // we use the option to choose from the ringbell panel
    mDoor = ringbellPanel[ringbellOption]

// Choose a delivery time
    // Use the default delivery time
    mDeliveryTime = defaultDeliveryTime

// Show the targetID on screen (and play some sound)   
    basic.showString("To:" + mCourierID)
    music.play(music.builtinPlayableSoundEffect(soundExpression.hello), music.PlaybackMode.InBackground)

// Encode the information to create a message
// =======================================
// ========= Task: 5
// =======================================
    // TODO: concatenate the parts of information (mType, mCourierID, mDoor, mDeliveryTime)
    //       into a message.
    //       Intercalate ":" in between as a separator
    message = ""

    // return the message
    // The message order is ready! return the message
    return message;
}

function sendMessage(message: string){
    // send the message by radio!
    music.play(music.builtinPlayableSoundEffect(soundExpression.hello), music.PlaybackMode.UntilDone)
// =======================================
// ========= Task: 6
// =======================================
    // TODO: use the radio.sendString function to send the message by radio
    radio.sendString("")
}

