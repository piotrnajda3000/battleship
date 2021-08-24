# My problem-solving framework in action

## 1. Understand the problem

Write it down. Write before I do, that is, think before I do. Writing is thinking. Edit for clarity.

If I can't explain the problem to someone in plain English, I don't understand it.

## 2. Plan

In plain English, write out step-by-step what I'm going to do,
before I do it.

## 3. Divide and conquer

Break down my problems in planning into smaller ones.
Solve those, and I'll end up with the solution.

---

I've spent the most time I've ever spent on a coding project so far.
I don't know how long. Perhaps even two, three weeks of work?

For now, I'll take a breather from this project to step on a bit, I'm sure when I come back to this project later, player.js in particular, I'll see it in a new light.

---

FIXME: Make it mobile friendly, and responsive.

---

FIXME: AI improvement idea

Now, when the computer is sure it sank a ship, because if there is either no board around the ship, or there are two missed fields around it, or
the hit ship length is five,
or when...
5 ship is sunk -> 4 hit fields = make restricted area
5 ship is sunk, 4 ship is sunk -> 3 hit fields = make restricted area
5 ship, 4 ship, 3 ship is sunk -> 3 hit fields = make restricted area
5, 4, 3, 3, 2 means a win.

So any of these conditions met means that the computer should not hit the restricted area around a ship...
