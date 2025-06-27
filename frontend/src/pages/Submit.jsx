import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function SubmitQuestion() {
  // Form state
  const [formData, setFormData] = useState({
    subject: "",
    topic: "",
    type: "short",
    difficulty: "easy",
    marks: 1,
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
  });

  // Modal states
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [newTopic, setNewTopic] = useState("");

  // Sample data (in real app, this would come from database)
  const [subjects, setSubjects] = useState(["Physics", "Chemistry", "Mathematics", "Biology", "Computer Science"]);

  const [topics, setTopics] = useState({
    Physics: ["Mechanics", "Thermodynamics", "Optics", "Electricity"],
    Chemistry: ["Organic Chemistry", "Inorganic Chemistry", "Physical Chemistry"],
    Mathematics: ["Algebra", "Calculus", "Geometry", "Statistics"],
    Biology: ["Cell Biology", "Genetics", "Ecology", "Evolution"],
    "Computer Science": ["Programming", "Data Structures", "Algorithms", "Database"],
  });

  const handleAddSubject = () => {
    if (newSubject.trim() && !subjects.includes(newSubject.trim())) {
      setSubjects([...subjects, newSubject.trim()]);
      setTopics({ ...topics, [newSubject.trim()]: [] });
      setFormData({ ...formData, subject: newSubject.trim() });
      setNewSubject("");
      setIsSubjectModalOpen(false);
    }
  };

  const handleAddTopic = () => {
    if (newTopic.trim() && formData.subject) {
      const currentTopics = topics[formData.subject] || [];
      if (!currentTopics.includes(newTopic.trim())) {
        setTopics({
          ...topics,
          [formData.subject]: [...currentTopics, newTopic.trim()],
        });
        setFormData({ ...formData, topic: newTopic.trim() });
        setNewTopic("");
        setIsTopicModalOpen(false);
      }
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const handleSubmitQuestion = () => {
    // Validation would go here
    console.log("Submitting question:", formData);
    
    // Clear form
    setFormData({
      subject: "",
      topic: "",
      type: "short",
      difficulty: "easy",
      marks: 1,
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-3xl font-bold text-foreground mb-4">Submit Question</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Add new questions to the question bank for exam paper generation
            </p>
          </div>

          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>Question Details</CardTitle>
              <CardDescription>Fill in all the required information to add a new question.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Subject Selection */}
              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <div className="flex gap-2">
                  <Select
                    value={formData.subject}
                    onValueChange={(value) => setFormData({ ...formData, subject: value, topic: "" })}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Dialog open={isSubjectModalOpen} onOpenChange={setIsSubjectModalOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Subject</DialogTitle>
                        <DialogDescription>Enter the name of the new subject you want to add.</DialogDescription>
                      </DialogHeader>
                      <Input
                        placeholder="Subject name"
                        value={newSubject}
                        onChange={(e) => setNewSubject(e.target.value)}
                      />
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsSubjectModalOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleAddSubject}>Add Subject</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* Topic Selection */}
              <div className="space-y-2">
                <Label htmlFor="topic">Topic *</Label>
                <div className="flex gap-2">
                  <Select
                    value={formData.topic}
                    onValueChange={(value) => setFormData({ ...formData, topic: value })}
                    disabled={!formData.subject}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select a topic" />
                    </SelectTrigger>
                    <SelectContent>
                      {(topics[formData.subject] || []).map((topic) => (
                        <SelectItem key={topic} value={topic}>
                          {topic}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Dialog open={isTopicModalOpen} onOpenChange={setIsTopicModalOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon" disabled={!formData.subject}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Topic</DialogTitle>
                        <DialogDescription>Enter the name of the new topic for {formData.subject}.</DialogDescription>
                      </DialogHeader>
                      <Input placeholder="Topic name" value={newTopic} onChange={(e) => setNewTopic(e.target.value)} />
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsTopicModalOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleAddTopic}>Add Topic</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* Question Type */}
              <div className="space-y-3">
                <Label>Question Type *</Label>
                <RadioGroup
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="short" id="short" />
                    <Label htmlFor="short">Short Answer</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="long" id="long" />
                    <Label htmlFor="long">Long Answer</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mcq" id="mcq" />
                    <Label htmlFor="mcq">Multiple Choice</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Difficulty and Marks Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty Level *</Label>
                  <Select
                    value={formData.difficulty}
                    onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="marks">Marks *</Label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.marks}
                    onChange={(e) => setFormData({ ...formData, marks: Number(e.target.value) || 1 })}
                  />
                </div>
              </div>

              {/* Question Input */}
              <div className="space-y-2">
                <Label htmlFor="question">Question *</Label>
                <Textarea
                  placeholder="Enter your question here..."
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  rows={4}
                />
              </div>

              {/* MCQ Options */}
              {formData.type === "mcq" && (
                <div className="space-y-4">
                  <Label>Answer Options *</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[0, 1, 2, 3].map((index) => (
                      <div key={index} className="space-y-2">
                        <Label htmlFor={`option-${index}`}>Option {index + 1}</Label>
                        <Input
                          id={`option-${index}`}
                          placeholder={`Enter option ${index + 1}`}
                          value={formData.options[index] || ""}
                          onChange={(e) => handleOptionChange(index, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <Label>Correct Answer *</Label>
                    <Select
                      value={formData.correctAnswer.toString()}
                      onValueChange={(value) => setFormData({ ...formData, correctAnswer: Number(value) })}
                    >
                      <SelectTrigger className="w-full md:w-48">
                        <SelectValue placeholder="Select correct option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Option 1</SelectItem>
                        <SelectItem value="1">Option 2</SelectItem>
                        <SelectItem value="2">Option 3</SelectItem>
                        <SelectItem value="3">Option 4</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  onClick={handleSubmitQuestion}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  size="lg"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Add Question
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}