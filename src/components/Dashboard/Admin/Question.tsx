"use client"

import { useEffect, useState } from "react"
import { Button } from "../../ui/Button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/Card"
import { Textarea } from "../../ui/textarea"
import { Badge } from "../../ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../ui/dropdown-menu"
import { ChartContainer } from "../../ui/chart"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { FiPlus, FiSearch, FiFilter, FiMoreHorizontal, FiEdit, FiTrash2, FiEye } from "react-icons/fi"
import { HiUsers, HiChatBubbleLeftRight } from "react-icons/hi2"
import { IoTrendingUp } from "react-icons/io5"
import { Input } from "../../ui/Input"
import { useGetAllQuestionsMutation, useGetAllQuestionsQuery } from "../../../redux/api/questionApi/questionApi"
import { useAppDispatch } from "../../../redux/hooks"

// Mock data for questions
const initialQuestions = [
  {
    id: 1,
    title: "What is React?",
    content: "Can someone explain what React is and how it works?",
    category: "Frontend",
    difficulty: "Beginner",
    tags: ["React", "JavaScript"],
    status: "Published",
    author: "John Doe",
    createdAt: "2024-01-15",
    views: 245,
    answers: 12,
  },
  {
    id: 2,
    title: "Database Optimization Techniques",
    content: "What are the best practices for optimizing database queries?",
    category: "Backend",
    difficulty: "Advanced",
    tags: ["Database", "SQL", "Performance"],
    status: "Draft",
    author: "Jane Smith",
    createdAt: "2024-01-14",
    views: 89,
    answers: 5,
  },
  {
    id: 3,
    title: "CSS Grid vs Flexbox",
    content: "When should I use CSS Grid versus Flexbox for layouts?",
    category: "Frontend",
    difficulty: "Intermediate",
    tags: ["CSS", "Layout"],
    status: "Published",
    author: "Mike Johnson",
    createdAt: "2024-01-13",
    views: 156,
    answers: 8,
  },
]

// Chart data
const categoryData = [
  { name: "Frontend", value: 45, fill: "hsl(var(--chart-1))" },
  { name: "Backend", value: 30, fill: "hsl(var(--chart-2))" },
  { name: "DevOps", value: 15, fill: "hsl(var(--chart-3))" },
  { name: "Mobile", value: 10, fill: "hsl(var(--chart-4))" },
]

const monthlyData = [
  { month: "Jan", questions: 65, answers: 120 },
  { month: "Feb", questions: 78, answers: 145 },
  { month: "Mar", questions: 92, answers: 180 },
  { month: "Apr", questions: 85, answers: 165 },
  { month: "May", questions: 98, answers: 195 },
  { month: "Jun", questions: 110, answers: 220 },
]

const difficultyData = [
  { difficulty: "Beginner", count: 45 },
  { difficulty: "Intermediate", count: 32 },
  { difficulty: "Advanced", count: 23 },
]

// Chart configurations with labels
const categoryChartConfig = {
  value: { label: "Questions", color: "hsl(var(--chart-1))" },
  Frontend: { label: "Frontend", color: "hsl(var(--chart-1))" },
  Backend: { label: "Backend", color: "hsl(var(--chart-2))" },
  DevOps: { label: "DevOps", color: "hsl(var(--chart-3))" },
  Mobile: { label: "Mobile", color: "hsl(var(--chart-4))" },
}

const monthlyChartConfig = {
  month: { label: "Month", color: "hsl(var(--chart-3))" },
  questions: { label: "Questions", color: "hsl(var(--chart-1))" },
  answers: { label: "Answers", color: "hsl(var(--chart-2))" },
}

const difficultyChartConfig = {
  difficulty: { label: "Difficulty", color: "hsl(var(--chart-3))" },
  count: { label: "Count", color: "hsl(var(--chart-1))" },
}

