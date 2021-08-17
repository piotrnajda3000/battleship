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
