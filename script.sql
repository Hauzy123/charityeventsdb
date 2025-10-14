
CREATE TABLE CharityEvents ( 
    EventID INT PRIMARY KEY AUTO_INCREMENT, 
    EventName VARCHAR(255) NOT NULL, 
    EventType VARCHAR(100), 
    Description TEXT, 
    EventDate DATE NOT NULL,
    StartTime TIME NOT NULL,
    EndTime TIME,
    VenueName VARCHAR(255), 
    Address VARCHAR(255), 
    OrganizerName VARCHAR(255) NOT NULL, 
    ContactEmail VARCHAR(255) NOT NULL, 
    WebsiteURL VARCHAR(255), 
    RegistrationLink VARCHAR(255), 
    TicketPrice DECIMAL(8,2) DEFAULT 0.00
);
comit

CREATE TABLE EventRegistrations (
    RegistrationID INT PRIMARY KEY AUTO_INCREMENT,  -- Unique identifier
    EventID INT NOT NULL,                           -- Connection to specific event
    FullName VARCHAR(255) NOT NULL,                 -- User details
    Email VARCHAR(255) NOT NULL,                    -- Contact details
    PhoneNumber VARCHAR(50),                        -- Contact details
    Age INT,                                        -- User details
    Gender VARCHAR(50),                             -- User details
    TicketsPurchased INT DEFAULT 1 CHECK (TicketsPurchased > 0), -- Number of tickets
    RegistrationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,        -- Date of registration
    
    -- Foreign key to CharityEvents
    CONSTRAINT fk_event FOREIGN KEY (EventID)
        REFERENCES CharityEvents(EventID)
        ON DELETE CASCADE,

    UNIQUE KEY unique_user_event (EventID, Email)
);


INSERT INTO CharityEvents (
    EventName, EventType, Description,
    EventDate, StartTime, EndTime,
    VenueName, Address,
    OrganizerName, ContactEmail, WebsiteURL,
    RegistrationLink, TicketPrice
) VALUES
-- 1. Hope Run 2025
('Hope Run 2025', 'Awareness Walk', 'A community fun run to raise awareness for mental health.',
 '2025-10-15', '08:00:00', '12:00:00',
 'Ela Beach', 'Ela Beach Road, Port Moresby',
 'Mental Wellness Foundation', 'info@mwf.org.pg', 'https://mwf.org.pg/hoperun',
 'https://mwf.org.pg/register', 0.00),

-- 2. Books for Kids
('Books for Kids', 'Fundraiser', 'A book fair to raise funds for literacy programs.',
 '2025-11-05', '10:00:00', '16:00:00',
 'Vision City Mall', 'Waigani Drive, Port Moresby',
 'Read PNG', 'contact@readpng.org', 'https://readpng.org/booksforbrains',
 NULL, 5.00),

-- 3. Clean Beach Day
('Clean Beach Day', 'Environmental Drive', 'Beach cleanup and awareness campaign.',
 '2025-10-20', '07:00:00', '11:00:00',
 'Fisherman\'s Island', 'Boat pickup from Koki Wharf, Port Moresby',
 'EcoPNG', 'volunteer@ecopng.org', 'https://ecopng.org/cleancoast',
 'https://ecopng.org/signup', 0.00),

-- 4. Hearts & Harmony
('Hearts & Harmony', 'Charity Concert', 'Live music event supporting heart disease research.',
 '2025-12-01', '18:00:00', '22:00:00',
 'Sir John Guise Stadium', 'Waigani Drive, Port Moresby',
 'PNG Heart Alliance', 'events@pngheart.org', 'https://pngheart.org/concert',
 'https://pngheart.org/tickets', 20.00),

-- 5. Food for All
('Food for All', 'Donation Drive', 'Community food collection for holiday distribution.',
 '2025-12-10', '09:00:00', '14:00:00',
 'Gordons Market', 'Gordons Road, Port Moresby',
 'Feed PNG', 'donate@feedpng.org', 'https://feedpng.org/foodforall',
 NULL, 0.00);


INSERT INTO EventRegistrations (EventID, FullName, Email, PhoneNumber, Age, Gender, TicketsPurchased) 
VALUES
(1, 'John Doe', 'johndoe@gmail.com', '71234567', 28, 'Male', 1),
(1, 'Mary Kila', 'mary.kila@yahoo.com', '76543210', 34, 'Female', 1),
(1, 'Sarah Johnson', 'sarah.j@example.com', '75678901', 25, 'Female', 2),

(2, 'Tom Lahui', 'tomlahui@hotmail.com', '72345678', 22, 'Male', 3),
(2, 'Anna Paul', 'anna.paul@gmail.com', '73456789', 19, 'Female', 1),

(3, 'Peter Wong', 'peter.wong@outlook.com', '74567890', 41, 'Male', 1),
(3, 'Michael Smith', 'mike.smith@test.com', '76789012', 30, 'Male', 1),

(4, 'Lisa Brown', 'lisa.brown@email.com', '77890123', 27, 'Female', 2),
(4, 'David Wilson', 'david.wilson@mail.com', '78901234', 35, 'Male', 1),

(5, 'Emma Davis', 'emma.davis@gmail.com', '79012345', 23, 'Female', 1),

(2, 'John Doe', 'johndoe@gmail.com', '71234567', 28, 'Male', 2),

(3, 'Mary Kila', 'mary.kila@yahoo.com', '76543210', 34, 'Female', 1);

SELECT 'Total Events:' AS Info, COUNT(*) AS Count FROM CharityEvents
UNION ALL
SELECT 'Total Registrations:', COUNT(*) FROM EventRegistrations;

