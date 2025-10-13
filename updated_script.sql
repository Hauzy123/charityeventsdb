CREATE TABLE Users (
    UserID INT PRIMARY KEY AUTO_INCREMENT,
    FullName VARCHAR(255) NOT NULL,
    Email VARCHAR(255) UNIQUE NOT NULL,
    PhoneNumber VARCHAR(50),
    Age INT,
    Gender VARCHAR(50)
);


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


CREATE TABLE EventRegistrations (
    RegistrationID INT PRIMARY KEY AUTO_INCREMENT,
    EventID INT NOT NULL,                         
    UserID INT NOT NULL,                           
    RegistrationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    TicketsPurchased INT DEFAULT 1 CHECK (TicketsPurchased > 0), 

   
    CONSTRAINT fk_event FOREIGN KEY (EventID)
        REFERENCES CharityEvents(EventID)
        ON DELETE CASCADE,

    CONSTRAINT fk_user FOREIGN KEY (UserID)
        REFERENCES Users(UserID)
        ON DELETE CASCADE,

      UNIQUE (EventID, UserID)
);


INSERT INTO Users (FullName, Email, PhoneNumber, Age, Gender) VALUES
('John Doe', 'johndoe@gmail.com', '71234567', 28, 'Male'),
('Mary Kila', 'mary.kila@yahoo.com', '76543210', 34, 'Female'),
('Tom Lahui', 'tomlahui@hotmail.com', '72345678', 22, 'Male'),
('Anna Paul', 'anna.paul@gmail.com', '73456789', 19, 'Female'),
('Peter Wong', 'peter.wong@outlook.com', '74567890', 41, 'Male'),
('Sarah Johnson', 'sarah.j@example.com', '75678901', 25, 'Female'),
('Michael Smith', 'mike.smith@test.com', '76789012', 30, 'Male'),
('Lisa Brown', 'lisa.brown@email.com', '77890123', 27, 'Female'),
('David Wilson', 'david.wilson@mail.com', '78901234', 35, 'Male'),
('Emma Davis', 'emma.davis@gmail.com', '79012345', 23, 'Female'),
('James Miller', 'james.miller@yahoo.com', '70123456', 29, 'Male'),
('Sophie Taylor', 'sophie.taylor@hotmail.com', '71234560', 26, 'Female');


INSERT INTO CharityEvents (
    EventName, EventType, Description,
    EventDate, StartTime, EndTime,
    VenueName, Address,
    OrganizerName, ContactEmail, WebsiteURL,
    RegistrationLink, TicketPrice
) VALUES

('Hope Run 2025', 'Awareness Walk', 'A community fun run to raise awareness for mental health.',
 '2025-10-15', '08:00:00', '12:00:00',
 'Ela Beach', 'Ela Beach Road, Port Moresby',
 'Mental Wellness Foundation', 'info@mwf.org.pg', 'https://mwf.org.pg/hoperun',
 'https://mwf.org.pg/register', 0.00),


('Books for Kids', 'Fundraiser', 'A book fair to raise funds for literacy programs.',
 '2025-11-05', '10:00:00', '16:00:00',
 'Vision City Mall', 'Waigani Drive, Port Moresby',
 'Read PNG', 'contact@readpng.org', 'https://readpng.org/booksforbrains',
 NULL, 5.00),


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


INSERT INTO EventRegistrations (EventID, UserID, TicketsPurchased) VALUES
(1, 1, 1),  -- John Doe for Hope Run 2025
(1, 2, 1),  -- Mary Kila for Hope Run 2025
(1, 3, 2),  -- Tom Lahui for Hope Run 2025 (2 tickets)
(2, 4, 1),  -- Anna Paul for Books for Kids
(2, 5, 3),  -- Peter Wong for Books for Kids (3 tickets)
(3, 6, 1),  -- Sarah Johnson for Clean Beach Day
(3, 7, 1),  -- Michael Smith for Clean Beach Day
(4, 8, 2),  -- Lisa Brown for Hearts & Harmony (2 tickets)
(4, 9, 1),  -- David Wilson for Hearts & Harmony
(5, 10, 1), -- Emma Davis for Food for All
(1, 11, 1), -- James Miller for Hope Run 2025
(2, 12, 2); -- Sophie Taylor for Books for Kids (2 tickets)


SELECT 'Total Events:' AS Info, COUNT(*) AS Count FROM CharityEvents
UNION ALL
SELECT 'Total Users:', COUNT(*) FROM Users
UNION ALL
SELECT 'Total Registrations:', COUNT(*) FROM EventRegistrations;