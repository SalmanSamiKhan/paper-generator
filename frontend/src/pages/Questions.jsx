import { useState, useMemo } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Search, Edit, Trash2, Filter, Plus } from "lucide-react";
import { Link } from "react-router-dom";

export default function Questions() {
  // Sample questions data
  const [questions, setQuestions] = useState([
    {
      id: "1",
      subject: "Physics",
      topic: "Mechanics",
      type: "short",
      difficulty: "easy",
      marks: 2,
      question: "Define Newton's first law of motion and provide an example.",
      createdAt: new Date("2024-01-15"),
    },
    {
      id: "2",
      subject: "Physics",
      topic: "Mechanics",
      type: "long",
      difficulty: "medium",
      marks: 5,
      question: "Derive the equation for kinetic energy starting from Newton's second law of motion.",
      createdAt: new Date("2024-01-16"),
    },
    {
      id: "3",
      subject: "Physics",
      topic: "Electricity",
      type: "mcq",
      difficulty: "easy",
      marks: 1,
      question: "What is the unit of electric current?",
      options: ["Ampere", "Volt", "Ohm", "Watt"],
      correctAnswer: 0,
      createdAt: new Date("2024-01-17"),
    },
    {
      id: "4",
      subject: "Chemistry",
      topic: "Organic Chemistry",
      type: "short",
      difficulty: "medium",
      marks: 3,
      question: "Explain the concept of isomerism with examples.",
      createdAt: new Date("2024-01-18"),
    },
    {
      id: "5",
      subject: "Mathematics",
      topic: "Calculus",
      type: "long",
      difficulty: "hard",
      marks: 8,
      question: "Prove the fundamental theorem of calculus and discuss its applications.",
      createdAt: new Date("2024-01-19"),
    },
    {
      id: "6",
      subject: "Biology",
      topic: "Cell Biology",
      type: "mcq",
      difficulty: "medium",
      marks: 2,
      question: "Which organelle is responsible for protein synthesis?",
      options: ["Mitochondria", "Ribosome", "Nucleus", "Golgi Apparatus"],
      correctAnswer: 1,
      createdAt: new Date("2024-01-20"),
    },
  ]);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [topicFilter, setTopicFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");

  // Modal states
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deletingQuestionId, setDeletingQuestionId] = useState(null);

  // Edit form state
  const [editForm, setEditForm] = useState({
    id: "",
    subject: "",
    topic: "",
    type: "short",
    difficulty: "easy",
    marks: 1,
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
    createdAt: new Date(),
  });

  // Get unique values for filters
  const subjects = Array.from(new Set(questions.map((q) => q.subject)));
  const topics = Array.from(new Set(questions.map((q) => q.topic)));

  // Filtered questions
  const filteredQuestions = useMemo(() => {
    return questions.filter((question) => {
      const matchesSearch =
        question.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        question.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        question.topic.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSubject = subjectFilter === "all" || question.subject === subjectFilter;
      const matchesTopic = topicFilter === "all" || question.topic === topicFilter;
      const matchesType = typeFilter === "all" || question.type === typeFilter;
      const matchesDifficulty = difficultyFilter === "all" || question.difficulty === difficultyFilter;

      return matchesSearch && matchesSubject && matchesTopic && matchesType && matchesDifficulty;
    });
  }, [questions, searchTerm, subjectFilter, topicFilter, typeFilter, difficultyFilter]);

  const handleEditQuestion = (question) => {
    setEditingQuestion(question);
    setEditForm({ ...question });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editForm.subject || !editForm.topic || !editForm.question.trim() || !editForm.marks) {
      alert("Please fill in all required fields.");
      return;
    }

    if (editForm.type === "mcq") {
      const filledOptions = editForm.options.filter((opt) => opt.trim());
      if (filledOptions.length < 4) {
        alert("Please fill in all 4 MCQ options.");
        return;
      }
    }

    setQuestions(questions.map((q) => (q.id === editForm.id ? editForm : q)));
    setIsEditModalOpen(false);
    setEditingQuestion(null);
    alert("The question has been successfully updated.");
  };

  const handleDeleteQuestion = (id) => {
    setQuestions(questions.filter((q) => q.id !== id));
    setDeletingQuestionId(null);
    alert("The question has been successfully deleted.");
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...editForm.options];
    newOptions[index] = value;
    setEditForm({ ...editForm, options: newOptions });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSubjectFilter("all");
    setTopicFilter("all");
    setTypeFilter("all");
    setDifficultyFilter("all");
  };

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "hard":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "mcq":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "short":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      case "long":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

