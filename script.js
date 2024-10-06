const dealsTableBody = document.querySelector('#dealsTable tbody');
let openDealId = null;
let openRow = null;

async function fetchAllDeals() {
    const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjgyYzE5OGM4MGFhMTc4OGUyYTRmMjk5NjNmNzU3OTU1MzY0OGIzYjdmZmZhYmNmZTBhZmQwMmY0NzdiZTQwY2IyNDc2NmUxYTA3MWIyMjBjIn0.eyJhdWQiOiI1NDUxNmI4MC1iZTljLTQ5N2YtYjM1Ny1jNDBlODY1YWFiNzkiLCJqdGkiOiI4MmMxOThjODBhYTE3ODhlMmE0ZjI5OTYzZjc1Nzk1NTM2NDhiM2I3ZmZmYWJjZmUwYWZkMDJmNDc3YmU0MGNiMjQ3NjZlMWEwNzFiMjIwYyIsImlhdCI6MTcyODI1NjEzMiwibmJmIjoxNzI4MjU2MTMyLCJleHAiOjE3MzAzMzI4MDAsInN1YiI6IjExNjEyMzgyIiwiZ3JhbnRfdHlwZSI6IiIsImFjY291bnRfaWQiOjMxOTkyOTE0LCJiYXNlX2RvbWFpbiI6ImFtb2NybS5ydSIsInZlcnNpb24iOjIsInNjb3BlcyI6WyJjcm0iLCJmaWxlcyIsImZpbGVzX2RlbGV0ZSIsIm5vdGlmaWNhdGlvbnMiLCJwdXNoX25vdGlmaWNhdGlvbnMiXSwiaGFzaF91dWlkIjoiMGFjNzY1M2MtM2Q4YS00MjFmLTg2YmYtMjIzYWM1YTViOTVlIiwiYXBpX2RvbWFpbiI6ImFwaS1iLmFtb2NybS5ydSJ9.FP84JEBVXGGx1SPsHL2r7bGaeirsezJv_zu0K2tYucncLHSsryxAE2goSfwPBLQ2xL-LLSiyNRW9wP79oS5QHolvV6ZqFXUVZ-B6gVjW7iHREe1wa3hEmUysRsGIZyxWihkZDlmowQUWpN87h2xzECxJJFxjCg5oqMhCDEIHxSHlCe16dDoKbN3HIKo3OsP7jFwTeCiasvU_pmG7xtlE_QXOw-aHcstAmYAtOOQ6zRxiAeZz8Vu42DBL-w3WLHL4CGHw9lz8nFErPeSk0H7sazYxB9xblQ_XaYIbXg65dZYf2miQ2oYjllrStDWfon9EYzVm41_7CKKsOe5iny2rmg';
    const url = 'https://freezof1x.amocrm.ru/api/v4/leads';

    try {
        let page = 1;
        let hasMoreDeals = true;

        while (hasMoreDeals) {
            const response = await fetch(`${url}?page=${page}&limit=3`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                console.error(`Error: ${response.status} ${response.statusText}`);
                hasMoreDeals = false;
                return;
            }

            const textData = await response.text();
            if (!textData || textData.trim() === '') {
                console.error('Error: Empty response body');
                hasMoreDeals = false;
                return;
            }

            const data = JSON.parse(textData);

            if (!data._embedded || !data._embedded.leads || data._embedded.leads.length === 0) {
                hasMoreDeals = false;
                break;
            }

            const deals = data._embedded.leads;
            renderDeals(deals);

            page++;
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    } catch (error) {
        console.error('Error fetching deals:', error);
    }
}

function renderDeals(deals) {
    deals.forEach(deal => {
        const row = document.createElement('tr');
        row.dataset.name = deal.name || 'Без названия';
        row.dataset.price = deal.price || '0';
        row.dataset.id = deal.id;

        row.innerHTML = `
            <td>${row.dataset.name}</td>
            <td>${row.dataset.price}</td>
            <td>${row.dataset.id}</td>
        `;
        row.addEventListener('click', () => loadDealDetails(deal.id, row));
        dealsTableBody.appendChild(row);
    });
}

async function loadDealDetails(dealId, row) {
    if (openDealId === dealId) {
        closeDeal(row);
        return;
    }

    if (openRow) {
        closeDeal(openRow);
    }

    openDealId = dealId;
    openRow = row;
    row.innerHTML = `<td colspan="3" class="loading"><img src="https://cdn.pixabay.com/animation/2023/08/11/21/18/21-18-05-265_512.gif" alt="Loading" style="width: 16px; height: 16px;"></td>`;

    const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjgyYzE5OGM4MGFhMTc4OGUyYTRmMjk5NjNmNzU3OTU1MzY0OGIzYjdmZmZhYmNmZTBhZmQwMmY0NzdiZTQwY2IyNDc2NmUxYTA3MWIyMjBjIn0.eyJhdWQiOiI1NDUxNmI4MC1iZTljLTQ5N2YtYjM1Ny1jNDBlODY1YWFiNzkiLCJqdGkiOiI4MmMxOThjODBhYTE3ODhlMmE0ZjI5OTYzZjc1Nzk1NTM2NDhiM2I3ZmZmYWJjZmUwYWZkMDJmNDc3YmU0MGNiMjQ3NjZlMWEwNzFiMjIwYyIsImlhdCI6MTcyODI1NjEzMiwibmJmIjoxNzI4MjU2MTMyLCJleHAiOjE3MzAzMzI4MDAsInN1YiI6IjExNjEyMzgyIiwiZ3JhbnRfdHlwZSI6IiIsImFjY291bnRfaWQiOjMxOTkyOTE0LCJiYXNlX2RvbWFpbiI6ImFtb2NybS5ydSIsInZlcnNpb24iOjIsInNjb3BlcyI6WyJjcm0iLCJmaWxlcyIsImZpbGVzX2RlbGV0ZSIsIm5vdGlmaWNhdGlvbnMiLCJwdXNoX25vdGlmaWNhdGlvbnMiXSwiaGFzaF91dWlkIjoiMGFjNzY1M2MtM2Q4YS00MjFmLTg2YmYtMjIzYWM1YTViOTVlIiwiYXBpX2RvbWFpbiI6ImFwaS1iLmFtb2NybS5ydSJ9.FP84JEBVXGGx1SPsHL2r7bGaeirsezJv_zu0K2tYucncLHSsryxAE2goSfwPBLQ2xL-LLSiyNRW9wP79oS5QHolvV6ZqFXUVZ-B6gVjW7iHREe1wa3hEmUysRsGIZyxWihkZDlmowQUWpN87h2xzECxJJFxjCg5oqMhCDEIHxSHlCe16dDoKbN3HIKo3OsP7jFwTeCiasvU_pmG7xtlE_QXOw-aHcstAmYAtOOQ6zRxiAeZz8Vu42DBL-w3WLHL4CGHw9lz8nFErPeSk0H7sazYxB9xblQ_XaYIbXg65dZYf2miQ2oYjllrStDWfon9EYzVm41_7CKKsOe5iny2rmg';
    const url = `https://freezof1x.amocrm.ru/api/v4/leads/${dealId}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            console.error(`Error loading details for deal ${dealId}: ${response.status} ${response.statusText}`);
            row.innerHTML = `<td colspan="3">Error loading details. Try again later.</td>`;
            openDealId = null;
            openRow = null;
            return;
        }

        const dealDetails = await response.json();

        const taskStatusCircle = getTaskStatusCircle(dealDetails.closest_task_at);

        const formattedDate = dealDetails.closest_task_at
            ? new Date(dealDetails.closest_task_at).getTime() > 0
                ? new Date(dealDetails.closest_task_at).toLocaleDateString('ru-RU', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                })
                : 'Нет задачи'
            : 'Нет задачи';

        row.innerHTML = `
            <td>${dealDetails.name}</td>
            <td>${dealDetails.id}</td>
            <td>${formattedDate} ${taskStatusCircle}</td>
        `;
    } catch (error) {
        console.error(`Error loading details for deal ${dealId}:`, error);
        row.innerHTML = `<td colspan="3">Error loading details. Try again later.</td>`;
    }
}

function closeDeal(row) {
    row.innerHTML = `
        <td>${row.dataset.name}</td>
        <td>${row.dataset.price}</td>
        <td>${row.dataset.id}</td>
    `;
    openDealId = null;
    openRow = null;
}

function getTaskStatusCircle(taskDate) {
    if (!taskDate) return `<span class="status-circle status-red"></span>`;

    const now = new Date();
    const taskDay = new Date(taskDate);

    const dayDiff = Math.ceil((taskDay - now) / (1000 * 60 * 60 * 24));

    if (dayDiff < 0) {
        return `<span class="status-circle status-red"></span>`;
    } else if (dayDiff === 0) {
        return `<span class="status-circle status-green"></span>`;
    } else {
        return `<span class="status-circle status-yellow"></span>`;
    }
}

fetchAllDeals();
