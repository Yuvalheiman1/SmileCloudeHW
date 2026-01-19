// Canvas rendering logic

document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('triangleCanvas');
    const ctx = canvas.getContext('2d');

    // Retrieve points from localStorage
    const pointsData = localStorage.getItem('trianglePoints');
    
    if (!pointsData) {
        ctx.font = '20px Arial';
        ctx.fillText('No triangle data found. Please go back and enter points.', 100, 400);
        return;
    }

    const points = JSON.parse(pointsData);
    const p1 = points.p1;
    const p2 = points.p2;
    const p3 = points.p3;

    // Calculate angles
    const angles = calculateTriangleAngles(p1, p2, p3);

    // Transform state for zoom and pan
    let scale = 1;
    let offsetX = 0;
    let offsetY = 0;
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;

    // Ruler elements
    const rulerX = document.getElementById('rulerX');
    const rulerY = document.getElementById('rulerY');

    // Make transform state accessible to updateRulers
    window.getCurrentTransform = function() {
        return { scale, offsetX, offsetY };
    };

    // Draw everything
    function draw() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Save context state
        ctx.save();

        // Apply transformations
        ctx.translate(offsetX, offsetY);
        ctx.scale(scale, scale);

        // Draw triangle
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.closePath();
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2 / scale;
        ctx.stroke();

        // Draw angle arcs and labels
        drawAngleArc(ctx, p1, p2, p3, angles.angle1, scale);
        drawAngleArc(ctx, p2, p1, p3, angles.angle2, scale);
        drawAngleArc(ctx, p3, p1, p2, angles.angle3, scale);

        // Draw angle values inside triangle
        const centroid = {
            x: (p1.x + p2.x + p3.x) / 3,
            y: (p1.y + p2.y + p3.y) / 3
        };

        drawAngleLabel(ctx, p1, centroid, angles.angle1, scale);
        drawAngleLabel(ctx, p2, centroid, angles.angle2, scale);
        drawAngleLabel(ctx, p3, centroid, angles.angle3, scale);

        // Draw points
        drawPoint(ctx, p1, 'P1', scale);
        drawPoint(ctx, p2, 'P2', scale);
        drawPoint(ctx, p3, 'P3', scale);

        // Restore context state
        ctx.restore();

        // Update rulers
        updateRulers();
    }

    // Mouse wheel zoom
    canvas.addEventListener('wheel', function(e) {
        e.preventDefault();

        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Zoom factor
        const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
        const newScale = scale * zoomFactor;

        // Limit zoom range
        if (newScale >= 0.5 && newScale <= 5) {
            // Adjust offset to zoom toward mouse position
            offsetX = mouseX - (mouseX - offsetX) * zoomFactor;
            offsetY = mouseY - (mouseY - offsetY) * zoomFactor;
            scale = newScale;
            draw();
        }
    });

    // Mouse drag to pan
    canvas.addEventListener('mousedown', function(e) {
        isDragging = true;
        dragStartX = e.clientX - offsetX;
        dragStartY = e.clientY - offsetY;
    });

    canvas.addEventListener('mousemove', function(e) {
        if (isDragging) {
            offsetX = e.clientX - dragStartX;
            offsetY = e.clientY - dragStartY;
            draw();
        }
    });

    canvas.addEventListener('mouseup', function() {
        isDragging = false;
    });

    canvas.addEventListener('mouseleave', function() {
        isDragging = false;
    });

    // Zoom buttons
    document.getElementById('zoomInBtn').addEventListener('click', function() {
        if (scale < 5) {
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            offsetX = centerX - (centerX - offsetX) * 1.2;
            offsetY = centerY - (centerY - offsetY) * 1.2;
            scale *= 1.2;
            draw();
        }
    });

    document.getElementById('zoomOutBtn').addEventListener('click', function() {
        if (scale > 0.5) {
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            offsetX = centerX - (centerX - offsetX) / 1.2;
            offsetY = centerY - (centerY - offsetY) / 1.2;
            scale /= 1.2;
            draw();
        }
    });

    document.getElementById('resetBtn').addEventListener('click', function() {
        scale = 1;
        offsetX = 0;
        offsetY = 0;
        draw();
    });

    // Initial draw
    draw();
});

