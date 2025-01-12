import pb from './pocketbase';

export async function getTheme(): Promise<string> {
    try {
        const record = await pb.collection('theme').getFirstListItem('');
        return record.theme || 'dracula';
    } catch {
        return 'dracula';
    }
}

export async function saveTheme(theme: string) {
    try {
        const existing = await pb.collection('theme').getFirstListItem('');
        await pb.collection('theme').update(existing.id, { theme });
    } catch {
        // Create new if doesn't exist
        await pb.collection('theme').create({ theme });
    }
}