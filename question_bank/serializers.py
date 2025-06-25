# version 1
"""
from rest_framework import serializers
from .models import Subject, Topic, Question, MCQOption


class MCQOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = MCQOption
        fields = ("id", "option_text", "is_correct")


class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = ("id", "name")


class SubjectSerializer(serializers.ModelSerializer):
    topics = TopicSerializer(many=True, read_only=True)

    class Meta:
        model = Subject
        fields = ("id", "name", "code", "description", "topics")


class QuestionSerializer(serializers.ModelSerializer):
    options = MCQOptionSerializer(many=True, required=False)
    topics = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Topic.objects.all(), required=False
    )

    class Meta:
        model = Question
        fields = (
            "id",
            "question_text",
            "question_type",
            "difficulty",
            "marks",
            "topics",
            "options",
            "created_at",
            "updated_at",
        )

    def create(self, validated_data):
        options_data = validated_data.pop("options", [])
        topics_data = validated_data.pop("topics", [])

        question = Question.objects.create(**validated_data)

        for option_data in options_data:
            MCQOption.objects.create(question=question, **option_data)

        question.topics.set(topics_data)
        return question
"""


# version 2
"""
from rest_framework import serializers
from .models import Subject, Topic, Question, MCQOption


class MCQOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = MCQOption
        fields = ("id", "option_text", "is_correct")


class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = ("id", "name", "subject")


class SubjectSerializer(serializers.ModelSerializer):
    topics = TopicSerializer(many=True, read_only=True)

    class Meta:
        model = Subject
        fields = ("id", "name", "code", "description", "topics")


class QuestionSerializer(serializers.ModelSerializer):
    options = MCQOptionSerializer(many=True, required=False)
    topics = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Topic.objects.all(), required=True
    )

    class Meta:
        model = Question
        fields = (
            "id",
            "question_text",
            "question_type",
            "difficulty",
            "marks",
            "topics",
            "options",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("created_at", "updated_at")

    def validate(self, data):
        if data["question_type"] == "MCQ":
            if "options" not in data or len(data["options"]) != 4:
                raise serializers.ValidationError(
                    "MCQ questions must have exactly 4 options"
                )

            correct_options = sum(1 for opt in data["options"] if opt["is_correct"])
            if correct_options != 1:
                raise serializers.ValidationError(
                    "MCQ questions must have exactly one correct option"
                )
        elif "options" in data and data["options"]:
            raise serializers.ValidationError(
                "Options can only be provided for MCQ questions"
            )

        if not data.get("topics"):
            raise serializers.ValidationError("At least one topic must be selected")

        return data

    def create(self, validated_data):
        options_data = validated_data.pop("options", [])
        topics = validated_data.pop("topics")

        question = Question.objects.create(
            created_by=self.context["request"].user, **validated_data
        )
        question.topics.set(topics)

        if question.question_type == "MCQ":
            for option_data in options_data:
                MCQOption.objects.create(question=question, **option_data)

        return question
"""

# version 3

from rest_framework import serializers
from .models import Subject, Topic, Question, MCQOption


class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ["id", "name", "code", "description"]


class TopicSerializer(serializers.ModelSerializer):
    # subject = SubjectSerializer(read_only=True)

    class Meta:
        model = Topic
        fields = ["id", "name", "subject"]


class MCQOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = MCQOption
        fields = ["id", "option_text", "is_correct"]


class QuestionCreateSerializer(serializers.ModelSerializer):
    subject = serializers.PrimaryKeyRelatedField(
        queryset=Subject.objects.all(), write_only=True
    )
    topics = serializers.PrimaryKeyRelatedField(many=True, queryset=Topic.objects.all())
    options = MCQOptionSerializer(many=True, required=False)

    class Meta:
        model = Question
        fields = [
            "subject",
            "topics",
            "question_type",
            "difficulty",
            "marks",
            "question_text",
            "options",
        ]

    def validate(self, data):
        if data["question_type"] == "MCQ":
            if "options" not in data or len(data["options"]) != 4:
                raise serializers.ValidationError(
                    "MCQ questions must have exactly 4 options"
                )
            if sum(1 for opt in data["options"] if opt["is_correct"]) != 1:
                raise serializers.ValidationError(
                    "MCQ questions must have exactly one correct option"
                )
        elif not data.get("question_text"):
            raise serializers.ValidationError(
                "Question text is required for non-MCQ questions"
            )
        return data

    def create(self, validated_data):
        subject = validated_data.pop("subject")
        options_data = validated_data.pop("options", [])
        topics = validated_data.pop("topics")

        question = Question.objects.create(
            created_by=self.context["request"].user, **validated_data
        )
        question.topics.set(topics)

        if question.question_type == "MCQ":
            for option_data in options_data:
                MCQOption.objects.create(question=question, **option_data)

        return question


class QuestionListSerializer(serializers.ModelSerializer):
    subject = serializers.SerializerMethodField()
    topics = TopicSerializer(many=True)
    options = MCQOptionSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = [
            "id",
            "subject",
            "topics",
            "question_type",
            "difficulty",
            "marks",
            "question_text",
            "options",
            "created_at",
        ]

    def get_subject(self, obj):
        if obj.topics.exists():
            return SubjectSerializer(obj.topics.first().subject).data
        return None


class QuestionSerializer(serializers.ModelSerializer):
    pass
