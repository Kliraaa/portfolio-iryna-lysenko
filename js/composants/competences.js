const radarCanvas = document.getElementById('radarChart');

function drawRadarChart(canvas) {
    const context = canvas.getContext('2d');
    const labels = ['Coding', 'Problem Solving', 'Algorithms', 'Data Structures', 'Knowledge'];
    const values = [90, 85, 80, 75, 95];
    const ratio = window.devicePixelRatio || 1;
    const width = canvas.clientWidth || 420;
    const height = Math.max(280, Math.min(width, 420));
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.31;
    const angleStep = (Math.PI * 2) / labels.length;

    canvas.width = width * ratio;
    canvas.height = height * ratio;
    context.scale(ratio, ratio);
    context.clearRect(0, 0, width, height);
    context.font = '12px BAHNSCHRIFT, sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    const point = (index, scale) => ({
        x: centerX + Math.cos(index * angleStep - Math.PI / 2) * radius * scale,
        y: centerY + Math.sin(index * angleStep - Math.PI / 2) * radius * scale
    });

    context.strokeStyle = '#1a242d';
    context.lineWidth = 1;

    for (let level = 1; level <= 5; level += 1) {
        context.beginPath();
        labels.forEach((label, index) => {
            const position = point(index, level / 5);
            index === 0 ? context.moveTo(position.x, position.y) : context.lineTo(position.x, position.y);
        });
        context.closePath();
        context.stroke();
    }

    labels.forEach((label, index) => {
        const position = point(index, 1);
        context.beginPath();
        context.moveTo(centerX, centerY);
        context.lineTo(position.x, position.y);
        context.stroke();
        context.fillStyle = '#8f9baa';
        context.fillText(label, point(index, 1.18).x, point(index, 1.18).y);
    });

    context.beginPath();
    values.forEach((value, index) => {
        const position = point(index, value / 100);
        index === 0 ? context.moveTo(position.x, position.y) : context.lineTo(position.x, position.y);
    });
    context.closePath();
    context.fillStyle = 'rgba(225, 20, 60, 0.2)';
    context.fill();
    context.strokeStyle = '#e1143c';
    context.lineWidth = 2;
    context.stroke();
}

if (radarCanvas) {
    drawRadarChart(radarCanvas);
    window.addEventListener('resize', () => drawRadarChart(radarCanvas));
}
