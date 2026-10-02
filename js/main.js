let ctx = document.getElementById('radarChart').getContext('2d');
let myRadarChart = new Chart(ctx, {
type: 'radar',
data: {
    labels: ['Coding', 'Problem Solving', 'Algorithms', 'Data Structures', 'GeeksforGeeks Knowledge'],
    datasets: [{
        label: 'GeeksforGeeks Skills',
        data: [90, 85, 80, 75, 95],
        backgroundColor: 'rgba(160, 23, 53, 0.2)',
        borderColor: 'rgba(225, 20, 60, 1)',
        borderWidth: 2,
        }]
        },
options: {
scale: {
pointLabels: {
fontSize: 14,
}
}
}
});