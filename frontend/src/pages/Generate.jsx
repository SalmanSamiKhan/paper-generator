import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, FileText, Download, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Generate() {
  // Form state
  const [subject, setSubject] = useState("");
  const [totalMarks, setTotalMarks] = useState(0);
  const [batches, setBatches] = useState([]);
  const [generatedPaper, setGeneratedPaper] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Sample data
  const subjects = ["Physics", "Chemistry", "Mathematics", "Biology", "Computer Science"];
  const topics = {
    Physics: ["Mechanics", "Thermodynamics", "Optics", "Electricity"],
    Chemistry: ["Organic Chemistry", "Inorganic Chemistry", "Physical Chemistry"],
    Mathematics: ["Algebra", "Calculus", "Geometry", "Statistics"],
    Biology: ["Cell Biology", "Genetics", "Ecology", "Evolution"],
    "Computer Science": ["Programming", "Data Structures", "Algorithms", "Database"],
  };

  // Sample questions for generation simulation
  const sampleQuestions = {
    Physics: [
      {
        id: "1",
        question: "Define Newton's first law of motion.",
        type: "short",
        difficulty: "easy",
        marks: 2,
        topic: "Mechanics",
      },
      {
        id: "2",
        question: "Derive the equation for kinetic energy.",
        type: "long",
        difficulty: "medium",
        marks: 5,
        topic: "Mechanics",
      },
      {
        id: "3",
        question: "What is the unit of electric current?",
        type: "mcq",
        difficulty: "easy",
        marks: 1,
        topic: "Electricity",
        options: ["Ampere", "Volt", "Ohm", "Watt"],
        correctAnswer: 0,
      },
    ],
    // Add more sample questions for other subjects...
  };

  const addBatch = () => {
    const newBatch = {
      id: Date.now().toString(),
      marks: 0,
      topic: "",
      questionType: "",
      difficulty: "",
    };
    setBatches([...batches, newBatch]);
  };

  const removeBatch = (id) => {
    setBatches(batches.filter((batch) => batch.id !== id));
  };

  const updateBatch = (id, field, value) => {
    setBatches(batches.map((batch) => (batch.id === id ? { ...batch, [field]: value } : batch)));
  };

  const getTotalBatchMarks = () => {
    return batches.reduce((total, batch) => total + (batch.marks || 0), 0);
  };

  const getRemainingMarks = () => {
    return totalMarks - getTotalBatchMarks();
  };

  const generateQuestionPaper = async () => {
    // Validation
    if (!subject || !totalMarks) {
      alert("Please select a subject and enter total marks.");
      return;
    }

    if (batches.length > 0 && getTotalBatchMarks() !== totalMarks) {
      alert("Batch marks must equal total marks.");
      return;
    }

    setIsGenerating(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      let questions = [];
      const availableQuestions = sampleQuestions[subject] || [];

      if (batches.length === 0) {
        // Random generation
        questions = generateRandomQuestions(availableQuestions, totalMarks);
      } else {
        // Batch-based generation
        for (const batch of batches) {
          const batchQuestions = generateBatchQuestions(availableQuestions, batch);
          questions = [...questions, ...batchQuestions];
        }
      }

      const paper = {
        subject,
        totalMarks,
        questions,
        generatedAt: new Date(),
      };

      setGeneratedPaper(paper);
      alert(`Successfully generated a ${totalMarks}-mark question paper for ${subject}.`);
    } catch (error) {
      alert("Failed to generate question paper. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const generateRandomQuestions = (availableQuestions, targetMarks) => {
    const questions = [];
    let currentMarks = 0;

    while (currentMarks < targetMarks && availableQuestions.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableQuestions.length);
      const question = { ...availableQuestions[randomIndex], id: Date.now().toString() + Math.random() };

      if (currentMarks + question.marks <= targetMarks) {
        questions.push(question);
        currentMarks += question.marks;
      }

      if (questions.length > 20) break; // Prevent infinite loop
    }

    return questions;
  };

  const generateBatchQuestions = (availableQuestions, batch) => {
    let filteredQuestions = availableQuestions;

    // Filter by topic
    if (batch.topic) {
      filteredQuestions = filteredQuestions.filter((q) => q.topic === batch.topic);
    }

    // Filter by question type
    if (batch.questionType) {
      filteredQuestions = filteredQuestions.filter((q) => q.type === batch.questionType);
    }

    // Filter by difficulty
    if (batch.difficulty) {
      filteredQuestions = filteredQuestions.filter((q) => q.difficulty === batch.difficulty);
    }

    // Generate questions for this batch
    const questions = [];
    let currentMarks = 0;

    while (currentMarks < batch.marks && filteredQuestions.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
      const question = { ...filteredQuestions[randomIndex], id: Date.now().toString() + Math.random() };

      if (currentMarks + question.marks <= batch.marks) {
        questions.push(question);
        currentMarks += question.marks;
      }

      if (questions.length > 10) break; // Prevent infinite loop
    }

    return questions;
  };

  const exportPaper = (format) => {
    alert(`Exporting as ${format.toUpperCase()}\nYour question paper is being prepared for download.`);
    // In real app, this would trigger actual export
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-3xl font-bold text-foreground mb-4">Generate Question Paper</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Create customized question papers with flexible batch-based generation rules
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Generation Form */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Paper Configuration</CardTitle>
                  <CardDescription>Set the basic parameters for your question paper.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Subject Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Select value={subject} onValueChange={setSubject}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((subj) => (
                          <SelectItem key={subj} value={subj}>
                            {subj}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Total Marks */}
                  <div className="space-y-2">
                    <Label htmlFor="totalMarks">Total Marks *</Label>
                    <Input
                      type="number"
                      min="1"
                      value={totalMarks || ""}
                      onChange={(e) => setTotalMarks(Number(e.target.value) || 0)}
                      placeholder="Enter total marks"
                    />
                  </div>

                  {/* Marks Summary */}
                  {totalMarks > 0 && (
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="flex justify-between text-sm">
                        <span>Total Marks:</span>
                        <span className="font-medium">{totalMarks}</span>
                      </div>
                      {batches.length > 0 && (
                        <>
                          <div className="flex justify-between text-sm">
                            <span>Batch Marks:</span>
                            <span className="font-medium">{getTotalBatchMarks()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Remaining:</span>
                            <span className={`font-medium ${getRemainingMarks() < 0 ? "text-red-500" : ""}`}>
                              {getRemainingMarks()}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Question Batches */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Question Batches</CardTitle>
                      <CardDescription>
                        Define specific criteria for different parts of your question paper (optional).
                      </CardDescription>
                    </div>
                    <Button onClick={addBatch} size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Batch
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {batches.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No batches defined. Questions will be randomly generated from the selected subject.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {batches.map((batch, index) => (
                        <div key={batch.id} className="p-4 border rounded-lg space-y-4">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline">Batch {index + 1}</Badge>
                            <Button onClick={() => removeBatch(batch.id)} size="sm" variant="ghost">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Marks *</Label>
                              <Input
                                type="number"
                                min="1"
                                value={batch.marks || ""}
                                onChange={(e) => updateBatch(batch.id, "marks", Number(e.target.value) || 0)}
                                placeholder="Marks"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>Topic</Label>
                              <Select
                                value={batch.topic || "Any topic"}
                                onValueChange={(value) => updateBatch(batch.id, "topic", value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Any topic" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Any topic">Any topic</SelectItem>
                                  {(topics[subject] || []).map((topic) => (
                                    <SelectItem key={topic} value={topic}>
                                      {topic}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label>Question Type</Label>
                              <Select
                                value={batch.questionType || "Any type"}
                                onValueChange={(value) => updateBatch(batch.id, "questionType", value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Any type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Any type">Any type</SelectItem>
                                  <SelectItem value="short">Short Answer</SelectItem>
                                  <SelectItem value="long">Long Answer</SelectItem>
                                  <SelectItem value="mcq">Multiple Choice</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label>Difficulty</Label>
                              <Select
                                value={batch.difficulty || "Any difficulty"}
                                onValueChange={(value) => updateBatch(batch.id, "difficulty", value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Any difficulty" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Any difficulty">Any difficulty</SelectItem>
                                  <SelectItem value="easy">Easy</SelectItem>
                                  <SelectItem value="medium">Medium</SelectItem>
                                  <SelectItem value="hard">Hard</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Generate Button */}
              <Button
                onClick={generateQuestionPaper}
                disabled={isGenerating || !subject || !totalMarks}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                size="lg"
              >
                {isGenerating ? "Generating..." : "Generate Question Paper"}
              </Button>
            </div>

            {/* Generated Paper Preview */}
            <div>
              {generatedPaper ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Generated Question Paper</CardTitle>
                        <CardDescription>
                          {generatedPaper.subject} • {generatedPaper.totalMarks} Marks •{" "}
                          {generatedPaper.questions.length} Questions
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => exportPaper("pdf")} size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          PDF
                        </Button>
                        <Button onClick={() => exportPaper("word")} size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Word
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {generatedPaper.questions.map((question, index) => (
                        <div key={question.id} className="border-l-4 border-blue-500 pl-4">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium">
                              {index + 1}. {question.question}
                            </h4>
                            <div className="flex gap-2 ml-4">
                              <Badge variant="secondary" className="text-xs">
                                {question.marks} marks
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {question.difficulty}
                              </Badge>
                            </div>
                          </div>

                          {question.type === "mcq" && question.options && (
                            <div className="mt-2 space-y-1">
                              {question.options.map((option, optIndex) => (
                                <div key={optIndex} className="text-sm text-muted-foreground">
                                  {String.fromCharCode(97 + optIndex)}) {option}
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="mt-2 text-xs text-muted-foreground">
                            Topic: {question.topic} • Type: {question.type}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <Eye className="h-16 w-16 text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-medium text-muted-foreground mb-2">No Paper Generated</h3>
                    <p className="text-sm text-muted-foreground text-center">
                      Configure your paper settings and click "Generate Question Paper" to see the preview here.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}