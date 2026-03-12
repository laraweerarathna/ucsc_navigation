document.addEventListener('DOMContentLoaded', () => {
    const nextLectureCard = document.getElementById('next-lecture-card');
    const navigationCard = document.getElementById('navigation-card');
    const clockElement = document.getElementById('digital-clock');

    let timeOffset = 0;

    const orientationSchedule = [
        // March 12, 2026
        { date: '2026-03-12', time: '10:00 AM', topic: 'Student Performance Analysis', lecturer: 'Dr. Jane Doe', location: { hall: 'UCSC Auditorium', floor: 1 } },
        { date: '2026-03-12', time: '11:00 AM', topic: 'How to Graduate', lecturer: 'Prof. John Smith', location: { hall: 'UCSC Auditorium', floor: 1 } },
        { date: '2026-03-12', time: '02:00 PM', topic: 'Vibe Coding', lecturer: 'Mr. Alex Raymond', location: { hall: 'S104', floor: 4 } },
        { date: '2026-03-12', time: '03:00 PM', topic: 'Closing Remarks', lecturer: 'Chancellor Cynthia Larive', location: { hall: 'UCSC Auditorium', floor: 1 } },
        // Add more sessions for other days
        { date: '2026-03-13', time: '09:00 AM', topic: 'Intro to University Resources', lecturer: 'Ms. Emily White', location: { hall: 'Library', floor: 1 } },
        { date: '2026-03-13', time: '11:00 AM', topic: 'Advanced Research Skills', lecturer: 'Dr. Robert Brown', location: { hall: 'S202', floor: 3 } },
    ];

    function parseTime(timeString) {
        const [time, modifier] = timeString.split(' ');
        let [hours, minutes] = time.split(':');

        if (hours === '12') {
            hours = '00';
        }
        if (modifier === 'PM') {
            hours = parseInt(hours, 10) + 12;
        }
        return `${hours}:${minutes}`;
    }

    async function initializeTime() {
        try {
            const response = await fetch('http://worldtimeapi.org/api/ip');
            if (!response.ok) throw new Error('API response not OK');
            const data = await response.json();
            const serverTime = new Date(data.datetime);
            timeOffset = serverTime - new Date();
        } catch (error) {
            console.error('Error fetching real time, falling back to system time:', error);
            timeOffset = 0;
        } finally {
            startClock();
            processSessions();
        }
    }

    function startClock() {
        setInterval(() => {
            const now = new Date(new Date().getTime() + timeOffset);
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const timeString = now.toLocaleTimeString();
            clockElement.textContent = `${year}-${month}-${day} ${timeString}`;
        }, 1000);
    }

    function processSessions() {
        const now = new Date(new Date().getTime() + timeOffset);

        // --- DEMO-ONLY CODE ---
        now.setFullYear(2026, 2, 12);
        now.setHours(13, 55, 0, 0); // Set time to 1:55 PM
        // --- END DEMO-ONLY CODE ---

        let upcomingSession = null;

        for (const session of orientationSchedule) {
            const twentyFourHourTime = parseTime(session.time);
            const sessionDateTime = new Date(`${session.date}T${twentyFourHourTime}:00`);
            
            if (sessionDateTime > now) {
                upcomingSession = session;
                break;
            }
        }

        if (upcomingSession) {
            displaySession(upcomingSession, "Upcoming Session");
            displayNavigation(upcomingSession);
        } else {
            nextLectureCard.innerHTML = '<h2>End of Schedule</h2><p>No more sessions scheduled.</p>';
            navigationCard.innerHTML = '';
        }
    }

    function displaySession(session, title) {
        nextLectureCard.innerHTML = `
            <h2>${title}: ${session.topic}</h2>
            <p><strong>Lecturer:</strong> <span class="lecturer">${session.lecturer}</span></p>
            <p><strong>Time:</strong> ${session.date} @ ${session.time}</p>
            <p><strong>Location:</strong> ${session.location.hall} (Floor ${session.location.floor})</p>
        `;
    }

    function displayNavigation(session) {
        let navHTML = '<h3>Navigation Guidance</h3>';
        if (session.location.floor > 1) {
            navHTML += '<p class="warning">STAIRS ONLY - LIFTS RESTRICTED FOR FIRST-YEARS.</p>';
        } else {
            navHTML += '<p class="info">Lifts are accessible for this location.</p>';
        }
        navHTML += '<p class="info">Authorized Washrooms: 1st Floor, near Student Study Area & Library Entrance.</p>';
        navigationCard.innerHTML = navHTML;
    }

    initializeTime();
    setInterval(processSessions, 300000);
});