// Update ruler displays based on current view
function updateRulers() {
    const rulerX = document.getElementById('rulerX');
    const rulerY = document.getElementById('rulerY');
    const canvas = document.getElementById('triangleCanvas');
    
    if (!rulerX || !rulerY) return;

    // Get current transform from the global function
    const currentTransform = getCurrentTransform();
    const scale = currentTransform.scale;
    const offsetX = currentTransform.offsetX;
    const offsetY = currentTransform.offsetY;

    // Clear rulers
    rulerX.innerHTML = '';
    rulerY.innerHTML = '';

    // Calculate visible coordinate range
    const minX = -offsetX / scale;
    const maxX = (canvas.width - offsetX) / scale;
    const minY = -offsetY / scale;
    const maxY = (canvas.height - offsetY) / scale;

    // Determine tick interval based on zoom
    let tickInterval = 100;
    if (scale > 2) tickInterval = 50;
    if (scale > 4) tickInterval = 25;
    if (scale < 0.5) tickInterval = 200;

    // Draw X-axis ruler marks
    const startX = Math.floor(minX / tickInterval) * tickInterval;
    for (let x = startX; x <= maxX; x += tickInterval) {
        if (x < 0 || x > 800) continue;
        
        const pixelX = x * scale + offsetX;
        
        // Tick mark
        const tick = document.createElement('div');
        tick.className = 'ruler-tick';
        tick.style.left = pixelX + 'px';
        tick.style.top = '25px';
        tick.style.width = '1px';
        tick.style.height = '5px';
        rulerX.appendChild(tick);
        
        // Label
        const label = document.createElement('div');
        label.className = 'ruler-mark';
        label.style.left = pixelX + 'px';
        label.style.top = '5px';
        label.style.transform = 'translateX(-50%)';
        label.textContent = Math.round(x);
        rulerX.appendChild(label);
    }

    // Draw Y-axis ruler marks
    const startY = Math.floor(minY / tickInterval) * tickInterval;
    for (let y = startY; y <= maxY; y += tickInterval) {
        if (y < 0 || y > 800) continue;
        
        const pixelY = y * scale + offsetY;
        
        // Tick mark
        const tick = document.createElement('div');
        tick.className = 'ruler-tick';
        tick.style.left = '35px';
        tick.style.top = pixelY + 'px';
        tick.style.width = '5px';
        tick.style.height = '1px';
        rulerY.appendChild(tick);
        
        // Label
        const label = document.createElement('div');
        label.className = 'ruler-mark';
        label.style.left = '5px';
        label.style.top = pixelY + 'px';
        label.style.transform = 'translateY(-50%)';
        label.textContent = Math.round(y);
        rulerY.appendChild(label);
    }
}

// Draw a small arc at a vertex to mark the angle
function drawAngleArc(ctx, vertex, p1, p2, angle, scale) {
    const arcRadius = 120;
    
    // Calculate start and end angles for the arc
    let startAngle = vectorAngle(vertex, p1);
    let endAngle = vectorAngle(vertex, p2);

    // Normalize angles to ensure we draw the interior angle
    let angleDiff = endAngle - startAngle;
    
    // Adjust to always use the smaller angle (interior angle)
    if (angleDiff > Math.PI) {
        startAngle += 2 * Math.PI;
    } else if (angleDiff < -Math.PI) {
        endAngle += 2 * Math.PI;
    }
    
    // If the angle difference is still going the wrong way, swap
    if (endAngle < startAngle) {
        [startAngle, endAngle] = [endAngle, startAngle];
    }

    ctx.beginPath();
    ctx.arc(vertex.x, vertex.y, arcRadius, startAngle, endAngle);
    ctx.strokeStyle = '#4CAF50';
    ctx.lineWidth = 1.5 / scale;
    ctx.stroke();
}

// Draw angle value label
function drawAngleLabel(ctx, vertex, centroid, angle, scale) {
    const arcRadius = 120;
    const scaledArcRadius = arcRadius * scale;
    
    // If arc is too small (heavily zoomed out), place label outside triangle
    if (scaledArcRadius < 40) {
        // Position outside the triangle, away from centroid
        const labelX = vertex.x - (centroid.x - vertex.x) * 0.15;
        const labelY = vertex.y - (centroid.y - vertex.y) * 0.15;
        
        ctx.font = `bold ${12 / scale}px Arial`;
        ctx.fillStyle = '#4CAF50';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(angle.toFixed(1) + '°', labelX, labelY);
    } else {
        // Position inside the arc, closer to the vertex
        const labelX = vertex.x + (centroid.x - vertex.x) * 0.15;
        const labelY = vertex.y + (centroid.y - vertex.y) * 0.15;
        
        ctx.font = `bold ${14 / scale}px Arial`;
        ctx.fillStyle = '#4CAF50';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(angle.toFixed(1) + '°', labelX, labelY);
    }
}

// Draw a point with label
function drawPoint(ctx, point, label, scale) {
    // Draw circle
    ctx.beginPath();
    ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = '#f44336';
    ctx.fill();

    // Draw label
    ctx.font = `${14 / scale}px Arial`;
    ctx.fillStyle = '#333';
    ctx.textAlign = 'center';
    ctx.fillText(label, point.x, point.y - 15);
}
