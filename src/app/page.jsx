"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Zap, Send, CheckCircle, RefreshCw, Code, Plus, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const initialTasks = [
  { id: 1, prompt: "Optimize this function for better performance", completed: false, inProgress: false },
  { id: 2, prompt: "Implement a quick sort algorithm", completed: false, inProgress: false },
  { id: 3, prompt: "Create a responsive layout using CSS Grid", completed: false, inProgress: false },
  { id: 4, prompt: "Write a React hook for form validation", completed: false, inProgress: false },
  { id: 5, prompt: "Develop a simple REST API using Node.js", completed: false, inProgress: false },
];

const NavButton = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center p-3 rounded-xl transition-all duration-300 ${active
      ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white'
      : 'text-gray-300 hover:text-white hover:bg-gray-800'
      }`}
  >
    <Icon className="mr-2" size={20} />
    {label}
  </button>
);

const AnimatedBubble = ({ size, speed, startPosition }) => {
  const [position, setPosition] = useState(startPosition);
  const [direction, setDirection] = useState({ x: Math.random() - 0.5, y: Math.random() - 0.5 });

  useEffect(() => {
    const moveInterval = setInterval(() => {
      setPosition(prev => {
        let newX = prev.x + direction.x * speed;
        let newY = prev.y + direction.y * speed;
        let newDirection = { ...direction };

        if (newX <= 0 || newX >= window.innerWidth - size) newDirection.x *= -1;
        if (newY <= 0 || newY >= window.innerHeight - size) newDirection.y *= -1;

        setDirection(newDirection);
        return { x: newX, y: newY };
      });
    }, 50);

    return () => clearInterval(moveInterval);
  }, []);

  return (
    <div
      className="absolute rounded-full bg-gradient-to-r from-purple-400 to-pink-600 opacity-10 blur-3xl"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        left: `${position.x}px`,
        top: `${position.y}px`,
        transition: 'left 0.5s, top 0.5s',
      }}
    />
  );
};

const GroqyInterface = () => {
  const [activeView, setActiveView] = useState('tasks');
  const [code, setCode] = useState('');
  const [tasks, setTasks] = useState(initialTasks);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);
  const [newTaskPrompt, setNewTaskPrompt] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const handleSubmit = useCallback(() => {
    if (code.trim() === '') {
      setAlertMessage('Please enter some code before submitting.');
      setShowAlert(true);
      return;
    }

    if (selectedTaskId === null) {
      setAlertMessage('Please select a task to submit your code for.');
      setShowAlert(true);
      return;
    }

    console.log("Submitted code for task:", selectedTaskId);
    console.log("Code:", code);

    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === selectedTaskId ? { ...task, completed: true, inProgress: false } : task
      )
    );

    setCode('');
    setSelectedTaskId(null);
    setAlertMessage('Code submitted successfully! Task marked as completed.');
    setShowAlert(true);
  }, [code, selectedTaskId]);

  const handleStartTask = useCallback((taskId) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, inProgress: true } : task
      )
    );
  }, []);

  const handleAddTask = useCallback(() => {
    if (newTaskPrompt.trim() === '') {
      setAlertMessage('Please enter a task prompt.');
      setShowAlert(true);
      return;
    }

    const newTask = {
      id: tasks.length + 1,
      prompt: newTaskPrompt,
      completed: false,
      inProgress: false
    };

    setTasks(prevTasks => [...prevTasks, newTask]);
    setNewTaskPrompt('');
    setIsAddTaskDialogOpen(false);
    setAlertMessage('New task added successfully!');
    setShowAlert(true);
  }, [newTaskPrompt, tasks]);

  const renderContent = () => {
    switch (activeView) {
      case 'tasks':
        return (
          <Card className="bg-gray-800 bg-opacity-70 backdrop-filter backdrop-blur-lg border-gray-700 overflow-hidden">
            <CardHeader className="bg-gray-900 bg-opacity-70 flex justify-between items-center">
              <CardTitle className="flex items-center text-2xl text-white font-bold">
                <Zap className="mr-2 text-yellow-400" />
                Current Tasks
              </CardTitle>
              <Button onClick={() => setIsAddTaskDialogOpen(true)} className="bg-green-500 hover:bg-green-600 text-white">
                <Plus size={16} className="mr-1" /> Add Task
              </Button>
            </CardHeader>
            <CardContent className="p-6">
              {tasks.filter(task => !task.completed && !task.inProgress).map(task => (
                <div key={task.id} className="mb-4 p-4 bg-gray-700 rounded-xl flex items-center justify-between">
                  <p className="text-white font-semibold text-lg">{task.prompt}</p>
                  <Button onClick={() => handleStartTask(task.id)} className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white">
                    Start
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        );
      case 'inProgress':
        return (
          <Card className="bg-gray-800 bg-opacity-70 backdrop-filter backdrop-blur-lg border-gray-700 overflow-hidden">
            <CardHeader className="bg-gray-900 bg-opacity-70">
              <CardTitle className="flex items-center text-2xl text-white font-bold">
                <RefreshCw className="mr-2 text-blue-400" />
                Tasks In Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {tasks.filter(task => task.inProgress).map(task => (
                <div key={task.id} className="mb-4 p-4 bg-gray-700 rounded-xl flex items-center justify-between">
                  <p className="text-white font-semibold text-lg">{task.prompt}</p>
                </div>
              ))}
              {tasks.filter(task => task.inProgress).length === 0 && (
                <p className="text-gray-300 font-semibold text-lg">No tasks currently in progress.</p>
              )}
            </CardContent>
          </Card>
        );
      case 'completed':
        return (
          <Card className="bg-gray-800 bg-opacity-70 backdrop-filter backdrop-blur-lg border-gray-700 overflow-hidden">
            <CardHeader className="bg-gray-900 bg-opacity-70">
              <CardTitle className="flex items-center text-2xl text-white font-bold">
                <CheckCircle className="mr-2 text-green-400" />
                Completed Tasks
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {tasks.filter(task => task.completed).map(task => (
                <div key={task.id} className="mb-4 p-4 bg-gray-700 rounded-xl flex items-center justify-between">
                  <p className="text-white font-semibold text-lg">{task.prompt}</p>
                  <CheckCircle className="text-green-500" size={24} />
                </div>
              ))}
              {tasks.filter(task => task.completed).length === 0 && (
                <p className="text-gray-300 font-semibold text-lg">No completed tasks yet.</p>
              )}
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8 overflow-hidden relative">
      {[...Array(5)].map((_, i) => (
        <AnimatedBubble
          key={i}
          size={Math.random() * 400 + 200}
          speed={Math.random() * 0.3 + 0.1}
          startPosition={{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }}
        />
      ))}
      <div className="container mx-auto max-w-6xl relative z-10">
        <header className="flex items-center justify-between mb-12">
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            GROQY
          </h1>
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center animate-pulse">
              <Code size={32} className="text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-gray-900"></div>
          </div>
        </header>

        <nav className="flex space-x-4 mb-8">
          <NavButton icon={Zap} label="Tasks" active={activeView === 'tasks'} onClick={() => setActiveView('tasks')} />
          <NavButton icon={RefreshCw} label="In Progress" active={activeView === 'inProgress'} onClick={() => setActiveView('inProgress')} />
          <NavButton icon={CheckCircle} label="Completed" active={activeView === 'completed'} onClick={() => setActiveView('completed')} />
        </nav>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-1/2">
            {renderContent()}
          </div>

          <Card className="w-full lg:w-1/2 bg-gray-800 bg-opacity-70 backdrop-filter backdrop-blur-lg border-gray-700">
            <CardHeader className="bg-gray-900 bg-opacity-70">
              <CardTitle className="flex items-center text-2xl text-white font-bold">
                <Code className="mr-2 text-blue-400" />
                Submit Your Work
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <Select onValueChange={(value) => setSelectedTaskId(Number(value))} value={selectedTaskId?.toString()}>
                <SelectTrigger className="w-full mb-4 bg-gray-700 text-white border-gray-600">
                  <SelectValue placeholder="Select a task to submit for" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 text-white border-gray-600">
                  {tasks.filter(task => task.inProgress).map(task => (
                    <SelectItem key={task.id} value={task.id.toString()}>{task.prompt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter your code here..."
                className="min-h-[300px] mb-4 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
              <Button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 transition-all duration-300 text-white"
              >
                Submit to GROQY
                <Send className="ml-2" size={18} />
              </Button>
            </CardContent>
          </Card>
        </div>

        {showAlert && (
          <Alert className="mt-4 bg-gray-800 border-gray-700">
            <AlertDescription className="text-white">{alertMessage}</AlertDescription>
            <Button onClick={() => setShowAlert(false)} className="ml-auto text-white" variant="ghost">
              <X size={18} />
            </Button>
          </Alert>
        )}

        <Dialog open={isAddTaskDialogOpen} onOpenChange={setIsAddTaskDialogOpen}>
          <DialogContent className="bg-gray-800 text-white border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-white">Add New Task</DialogTitle>
              <DialogDescription className="text-gray-300">Enter the details for the new task below.</DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="taskPrompt" className="text-white">Task Prompt</Label>
              <Input
                id="taskPrompt"
                value={newTaskPrompt}
                onChange={(e) => setNewTaskPrompt(e.target.value)}
                placeholder="Enter task prompt..."
                className="mt-2 bg-gray-700 text-white border-gray-600 placeholder-gray-400"
              />
            </div>
            <DialogFooter>
              <Button onClick={handleAddTask} className="bg-green-500 hover:bg-green-600 text-white">
                Add Task
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default GroqyInterface;