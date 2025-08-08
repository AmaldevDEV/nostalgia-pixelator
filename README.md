<img width="3188" height="1202" alt="frame (3)" src="https://github.com/user-attachments/assets/517ad8e9-ad22-457d-9538-a9e62d137cd7" />


# Nostalgia Pixelator 🎯


## Basic Details
### Team Name: Void Devs


### Team Members
- Team Lead: Amaldev V K - LBS College of Engineering, Kasaragod
- Member 2: Vaishnav Gopalakrishnan - LBS College of Engineering, Kasaragod

### Project Description
A full-stack web application that combines the retro aesthetics of 8-bit graphics with the uncanny power of modern AI. It's a digital memory decay machine that pixelates your photos and then uses Gemini AI to hallucinate their restoration.

### The Problem (that doesn't exist)
In a world of flawless, high-resolution digital photos, our memories have lost their charm. We've forgotten the beauty of corrupted files, the mystery of a pixelated face, and the nostalgia of a low-fidelity aesthetic. Our digital lives are too perfect.

### The Solution (that nobody asked for)
The Nostalgia Pixelator solves this nonexistent problem by intentionally degrading your high-quality images into glorious 8-bit, monochromatic masterpieces. Then, with a single click, it uses Google's Gemini AI to "restore" them, creating a completely new, often unsettling, but always fun, version of your memory. It's a journey into what our memories would look like if a machine tried to recreate them from scratch.

## Technical Details
### Technologies/Components Used
For Software:
- **Languages used:** JavaScript
- **Frameworks used:** Node.js, Express.js, TailwindCSS
- **Libraries used:** Mongoose, `@google/generative-ai`, `dotenv`, `cors`, `body-parser`
- **Tools used:** MongoDB Atlas

For Hardware:
*(Not applicable for this project)*

### Implementation
For Software:
# Installation
1. Clone the repository.
2. Install dependencies.
```bash
npm install
```
3. Set up your .env file with your GEMINI_API_KEY and MONGO_URI
### Implementation

For Software:
# Installation

# Run
```Bash
node server.js
```

### Project Documentation
For Software:

# Screenshots (Add at least 3)
<img width="961" height="847" alt="image" src="https://github.com/user-attachments/assets/e76ae5ee-eba7-47c8-98ae-74dacb5461d7" />

A high-resolution image is uploaded to the Nostalgia Pixelator.

<img width="985" height="854" alt="image" src="https://github.com/user-attachments/assets/06a42bbc-c387-4102-a3cc-9d39abed7bce" />

The uploaded image progressively decays into a low-fidelity, pixelated state over time.


# Diagrams
### Project Workflow Diagram

This diagram outlines the flow of data for the core functions of the "Nostalgia Pixelator" application, from the user's browser to the backend services.

```
+----------------+      +-----------------+      +---------------------+
|   Frontend     |      |    Backend      |      |   Database/AI       |
| (index.html)   |      |  (server.js)    |      |  (MongoDB/Gemini)   |
+----------------+      +-----------------+      +---------------------+
        |                        |                        |
        |  1. User Uploads Image |                        |
        +----------------------->| 2. Receives Image Data |
        |                        | 3. Saves to DB      |
        |                        +---------------------->| 4. Stores Image Data  |
        |                        |                        |
        |                        |                        |
        |  5. User Clicks Restore|                        |
        +----------------------->| 6. Receives Image ID   |
        |                        | 7. Fetches Image from DB |
        |                        +---------------------->| 8. Retrieves Image    |
        |                        |                        |
        |                        | 9. Sends to Gemini API |
        |                        +---------------------->| 10. AI Restores Image |
        |                        |                        |
        | <----------------------+ 11. Sends Image Back |
        |                        | 12. Updates DB        |
        |                        +---------------------->| 13. Sets 'restoredFromBin'|
        |                        |                        |
        |  14. Displays Restored |                        |
        |      Image             |                        |
        +----------------------->|                        |
        |                        |                        |
        |                        |                        |
        |  15. User Enters Prompt |                        |
        +----------------------->| 16. Receives Prompt    |
        |                        | 17. Sends to Gemini API |
        |                        +---------------------->| 18. AI Generates Image|
        |                        |                        |
        | <----------------------+ 19. Sends Image Back |
        |                        |                        |
        |  20. Displays Generated|                        |
        |      Image             |                        |
        +----------------------->|                        |
```

For Hardware:
not applicable


### Project Demo
# Video
https://drive.google.com/file/d/19L22sJuSnYK8dGawCcEj-0P2a61TeUz2/view?usp=drive_link


# Additional Demos
[Add any extra demo materials/links]

## Team Contributions
- Amaldev V K : Full-stack development, Gemini AI integration, MongoDB integration, frontend UI/UX, and project lead.
- Vaishnav Gopalakrishnan : Backend API development, MongoDB integration, and bug fixes.

---
Made with ❤️ at TinkerHub Useless Projects 

![Static Badge](https://img.shields.io/badge/TinkerHub-24?color=%23000000&link=https%3A%2F%2Fwww.tinkerhub.org%2F)
![Static Badge](https://img.shields.io/badge/UselessProjects--25-25?link=https%3A%2F%2Fwww.tinkerhub.org%2Fevents%2FQ2Q1TQKX6Q%2FUseless%2520Projects)
