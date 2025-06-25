import random
from typing import List, Dict
from question_bank.models import Question, QuestionPaper


class PaperGenerator:
    def __init__(self, requirements: Dict):
        self.requirements = requirements

    def generate_paper(self) -> QuestionPaper:
        """
        Generate a question paper based on requirements
        Requirements format:
        {
            "title": "Midterm Exam",
            "total_marks": 100,
            "duration": "2:00:00",
            "sections": [
                {
                    "name": "Section A",
                    "description": "Multiple Choice Questions",
                    "marks_distribution": [
                        {"difficulty": "E", "count": 5, "marks_per_question": 2},
                        {"difficulty": "M", "count": 5, "marks_per_question": 3}
                    ],
                    "question_type": "MCQ",
                    "topics": ["Arrays", "Linked Lists"]
                },
                {
                    "name": "Section B",
                    "description": "Short Answer Questions",
                    "marks_distribution": [
                        {"difficulty": "M", "count": 4, "marks_per_question": 5},
                        {"difficulty": "H", "count": 2, "marks_per_question": 10}
                    ],
                    "question_type": "SA",
                    "topics": ["Sorting", "Searching"]
                }
            ]
        }
        """
        paper = QuestionPaper.objects.create(
            title=self.requirements["title"],
            created_by=self.requirements["user"],
            total_marks=self.requirements["total_marks"],
            duration=self.requirements["duration"],
            instructions=self.requirements.get("instructions", ""),
        )

        order = 1
        for section in self.requirements["sections"]:
            for dist in section["marks_distribution"]:
                questions = self._get_questions(
                    difficulty=dist["difficulty"],
                    question_type=section["question_type"],
                    topics=section["topics"],
                    count=dist["count"],
                )

                for question in questions:
                    QuestionPaperQuestion.objects.create(
                        question_paper=paper,
                        question=question,
                        order=order,
                        section=section["name"],
                    )
                    order += 1

        return paper

    def _get_questions(
        self, difficulty: str, question_type: str, topics: List[str], count: int
    ) -> List[Question]:
        """Get random questions matching criteria"""
        questions = Question.objects.filter(
            difficulty=difficulty,
            question_type=question_type,
            topics__name__in=topics,
            is_active=True,
        ).distinct()

        if questions.count() < count:
            raise ValueError(
                f"Not enough questions available for {difficulty} {question_type} on {topics}"
            )

        return random.sample(list(questions), count)