return (
  <div className="min-h-screen bg-background">
    <Header />

    {/* Main Content */}
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-4">All Questions</h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Manage and browse all questions in the question bank
              </p>
            </div>
            <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
              <Link to="/submit">
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Link>
            </Button>
          </div>
        </div>

        {/* Filters - Redesigned */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative w-full max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Subject Filter */}
            <div className="w-full sm:w-auto">
              <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                <SelectTrigger className="min-w-[180px]">
                  <SelectValue placeholder="Subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Topic Filter */}
            <div className="w-full sm:w-auto">
              <Select value={topicFilter} onValueChange={setTopicFilter}>
                <SelectTrigger className="min-w-[180px]">
                  <SelectValue placeholder="Topic" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Topics</SelectItem>
                  {topics.map((topic) => (
                    <SelectItem key={topic} value={topic}>
                      {topic}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Type Filter */}
            <div className="w-full sm:w-auto">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="min-w-[180px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="short">Short Answer</SelectItem>
                  <SelectItem value="long">Long Answer</SelectItem>
                  <SelectItem value="mcq">Multiple Choice</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Difficulty Filter */}
            <div className="w-full sm:w-auto">
              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger className="min-w-[180px]">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Clear Button */}
            <Button
              variant="destructive"
              onClick={clearFilters}
            >
              Clear
            </Button>
          </div>

          {/* Results count */}
          <div className="text-sm text-muted-foreground">
            Showing {filteredQuestions.length} of {questions.length} questions
          </div>
        </div>

          {/* Questions Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40%]">Question</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Topic</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Difficulty</TableHead>
                      <TableHead>Marks</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredQuestions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No questions found matching your criteria.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredQuestions.map((question) => (
                        <TableRow key={question.id}>
                          <TableCell className="font-medium">
                            <div className="max-w-md">
                              <p className="text-sm">{truncateText(question.question, 100)}</p>
                              {question.type === "mcq" && question.options && (
                                <div className="mt-1 text-xs text-muted-foreground">
                                  Options: {question.options.slice(0, 2).join(", ")}...
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{question.subject}</TableCell>
                          <TableCell>{question.topic}</TableCell>
                          <TableCell>
                            <Badge className={getTypeColor(question.type)}>{question.type.toUpperCase()}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getDifficultyColor(question.difficulty)}>{question.difficulty}</Badge>
                          </TableCell>
                          <TableCell>{question.marks}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="sm" onClick={() => handleEditQuestion(question)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => setDeletingQuestionId(question.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Edit Question Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Question</DialogTitle>
            <DialogDescription>Make changes to the question details.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Subject and Topic */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Subject *</Label>
                <Input
                  value={editForm.subject}
                  onChange={(e) => setEditForm({ ...editForm, subject: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Topic *</Label>
                <Input value={editForm.topic} onChange={(e) => setEditForm({ ...editForm, topic: e.target.value })} />
              </div>
            </div>

            {/* Question Type */}
            <div className="space-y-3">
              <Label>Question Type *</Label>
              <RadioGroup
                value={editForm.type}
                onValueChange={(value) => setEditForm({ ...editForm, type: value })}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="short" id="edit-short" />
                  <Label htmlFor="edit-short">Short Answer</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="long" id="edit-long" />
                  <Label htmlFor="edit-long">Long Answer</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mcq" id="edit-mcq" />
                  <Label htmlFor="edit-mcq">Multiple Choice</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Difficulty and Marks */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Difficulty *</Label>
                <Select
                  value={editForm.difficulty}
                  onValueChange={(value) => setEditForm({ ...editForm, difficulty: value })}
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
                <Label>Marks *</Label>
                <Input
                  type="number"
                  min="1"
                  value={editForm.marks}
                  onChange={(e) => setEditForm({ ...editForm, marks: Number(e.target.value) || 1 })}
                />
              </div>
            </div>

            {/* Question */}
            <div className="space-y-2">
              <Label>Question *</Label>
              <Textarea
                value={editForm.question}
                onChange={(e) => setEditForm({ ...editForm, question: e.target.value })}
                rows={4}
              />
            </div>

            {/* MCQ Options */}
            {editForm.type === "mcq" && (
              <div className="space-y-4">
                <Label>Answer Options *</Label>
                <div className="grid grid-cols-2 gap-4">
                  {[0, 1, 2, 3].map((index) => (
                    <div key={index} className="space-y-2">
                      <Label>Option {index + 1}</Label>
                      <Input
                        value={editForm.options[index] || ""}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                      />
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <Label>Correct Answer *</Label>
                  <Select
                    value={editForm.correctAnswer?.toString()}
                    onValueChange={(value) => setEditForm({ ...editForm, correctAnswer: Number(value) })}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
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
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} className="bg-blue-600 hover:bg-blue-700 text-white">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingQuestionId} onOpenChange={() => setDeletingQuestionId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Question</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this question? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingQuestionId && handleDeleteQuestion(deletingQuestionId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
    </div>
  );
}