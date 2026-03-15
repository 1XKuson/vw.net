const regionTitles = {
    "europe": "Europe",
    "asia": "Asia, Middle East & Oceania",
    "americas": "Americas",
    "africa": "Africa",
    "other": "Other Regions"
};

const regionDescriptions = {
    "europe": "Major hubs across UK, Germany, France, Netherlands and beyond.",
    "asia": "Deep regional penetration ensuring optimal eastern connectivity.",
    "americas": "Reliable hosting across North, Central, and South America.",
    "africa": "Growing presence to support rapidly emerging digital markets.",
    "other": "Miscellaneous regions and specific unassigned locations."
};

let serverData = {};

const grid = document.getElementById('countries-grid');
const titleLabel = document.getElementById('display-region-title');
const regionsSelector = document.getElementById('regions-selector');

window.updateData = function (regionKey) {
    const list = serverData[regionKey] || [];
    const rawTitle = regionTitles[regionKey] || regionKey;
    const title = `${rawTitle}`;

    if (titleLabel) {
        titleLabel.innerText = title;
    }

    if (grid) {
        grid.innerHTML = list.map(item => {
            const flagCode = item.flag;
            const flagHtml = flagCode
                ? `<img src="https://flagcdn.com/w20/${flagCode}.png" alt="${item.country} flag" class="w-4 h-3 rounded-[2px] object-cover" />`
                : `<div class="w-1 h-1 rounded-full bg-white/20 group-hover:bg-primary transition-colors"></div>`;

            const countryUrl = item.url || "#";

            return `
            <a href="${countryUrl}" target="_blank" class="flex items-center gap-2 group cursor-pointer hover:bg-white/5 p-1 -m-1 rounded transition-colors">
                ${flagHtml}
                <span class="text-xs text-white/50 group-hover:text-white transition-colors truncate" title="${item.country}">${item.country}</span>
            </a>
            `;
        }).join('');
    }

    const cards = document.querySelectorAll('.region-card');
    cards.forEach(c => {
        const target = c.getAttribute('data-target');
        const span = c.querySelector('span');

        if (target === regionKey) {
            c.classList.add('active', 'border-primary', 'bg-primary/5');
            c.classList.remove('border-white/5');

            if (span) {
                // Remove inactive styles
                span.classList.remove('bg-white/5', 'text-white/50', 'border-white/10');
                // Add active styles
                span.classList.add('bg-primary', 'text-white', 'shadow-lg', 'shadow-primary/30', 'border-transparent');
            }
        } else {
            c.classList.remove('active', 'border-primary', 'bg-primary/5');
            c.classList.add('border-white/5');

            if (span) {
                // Remove active styles
                span.classList.remove('bg-primary', 'text-white', 'shadow-lg', 'shadow-primary/30', 'border-transparent');
                // Add inactive styles
                span.classList.add('bg-white/5', 'text-white/50', 'border-white/10');
            }
        }
    });
};

function renderRegionCards() {
    if (!regionsSelector) return;

    let html = '';
    const regionKeys = Object.keys(serverData);

    regionKeys.forEach((key, index) => {
        const count = serverData[key].length;
        const title = regionTitles[key] || key;
        const desc = regionDescriptions[key] || '';

        // Active class on first region by default for visual consistency before first click
        const isActive = index === 0;

        html += `
        <div class="region-card ${isActive ? 'active border-primary bg-primary/5' : 'border-white/5'} flex flex-col h-full cursor-pointer glass-panel p-6 rounded-2xl border relative overflow-hidden group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10"
            data-target="${key}">
            <div
                class="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            </div>
            
            <div class="relative z-10 flex justify-start mb-4">
                <span class="${isActive ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-white/5 text-white/50 border border-white/10'} inline-flex px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest group-hover:bg-primary group-hover:text-white group-hover:border-transparent group-hover:shadow-lg group-hover:shadow-primary/30 transition-all duration-300">
                    ${count} Countries
                </span>
            </div>
            
            <h4 class="font-heading text-2xl font-bold mb-3 relative z-10 text-white group-hover:text-primary transition-colors">${title}</h4>
            <p class="text-white/50 text-sm relative z-10 leading-relaxed mt-auto">${desc}</p>
        </div>
        `;
    });

    regionsSelector.innerHTML = html;

    const cards = document.querySelectorAll('.region-card');
    cards.forEach(c => {
        c.addEventListener('click', () => {
            window.updateData(c.getAttribute('data-target'));
        });
    });
}

// Initialize Lucide Icons
if (typeof lucide !== 'undefined') {
    lucide.createIcons();
}

// Fetch data
fetch('server-region.json')
    .then(res => res.json())
    .then(data => {
        // data is an array of objects e.g. [{"europe": [...]}, {"asia": [...]}]
        data.forEach(obj => {
            const key = Object.keys(obj)[0];
            serverData[key] = obj[key];
        });

        renderRegionCards();

        const firstRegion = Object.keys(serverData)[0] || 'europe';
        window.updateData(firstRegion); // Trigger default
    })
    .catch(err => {
        console.error('Failed to load server-region.json:', err);
    });
