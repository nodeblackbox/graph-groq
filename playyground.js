const fs = require('fs');
const groq = require('groq-js');

const JSON_FILE = 'todos.json';

// Read the JSON file
function readJsonFile() {
    return JSON.parse(fs.readFileSync(JSON_FILE, 'utf8'));
}

// Write to the JSON file
function writeJsonFile(data) {
    fs.writeFileSync(JSON_FILE, JSON.stringify(data, null, 2));
}

// Function to execute GROQ query
async function executeQuery(query) {
    const jsonData = readJsonFile();
    const tree = groq.parse(query);
    const value = await groq.evaluate(tree, { dataset: jsonData });
    return await value.get();
}

// Create a new task
function createTask(userId, title) {
    const jsonData = readJsonFile();
    const newTask = {
        userId: userId,
        id: jsonData.length + 1,
        title: title,
        completed: false
    };
    jsonData.push(newTask);
    writeJsonFile(jsonData);
    return newTask;
}

// Update a task
function updateTask(id, updates) {
    const jsonData = readJsonFile();
    const taskIndex = jsonData.findIndex(task => task.id === id);
    if (taskIndex !== -1) {
        jsonData[taskIndex] = { ...jsonData[taskIndex], ...updates };
        writeJsonFile(jsonData);
        return jsonData[taskIndex];
    }
    return null;
}

// Delete a task
function deleteTask(id) {
    const jsonData = readJsonFile();
    const updatedData = jsonData.filter(task => task.id !== id);
    if (updatedData.length < jsonData.length) {
        writeJsonFile(updatedData);
        return true;
    }
    return false;
}

// Example usage
async function runExamples() {
    console.log("1. Read all tasks:");
    console.log(await executeQuery('*'));

    console.log("\n2. Create a new task:");
    const newTask = createTask(1, "Learn GROQ");
    console.log(newTask);

    console.log("\n3. Update the task:");
    const updatedTask = updateTask(newTask.id, { completed: true });
    console.log(updatedTask);

    console.log("\n4. Read completed tasks:");
    console.log(await executeQuery('*[completed == true]{title, userId}'));

    console.log("\n5. Delete the task:");
    const deleted = deleteTask(newTask.id);
    console.log("Task deleted:", deleted);

    console.log("\n6. Read all tasks after operations:");
    console.log(await executeQuery('*'));
}

runExamples().catch(console.error);