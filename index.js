// ==UserScript==
// @name         NameMC History
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Add a Crafty and Laby API Username table after the Name History table on NameMC profiles using the selected UUID, filter out invalid dates, and sort by date.
// @author       You
// @match        https://namemc.com/profile/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Get the selected UUID from the dropdown
    const uuidSelect = document.querySelector('#uuid-select');
    const selectedUUID = uuidSelect ? uuidSelect.options[uuidSelect.selectedIndex].text : null;

    if (!selectedUUID) {
        console.log("UUID not found or not selected.");
        return;
    }

    // Use a CORS proxy to bypass the CORS restriction
    const proxyUrl = 'https://corsproxy.io/?';

    // Crafty API URL
    const craftyApiUrl = `https://crafty.gg/players/${selectedUUID}.json`;

    // Laby API URL
    const labyApiUrl = `https://laby.net/api/v3/user/${selectedUUID}/names`;


// Function to filter, sort, and populate the table with usernames and dates
function populateTable(apiData, tableCard, apiType) {
    // Adjusting for Crafty API and Laby API data structure
    const usernames = apiType === 'crafty' ? apiData.usernames : apiData;

    const validUsernames = usernames.sort((a, b) => new Date(b.changed_at || 0) - new Date(a.changed_at || 0)); // Sort by date (null dates treated as earliest)

    // Get the table body element
    const tbody = tableCard.querySelector('tbody');
    tbody.innerHTML = ''; // Clear previous rows
    const totalUsernames = validUsernames.length; // Get total number of valid usernames

    validUsernames.forEach((usernameData, index) => {
        let username = apiType === 'crafty' ? usernameData.username : usernameData.name;

        // Special logic for Laby API: rename "-" if the 'hidden' key is missing
        if (apiType === 'laby' && username === '－' && !usernameData.hidden) {
            username = '[DELETED FROM LABY DATABASE]';
        }

        const available = usernameData.available ? 'Yes' : 'No';
        const changedAtDate = usernameData.changed_at ? new Date(usernameData.changed_at).toLocaleDateString() : '[ORIGINAL NAME]';
        const changedAtTime = usernameData.changed_at ? new Date(usernameData.changed_at).toLocaleTimeString() : '';
        const displayIndex = totalUsernames - index; // Reverse the index for display

        // Determine the HTML for the username cell
        let usernameHTML;
        if (username === '[DELETED FROM LABY DATABASE]' || username === '－') {
            // Display username as plain text without a link
            usernameHTML = `<span translate="no">${username === '－' ? "—" : username}</span>`;
        } else {
            // Wrap username in an anchor tag with href
            usernameHTML = `<a class="" translate="no" href="/search?q=${encodeURIComponent(username)}">${username}</a>`;
        }

        // Create a new row for each username
        const row = document.createElement('tr');
        row.innerHTML = `
            <tr>
                <td width="1" class="text-center fw-bold">${displayIndex}</td>
                <td width="100%" style="max-width: 0" class="text-nowrap text-ellipsis">
                  ${usernameHTML}
                </td>
                <td width="20%" class="d-none d-lg-table-cell text-end text-nowrap pe-0">
                  <time datetime="${usernameData.changed_at}" data-type="date">${changedAtDate}</time>
                </td>
                <td width="1" class="d-none d-lg-table-cell text-center px-1">•</td>
                <td width="1" class="d-none d-lg-table-cell text-left text-nowrap p-0">
                   ${changedAtTime ? `<time datetime="${usernameData.changed_at}" data-type="time">${changedAtTime}</time>` : ""}
                </td>
                <td class="text-end text-nowrap ps-0">
                  <a class="copy-button px-1" href="javascript:void(0)" data-clipboard-text="${username}" onclick="return false"><i class="far fa-fw fa-copy"></i></a>
                </td>
            </tr>
        `;
        tbody.appendChild(row);
    });
}

    // Create a new table for Crafty API data (Usernames)
    const craftyTableCard = document.createElement('div');
    craftyTableCard.classList.add('card', 'mb-3');

    // Create the table header with two buttons
    craftyTableCard.innerHTML = `
      <div class="card-header py-1 d-flex justify-content-between align-items-center">
        <strong>API Username History</strong>
        <div>
          <button id="craftyApiBtn" class="btn btn-primary btn-sm">Crafty API</button>
          <button id="labyApiBtn" class="btn btn-secondary btn-sm">Laby API</button>
        </div>
      </div>
      <div class="card-body px-0 py-1" style="max-height: 134px; overflow: auto">
        <table class="table table-borderless mb-0">
          <tbody>
          </tbody>
        </table>
      </div>
    `;

    // Find the Name History table card and insert the new card after it
    const nameHistoryCard = Array.from(document.querySelectorAll('.card')).find(card => card.innerText.includes('Name History'));
    if (nameHistoryCard) {
        nameHistoryCard.after(craftyTableCard);
    }

    // Function to fetch API data and populate the table
    function fetchApiData(apiUrl, apiType) {
        fetch(proxyUrl + apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data) {
                    console.log(`${apiType} API data fetched successfully.`);
                    populateTable(data, craftyTableCard, apiType);
                } else {
                    console.log(`No username data found in the ${apiType} API response.`);
                }
            })
            .catch(error => {
                console.error(`Error fetching data from ${apiType} API:`, error);
            });
    }

    // Function to switch between primary and secondary APIs
    function switchApi(primary) {
        const craftyBtn = document.getElementById('craftyApiBtn');
        const labyBtn = document.getElementById('labyApiBtn');

        if (primary === 'crafty') {
            craftyBtn.classList.add('btn-primary');
            craftyBtn.classList.remove('btn-secondary');
            labyBtn.classList.add('btn-secondary');
            labyBtn.classList.remove('btn-primary');

            fetchApiData(craftyApiUrl, 'crafty'); // Fetch and populate table with Crafty API data
        } else {
            labyBtn.classList.add('btn-primary');
            labyBtn.classList.remove('btn-secondary');
            craftyBtn.classList.add('btn-secondary');
            craftyBtn.classList.remove('btn-primary');

            fetchApiData(labyApiUrl, 'laby'); // Fetch and populate table with Laby API data
        }
    }

    // Add event listeners to the buttons
    document.getElementById('craftyApiBtn').addEventListener('click', () => {
        switchApi('crafty'); // Switch to Crafty as primary
    });

    document.getElementById('labyApiBtn').addEventListener('click', () => {
        switchApi('laby'); // Switch to Laby as primary
    });

    // Fetch from Crafty API by default when the page loads
    switchApi('crafty'); // Default primary API is Crafty

})();
