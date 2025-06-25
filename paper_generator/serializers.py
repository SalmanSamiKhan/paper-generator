from rest_framework import serializers
from question_bank.models import QuestionPaper, QuestionPaperQuestion
from question_bank.serializers import QuestionSerializer


class QuestionPaperQuestionSerializer(serializers.ModelSerializer):
    question = QuestionSerializer(read_only=True)

    class Meta:
        model = QuestionPaperQuestion
        fields = (
            "id",
            "question",
            "order",
        )
        read_only_fields = fields


class QuestionPaperSerializer(serializers.ModelSerializer):
    questions = QuestionPaperQuestionSerializer(
        source="questionpaperquestion_set", many=True, read_only=True
    )

    class Meta:
        model = QuestionPaper
        fields = (
            "id",
            "title",
            "created_by",
            "created_at",
            "instructions",
            "total_marks",
            "duration",
            "questions",
        )
        read_only_fields = ("created_by", "created_at", "questions")


class PaperGenerationSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=200)
    instructions = serializers.CharField(required=False, allow_blank=True)
    total_marks = serializers.IntegerField(min_value=1)
    duration = serializers.DurationField()
    sections = serializers.ListField(
        child=serializers.DictField(child=serializers.CharField(), allow_empty=False)
    )

    def validate_sections(self, sections):
        required_keys = {
            "name",
            "description",
            "question_type",
            "topics",
            "marks_distribution",
        }
        for section in sections:
            if not required_keys.issubset(section.keys()):
                raise serializers.ValidationError(
                    "Section missing required fields. Needed: "
                    + ", ".join(required_keys)
                )

            # Validate marks_distribution
            for dist in section["marks_distribution"]:
                if not all(
                    k in dist for k in ["difficulty", "count", "marks_per_question"]
                ):
                    raise serializers.ValidationError(
                        "Each distribution needs difficulty, count, and marks_per_question"
                    )
        return sections
