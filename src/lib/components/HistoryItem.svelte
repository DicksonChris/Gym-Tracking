<script lang="ts">
	import type { History } from '$lib/api/history';
	export let history: History;
</script>

<tr>
	<td class="border border-slate-300 px-2 py-1">{history.id}</td>
	<td class="border border-slate-300 px-2 py-1">{history.reps || '-'}</td>
	<td class="border border-slate-300 px-2 py-1">{history.weight || '-'}</td>
	<td class="border border-slate-300 px-2 py-1">{history.distance || '-'}</td>
	<td class="border border-slate-300 px-2 py-1">{history.time || '-'}</td>
	<td class="border border-slate-300 px-2 py-1">{history.startTime || '-'}</td>
</tr>