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

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw triangle
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.closePath();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw angle arcs and labels
    drawAngleArc(ctx, p1, p2, p3, angles.angle1);
    drawAngleArc(ctx, p2, p1, p3, angles.angle2);
    drawAngleArc(ctx, p3, p1, p2, angles.angle3);

    // Draw angle values inside triangle
    const centroid = {
        x: (p1.x + p2.x + p3.x) / 3,
        y: (p1.y + p2.y + p3.y) / 3
    };

    drawAngleLabel(ctx, p1, centroid, angles.angle1);
    drawAngleLabel(ctx, p2, centroid, angles.angle2);
    drawAngleLabel(ctx, p3, centroid, angles.angle3);

    // Draw points
    drawPoint(ctx, p1, 'P1');
    drawPoint(ctx, p2, 'P2');
    drawPoint(ctx, p3, 'P3');
});

// Draw a small arc at a vertex to mark the angle
function drawAngleArc(ctx, vertex, p1, p2, angle) {
    const arcRadius = 30;
    
    // Calculate start and end angles for the arc
    const startAngle = vectorAngle(vertex, p1);
    const endAngle = vectorAngle(vertex, p2);

    ctx.beginPath();
    ctx.arc(vertex.x, vertex.y, arcRadius, startAngle, endAngle);
    ctx.strokeStyle = '#4CAF50';
    ctx.lineWidth = 1.5;
    ctx.stroke();
}

// Draw angle value label
function drawAngleLabel(ctx, vertex, centroid, angle) {
    // Position label between vertex and centroid
    const labelX = vertex.x + (centroid.x - vertex.x) * 0.4;
    const labelY = vertex.y + (centroid.y - vertex.y) * 0.4;

    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = '#4CAF50';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(angle.toFixed(1) + '°', labelX, labelY);
}

// Draw a point with label
function drawPoint(ctx, point, label) {
    // Draw circle
    ctx.beginPath();
    ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = '#f44336';
    ctx.fill();

    // Draw label
    ctx.font = '14px Arial';
    ctx.fillStyle = '#333';
    ctx.textAlign = 'center';
    ctx.fillText(label, point.x, point.y - 15);
}
