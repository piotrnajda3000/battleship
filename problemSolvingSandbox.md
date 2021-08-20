# My problem-solving framework in action

## 1. Understand the problem

**Write it down. Write before I do.**

If I can't explain the problem to someone in plain English, I don't understand it.

## 2. Plan

In plain English, write out step-by-step what I'm going to do.

## 3. Divide and conquer

Break down my problems in planning into smaller ones.
Solve those, and I'll end up with the solution.

---

1. Render the restricted area during `renderPlayerBoard` called with the `click & drop ability event`

Try to make it as simple and therefore as beautiful as possible. So that it's independent of much other code.

Well, I can't place a ship within one square of another ship. That's the steadfast rule.

So corners sort of have a weird behaviour...

To put it simply, there can't be another ship in that restricted area. period.

---

I'm differentiating between render and hover data.
And in doing so, i automatically fixed the issue that i had, lol.

I need to update things for display.

---

So the issue is that I need to dynamically get each ship's `shipID` on each board re-render.

To do that, I need to create a `getShipID` function in the `gameboard` module.

`shipID` is not fixed, and that might become a problem later.

Anyway, now I can grab all squares of an individual ship on the DOM board.
Not sure what I'll use that for yet. Got to get creative, and comfortable with this.

After all, if a solution requires new ways of thinking, the diffuse mode of thinking might help with that.

---

Should I take a step back and look at it from a higher perspective, like looking at the earth from above?

---

One of the biggest challenges seems to be tying the application logic to the DOM.

---

It's time to clean up my code. All of it. From first principles, basically.

---

I have to implement start the game button now.
So, player is unable to click and drop ships anymore, when I press start game
Computer board appears and attacks the user.

---

I'll just give the player a visual cue for now as to where he grabbed the shippo.

---

The thing that perhaps stinks right now is that,
I'm not sure if
Am I not thinking generally enough?
Is the way I'm rendering my ships too simplistic?
Should I include another parameter that would greatly help me with hover behaviour?
For example, I'd love to get all the coordinates in a single array, where there are ships.
But that's not enough, not exactly.

Okay, I need to step through, step-by-step through my code and see whether I got too specific at a certain point, and I could solve some problems with a more general approach.

I want to be able to say, "place a ship there", I want to be declarative.

I will have to get the render offset and where I grabbed the ship. That's part of the DOM.

So the question that I have is, where should I implement that behaviour, that doesn't allow me to place a ship, if there's a ship already there? Should I do it in the DOM module, or the gameboard module?

I got it working, but it's wonky.

What's wonky about it is

---

Implement functionality that disallows me to place a ship on the board if there's another ship there.

---

The current problem that is happening is that while moving around my ships, a ship can eat another ship.
Make it unable to place a ship in a radius of one from another ship.

Look for the simplest solution. Most elegant solution. Anyway...

When placing a ship on the gameboard, I could "wrap it in a box" with a special value like "cantPlaceHere"

But let's start simpler before that.

What's my mechanism in place for ships not overlapping?

---

Rendering the ship on the board is incomplete, because I'm not taking into the account the square I grab it by. Certainly seems doable, though.

See the position in the hitmap that I'm at, and then **offset the render by the ship -(length - position)**.
So for example, I'm grabbing it by second square, the length is three.
I need to offset it by -1.

---

It just eats away the ship that's on the board.

---

I've had an idea about mouseleave before. It seems more appropriate and descriptive, and potentially could give me less problems and less code...

---

So now, if I'm hovering over the same square as before, uhh....

---

Will I need a mouseleave event or something? Could be useful.

---

I can hover the ships over, but I want to be able to click to drop them.

mouseover vs mouseenter vs mouseleave...