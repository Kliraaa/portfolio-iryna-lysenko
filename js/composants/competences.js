const radarCanvas = document.getElementById('radarChart');

const radarLabels = ['Coding', 'Problem Solving', 'Algorithms', 'Data Structures', 'Knowledge'];
const radarValues = [90, 85, 80, 75, 95];
let radarState = {
    width: 0,
    height: 0,
    points: [],
    labelPoints: [],
    hoveredIndex: -1,
    hoverScales: [],
    hoverAnimationFrame: null,
    progress: 1
};

function drawRadarChart(canvas, progress = radarState.progress) {
    const context = canvas.getContext('2d');
    const ratio = window.devicePixelRatio || 1;
    const containerWidth = canvas.parentElement ? canvas.parentElement.clientWidth : 420;
    const width = Math.min(containerWidth || 420, 420);
    const height = Math.max(280, Math.min(width, 420));
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.31;
    const angleStep = (Math.PI * 2) / radarLabels.length;
    const point = (index, scale) => ({
        x: centerX + Math.cos(index * angleStep - Math.PI / 2) * radius * scale,
        y: centerY + Math.sin(index * angleStep - Math.PI / 2) * radius * scale
    });

    canvas.width = width * ratio;
    canvas.height = height * ratio;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, width, height);
    context.lineJoin = 'round';
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    radarState.width = width;
    radarState.height = height;
    radarState.points = radarValues.map((value, index) => point(index, value / 100));
    radarState.labelPoints = radarLabels.map((label, index) => point(index, 1.18));
    radarState.hoverScales = radarLabels.map((label, index) => radarState.hoverScales[index] || 0);
    radarState.progress = progress;

    context.strokeStyle = '#1a242d';
    context.lineWidth = 1;

    for (let level = 1; level <= 5; level += 1) {
        context.beginPath();
        radarLabels.forEach((label, index) => {
            const position = point(index, level / 5);
            index === 0 ? context.moveTo(position.x, position.y) : context.lineTo(position.x, position.y);
        });
        context.closePath();
        context.stroke();
    }

    radarLabels.forEach((label, index) => {
        const position = point(index, 1);
        context.beginPath();
        context.moveTo(centerX, centerY);
        context.lineTo(position.x, position.y);
        context.stroke();
    });

    const completedSegments = Math.floor(progress * radarLabels.length);
    const segmentProgress = progress * radarLabels.length - completedSegments;
    const animatedPoints = radarState.points.slice(0, completedSegments + 1);

    if (completedSegments < radarLabels.length && radarState.points[completedSegments]) {
        const startPoint = radarState.points[completedSegments];
        const endPoint = radarState.points[(completedSegments + 1) % radarLabels.length];

        if (endPoint) {
            animatedPoints.push({
                x: startPoint.x + (endPoint.x - startPoint.x) * segmentProgress,
                y: startPoint.y + (endPoint.y - startPoint.y) * segmentProgress
            });
        }
    }

    if (animatedPoints.length) {
        context.beginPath();
        animatedPoints.forEach((position, index) => {
            index === 0 ? context.moveTo(position.x, position.y) : context.lineTo(position.x, position.y);
        });
        context.strokeStyle = '#e1143c';
        context.lineWidth = 3;
        context.shadowColor = 'rgba(225, 20, 60, 0.7)';
        context.shadowBlur = 8;
        context.stroke();
        context.shadowBlur = 0;
    }

    if (progress >= 1) {
        context.beginPath();
        radarState.points.forEach((position, index) => {
            index === 0 ? context.moveTo(position.x, position.y) : context.lineTo(position.x, position.y);
        });
        context.closePath();
        context.fillStyle = 'rgba(225, 20, 60, 0.2)';
        context.fill();
        context.strokeStyle = '#e1143c';
        context.lineWidth = 3;
        context.shadowColor = 'rgba(225, 20, 60, 0.7)';
        context.shadowBlur = 8;
        context.stroke();
        context.shadowBlur = 0;
    }

    radarLabels.forEach((label, index) => {
        const hoverScale = radarState.hoverScales[index];
        const labelPosition = radarState.labelPoints[index];
        context.fillStyle = hoverScale > 0.01 ? '#f3faff' : '#8f9baa';
        context.font = `${hoverScale > 0.5 ? 'bold ' : ''}${12 + (3 * hoverScale)}px BAHNSCHRIFT, sans-serif`;
        context.shadowColor = hoverScale > 0.01 ? '#e1143c' : 'transparent';
        context.shadowBlur = 12 * hoverScale;
        context.fillText(label, labelPosition.x, labelPosition.y);
        context.shadowBlur = 0;
    });

    radarState.points.forEach((position, index) => {
        const isVisible = progress >= index / radarLabels.length;
        if (!isVisible) {
            return;
        }

        const hoverScale = radarState.hoverScales[index];
        context.beginPath();
        context.arc(position.x, position.y, 5 + (3 * hoverScale), 0, Math.PI * 2);
        context.fillStyle = '#e1143c';
        context.strokeStyle = '#a01735';
        context.lineWidth = 2 + hoverScale;
        context.shadowColor = '#e1143c';
        context.shadowBlur = 10 + (10 * hoverScale);
        context.fill();
        context.stroke();
        context.shadowBlur = 0;
    });
}

