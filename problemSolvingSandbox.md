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

---

Anyway, it doesn't really seem to matter which way I extend the objects, unless I care about overwriting properties.

Before, I used a closure. Now these properties are public on the gameboard object.

I don't like that.

---

Now, when the computer is sure it sank a ship, because if there is either no board around the ship, or there are two missed fields around it, or
the hit ship length is five,
or when...
5 ship is sunk -> 4 hit fields = make restricted area
5 ship is sunk, 4 ship is sunk -> 3 hit fields = make restricted area
5 ship, 4 ship, 3 ship is sunk -> 3 hit fields = make restricted area
5, 4, 3, 3, 2 means a win.

So any of these conditions met means that the computer should not hit the restricted area around a ship...

First. Let's clean up my code.
