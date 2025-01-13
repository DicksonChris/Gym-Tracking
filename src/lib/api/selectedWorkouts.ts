import pb from '$lib/api/pocketbase';

export async function getSelectedWorkouts(): Promise<string[]> {
    try {
        const record = await pb.collection('selected_workouts').getFirstListItem('');
        return record.workouts || [];
    } catch {
        return [];
    }
}

export async function saveSelectedWorkouts(workouts: string[]) {
    try {
        const existing = await pb.collection('selected_workouts').getFirstListItem('');
        await pb.collection('selected_workouts').update(existing.id, { workouts });
    } catch {
        // Create new if doesn't exist
        await pb.collection('selected_workouts').create({ workouts });
    }
}