function animateHoverTransition() {
    if (radarState.hoverAnimationFrame !== null) {
        window.cancelAnimationFrame(radarState.hoverAnimationFrame);
    }

    const startScales = radarState.hoverScales.slice();
    const targetScales = radarLabels.map((label, index) => (
        index === radarState.hoveredIndex ? 1 : 0
    ));
    const startTime = performance.now();
    const duration = 220;

    function frame(timestamp) {
        const linearProgress = Math.min((timestamp - startTime) / duration, 1);
        const easedProgress = 1 - Math.pow(1 - linearProgress, 3);
        radarState.hoverScales = startScales.map((scale, index) => (
            scale + ((targetScales[index] - scale) * easedProgress)
        ));
        drawRadarChart(radarCanvas);

        if (linearProgress < 1) {
            radarState.hoverAnimationFrame = window.requestAnimationFrame(frame);
        } else {
            radarState.hoverAnimationFrame = null;
        }
    }

    radarState.hoverAnimationFrame = window.requestAnimationFrame(frame);
}

function findHoveredIndex(event) {
    const bounds = radarCanvas.getBoundingClientRect();
    const scaleX = radarState.width / bounds.width;
    const scaleY = radarState.height / bounds.height;
    const pointer = {
        x: (event.clientX - bounds.left) * scaleX,
        y: (event.clientY - bounds.top) * scaleY
    };
    const hitRadius = 24;
    const pointIndex = radarState.points.findIndex((point) => Math.hypot(point.x - pointer.x, point.y - pointer.y) <= hitRadius);

    if (pointIndex !== -1) {
        return pointIndex;
    }

    return radarState.labelPoints.findIndex((point) => Math.hypot(point.x - pointer.x, point.y - pointer.y) <= 42);
}

function animateRadarChart() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = prefersReducedMotion ? 0 : 1400;
    const start = performance.now();

    function frame(timestamp) {
        const progress = duration === 0 ? 1 : Math.min((timestamp - start) / duration, 1);
        drawRadarChart(radarCanvas, progress);
        if (progress < 1) {
            window.requestAnimationFrame(frame);
        }
    }

    window.requestAnimationFrame(frame);
}

if (radarCanvas) {
    radarCanvas.setAttribute('aria-label', 'Diagramme radar des compétences');
    radarCanvas.addEventListener('pointermove', (event) => {
        const hoveredIndex = findHoveredIndex(event);
        if (hoveredIndex !== radarState.hoveredIndex) {
            radarState.hoveredIndex = hoveredIndex;
            animateHoverTransition();
        }
    });
    radarCanvas.addEventListener('pointerleave', () => {
        radarState.hoveredIndex = -1;
        animateHoverTransition();
    });
    window.addEventListener('resize', () => {
        drawRadarChart(radarCanvas);
    });
    animateRadarChart();
}