export default function Question() {
const { data, isLoading, isSuccess } = useGetAllQuestionsQuery();

useEffect(() => {
  if (isSuccess && data?.success) {
    // setQuestions(data.data || []);

  }
}, [isSuccess, data]);

  console.log({data})

  const [questions, setQuestions] = useState(initialQuestions)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState(null)

  const [newQuestion, setNewQuestion] = useState({
    title: "",
    content: "",
    category: "",
    difficulty: "",
    tags: "",
    status: "Draft",
  })

  const filteredQuestions = questions.filter((question) => {
    const matchesSearch =
      question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || question.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleCreateQuestion = () => {
    const question = {
      id: questions.length + 1,
      ...newQuestion,
      tags: newQuestion.tags.split(",")?.map((tag) => tag.trim()),
      author: "Current User",
      createdAt: new Date().toISOString().split("T")[0],
      views: 0,
      answers: 0,
    }
    setQuestions([...questions, question])
    setNewQuestion({ title: "", content: "", category: "", difficulty: "", tags: "", status: "Draft" })
    setIsCreateDialogOpen(false)
  }

  const handleEditQuestion = (question:any) => {
    setEditingQuestion(question)
    setNewQuestion({
      ...question,
      tags: question.tags.join(", "),
    })
    setIsCreateDialogOpen(true)
  }

  const handleUpdateQuestion = () => {
    const updatedQuestions = questions?.map((q) =>
      q.id === editingQuestion && editingQuestion?.id && editingQuestion.id
        ? { ...q, ...newQuestion, tags: newQuestion.tags.split(",")?.map((tag) => tag.trim()) }
        : q,
    )
    setQuestions(updatedQuestions)
    setEditingQuestion(null)
    setNewQuestion({ title: "", content: "", category: "", difficulty: "", tags: "", status: "Draft" })
    setIsCreateDialogOpen(false)
  }

  const handleDeleteQuestion = (id) => {
    setQuestions(questions.filter((q) => q.id !== id))
  }

  const resetForm = () => {
    setNewQuestion({ title: "", content: "", category: "", difficulty: "", tags: "", status: "Draft" })
    setEditingQuestion(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold font-[family-name:var(--font-space-grotesk)] text-foreground">
              Questions Dashboard
            </h1>
            <p className="text-muted-foreground">Manage and analyze your question database</p>
          </div>
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={(open) => {
              setIsCreateDialogOpen(open)
              if (!open) resetForm()
            }}
          >
            <DialogTrigger>
              <div className="flex items-center space-x-2">
                <FiPlus className="w-4 h-4 mr-2" />
                Add Question
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingQuestion ? "Edit Question" : "Create New Question"}</DialogTitle>
                <DialogDescription>
                  {editingQuestion
                    ? "Update the question details below."
                    : "Fill in the details to create a new question."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="title">Title</label>
                  <Input
                    id="title"
                    value={newQuestion.title}
                    onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
                    placeholder="Enter question title"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="content">Content</label>
                  <Textarea
                    id="content"
                    value={newQuestion.content}
                    onChange={(e) => setNewQuestion({ ...newQuestion, content: e.target.value })}
                    placeholder="Enter question content"
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="category">Category</label>
                    <Select
                      value={newQuestion.category}
                      onValueChange={(value) => setNewQuestion({ ...newQuestion, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Frontend">Frontend</SelectItem>
                        <SelectItem value="Backend">Backend</SelectItem>
                        <SelectItem value="DevOps">DevOps</SelectItem>
                        <SelectItem value="Mobile">Mobile</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="difficulty">Difficulty</label>
                    <Select
                      value={newQuestion.difficulty}
                      onValueChange={(value) => setNewQuestion({ ...newQuestion, difficulty: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <label htmlFor="tags">Tags (comma-separated)</label>
                  <Input
                    id="tags"
                    value={newQuestion.tags}
                    onChange={(e) => setNewQuestion({ ...newQuestion, tags: e.target.value })}
                    placeholder="React, JavaScript, Frontend"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="status">Status</label>
                  <Select
                    value={newQuestion.status}
                    onValueChange={(value) => setNewQuestion({ ...newQuestion, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={editingQuestion ? handleUpdateQuestion : handleCreateQuestion}
                  className="bg-accent hover:bg-accent/90"
                >
                  {editingQuestion ? "Update Question" : "Create Question"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="questions">Questions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
                  <HiChatBubbleLeftRight className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{questions.length}</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Published</CardTitle>
                  <FiEye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{questions.filter((q) => q.status === "Published").length}</div>
                  <p className="text-xs text-muted-foreground">+8% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                  <IoTrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{questions.reduce((sum, q) => sum + q.views, 0)}</div>
                  <p className="text-xs text-muted-foreground">+23% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Answers</CardTitle>
                  <HiUsers className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{questions.reduce((sum, q) => sum + q.answers, 0)}</div>
                  <p className="text-xs text-muted-foreground">+15% from last month</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Questions by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={categoryChartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                          nameKey="name"
                        >
                          {categoryData?.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Monthly Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={monthlyChartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Line type="monotone" dataKey="questions" stroke="hsl(var(--chart-1))" strokeWidth={2} />
                        <Line type="monotone" dataKey="answers" stroke="hsl(var(--chart-2))" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="questions" className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4">
              <div className="relative flex-1">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <FiFilter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Frontend">Frontend</SelectItem>
                  <SelectItem value="Backend">Backend</SelectItem>
                  <SelectItem value="DevOps">DevOps</SelectItem>
                  <SelectItem value="Mobile">Mobile</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Questions Table */}
            <Card>
              <CardHeader>
                <CardTitle>Questions ({filteredQuestions.length})</CardTitle>
                <CardDescription>Manage your question database</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Difficulty</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Views</TableHead>
                      <TableHead>Answers</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="w-[70px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredQuestions?.map((question) => (
                      <TableRow key={question.id}>
                        <TableCell className="font-medium">
                          <div>
                            <div className="font-semibold">{question.title}</div>
                            <div className="text-sm text-muted-foreground truncate max-w-[300px]">
                              {question.content}
                            </div>
                            <div className="flex gap-1 mt-1">
                              {question?.tags?.map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{question.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              question.difficulty === "Beginner"
                                ? "default"
                                : question.difficulty === "Intermediate"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {question.difficulty}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={question.status === "Published" ? "default" : "secondary"}>
                            {question.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{question.views}</TableCell>
                        <TableCell>{question.answers}</TableCell>
                        <TableCell>{question.createdAt}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <FiMoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditQuestion(question)}>
                                <FiEdit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteQuestion(question.id)}
                                className="text-destructive"
                              >
                                <FiTrash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Questions by Difficulty</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={difficultyChartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={difficultyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="difficulty" />
                        <YAxis />
                        <Bar dataKey="count" fill="hsl(var(--chart-1))" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Engagement Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Average Views per Question</span>
                      <span className="text-2xl font-bold">
                        {Math.round(questions.reduce((sum, q) => sum + q.views, 0) / questions.length)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Average Answers per Question</span>
                      <span className="text-2xl font-bold">
                        {Math.round(questions.reduce((sum, q) => sum + q.answers, 0) / questions.length)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Most Popular Category</span>
                      <span className="text-lg font-semibold">Frontend</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Publication Rate</span>
                      <span className="text-lg font-semibold">
                        {Math.round(
                          (questions.filter((q) => q.status === "Published").length / questions.length) * 100,
                        )}
                        %
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
