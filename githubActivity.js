const https = require('https');

// Function to fetch GitHub user activity
function fetchGitHubActivity(username) {
    const url = `https://api.github.com/users/${username}/events`;

    const options = {
        headers: {
            'User-Agent': 'github-activity-cli', // GitHub API requires a user-agent header
        },
    };

    https.get(url, options, (res) => {
        let data = '';

        // A chunk of data has been received.
        res.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received.
        res.on('end', () => {
            if (res.statusCode === 200) {
                const events = JSON.parse(data);
                displayActivity(events);
            } else {
                console.error(`Failed to fetch data. Status code: ${res.statusCode}`);
            }
        });
    }).on('error', (err) => {
        console.error(`Error: ${err.message}`);
    });
}

// Function to display GitHub activity
function displayActivity(events) {
    if (events.length === 0) {
        console.log('No recent activity found.');
        return;
    }

    events.forEach((event) => {
        switch (event.type) {
            case 'PushEvent':
                console.log(`Pushed ${event.payload.commits.length} commits to ${event.repo.name}`);
                break;
            case 'IssuesEvent':
                console.log(`Opened a new issue in ${event.repo.name}`);
                break;
            case 'WatchEvent':
                console.log(`Starred ${event.repo.name}`);
                break;
            // Add more event types as needed
            default:
                console.log(`${event.type} in ${event.repo.name}`);
                break;
        }
    });
}

// Get the GitHub username from command-line arguments
const username = process.argv[2];

if (!username) {
    console.log('Usage: node githubActivity.js <username>');
} else {
    fetchGitHubActivity(username);
}
