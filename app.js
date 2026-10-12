var app = angular.module("studyApp", []);

app.controller("MainController", function($scope, $timeout) {

    $scope.subjects = JSON.parse(localStorage.getItem("subjects")) || [];

    $scope.addSubject = function() {
        const sub = $scope.newSubject;
        if (!sub || !sub.name) return;

        let hours;
        if (sub.difficulty === "hard") hours = Math.ceil(sub.days / 2);
        else if (sub.difficulty === "medium") hours = Math.ceil(sub.days / 3);
        else hours = Math.ceil(sub.days / 4);

        $scope.subjects.push({
            name: sub.name,
            days: sub.days,
            difficulty: sub.difficulty,
            hours: hours,
            progress: 0
        });

        $scope.newSubject = {};
        saveData();
        updateChart();
    };

    $scope.markDone = function(sub) {
        sub.progress += 10;
        if (sub.progress > 100) sub.progress = 100;

        saveData();
        updateChart();
    };
    $scope.deleteSubject = function(index) {
    $scope.subjects.splice(index, 1);
    saveData();
    updateChart();
    };

    $scope.deleteSubject = function(index) {
    if (confirm("Are you sure you want to delete?")) {
        $scope.subjects.splice(index, 1);
        saveData();
        updateChart();
    }
    };



    $scope.generatePlan = function() {
        $scope.plan = [];

        $scope.subjects.forEach(sub => {
            let suggestion = sub.progress < 50 
                ? "Focus more ⚡" 
                : "Revision mode 📘";

            $scope.plan.push(
                `${sub.name}: ${sub.hours} hrs/day → ${suggestion}`
            );
        });
    };

    function saveData() {
        localStorage.setItem("subjects", JSON.stringify($scope.subjects));
    }

    // GRAPH
    let chart;

    function updateChart() {
        $timeout(() => {
            const ctx = document.getElementById("chart");

            if (!ctx) return;

            const labels = $scope.subjects.map(s => s.name);
            const data = $scope.subjects.map(s => s.progress);

            if (chart) chart.destroy();

            chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Progress %',
                        data: data
                    }]
                }
            });
        }, 200);
    }

    updateChart();

});