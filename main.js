document.addEventListener('DOMContentLoaded', () => {
    fetchWorkouts();
});

function fetchWorkouts() {
    fetch('http://localhost:3000/workouts')
        .then(response => response.json())
        .then(workouts => {
            const workoutsList = document.getElementById('workouts-list');
            workouts.forEach(workout => {
                const li = document.createElement('li');
                li.textContent = workout.groupName;
                const exercisesList = document.createElement('ul');
                fetchExercises(workout.exercises, exercisesList);
                li.appendChild(exercisesList);
                workoutsList.appendChild(li);
            });
        });
}

function fetchExercises(exerciseIds, exercisesList) {
    fetch('http://localhost:3000/exercises')
        .then(response => response.json())
        .then(exercises => {
            exercises.filter(exercise => exerciseIds.includes(exercise.id))
                .forEach(exercise => {
                    const li = document.createElement('li');
                    li.textContent = `${exercise.name} (${exercise.muscleGroup})`;
                    const historyList = document.createElement('div');
                    fetchExerciseHistory(exercise.id, historyList);
                    li.appendChild(historyList);
                    exercisesList.appendChild(li);
                });
        });
}

function fetchExerciseHistory(exerciseId, historyList) {
    fetch('http://localhost:3000/history')
        .then(response => response.json())
        .then(history => {
            const filteredHistory = history.filter(entry => entry.exerciseId === exerciseId)
                .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

            const dates = [...new Set(filteredHistory.map(entry => new Date(entry.timestamp).toLocaleDateString()))];
            const last4Dates = dates.slice(-4);

            const tableContainer = document.createElement('div');
            tableContainer.className = 'table-container';

            const table = document.createElement('table');
            table.innerHTML = `
                <thead>
                    <tr>
                        ${last4Dates.map(date => `<th>${date}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                </tbody>
            `;
            const tbody = table.querySelector('tbody');

            const maxSets = Math.max(...last4Dates.map(date => filteredHistory.filter(entry => new Date(entry.timestamp).toLocaleDateString() === date).length));

            for (let i = 0; i < maxSets; i++) {
                const tr = document.createElement('tr');
                tr.innerHTML = last4Dates.map(date => {
                    const entry = filteredHistory.filter(entry => new Date(entry.timestamp).toLocaleDateString() === date)[i];
                    return entry ? `
                        <td>
                            <div class="flex-cell">
                                <span>${entry.measurement.weight} lbs</span>
                                <span>${entry.measurement.reps} reps</span>
                            </div>
                        </td>
                    ` : '<td></td>';
                }).join('');
                tbody.appendChild(tr);
            }

            tableContainer.appendChild(table);
            historyList.appendChild(tableContainer);
        });
}

function addNewSet(exerciseId) {
    // Function to handle adding a new set
    console.log(`Add new set for exercise ID: ${exerciseId}`);
}
