/****************************************************************************************
 * Project: Micro:bit Multiplayer Game
 * Description: Core logic and custom extensions for micro:bit multiplayer interaction.
 * 
 * File: backend.ts
 * Contains: Helper functions to aliviate students' work
 * 
 * Author: Sebastian Barillaro
 * Date: 2025-06-01
 * Platform: Microsoft MakeCode for micro:bit
 * 
 * Notes:
 * - Designed for use with MakeCode editor (https://makecode.microbit.org/)
 * - Compatible with MakeCode's TypeScript (pxt) environment
 * 
 * License: Reserved for Luxembourg Tech School ASBL
 ****************************************************************************************/


let lastSendTime = 0
const cooldownTimer = 10 //seconds

// === Helper: Show current status (ID + Score) ===
function showStatus() {
    // Show ID and myScore on the LED display
    basic.showString("ID:" + myID + " S:" + myScore)
}
function startGame() {
    // play starting sound
    music.play(music.builtinPlayableSoundEffect(soundExpression.happy), music.PlaybackMode.InBackground)
    // show the status!
    showStatus()
}

// This function configures the device to end the game
function endGame() {
    // Set the flag gameOver 
    gameOver = true
    // Deactivate any order
    orderActive = false
    //Stop the sound
    music.stopAllSounds()
    // Show the NO icon during 1 second (a visual reference)
    basic.showIcon(IconNames.Ghost)
    basic.pause(1000)
}

function announceOrder(){
    basic.showIcon(IconNames.Surprised)
    
    music._playDefaultBackground(music.builtInPlayableMelody(Melodies.BaDing), music.PlaybackMode.UntilDone)
    // All players get a point for surviving this round
    myScore++
}



function countdown(delyTime: number) {
    for (let i = 0; i <= delyTime - 1; i++) {
        music.playTone(262, 100)
        // basic.showIcon(IconNames.Heart)
        basic.showNumber(delyTime - i)
        basic.pause(400)
        music.playTone(349, 100)
        basic.clearScreen()
        basic.pause(400)
        if (orderActive == false) {
            break;
        }
    }
}


// === Helper: order delivered correctly ===
function deliveryOK() {
    orderActive = false
    myScore += 2
    music.stopAllSounds()
    basic.showIcon(IconNames.Yes)
    basic.pause(1000)
    showStatus()
}

// === Helper: Delivery Fail ===
function deliveryFail() {
    orderActive = false
    myScore = Math.max(0, myScore - 2)
    music.stopAllSounds()
    music.startMelody(["C5", "B", "A", "G", "F", "E", "D", "C"], MelodyOptions.Once)
    basic.showIcon(IconNames.Skull)
    basic.pause(1000)
    showStatus()
}

