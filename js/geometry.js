// Geometry calculations

// Calculate distance between two points
function distance(p1, p2) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
}

// Calculate angle at a vertex given three points
// Returns angle in degrees
function calculateAngle(vertex, p1, p2) {
    // Vectors from vertex to the other two points
    const v1 = { x: p1.x - vertex.x, y: p1.y - vertex.y };
    const v2 = { x: p2.x - vertex.x, y: p2.y - vertex.y };

    // Calculate dot product
    const dot = v1.x * v2.x + v1.y * v2.y;

    // Calculate magnitudes
    const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
    const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);

    // Calculate angle in radians then convert to degrees
    const angleRad = Math.acos(dot / (mag1 * mag2));
    return angleRad * (180 / Math.PI);
}

// Calculate all three angles of a triangle
function calculateTriangleAngles(p1, p2, p3) {
    return {
        angle1: calculateAngle(p1, p2, p3),
        angle2: calculateAngle(p2, p1, p3),
        angle3: calculateAngle(p3, p1, p2)
    };
}

// Calculate the angle (in radians) of a vector from vertex to point
function vectorAngle(vertex, point) {
    return Math.atan2(point.y - vertex.y, point.x - vertex.x);
}
