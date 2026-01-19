# Triangle Angle Display

A simple web application that visualizes a triangle based on user-defined points and displays the angles at each vertex.

## Overview

This project allows users to:
1. Enter three 2D points (x, y coordinates)
2. View a triangle drawn on a canvas with marked angles
3. See the numeric angle values displayed inside the triangle

## Technical Requirements

- Pure HTML, CSS, and Vanilla JavaScript
- Canvas size: 800x800 pixels

## File Structure

```
/index.html        - Input page for entering three points
/display.html      - Canvas page for displaying the triangle
/css/style.css     - Styling for both pages
/js/input.js       - Handle input page logic
/js/display.js     - Handle canvas rendering
/js/geometry.js    - Mathematical calculations for angles
/README.md         - Project documentation
```

## How to Run

1. Open index.html in a web browser
2. Enter coordinates for three points
3. Submit to view the triangle on the display page

## Notes

- No input validation is implemented
- Assumes valid numeric inputs
- Clean, readable code structure
