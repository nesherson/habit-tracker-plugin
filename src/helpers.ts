export function uid() {
	return Math.random().toString(36).slice(2, 9);
}

/* small svg ring (Loop-style weekly completion) */
export function makeRing(pct: number, color: string, size: string) {
	const NS = 'http://www.w3.org/2000/svg';
	const svg = activeDocument.createElementNS(NS, 'svg');

	svg.setAttribute('viewBox', '0 0 24 24');
	svg.setAttribute('width', size);
	svg.setAttribute('height', size);
	svg.addClass('ht-ring');

	const r = 8.5;
	const c = 2 * Math.PI * r;
	const bg = activeDocument.createElementNS(NS, 'circle');

	bg.setAttribute('cx', '12');
	bg.setAttribute('cy', '12');
	bg.setAttribute('r', r.toString());
	bg.setAttribute('fill', 'none');
	bg.setAttribute('stroke-width', '3.2');
	bg.addClass('ht-ring-bg');

	const fg = activeDocument.createElementNS(NS, 'circle');

	fg.setAttribute('cx', '12');
	fg.setAttribute('cy', '12');
	fg.setAttribute('r', r.toString());
	fg.setAttribute('fill', 'none');
	fg.setAttribute('stroke', color);
	fg.setAttribute('stroke-width', '3.2');
	fg.setAttribute('stroke-linecap', 'round');
	fg.setAttribute('stroke-dasharray', c.toString());
	fg.setAttribute('stroke-dashoffset', (c * (1 - pct)).toString());
	fg.setAttribute('transform', 'rotate(-90 12 12)');
	svg.appendChild(bg);
	svg.appendChild(fg);

	return svg;
}

export function startOfWeek(d: Date) {
	// Monday
	const x = new Date(d);
	const dow = (x.getDay() + 6) % 7; // 0 = Mon
	x.setDate(x.getDate() - dow);
	x.setHours(0, 0, 0, 0);
	return x;
}

export function addDays(d: Date, n: number) {
	const x = new Date(d);

	x.setDate(x.getDate() + n);

	return x;
}

export function dateKey(d: Date) {
	const y = d.getFullYear();
	const m = String(d.getMonth() + 1).padStart(2, '0');
	const day = String(d.getDate()).padStart(2, '0');

	return `${y}-${m}-${day}`;
}
