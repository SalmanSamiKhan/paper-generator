from io import BytesIO
from django.http import HttpResponse
from rest_framework import viewsets, status
from rest_framework.decorators import action  # <-- Add this import
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from docx import Document
from question_bank.models import QuestionPaper
from .serializers import QuestionPaperSerializer, PaperGenerationSerializer
from .servies import PaperGenerator


class QuestionPaperViewSet(viewsets.ModelViewSet):
    serializer_class = QuestionPaperSerializer
    permission_classes = [IsAuthenticated]
    queryset = QuestionPaper.objects.all()

    def get_queryset(self):
        """Return only papers created by the current user"""
        return self.queryset.filter(created_by=self.request.user)

    def perform_create(self, serializer):
        """Automatically set the creator to the current user"""
        serializer.save(created_by=self.request.user)

    @action(detail=False, methods=["post"])
    def generate(self, request):
        """
        Custom endpoint for generating question papers
        Example POST data:
        {
            "title": "Final Exam",
            "total_marks": 100,
            "duration": "02:00:00",
            "sections": [{
                "name": "Section A",
                "description": "Multiple Choice",
                "question_type": "MCQ",
                "topics": ["Data Structures"],
                "marks_distribution": [
                    {"difficulty": "E", "count": 5, "marks_per_question": 2}
                ]
            }]
        }
        """
        serializer = PaperGenerationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            generator = PaperGenerator(
                {**serializer.validated_data, "user": request.user}
            )
            paper = generator.generate_paper()
            return Response(
                self.get_serializer(paper).data, status=status.HTTP_201_CREATED
            )
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["get"])
    def download(self, request, pk=None):
        """
        Download paper in specified format
        /papers/1/download/?format=pdf or /papers/1/download/?format=docx
        """
        paper = self.get_object()
        file_format = request.query_params.get("format", "pdf").lower()

        if file_format == "pdf":
            return self._generate_pdf(paper)
        elif file_format == "docx":
            return self._generate_docx(paper)
        return Response(
            {"error": "Invalid format. Use 'pdf' or 'docx'"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    def _generate_pdf(self, paper):
        """Generate PDF version of question paper"""
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter)
        styles = getSampleStyleSheet()

        content = [
            Paragraph(paper.title, styles["Title"]),
            Spacer(1, 12),
            Paragraph(f"Total Marks: {paper.total_marks}", styles["Normal"]),
            Spacer(1, 12),
        ]

        for q in paper.questionpaperquestion_set.order_by("order"):
            content.append(
                Paragraph(f"{q.order}. {q.question.question_text}", styles["Normal"])
            )
            content.append(Spacer(1, 8))

        doc.build(content)
        buffer.seek(0)

        response = HttpResponse(buffer, content_type="application/pdf")
        response["Content-Disposition"] = f'attachment; filename="{paper.title}.pdf"'
        return response

    def _generate_docx(self, paper):
        """Generate Word version of question paper"""
        buffer = BytesIO()
        doc = Document()

        doc.add_heading(paper.title, 0)
        doc.add_paragraph(f"Total Marks: {paper.total_marks}")

        for q in paper.questionpaperquestion_set.order_by("order"):
            doc.add_paragraph(
                f"{q.order}. {q.question.question_text}", style="ListNumber"
            )

        doc.save(buffer)
        buffer.seek(0)

        response = HttpResponse(
            buffer,
            content_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        )
        response["Content-Disposition"] = f'attachment; filename="{paper.title}.docx"'
        return response
