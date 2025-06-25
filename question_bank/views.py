# version 1
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser
from django.shortcuts import get_object_or_404
from .models import Subject, Topic, Question, MCQOption
from .serializers import (
    SubjectSerializer,
    TopicSerializer,
    QuestionSerializer,
    MCQOptionSerializer,
)
import pandas as pd
from io import BytesIO
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView


class SubjectViewSet(viewsets.ModelViewSet):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    permission_classes = []

    @action(detail=True, methods=["get"])
    def topics(self, request, pk=None):
        subject = self.get_object()
        topics = subject.topic_set.all()
        serializer = TopicSerializer(topics, many=True)
        return Response(serializer.data)


class TopicViewSet(viewsets.ModelViewSet):
    serializer_class = TopicSerializer
    permission_classes = []

    def get_queryset(self):
        queryset = Topic.objects.all()
        subject_id = self.request.query_params.get("subject_id")
        if subject_id is not None:
            queryset = queryset.filter(subject_id=subject_id)
        return queryset

    @action(detail=False, methods=["get"])
    def list_by_subject(self, request):
        subject_id = request.query_params.get("subject_id")
        if not subject_id:
            return Response(
                {"error": "subject_id parameter is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        topics = Topic.objects.filter(subject_id=subject_id)
        serializer = self.get_serializer(topics, many=True)
        return Response(serializer.data)


class QuestionViewSet(viewsets.ModelViewSet):
    serializer_class = QuestionSerializer
    permission_classes = []

    def get_queryset(self):
        queryset = Question.objects.filter(is_active=True)

        # Filter by topic if provided
        topic_id = self.request.query_params.get("topic_id")
        if topic_id:
            queryset = queryset.filter(topics__id=topic_id)

        # Filter by subject if provided
        subject_id = self.request.query_params.get("subject_id")
        if subject_id:
            queryset = queryset.filter(topics__subject_id=subject_id)

        # Filter by question type if provided
        question_type = self.request.query_params.get("type")
        if question_type:
            queryset = queryset.filter(question_type=question_type)

        # Filter by difficulty if provided
        difficulty = self.request.query_params.get("difficulty")
        if difficulty:
            queryset = queryset.filter(difficulty=difficulty)

        return queryset.distinct()

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=["post"])
    def add_options(self, request, pk=None):
        question = self.get_object()
        if question.question_type != "MCQ":
            return Response(
                {"error": "Options can only be added to MCQ questions"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = MCQOptionSerializer(data=request.data, many=True)
        if serializer.is_valid():
            serializer.save(question=question)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class QuestionBulkUploadView(APIView):
    parser_classes = [MultiPartParser]
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        if "file" not in request.FILES:
            return Response(
                {"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST
            )

        file = request.FILES["file"]
        if not file.name.endswith((".xlsx", ".xls", ".csv")):
            return Response(
                {"error": "Invalid file format. Only Excel or CSV files are supported"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            # Read the file based on its type
            if file.name.endswith(".csv"):
                df = pd.read_csv(file)
            else:
                df = pd.read_excel(file)

            # Process each row in the dataframe
            created_questions = []
            for _, row in df.iterrows():
                try:
                    # Create the question
                    question_data = {
                        "question_text": row["question_text"],
                        "question_type": row.get("question_type", "MCQ"),
                        "difficulty": row.get("difficulty", "M"),
                        "marks": row.get("marks", 1),
                        "created_by": request.user.id,
                    }

                    # Get or create topics
                    topic_names = row.get("topics", "").split(",")
                    topics = []
                    for topic_name in topic_names:
                        topic_name = topic_name.strip()
                        if topic_name:
                            topic, _ = Topic.objects.get_or_create(
                                name=topic_name,
                                defaults={"subject_id": row.get("subject_id")},
                            )
                            topics.append(topic.id)

                    question_serializer = QuestionSerializer(data=question_data)
                    if question_serializer.is_valid():
                        question = question_serializer.save()
                        question.topics.set(topics)

                        # If MCQ, add options
                        if question.question_type == "MCQ":
                            options = []
                            for i in range(1, 5):
                                option_text = row.get(f"option_{i}")
                                is_correct = row.get(f"is_correct_{i}", False)
                                if option_text:
                                    options.append(
                                        {
                                            "option_text": option_text,
                                            "is_correct": is_correct,
                                        }
                                    )

                            option_serializer = MCQOptionSerializer(
                                data=options, many=True
                            )
                            if option_serializer.is_valid():
                                option_serializer.save(question=question)

                        created_questions.append(question.id)
                    else:
                        continue

                except Exception as e:
                    continue

            return Response(
                {
                    "message": f"Successfully processed {len(created_questions)} questions",
                    "created_questions": created_questions,
                },
                status=status.HTTP_201_CREATED,
            )

        except Exception as e:
            return Response(
                {"error": f"Error processing file: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )
"""

# version 2
'''
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Subject, Topic, Question, MCQOption
from .serializers import (
    SubjectSerializer,
    TopicSerializer,
    QuestionSerializer,
    MCQOptionSerializer,
)
import pandas as pd
from io import BytesIO
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser


class SubjectViewSet(viewsets.ModelViewSet):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    permission_classes = []

    @action(detail=True, methods=["get"])
    def topics(self, request, pk=None):
        subject = self.get_object()
        topics = subject.topic_set.all()
        serializer = TopicSerializer(topics, many=True)
        return Response(serializer.data)


class TopicViewSet(viewsets.ModelViewSet):
    serializer_class = TopicSerializer
    permission_classes = []

    def get_queryset(self):
        queryset = Topic.objects.all()
        subject_id = self.request.query_params.get("subject_id")
        if subject_id is not None:
            queryset = queryset.filter(subject_id=subject_id)
        return queryset


class QuestionViewSet(viewsets.ModelViewSet):
    serializer_class = QuestionSerializer
    permission_classes = []

    def get_queryset(self):
        queryset = Question.objects.filter(is_active=True)

        # Apply filters
        filters = {
            "topics__id": self.request.query_params.get("topic_id"),
            "topics__subject_id": self.request.query_params.get("subject_id"),
            "question_type": self.request.query_params.get("type"),
            "difficulty": self.request.query_params.get("difficulty"),
        }

        for field, value in filters.items():
            if value:
                queryset = queryset.filter(**{field: value})

        return queryset.distinct()

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=True, methods=["post"])
    def options(self, request, pk=None):
        """Add or update options for an MCQ question"""
        question = self.get_object()
        if question.question_type != "MCQ":
            return Response(
                {"error": "Options can only be added to MCQ questions"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Delete existing options
        question.options.all().delete()

        # Create new options
        serializer = MCQOptionSerializer(data=request.data, many=True)
        serializer.is_valid(raise_exception=True)
        serializer.save(question=question)

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class QuestionBulkUploadView(APIView):
    parser_classes = [MultiPartParser]
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        if "file" not in request.FILES:
            return Response(
                {"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST
            )

        file = request.FILES["file"]
        if not file.name.endswith((".xlsx", ".xls", ".csv")):
            return Response(
                {"error": "Invalid file format. Only Excel or CSV files are supported"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            df = (
                pd.read_excel(file)
                if file.name.endswith((".xlsx", ".xls"))
                else pd.read_csv(file)
            )
            created_questions = []

            for _, row in df.iterrows():
                try:
                    # Prepare question data
                    question_data = {
                        "question_text": row["question_text"],
                        "question_type": row.get("question_type", "MCQ"),
                        "difficulty": row.get("difficulty", "M"),
                        "marks": row.get("marks", 1),
                        "created_by": request.user.id,
                        "topics": self._get_topic_ids(row),
                    }

                    # Prepare options if MCQ
                    if question_data["question_type"] == "MCQ":
                        question_data["options"] = [
                            {
                                "option_text": row[f"option_{i}"],
                                "is_correct": row.get(f"is_correct_{i}", False),
                            }
                            for i in range(1, 5)
                            if pd.notna(row.get(f"option_{i}"))
                        ]

                    serializer = QuestionSerializer(
                        data=question_data, context={"request": request}
                    )
                    if serializer.is_valid():
                        question = serializer.save()
                        created_questions.append(question.id)

                except Exception as e:
                    continue

            return Response(
                {
                    "message": f"Successfully processed {len(created_questions)} questions",
                    "created_questions": created_questions,
                },
                status=status.HTTP_201_CREATED,
            )

        except Exception as e:
            return Response(
                {"error": f"Error processing file: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def _get_topic_ids(self, row):
        """Convert topic names to IDs"""
        topic_ids = []
        for topic_name in str(row.get("topics", "")).split(","):
            topic_name = topic_name.strip()
            if topic_name:
                topic, _ = Topic.objects.get_or_create(
                    name=topic_name, defaults={"subject_id": row.get("subject_id")}
                )
                topic_ids.append(topic.id)
        return topic_ids

'''

# version 3
from rest_framework import viewsets, status, mixins
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser
from django.shortcuts import get_object_or_404
from .models import Subject, Topic, Question, MCQOption
from .serializers import (
    SubjectSerializer,
    TopicSerializer,
    QuestionCreateSerializer,
    QuestionListSerializer,
    MCQOptionSerializer,
)
import pandas as pd
from io import BytesIO


class SubjectViewSet(viewsets.ModelViewSet):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    permission_classes = []

    @action(detail=True, methods=["get"])
    def topics(self, request, pk=None):
        subject = self.get_object()
        topics = subject.topic_set.all()
        serializer = TopicSerializer(topics, many=True)
        return Response(serializer.data)


class TopicViewSet(viewsets.ModelViewSet):
    serializer_class = TopicSerializer
    permission_classes = []

    def get_queryset(self):
        queryset = Topic.objects.all()
        subject_id = self.request.query_params.get("subject_id")
        if subject_id:
            queryset = queryset.filter(subject_id=subject_id)
        return queryset


class QuestionViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return QuestionCreateSerializer
        return QuestionListSerializer

    def get_queryset(self):
        queryset = Question.objects.filter(
            is_active=True, created_by=self.request.user
        ).prefetch_related("topics", "topics__subject", "options")

        # Apply filters
        filters = {
            "topics__id": self.request.query_params.get("topic_id"),
            "topics__subject_id": self.request.query_params.get("subject_id"),
            "question_type": self.request.query_params.get("type"),
            "difficulty": self.request.query_params.get("difficulty"),
        }

        for field, value in filters.items():
            if value:
                queryset = queryset.filter(**{field: value})

        return queryset

    def get_serializer_context(self):
        return {"request": self.request}

    @action(detail=False, methods=["get"])
    def form_data(self, request):
        """Endpoint for form dropdown data"""
        return Response(
            {
                "subjects": SubjectSerializer(Subject.objects.all(), many=True).data,
                "topics": TopicSerializer(
                    Topic.objects.select_related("subject").all(), many=True
                ).data,
            }
        )


class QuestionBulkUploadView(APIView):
    parser_classes = [MultiPartParser]
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        if "file" not in request.FILES:
            return Response(
                {"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST
            )

        file = request.FILES["file"]
        if not file.name.endswith((".xlsx", ".xls", ".csv")):
            return Response(
                {"error": "Invalid file format"}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            df = (
                pd.read_excel(file)
                if file.name.endswith((".xlsx", ".xls"))
                else pd.read_csv(file)
            )
            created_questions = []

            for _, row in df.iterrows():
                try:
                    question_data = {
                        "subject": row["subject_id"],
                        "topics": self._get_topic_ids(row),
                        "question_type": row.get("question_type", "MCQ"),
                        "difficulty": row.get("difficulty", "M"),
                        "marks": row.get("marks", 1),
                    }

                    if question_data["question_type"] == "MCQ":
                        question_data["options"] = [
                            {
                                "option_text": row[f"option_{i}"],
                                "is_correct": bool(row.get(f"is_correct_{i}", False)),
                            }
                            for i in range(1, 5)
                            if pd.notna(row.get(f"option_{i}"))
                        ]
                    else:
                        question_data["question_text"] = row["question_text"]

                    serializer = QuestionCreateSerializer(
                        data=question_data, context={"request": request}
                    )
                    if serializer.is_valid():
                        question = serializer.save()
                        created_questions.append(question.id)

                except Exception as e:
                    continue

            return Response(
                {
                    "message": f"Successfully processed {len(created_questions)} questions",
                    "created_questions": created_questions,
                },
                status=status.HTTP_201_CREATED,
            )

        except Exception as e:
            return Response(
                {"error": f"Error processing file: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def _get_topic_ids(self, row):
        topic_ids = []
        for topic_name in str(row.get("topics", "")).split(","):
            topic_name = topic_name.strip()
            if topic_name:
                topic, _ = Topic.objects.get_or_create(
                    name=topic_name, defaults={"subject_id": row.get("subject_id")}
                )
                topic_ids.append(topic.id)
        return topic_ids
